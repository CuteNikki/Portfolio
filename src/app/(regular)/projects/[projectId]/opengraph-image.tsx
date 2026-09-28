import { getPublishedProject, getPublishedProjects } from '@/lib/data';
import { OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'niso.moe - Project';
export const size = OG_SIZE;
export const contentType = 'image/png';

export async function generateStaticParams() {
  const projects = await getPublishedProjects();

  // Cache Components needs at least one param to prerender the route
  if (projects.length === 0) return [{ projectId: 'none' }];

  return projects.map((project) => ({ projectId: project.slug ?? project.id }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  // Only published projects, so the image can't leak the title of a draft
  const project = await getPublishedProject(projectId);

  return renderOgImage({
    eyebrow: 'Project',
    title: project?.title ?? 'Projects',
    subtitle: project?.technologies.slice(0, 5).join(' · ') || undefined,
  });
}
