import { PROJECTS_METADATA } from '@/constants/metadata';

import { ProjectsContent } from '@/components/pages/projects';

export const metadata = PROJECTS_METADATA;

export default function ProjectsPage() {
  return <ProjectsContent />;
}
