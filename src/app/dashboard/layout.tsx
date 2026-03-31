import { redirect } from 'next/navigation';

import { Role } from '@/generated/prisma/enums';

import { getCurrentSession } from '@/lib/auth';

import { SITE_METADATA } from '@/constants/metadata';

import { AuthProvider } from '@/providers/auth';

import { AppSidebar } from '@/components/dashboard/sidebar';
import { Footer } from '@/components/navigation/footer';
import { ThemeSwitcher } from '@/components/theme/switcher';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export const { dashboard: metadata } = SITE_METADATA;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session || session.user.role !== Role.ADMIN) {
    redirect('/unauthorized');
  }

  return (
    <AuthProvider session={session}>
      <SidebarProvider>
        <AppSidebar />

        <div className='flex min-w-0 flex-1 flex-col'>
          <header className='bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-10 flex h-14 items-center gap-4 border-b px-4 backdrop-blur'>
            <SidebarTrigger />
            <div className='flex flex-1 items-center justify-end gap-2'>
              <ThemeSwitcher />
            </div>
          </header>

          <main className='flex-1 p-4 md:p-8'>{children}</main>
          <Footer />
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}
