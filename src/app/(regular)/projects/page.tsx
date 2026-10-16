import { Suspense } from 'react';

import { toProjectCard } from '@/lib/cards';
import { getDraftProjects, getPublishedProjects } from '@/lib/data';

import { SITE_METADATA } from '@/constants/metadata';

import { PageHeader } from '@/components/common/page-header';
import { ProjectBrowser } from '@/components/projects/project-browser';
import { ProjectCard } from '@/components/projects/project-card';

export const { projects: metadata } = SITE_METADATA;

export default function ProjectsPage() {
  return (
    <div className='flex w-full flex-col gap-10'>
      <PageHeader
        eyebrow='Selected work'
        title='Projects.'
        description='A collection of products, experiments, and systems I’ve helped bring to life.'
      />
      {/* Drafts read the session, so they stream in after the prerendered list */}
      <Suspense fallback={null}>
        <Drafts />
      </Suspense>
      <PublishedProjects />
    </div>
  );
}

async function PublishedProjects() {
  const projects = await getPublishedProjects();

  if (projects.length === 0) {
    return (
      <p className='text-muted-foreground py-20 text-center'>
        No projects yet. Check back later!
      </p>
    );
  }

  return <ProjectBrowser projects={projects.map(toProjectCard)} />;
}

// Only writers see unpublished projects
async function Drafts() {
  const drafts = await getDraftProjects();
  if (drafts.length === 0) return null;

  return (
    <section aria-labelledby='drafts-heading' className='flex flex-col gap-4'>
      <h2 id='drafts-heading' className='text-lg font-bold tracking-[-0.03em]'>
        Drafts{' '}
        <span className='text-muted-foreground font-normal'>
          · only writers see these
        </span>
      </h2>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {drafts.map((project) => (
          <ProjectCard key={project.id} project={toProjectCard(project)} />
        ))}
      </div>
    </section>
  );
}
