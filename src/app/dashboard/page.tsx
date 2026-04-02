import { SITE_METADATA } from '@/constants/metadata';

import { ErrorToast } from '@/components/common/error-toast';
import { PostChartPie } from '@/components/dashboard/posts/chart';
import { SidebarInset } from '@/components/ui/sidebar';
import prisma from '@/lib/prisma';

export const { dashboard: metadata } = SITE_METADATA;

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
      <div className='flex flex-col gap-4'>
        <h1 className='text-2xl font-bold'>Welcome to the Dashboard</h1>
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
        <div className='flex flex-wrap gap-4'>
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
      </div>
    </SidebarInset>
  );
}
