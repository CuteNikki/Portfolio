'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  PlusIcon,
  PresentationIcon,
  SquarePenIcon,
} from 'lucide-react';

import {
  DASHBOARD_ADMIN_LINKS,
  DASHBOARD_LINKS,
  LINKS,
  type Link as NavLink,
} from '@/constants/links';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// How many there are of each, shown next to their links, keyed by the link's address
export type DashboardCounts = Record<string, number | undefined>;

const COLLAPSED_KEY = 'dashboard-sidebar-collapsed';
const listeners = new Set<() => void>();

// The collapsed sidebar is a per-browser preference. Storage can be unavailable (private windows), so it falls back
// to open.
function readCollapsed() {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === '1';
  } catch {
    return false;
  }
}
function setCollapsed(collapsed: boolean) {
  try {
    localStorage.setItem(COLLAPSED_KEY, collapsed ? '1' : '0');
  } catch {}
  listeners.forEach((listener) => listener());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const path = (url: string) => url.split('#')[0];
// Overview only on its own page; the others also on the pages below them, e.g. a post's edit page
function isCurrent(pathname: string, url: string) {
  const target = path(url);
  return target === '/dashboard'
    ? pathname === target
    : pathname === target || pathname.startsWith(`${target}/`);
}

function sectionsFor(isAdmin: boolean) {
  return [
    { label: 'Content', links: DASHBOARD_LINKS },
    ...(isAdmin ? [{ label: 'Admin', links: DASHBOARD_ADMIN_LINKS }] : []),
  ];
}

function NewMenu({ compact }: { compact?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={compact ? undefined : 'flex-1'}
          size={compact ? 'icon-lg' : 'lg'}
          aria-label={compact ? 'New' : undefined}
        >
          <PlusIcon />
          {!compact && 'New'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-52'>
        <DropdownMenuItem asChild>
          <Link href={LINKS.dashboardPostNew.url}>
            <SquarePenIcon />
            Post
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={LINKS.dashboardProjectNew.url}>
            <PresentationIcon />
            Project
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarLink({
  link,
  count,
  current,
  collapsed,
}: {
  link: NavLink;
  count?: number;
  current: boolean;
  collapsed: boolean;
}) {
  const Icon = link.icon;
  const item = (
    <Link
      href={link.url}
      aria-current={current ? 'page' : undefined}
      aria-label={collapsed ? link.label : undefined}
      className={cn(
        'flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors [&_svg]:size-4.5 [&_svg]:shrink-0',
        current
          ? 'bg-primary-soft text-foreground [&_svg]:text-primary-text font-semibold'
          : 'text-body hover:bg-muted hover:text-foreground [&_svg]:text-muted-foreground',
        collapsed && 'justify-center px-0',
      )}
    >
      {Icon && <Icon aria-hidden />}
      {!collapsed && (
        <>
          <span className='flex-1 truncate'>{link.label}</span>
          {count !== undefined && (
            <span className='text-muted-foreground text-xs tabular-nums'>
              {count}
            </span>
          )}
        </>
      )}
    </Link>
  );

  if (!collapsed) return item;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{item}</TooltipTrigger>
      <TooltipContent side='right'>
        {link.label}
        {count !== undefined && ` · ${count}`}
      </TooltipContent>
    </Tooltip>
  );
}

// The dashboard's sidebar on larger screens. It folds down to icons with tooltips, remembered per browser.
export function DashboardSidebar({
  counts,
  isAdmin,
}: {
  counts: DashboardCounts;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const collapsed = useSyncExternalStore(subscribe, readCollapsed, () => false);

  return (
    <aside
      aria-label='Dashboard'
      className={cn(
        'hidden shrink-0 border-r transition-[width] duration-300 ease-(--ease-out-soft) lg:block',
        collapsed ? 'w-18' : 'w-66',
      )}
    >
      <div className='sticky top-17 flex max-h-[calc(100svh-4.25rem)] flex-col gap-6 overflow-y-auto px-3 py-6'>
        <div className={cn('flex gap-2', collapsed && 'flex-col items-center')}>
          <NewMenu compact={collapsed} />
          <Button
            variant='outline'
            size='icon-lg'
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
          </Button>
        </div>

        {sectionsFor(isAdmin).map(({ label, links }) => (
          <nav key={label} aria-label={label} className='flex flex-col gap-0.5'>
            {!collapsed && (
              <span className='text-muted-foreground px-3 pb-1.5 text-[11px] tracking-widest uppercase'>
                {label}
              </span>
            )}
            {links.map((link) => (
              <SidebarLink
                key={link.url}
                link={link}
                count={counts[path(link.url)]}
                current={isCurrent(pathname, link.url)}
                collapsed={collapsed}
              />
            ))}
          </nav>
        ))}
      </div>
    </aside>
  );
}

// The same sections on phones and tablets, as a row of tabs that scrolls sideways above the page
export function DashboardTabs({
  counts,
  isAdmin,
}: {
  counts: DashboardCounts;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const links = sectionsFor(isAdmin).flatMap(({ links }) => links);

  return (
    <nav aria-label='Dashboard' className='flex items-center gap-2 lg:hidden'>
      <NewMenu compact />
      <ul className='flex min-w-0 flex-1 gap-1 overflow-x-auto py-1'>
        {links.map((link) => {
          const current = isCurrent(pathname, link.url);
          const Icon = link.icon;
          const count = counts[path(link.url)];
          return (
            <li key={link.url} className='shrink-0'>
              <Link
                href={link.url}
                aria-current={current ? 'page' : undefined}
                className={cn(
                  'flex h-10 items-center gap-2 rounded-lg border px-3 text-sm whitespace-nowrap transition-colors [&_svg]:size-4',
                  current
                    ? 'border-primary-text/40 bg-primary-soft text-foreground'
                    : 'bg-card text-body hover:text-foreground',
                )}
              >
                {Icon && <Icon aria-hidden className='text-muted-foreground' />}
                {link.label}
                {count !== undefined && (
                  <span className='text-muted-foreground text-xs'>{count}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
