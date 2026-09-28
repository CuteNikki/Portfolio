import { OG_SIZE, renderOgImage } from '@/lib/og';
import prisma from '@/lib/prisma';

export const alt = 'niso.moe - Project';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  // Only published projects, so the image can't leak the title of a draft
  const project = await prisma.project
    .findFirst({
      where: {
        OR: [{ id: projectId }, { slug: projectId }],
        publishedAt: { not: null },
      },
    })
    .catch(() => null);

  return renderOgImage({
    eyebrow: 'Project',
    title: project?.title ?? 'Projects',
    subtitle: project?.technologies.slice(0, 5).join(' · ') || undefined,
  });
}
