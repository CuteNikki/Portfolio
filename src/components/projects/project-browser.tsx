'use client';

import { useState } from 'react';

import {
  ArrowDownAZIcon,
  CalendarIcon,
  ClockArrowDownIcon,
  ClockArrowUpIcon,
  LayersIcon,
  TagIcon,
  XIcon,
} from 'lucide-react';

import {
  type DateQuery,
  describeDateQuery,
  matchesDateQuery,
  parseDateQuery,
  shortDateQuery,
} from '@/lib/date-query';
import { imageUrl } from '@/lib/images';
import { cn } from '@/lib/utils';

import {
  ProjectCard,
  type ProjectCardData,
} from '@/components/projects/project-card';
import {
  SearchBox,
  type SuggestionSection,
} from '@/components/search/search-box';
import { type SortOption, SortMenu } from '@/components/search/sort-menu';
import { Button } from '@/components/ui/button';

type Sort = 'new' | 'old' | 'az';

const SORTS: SortOption<Sort>[] = [
  {
    id: 'new',
    label: 'Newest first',
    short: 'Newest',
    icon: ClockArrowDownIcon,
  },
  { id: 'old', label: 'Oldest first', short: 'Oldest', icon: ClockArrowUpIcon },
  { id: 'az', label: 'Name, A–Z', short: 'A–Z', icon: ArrowDownAZIcon },
];

// How many times each value appears across the projects, most common first
function countValues(
  projects: ProjectCardData[],
  pick: (p: ProjectCardData) => string[],
) {
  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const value of pick(project))
      counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  );
}

const plural = (n: number) => (n === 1 ? '1 project' : `${n} projects`);

