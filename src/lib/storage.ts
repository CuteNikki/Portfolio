import 'server-only';

import { AwsClient } from 'aws4fetch';

// Where pictures go and where they're read from. Uploads go through Garage's S3 API at s3.niso.moe, which takes the
// bucket in the path, into this site's own bucket; reads go to images.niso.moe/portfolio/, which Caddy serves from
// that bucket. Locally they can point at any S3-compatible test server instead.
const STORAGE_ENDPOINT = (
  process.env.STORAGE_ENDPOINT ?? 'https://s3.niso.moe'
).replace(/\/$/, '');
const STORAGE_BUCKET = process.env.STORAGE_BUCKET ?? 'portfolio';
export const IMAGE_PUBLIC_URL = (
  process.env.IMAGE_PUBLIC_URL ?? 'https://images.niso.moe'
).replace(/\/$/, '');

// Keys keep the folder they had when every site shared one bucket, as addresses still start with it; the bucket, being
// this site's alone, holds them without it
const FOLDER = 'portfolio/';
const inBucket = (key: string) =>
  key.startsWith(FOLDER) ? key.slice(FOLDER.length) : key;

// How long a link to upload to lasts: plenty to send one picture, too short to keep
const UPLOAD_LINK_SECONDS = 300;

// Our storage as its S3 API takes requests, signed with the site's key
function storage() {
  const accessKeyId = process.env.STORAGE_ACCESS_KEY_ID;
  const secretAccessKey = process.env.STORAGE_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      'STORAGE_ACCESS_KEY_ID and STORAGE_SECRET_ACCESS_KEY must be set to upload pictures',
    );
  }

  return new AwsClient({
    accessKeyId,
    secretAccessKey,
    service: 's3',
    region: process.env.STORAGE_REGION || 'garage',
    retries: 1,
  });
}

const apiUrl = (objectKey = '') =>
  new URL(`${STORAGE_ENDPOINT}/${STORAGE_BUCKET}/${inBucket(objectKey)}`);

/**
 * A link for the browser to upload one file to, straight to storage rather than through the site. It is signed for
 * exactly this type and size, so nothing else can be sent with it, and only for a few minutes.
 */
export async function signUpload(
  objectKey: string,
  type: string,
  size: number,
) {
  const url = apiUrl(objectKey);
  url.searchParams.set('X-Amz-Expires', String(UPLOAD_LINK_SECONDS));

  const signed = await storage().sign(url.href, {
    method: 'PUT',
    headers: { 'content-type': type, 'content-length': String(size) },
    aws: { signQuery: true, allHeaders: true },
  });

  return signed.url;
}

/**
 * Every file whose key starts with `prefix`.
 */
export async function listObjects(prefix: string) {
  const keys: { key: string; size: number; lastModified: Date }[] = [];
  let token: string | undefined;

  do {
    const url = apiUrl();
    url.searchParams.set('list-type', '2');
    url.searchParams.set('prefix', inBucket(prefix));
    if (token) url.searchParams.set('continuation-token', token);

    const response = await storage().fetch(url.href, {
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok)
      throw new Error(`Listing pictures failed with ${response.status}`);

    const xml = await response.text();
    for (const [, entry] of xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)) {
      const key = entry.match(/<Key>([^<]*)<\/Key>/)?.[1];
      const modified = entry.match(
        /<LastModified>([^<]*)<\/LastModified>/,
      )?.[1];
      const size = Number(entry.match(/<Size>([^<]*)<\/Size>/)?.[1] ?? 0);
      if (key && modified) {
        keys.push({
          key: FOLDER + key,
          size,
          lastModified: new Date(modified),
        });
      }
    }
    token = xml.match(
      /<NextContinuationToken>([^<]*)<\/NextContinuationToken>/,
    )?.[1];
  } while (token);

  return keys;
}

export async function deleteObject(objectKey: string) {
  const response = await storage().fetch(apiUrl(objectKey).href, {
    method: 'DELETE',
    signal: AbortSignal.timeout(8_000),
  });
  // Deleting something that is already gone counts as done
  if (!response.ok && response.status !== 404) {
    throw new Error(`Deleting ${objectKey} failed with ${response.status}`);
  }
}
