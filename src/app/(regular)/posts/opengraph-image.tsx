import { getPublishedPosts } from '@/lib/data';
import { OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'Posts on niso.moe: Notes on how I build things.';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  const { length } = await getPublishedPosts();

  return renderOgImage({
    eyebrow: 'Posts',
    title: 'Notes on how I build things.',
    subtitle: `${length} ${length === 1 ? 'post' : 'posts'}`,
  });
}
