import { MedalIcon } from 'lucide-react';

import { SITE_METADATA } from '@/constants/metadata';
import prisma from '@/lib/prisma';

import { ErrorToast } from '@/components/common/error-toast';
import { PostChartPie } from '@/components/dashboard/posts/chart';
import { DashboardHeader } from '@/components/dashboard/shared/header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SidebarInset } from '@/components/ui/sidebar';

export const { dashboard: metadata } = SITE_METADATA;

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { posts, hasPostsError } = await prisma.post
    .findMany({ orderBy: { views: 'desc' }, take: 5 })
    .then((posts) => ({ posts, hasPostsError: false }))
    .catch((error) => {
      console.error('Error fetching posts:', error);
      return { posts: [], hasPostsError: true };
    });
  // const { projects, hasProjectsError } = await prisma.project
  //   .findMany()
  //   .then((projects) => ({ projects, hasProjectsError: false }))
  //   .catch((error) => {
  //     console.error('Error fetching projects:', error);
  //     return { projects: [], hasProjectsError: true };
  //   });

  return (
    <SidebarInset>
      {/* {hasProjectsError && (
        <ErrorToast
          title='Error fetching projects'
          description='There was an error while fetching the projects. Please try again later.'
        />
      )} */}
      {hasPostsError && (
        <ErrorToast
          title='Error fetching posts'
          description='There was an error while fetching the posts. Please try again later.'
        />
      )}
      <div className='flex flex-col gap-4'>
        <Card className='w-full max-w-5xl'>
          <CardHeader>
            <DashboardHeader
              title='Top 5 Posts by Views'
              description='Here are the top 5 posts based on the number of views.'
              icon={MedalIcon}
            />
          </CardHeader>
          <CardContent>
            {posts.length === 0 ? (
              <p className='text-muted-foreground'>No posts available.</p>
            ) : (
              <ul className='space-y-2'>
                {posts.map((post, index) => (
                  <li key={post.id} className='flex justify-between'>
                    <span>
                      {index + 1}. {post.title}
                    </span>
                    <span className='font-medium'>{post.views} views</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        {posts.length > 0 && (
          <PostChartPie
            chartData={posts.map((post, index) => ({
              title: post.title,
              views: post.views,
              fill: `var(--color-post${index})`,
            }))}
            chartConfig={{
              views: {
                label: 'Views',
              },
              ...Object.fromEntries(
                posts.map((post, index) => [
                  `post${index}`,
                  {
                    label: post.title,
                    color: `var(--chart-${(index % 5) + 1})`,
                  },
                ]),
              ),
            }}
          />
        )}
      </div>
    </SidebarInset>
  );
}
