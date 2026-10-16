import { getPublishedProjects } from '@/lib/data';
import { OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = "Projects on niso.moe: Things I've built.";
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  const { length } = await getPublishedProjects();

  return renderOgImage({
    eyebrow: 'Projects',
    title: "Things I've built.",
    subtitle: `${length} ${length === 1 ? 'project' : 'projects'}`,
  });
}
