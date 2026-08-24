'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { motion, useReducedMotion } from 'framer-motion';
import { Tabs as TabsPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/lib/utils';

// Shares the active value + a per-Tabs layout id so a single indicator can slide
// between triggers. Variant travels separately from TabsList.
type TabsContextValue = { value: string | undefined; indicatorId: string };
const TabsContext = React.createContext<TabsContextValue | null>(null);
const TabsVariantContext = React.createContext<'default' | 'line'>('default');

function Tabs({
  className,
  orientation = 'horizontal',
  value,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const indicatorId = React.useId();
  // Mirror the active tab (controlled or not) so the indicator knows where to sit.
  const [current, setCurrent] = React.useState<string | undefined>(
    value ?? defaultValue,
  );
  React.useEffect(() => {
    if (value !== undefined) setCurrent(value);
  }, [value]);

  return (
    <TabsContext.Provider value={{ value: current, indicatorId }}>
      <TabsPrimitive.Root
        data-slot='tabs'
        data-orientation={orientation}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next) => {
          setCurrent(next);
          onValueChange?.(next);
        }}
        className={cn(
          'group/tabs flex gap-2 data-horizontal:flex-col',
          className,
        )}
        {...props}
      />
    </TabsContext.Provider>
  );
}

const tabsListVariants = cva(
  'group/tabs-list inline-flex w-fit items-center justify-center p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        line: 'gap-1 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function TabsList({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsVariantContext.Provider value={variant ?? 'default'}>
      <TabsPrimitive.List
        data-slot='tabs-list'
        data-variant={variant}
        className={cn(tabsListVariants({ variant }), className)}
        {...props}
      />
    </TabsVariantContext.Provider>
  );
}

function TabsTrigger({
  className,
  value,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const tabs = React.useContext(TabsContext);
  const variant = React.useContext(TabsVariantContext);
  const reduce = useReducedMotion();
  const active = tabs?.value !== undefined && tabs.value === value;

  return (
    <TabsPrimitive.Trigger
      data-slot='tabs-trigger'
      value={value}
      className={cn(
        "text-foreground/60 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:text-muted-foreground dark:hover:text-foreground data-active:text-foreground dark:data-active:text-foreground relative isolate inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {active && tabs ? (
        <motion.span
          layoutId={reduce ? undefined : tabs.indicatorId}
          aria-hidden
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          className={cn(
            'pointer-events-none absolute -z-10',
            variant === 'line'
              ? 'bg-foreground inset-x-0 -bottom-1 h-0.5'
              : 'bg-background dark:border-input dark:bg-input/30 inset-0 shadow-sm dark:border',
          )}
        />
      ) : null}
      {children}
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot='tabs-content'
      className={cn('flex-1 text-sm outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, tabsListVariants, TabsTrigger };
