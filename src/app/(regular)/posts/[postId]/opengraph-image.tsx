import { getPublishedPost, getPublishedPosts } from '@/lib/data';
import { OG_SIZE, renderOgImage } from '@/lib/og';
import { formatDate } from '@/lib/utils';

export const alt = 'niso.moe - Post';
export const size = OG_SIZE;
export const contentType = 'image/png';

export async function generateStaticParams() {
  const posts = await getPublishedPosts();

  // Cache Components needs at least one param to prerender the route
  if (posts.length === 0) return [{ postId: 'none' }];

  return posts.map((post) => ({ postId: post.slug ?? post.id }));
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
    eyebrow: 'Blog',
    title: post?.title ?? 'Posts',
    subtitle: post ? formatDate(post.createdAt, true) : undefined,
  });
}