// Search, filters and sorting for the projects page. The search also reads dates in most formats ("26 Sep",
// "09/2026", "26th") and suggests technologies, tags and projects as you type.
export function ProjectBrowser({ projects }: { projects: ProjectCardData[] }) {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState<string | null>(null);
  const [technology, setTechnology] = useState<string | null>(null);
  const [date, setDate] = useState<DateQuery | null>(null);
  const [sort, setSort] = useState<Sort>('new');

  const text = query.trim().toLowerCase();
  const dates = parseDateQuery(query);

  const matchesQuery = (p: ProjectCardData) =>
    dates
      ? matchesDateQuery(p.time, dates)
      : !text ||
        [p.title, p.excerpt, ...p.technologies, ...p.tags]
          .join(' ')
          .toLowerCase()
          .includes(text);
  const matchesFilters = (p: ProjectCardData) =>
    (!technology || p.technologies.includes(technology)) &&
    (!date || matchesDateQuery(p.time, [date]));

  const shown = projects
    .filter(
      (p) =>
        matchesQuery(p) && matchesFilters(p) && (!tag || p.tags.includes(tag)),
    )
    .sort((a, b) =>
      sort === 'az'
        ? a.title.localeCompare(b.title)
        : sort === 'old'
          ? a.time - b.time
          : b.time - a.time,
    );

  const tags = countValues(projects, (p) => p.tags);
  const technologies = countValues(projects, (p) => p.technologies);

  const pickTechnology = (t: string) => {
    setTechnology(t);
    setQuery('');
  };
  const pickTag = (t: string) => {
    setTag(t);
    setQuery('');
  };

  const projectItems = (list: ProjectCardData[]) =>
    list.map((p) => ({
      id: `project-${p.id}`,
      label: p.title,
      href: p.href,
      meta: [p.date, p.technologies.slice(0, 3).join(' · ')]
        .filter(Boolean)
        .join(' · '),
      icon: <ProjectSwatch tone={p.tone} coverUrl={p.coverUrl} />,
    }));

  let sections: SuggestionSection[];
  if (!text) {
    sections = [
      {
        id: 'popular',
        heading: 'Popular technologies',
        layout: 'chips',
        items: technologies
          .filter(([t]) => t !== technology)
          .slice(0, 6)
          .map(([t, count]) => ({
            id: `tech-${t}`,
            label: t,
            count,
            icon: <LayersIcon />,
            onSelect: () => pickTechnology(t),
          })),
      },
      {
        id: 'recent',
        heading: 'Recently published',
        layout: 'list',
        items: projectItems(
          [...projects].sort((a, b) => b.time - a.time).slice(0, 3),
        ),
      },
    ];
  } else if (dates) {
    sections = [
      {
        id: 'date',
        heading: 'Date',
        layout: 'list',
        items: dates.map((d) => ({
          id: `date-${shortDateQuery(d)}`,
          label: `Published ${describeDateQuery(d)}`,
          count: projects.filter((p) => matchesDateQuery(p.time, [d])).length,
          icon: <CalendarIcon className='text-primary-text size-4' />,
          onSelect: () => {
            setDate(d);
            setQuery('');
          },
        })),
      },
      {
        id: 'projects',
        heading: 'Projects',
        layout: 'list',
        items: projectItems(shown.slice(0, 4)),
      },
    ];
  } else {
    sections = [
      {
        id: 'filters',
        heading: 'Filter by',
        layout: 'chips',
        items: [
          ...tags
            .filter(([t]) => t !== tag && t.toLowerCase().includes(text))
            .map(([t, count]) => ({
              id: `tag-${t}`,
              label: t,
              count,
              icon: <TagIcon />,
              onSelect: () => pickTag(t),
            })),
          ...technologies
            .filter(([t]) => t !== technology && t.toLowerCase().includes(text))
            .map(([t, count]) => ({
              id: `tech-${t}`,
              label: t,
              count,
              icon: <LayersIcon />,
              onSelect: () => pickTechnology(t),
            })),
        ].slice(0, 8),
      },
      {
        id: 'projects',
        heading: 'Projects',
        layout: 'list',
        items: projectItems(shown.slice(0, 4)),
      },
    ];
  }

  const hasFilters = !!(query || tag || technology || date);
  const clearAll = () => {
    setQuery('');
    setTag(null);
    setTechnology(null);
    setDate(null);
  };

  return (
    <div className='flex flex-col gap-4'>
      {/* The cards' titles are third-level headings, so the list needs one at the second level */}
      <h2 className='sr-only'>All projects</h2>
      <div className='flex items-center gap-2.5'>
        <div className='min-w-0 flex-1'>
          <SearchBox
            value={query}
            onChange={setQuery}
            label='Search projects'
            placeholder='Name, stack or date'
            sections={sections}
            resultsLabel={plural(shown.length)}
            emptyText={`No projects, technologies or dates match “${query.trim()}”.`}
          />
        </div>
        <SortMenu options={SORTS} value={sort} onChange={setSort} />
      </div>

      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div
          role='group'
          aria-label='Filter by tag'
          className='flex flex-wrap gap-1.5'
        >
          {tags.length > 1 &&
            [null, ...tags.map(([t]) => t)].map((t) => {
              const on = t === tag;
              const count = projects.filter(
                (p) =>
                  matchesQuery(p) &&
                  matchesFilters(p) &&
                  (!t || p.tags.includes(t)),
              ).length;
              return (
                <button
                  key={t ?? 'all'}
                  type='button'
                  aria-pressed={on}
                  onClick={() => setTag(t)}
                  className={cn(
                    'flex h-9 items-center gap-2 rounded-lg border px-3 text-[13px] transition-colors',
                    on
                      ? 'border-primary-text bg-primary-soft text-foreground'
                      : 'bg-card text-body hover:border-line-strong hover:text-foreground',
                  )}
                >
                  {t ?? 'All'}
                  <span className='text-muted-foreground text-[11px]'>
                    {count}
                  </span>
                </button>
              );
            })}
          {technology && (
            <ActiveFilter
              icon={<LayersIcon />}
              label={technology}
              description={`technology ${technology}`}
              onRemove={() => setTechnology(null)}
            />
          )}
          {date && (
            <ActiveFilter
              icon={<CalendarIcon />}
              label={shortDateQuery(date)}
              description={`date: published ${describeDateQuery(date)}`}
              onRemove={() => setDate(null)}
            />
          )}
        </div>
        <p role='status' className='text-muted-foreground text-[13px]'>
          {plural(shown.length)}
        </p>
      </div>

      {shown.length > 0 ? (
        <div className='mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {shown.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              priority={index < 3}
              revealIndex={index % 3}
            />
          ))}
        </div>
      ) : (
        <div className='mt-2 flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-18 text-center'>
          <p className='font-bold'>No projects match your search.</p>
          {hasFilters && (
            <Button variant='outline' onClick={clearAll}>
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// A filter picked from the suggestions, shown next to the tag chips until it's removed
function ActiveFilter({
  icon,
  label,
  description,
  onRemove,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onRemove: () => void;
}) {
  return (
    <button
      type='button'
      aria-label={`Remove filter: ${description}`}
      onClick={onRemove}
      className='border-primary-text bg-primary-soft text-foreground flex h-9 items-center gap-2 rounded-lg border pr-2.5 pl-3 text-[13px] [&_svg]:size-3.5'
    >
      <span className='text-primary-text'>{icon}</span>
      {label}
      <XIcon className='text-muted-foreground' />
    </button>
  );
}

// The project's colour as a small square, so suggestions are easy to tell apart
function ProjectSwatch({
  tone,
  coverUrl,
}: {
  tone: string;
  coverUrl: string | null;
}) {
  if (coverUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl(coverUrl, 'thumb')}
        alt=''
        loading='lazy'
        className='h-7.5 w-12 shrink-0 rounded-md object-cover'
      />
    );
  }

  return (
    <span
      aria-hidden
      className='relative h-7.5 w-12 shrink-0 overflow-hidden rounded-md bg-[color-mix(in_oklab,var(--tone)_18%,var(--card))]'
      style={{ '--tone': tone } as React.CSSProperties}
    >
      <span className='bg-card absolute inset-x-[14%] top-[22%] -bottom-[10%] rounded-[3px]' />
    </span>
  );
}
