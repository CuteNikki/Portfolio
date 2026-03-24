'use client';

import { DASHBOARD_LINKS, SIDEBAR_LINKS } from '@/constants/links';

import { SidebarNavigationGroup } from '@/components/dashboard/sidebar/group';
import { NavUser } from '@/components/dashboard/sidebar/user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarContent>
        <SidebarNavigationGroup label='Main' items={SIDEBAR_LINKS} />
        <SidebarNavigationGroup label='Dashboard' items={DASHBOARD_LINKS} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
