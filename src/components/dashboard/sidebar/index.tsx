'use client';

import { Role } from '@/generated/prisma/enums';

import { DASHBOARD_LINKS, SIDEBAR_LINKS } from '@/constants/links';

import { useAuth } from '@/providers/auth';

import { SidebarNavigationGroup } from '@/components/dashboard/sidebar/group';
import { NavUser } from '@/components/dashboard/sidebar/user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useAuth();
  // Writers manage posts and projects; the users page is only for admins
  const dashboardLinks = DASHBOARD_LINKS.filter(
    (link) => !link.requiresAdmin || session?.user.role === Role.ADMIN,
  );

  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarContent>
        <SidebarNavigationGroup label='Main' items={SIDEBAR_LINKS} />
        <SidebarNavigationGroup label='Dashboard' items={dashboardLinks} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
