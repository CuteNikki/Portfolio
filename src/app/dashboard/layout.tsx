import { Role } from '@/generated/prisma/enums';

import { requireWriter } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { SITE_METADATA } from '@/constants/metadata';

import {
  DashboardMobileNav,
  DashboardSidebar,
} from '@/components/dashboard/sidebar/dashboard-nav';
import { Footer } from '@/components/navigation/footer';
import { Navbar } from '@/components/navigation/navbar';
import { TooltipProvider } from '@/components/ui/tooltip';

export const { dashboard: metadata } = SITE_METADATA;

// The dashboard is private and every page checks the session, so it renders on
// every request instead of being prerendered
export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireWriter();
  const isAdmin = user.role === Role.ADMIN;

  // The numbers next to the sidebar's links
  const [posts, projects, comments, users] = await Promise.all([
    prisma.post.count(),
    prisma.project.count(),
    prisma.comment.count(),
    isAdmin ? prisma.user.count() : undefined,
  ]);
  const counts = {
    '/dashboard/posts': posts,
    '/dashboard/projects': projects,
    '/dashboard/comments': comments,
    '/dashboard/users': users,
  };

  return (
    // The sidebar's tooltips; the rest of the site has none
    <TooltipProvider>
      <div className='flex min-h-svh flex-col'>
        <Navbar wide />
        <div className='flex flex-1'>
          <DashboardSidebar counts={counts} isAdmin={isAdmin} />
          <main className='flex min-w-0 flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-10 lg:py-8'>
            <DashboardMobileNav counts={counts} isAdmin={isAdmin} />
            {children}
          </main>
        </div>
        <Footer wide />
      </div>
    </TooltipProvider>
  );
}
