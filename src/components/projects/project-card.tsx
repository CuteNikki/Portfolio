import Link from 'next/link';

import { ArrowUpRightIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { ProjectThumbnail } from '@/components/projects/project-thumbnail';

// Plain data, so the cards can also be rendered by Client Components such as the filterable lists
export interface ProjectCardData {
  id: string;
  href: string;
  title: string;
  excerpt: string;
  date: string;
  // Sortable form of the date, in milliseconds
  time: number;
  technologies: string[];
  tags: string[];
  coverUrl: string | null;
}

export function ProjectCard({
  project,
  featured,
  priority,
}: {
  project: ProjectCardData;
  // The first card on the home page spans two columns and gets a taller picture
  featured?: boolean;
  priority?: boolean;
}) {
  return (
    <Link
      href={project.href}
      className={cn(
        'card-lift group bg-card flex flex-col overflow-hidden rounded-[18px] border',
        featured && 'lg:col-span-2',
      )}
    >
      <ProjectThumbnail
        title={project.title}
        coverUrl={project.coverUrl}
        priority={priority}
        sizes={
          featured
            ? '(min-width: 1024px) 760px, 100vw'
            : '(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw'
        }
        className={featured ? 'h-50 lg:h-75' : 'h-50'}
      />
      <div className='flex flex-1 flex-col gap-1.5 border-t px-5 pt-4.5 pb-5'>
        <div className='flex items-center justify-between gap-3'>
          <h3 className='text-[17px] font-bold tracking-[-0.04em]'>
            {project.title}
          </h3>
          <ArrowUpRightIcon
            aria-hidden
            className='text-primary-text size-4 shrink-0 -translate-x-1 translate-y-1 opacity-0 transition-[opacity,translate] duration-300 group-hover:translate-0 group-hover:opacity-100 group-focus-visible:translate-0 group-focus-visible:opacity-100'
          />
        </div>
        <p className='text-body line-clamp-3 text-[13px]'>{project.excerpt}</p>
        <div className='text-muted-foreground mt-auto flex flex-wrap gap-x-3.5 gap-y-1 pt-2 text-xs'>
          <time dateTime={new Date(project.time).toISOString()}>
            {project.date}
          </time>
          {project.technologies.length > 0 && (
            <span>{project.technologies.slice(0, 3).join(' · ')}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
