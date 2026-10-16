import { getPublishedProject } from '@/lib/data';
import { OG_SIZE, renderOgImage } from '@/lib/og';

// Gives the image an alt text with the project's title. Next.js then serves it under its own id, and prerendering
// the image as well isn't possible, but the picture itself is cached.
export async function generateImageMetadata({
  params,
}: {
  params: { projectId: string };
}) {
  // Only published projects, so the alt text can't leak the title of a draft
  const project = await getPublishedProject(params.projectId);

  return [
    {
      id: 'cover',
      alt: project
        ? `${project.title}, a project on niso.moe`
        : 'Projects on niso.moe',
      size: OG_SIZE,
      contentType: 'image/png',
    },
  ];
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
    details: project?.technologies.slice(0, 4),
    coverUrl: project?.coverUrl,
  });
}
