import { requireAdmin } from '@/lib/auth';

import { SITE_METADATA } from '@/constants/metadata';

import { AuthProvider } from '@/providers/auth';

import { AppSidebar } from '@/components/dashboard/sidebar';
import { Footer } from '@/components/navigation/footer';
import { ThemeSwitcher } from '@/components/theme/switcher';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export const { dashboard: metadata } = SITE_METADATA;

// The dashboard is private and every page checks the session, so it renders on
// every request instead of being prerendered
export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();

  return (
    <AuthProvider
      session={{
        user: {
          id: user.id,
          discordId: user.discordId,
          displayName: user.displayName,
          username: user.username,
          avatarUrl: user.avatarUrl,
          role: user.role,
          createdAt: user.createdAt,
        },
      }}
    >
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
