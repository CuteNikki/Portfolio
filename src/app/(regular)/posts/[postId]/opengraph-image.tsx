import { getPublishedPost } from '@/lib/data';
import { OG_SIZE, renderOgImage } from '@/lib/og';
import { formatDate } from '@/lib/utils';

// Gives the image an alt text with the post's title. Next.js then serves it under its own id, and prerendering
// the image as well isn't possible, but the picture itself is cached.
export async function generateImageMetadata({
  params,
}: {
  params: { postId: string };
}) {
  // Only published posts, so the alt text can't leak the title of a draft
  const post = await getPublishedPost(params.postId);

  return [
    {
      id: 'cover',
      alt: post ? `${post.title}, a post on niso.moe` : 'Posts on niso.moe',
      size: OG_SIZE,
      contentType: 'image/png',
    },
  ];
}

export default async function Image({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  // Only published posts, so the image can't leak the title of a draft
  const post = await getPublishedPost(postId);

  return renderOgImage({
    eyebrow: 'Post',
    title: post?.title ?? 'Posts',
    subtitle: post ? formatDate(post.createdAt, true) : undefined,
    coverUrl: post?.coverUrl,
  });
}
