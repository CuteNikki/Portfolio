'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

import {
  ProjectCard,
  type ProjectCardData,
} from '@/components/projects/project-card';

const SHOWN = 5;

// The home page's projects: up to five, with chips for the most used tags. The first card spans two columns when
// there are enough cards to fill the rows around it.
export function FeaturedProjects({
  projects,
  heading,
}: {
  projects: ProjectCardData[];
  // Sits on the left of the filter chips
  heading: React.ReactNode;
}) {
  const [tag, setTag] = useState<string | null>(null);

  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const t of project.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  const tags = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 4)
    .map(([t]) => t);

  const shown = projects
    .filter((project) => !tag || project.tags.includes(tag))
    .slice(0, SHOWN);

  return (
    <>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        {heading}
        {tags.length > 1 && (
          <div
            role='group'
            aria-label='Filter projects'
            data-reveal=''
            className='flex flex-wrap gap-1.5'
          >
            {[null, ...tags].map((t) => {
              const on = t === tag;
              return (
                <button
                  key={t ?? 'all'}
                  type='button'
                  aria-pressed={on}
                  onClick={() => setTag(t)}
                  className={cn(
                    'h-9 rounded-lg border px-3.5 text-[13px] transition-colors',
                    on
                      ? 'border-primary-text bg-primary-soft text-foreground'
                      : 'bg-card text-muted-foreground hover:border-line-strong hover:text-foreground',
                  )}
                >
                  {t ?? 'All'}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {shown.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            featured={index === 0 && shown.length > 2}
            priority={index === 0}
            revealIndex={index}
          />
        ))}
      </div>
    </>
  );
}
