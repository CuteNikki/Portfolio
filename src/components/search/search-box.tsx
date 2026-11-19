'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useId, useState } from 'react';

import { ArrowUpRightIcon, SearchIcon, XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface Suggestion {
  id: string;
  label: string;
  // Opens a page, or else runs `onSelect`, e.g. to add a filter
  href?: string;
  onSelect?: () => void;
  icon?: React.ReactNode;
  // Shown under the label in lists, e.g. the date and stack of a project
  meta?: string;
  count?: number;
}

export interface SuggestionSection {
  id: string;
  heading: string;
  // Chips wrap side by side, lists show one suggestion per row
  layout: 'chips' | 'list';
  items: Suggestion[];
}

// Marks where the query appears in a suggestion's label
function Highlighted({ text, query }: { text: string; query: string }) {
  const at = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (at === -1) return text;

  return (
    <>
      {text.slice(0, at)}
      <mark className='rounded-[3px] bg-primary-soft text-foreground'>
        {text.slice(at, at + query.length)}
      </mark>
      {text.slice(at + query.length)}
    </>
  );
}

// A search field whose suggestions open as soon as it is focused. Arrow keys move through them, Enter picks one,
// and Escape closes the list. The list filters what the page shows as you type; picking "Show all" just closes it.
export function SearchBox({
  value,
  onChange,
  label,
  placeholder,
  sections,
  resultsLabel,
  emptyText,
}: {
  value: string;
  onChange: (value: string) => void;
  // Read by screen readers, e.g. "Search projects"
  label: string;
  placeholder: string;
  sections: SuggestionSection[];
  // The "Show all …" line under the suggestions while typing, e.g. "3 projects"
  resultsLabel: string;
  emptyText: string;
}) {
  const router = useRouter();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const query = value.trim();
  const items = sections.flatMap((section) => section.items);
  // The "Show all" line is the last option while typing
  const showAll = query.length > 0 && items.length > 0;
  const optionCount = items.length + (showAll ? 1 : 0);
  const optionId = (index: number) => `${id}-option-${index}`;

  const close = () => {
    setOpen(false);
    setActive(-1);
  };

  const choose = (item: Suggestion | undefined) => {
    if (item?.href) router.push(item.href);
    item?.onSelect?.();
    close();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      if (optionCount === 0) return;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActive((current) => (current + step + optionCount) % optionCount);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      choose(active >= 0 ? items[active] : undefined);
    } else if (event.key === 'Escape') {
      if (open) {
        event.preventDefault();
        close();
      } else if (value) {
        onChange('');
      }
    }
  };

  // Suggestions are picked with the mouse without taking focus from the field, so it doesn't close the list first
  const keepFocus = (event: React.MouseEvent) => event.preventDefault();

  // Where each section's suggestions start among all of them, for the arrow keys and screen readers
  const starts = sections.map((_, i) =>
    sections.slice(0, i).reduce((sum, section) => sum + section.items.length, 0)
  );

  return (
    <div className='relative'>
      <label className='flex h-12 items-center gap-3 rounded-lg border bg-card px-4 transition-[border-color,box-shadow] focus-within:border-primary-text/60 focus-within:ring-3 focus-within:ring-primary/20'>
        <SearchIcon
          aria-hidden
          className='size-4.5 shrink-0 text-muted-foreground'
        />
        <span className='sr-only'>{label}</span>
        <input
          type='text'
          role='combobox'
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete='list'
          aria-activedescendant={
            open && active >= 0 ? optionId(active) : undefined
          }
          autoComplete='off'
          spellCheck={false}
          placeholder={placeholder}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onBlur={close}
          onKeyDown={onKeyDown}
          className='h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground'
        />
        {value && (
          <button
            type='button'
            aria-label='Clear search'
            onMouseDown={keepFocus}
            onClick={() => onChange('')}
            className='-mr-2 grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
          >
            <XIcon className='size-4' />
          </button>
        )}
      </label>

      {open && (
        <div
          id={`${id}-list`}
          role='listbox'
          aria-label='Suggestions'
          onMouseDown={keepFocus}
          className='animate-pop-in absolute inset-x-0 top-14 z-40 max-h-[min(28rem,70vh)] overflow-y-auto rounded-xl bg-popover p-2 text-popover-foreground shadow-lg ring-1 ring-foreground/10'
        >
          {sections.map((section, sectionIndex) =>
            section.items.length === 0 ? null : (
              <Fragment key={section.id}>
                <div
                  role='presentation'
                  className={cn(
                    'px-2.5 pt-1.5 pb-2 text-[11px] tracking-widest text-muted-foreground uppercase',
                    sectionIndex > 0 && 'mt-1.5 border-t pt-3'
                  )}
                >
                  {section.heading}
                </div>
                <div
                  role='group'
                  aria-label={section.heading}
                  className={cn(
                    section.layout === 'chips'
                      ? 'flex flex-wrap gap-1.5 px-2 pb-2'
                      : 'flex flex-col'
                  )}
                >
                  {section.items.map((item, itemIndex) => {
                    const i = starts[sectionIndex] + itemIndex;
                    const isActive = i === active;
                    const optionProps = {
                      id: optionId(i),
                      role: 'option',
                      'aria-selected': isActive,
                      // The arrow keys move through suggestions; Tab moves on to the rest of the page
                      tabIndex: -1,
                      onMouseEnter: () => setActive(i),
                    } as const;

                    if (section.layout === 'chips') {
                      return (
                        <button
                          key={item.id}
                          type='button'
                          {...optionProps}
                          onClick={() => choose(item)}
                          className={cn(
                            'flex h-8.5 items-center gap-2 rounded-lg border bg-background px-3 text-[13px] transition-colors [&_svg]:size-3.5 [&_svg]:text-primary-text',
                            isActive && 'border-primary-text/60 bg-card'
                          )}
                        >
                          {item.icon}
                          <span>
                            <Highlighted text={item.label} query={query} />
                          </span>
                          {item.count !== undefined && (
                            <span className='text-[11px] text-muted-foreground'>
                              {item.count}
                            </span>
                          )}
                        </button>
                      );
                    }

                    const content = (
                      <>
                        {item.icon}
                        <span className='min-w-0 flex-1'>
                          <span className='block truncate text-sm font-semibold'>
                            <Highlighted text={item.label} query={query} />
                          </span>
                          {item.meta && (
                            <span className='block truncate text-xs text-muted-foreground'>
                              {item.meta}
                            </span>
                          )}
                        </span>
                        {item.count !== undefined && (
                          <span className='text-xs text-muted-foreground'>
                            {item.count}
                          </span>
                        )}
                        {item.href && (
                          <ArrowUpRightIcon
                            aria-hidden
                            className='size-4 text-muted-foreground'
                          />
                        )}
                      </>
                    );
                    const rowClass = cn(
                      'flex min-h-12 w-full items-center gap-3 rounded-lg px-2.5 py-1.5 text-left transition-colors',
                      isActive && 'bg-accent'
                    );

                    return item.href ? (
                      <Link
                        key={item.id}
                        href={item.href}
                        {...optionProps}
                        onClick={close}
                        className={rowClass}
                      >
                        {content}
                      </Link>
                    ) : (
                      <button
                        key={item.id}
                        type='button'
                        {...optionProps}
                        onClick={() => choose(item)}
                        className={rowClass}
                      >
                        {content}
                      </button>
                    );
                  })}
                </div>
              </Fragment>
            )
          )}

          {items.length === 0 && query && (
            <p className='px-2.5 py-3 text-[13px] text-muted-foreground'>
              {emptyText}
            </p>
          )}

          {showAll && (
            <button
              type='button'
              id={optionId(items.length)}
              role='option'
              aria-selected={active === items.length}
              tabIndex={-1}
              onMouseEnter={() => setActive(items.length)}
              onClick={close}
              className={cn(
                'mt-1.5 flex min-h-10 w-full items-center justify-between rounded-lg border-t px-2.5 text-left text-[13px] text-body transition-colors',
                active === items.length && 'bg-accent'
              )}
            >
              Show all {resultsLabel}
              <kbd className='rounded-md border px-1.5 text-[11px] text-muted-foreground'>
                Enter
              </kbd>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
