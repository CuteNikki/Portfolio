'use client';

import Link from 'next/link';

import { LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export function SidebarNavigationGroup({
  items,
  label,
}: {
  label: string;
  items: {
    label: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton asChild>
              {/* On mobile the sidebar is a sheet over the page, so close it once a page is picked */}
              <Link href={item.url} onClick={() => setOpenMobile(false)}>
                {item.icon && <item.icon className='size-4 shrink-0' />}
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
