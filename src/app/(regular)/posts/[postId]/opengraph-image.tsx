import { OG_SIZE, renderOgImage } from '@/lib/og';
import prisma from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

export const alt = 'niso.moe - Post';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  // Only published posts, so the image can't leak the title of a draft
  const post = await prisma.post
    .findFirst({
      where: {
        OR: [{ id: postId }, { slug: postId }],
        publishedAt: { not: null },
      },
    })
    .catch(() => null);

  return renderOgImage({
    eyebrow: 'Blog',
    title: post?.title ?? 'Posts',
    subtitle: post ? formatDate(post.createdAt, true) : undefined,
  });
}
