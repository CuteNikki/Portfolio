import { CalendarIcon } from 'lucide-react';
import Link from 'next/link';

import { LINKS } from '@/constants/links';
import { getDraftProjects, getPublishedProjects } from '@/lib/data';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export async function ProjectList() {
  const projects = await getPublishedProjects();

  if (projects.length === 0) {
    return (
      <div className='text-muted-foreground py-20 text-center'>
        No projects found. Check back later!
      </div>
    );
  }

  return <ProjectGrid projects={projects} />;
}

// Only rendered for writers, so it streams in separately from the cached list
export async function DraftProjectList() {
  const projects = await getDraftProjects();

  if (projects.length === 0) return null;

  return <ProjectGrid projects={projects} />;
}

function ProjectGrid({
  projects,
}: {
  projects: Awaited<ReturnType<typeof getPublishedProjects>>;
}) {
  return (
    <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2'>
      {projects.map((project, index) => (
        <Link
          href={LINKS.projectWithSlugOrId(project.slug ?? project.id).url}
          key={project.id}
          data-reveal-item
          style={{ '--reveal-index': index } as React.CSSProperties}
          className='group hover:border-primary/50 hover:bg-muted/20 flex flex-col justify-between border p-5 transition-colors'
        >
          <div className='flex flex-col gap-2'>
            {!project.publishedAt && <Badge>Draft</Badge>}
            <h2 className='group-hover:text-primary-text truncate text-xl font-bold transition-colors'>
              {project.title}
            </h2>
            <p className='text-muted-foreground line-clamp-3 text-sm text-ellipsis'>
              {project.description}
            </p>
          </div>

          <div className='text-muted-foreground mt-2 flex items-center gap-4 text-sm'>
            <div className='flex items-center gap-2'>
              <CalendarIcon className='size-4 shrink-0' />
              {new Date(project.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                timeZone: 'UTC',
              })}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function ProjectListSkeleton() {
  return (
    <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2'>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className='group hover:border-primary/50 hover:bg-muted/20 flex flex-col justify-between border p-5 transition-colors'
        >
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-7 w-full' />
            <Skeleton className='h-15 w-full' />
          </div>

          <div className='mt-2 flex items-center gap-4'>
            <Skeleton className='h-5 w-24' />
          </div>
        </div>
      ))}
    </div>
  );
}
