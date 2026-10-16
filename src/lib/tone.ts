import 'server-only';

import sharp from 'sharp';

import { imageUrl } from '@/lib/images';
import { IMAGE_PUBLIC_URL } from '@/lib/storage';

// The hues of the five chart colours in globals.css (--chart-1 to --chart-5), in OKLCH degrees
const TONE_HUES = [302, 250, 175, 75, 15];

// Pixels this vivid or more count towards a picture's colour; greys, white and black backgrounds don't
const MIN_CHROMA = 0.03;
// A picture whose vivid pixels add up to less than this share of it has no clear colour
const MIN_COLOURFUL = 0.01;

// One sRGB channel (0 to 255) as linear light
const linear = (channel: number) => {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

// A pixel's lightness, chroma and hue in OKLCH (https://bottosson.github.io/posts/oklab/)
function oklch(r: number, g: number, b: number) {
  const [lr, lg, lb] = [linear(r), linear(g), linear(b)];
  const l = Math.cbrt(
    0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb,
  );
  const m = Math.cbrt(
    0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb,
  );
  const s = Math.cbrt(
    0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb,
  );
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return {
    lightness: L,
    chroma: Math.hypot(a, bb),
    hue: ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360,
  };
}

const hueDistance = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

/**
 * The chart colour (1 to 5) closest to a cover's main colour, or null when it has no clear colour or can't be read.
 * Vivid pixels count by how vivid they are, so a coloured headline outweighs a large pale background. Only pictures
 * from our own image server are fetched.
 */
export async function coverTone(url: string | null | undefined) {
  if (!url?.startsWith(`${IMAGE_PUBLIC_URL}/`)) return null;

  try {
    const response = await fetch(imageUrl(url, 'thumb'), {
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return null;

    const { data, info } = await sharp(
      Buffer.from(await response.arrayBuffer()),
    )
      .resize(120, 60, { fit: 'inside' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // How much vivid colour falls on each hue, in 10 degree steps
    const bins = new Array<number>(36).fill(0);
    let colourful = 0;
    const pixels = info.width * info.height;
    for (let i = 0; i < data.length; i += 3) {
      const { lightness, chroma, hue } = oklch(
        data[i],
        data[i + 1],
        data[i + 2],
      );
      if (chroma < MIN_CHROMA || lightness < 0.25 || lightness > 0.97) continue;
      bins[Math.floor(hue / 10) % 36] += chroma;
      colourful++;
    }
    if (colourful / pixels < MIN_COLOURFUL) return null;

    // The strongest hue, with its neighbours on either side, so a colour split across two steps still wins
    let best = 0;
    for (let i = 1; i < 36; i++) {
      const weight = (j: number) =>
        bins[(j + 35) % 36] + bins[j] + bins[(j + 1) % 36];
      if (weight(i) > weight(best)) best = i;
    }
    const hue = best * 10 + 5;

    let closest = 0;
    for (let i = 1; i < TONE_HUES.length; i++) {
      if (hueDistance(hue, TONE_HUES[i]) < hueDistance(hue, TONE_HUES[closest]))
        closest = i;
    }
    return closest + 1;
  } catch (error) {
    console.error('Could not read the colour of a cover:', error);
    return null;
  }
}
