import { CalendarIcon } from 'lucide-react';
import Link from 'next/link';

import { Role } from '@/generated/prisma/enums';

import { LINKS } from '@/constants/links';
import { getCurrentSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { ErrorToast } from '@/components/common/error-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export async function ProjectList() {
  const session = await getCurrentSession();
  const isAdmin =
    session?.user.role === Role.ADMIN || session?.user.role === Role.WRITER;

  const { projects, hasError } = await prisma.project
    .findMany({
      where: isAdmin ? {} : { publishedAt: { not: null } },
      orderBy: { createdAt: 'desc' },
      include: { writer: true },
    })
    .then((projects) => ({ projects, hasError: false }))
    .catch((error) => {
      console.error('Error fetching projects:', error);
      return { projects: [], hasError: true };
    });

  return (
    <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2'>
      {hasError && (
        <ErrorToast
          title='Failed to load latest projects.'
          description='The database is currently unreachable. Please try again later.'
        />
      )}
      {projects.map((project) => (
        <Link
          href={LINKS.projectWithSlugOrId(project.slug ?? project.id).url}
          key={project.id}
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

          <div className='text-muted-foreground mt-6 flex items-center gap-4 text-xs'>
            <div className='flex items-center gap-1'>
              <CalendarIcon className='size-3' />
              {new Date(project.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        </Link>
      ))}
      {projects.length === 0 && (
        <div className='text-muted-foreground col-span-full py-20 text-center'>
          No projects found. Check back later!
        </div>
      )}
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

          <div className='mt-6 flex items-center gap-4'>
            <Skeleton className='h-4 w-24' />
          </div>
        </div>
      ))}
    </div>
  );
}
