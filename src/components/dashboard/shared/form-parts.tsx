'use client';

import dynamic from 'next/dynamic';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// The preview's Markdown renderer and syntax highlighter are most of the editor's code, so they load the first time
// someone opens the Preview tab
const MarkdownViewer = dynamic(
  () =>
    import('@/components/dashboard/posts/markdown').then(
      (module) => module.MarkdownViewer,
    ),
  {
    loading: () => <p className='text-muted-foreground'>Loading preview…</p>,
  },
);

// The post and project forms: the writing on the left, publishing and the rest in a column on the right that stays
// in view while scrolling. On narrower screens the column follows below.
export function FormColumns({
  main,
  side,
}: {
  main: React.ReactNode;
  side: React.ReactNode;
}) {
  return (
    <div className='grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start'>
      <div className='flex min-w-0 flex-col gap-4'>{main}</div>
      <div className='flex min-w-0 flex-col gap-4 xl:sticky xl:top-20'>
        {side}
      </div>
    </div>
  );
}

// A card holding a group of fields
export function FormCard({
  title,
  description,
  className,
  children,
}: {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        'bg-card flex min-w-0 flex-col gap-5 rounded-xl border p-4 sm:p-5',
        className,
      )}
    >
      {title && (
        <header>
          <h2 className='text-[15px] font-bold'>{title}</h2>
          {description && (
            <p className='text-muted-foreground mt-0.5 text-xs'>
              {description}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}

// A field's label above its input, with an optional hint below
export function Field({
  label,
  htmlFor,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={htmlFor} className='text-sm font-medium'>
        {label}
      </label>
      {children}
      {hint && <p className='text-muted-foreground text-xs'>{hint}</p>}
    </div>
  );
}

// The Markdown of a post or project, with a preview of how it reads on the site
export function MarkdownField({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <FormCard>
      {/* The value goes to the form from here, since the textarea is gone while the preview shows */}
      <input type='hidden' name={id} value={value} />
      <Tabs defaultValue='write' className='flex flex-col gap-3'>
        <div className='flex items-center justify-between gap-3'>
          <label htmlFor={id} className='text-sm font-medium'>
            {label}
          </label>
          <TabsList className='grid w-44 grid-cols-2'>
            <TabsTrigger value='write'>Write</TabsTrigger>
            <TabsTrigger value='preview'>Preview</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value='write'>
          <Textarea
            id={id}
            placeholder={placeholder}
            className='min-h-112 resize-y'
            value={value}
            onChange={(event) => onChange(event.target.value)}
            required
          />
        </TabsContent>

        <TabsContent value='preview'>
          <div className='prose catppuccin-macchiato:prose-invert dark:prose-invert border-input min-h-112 w-full max-w-none rounded-lg border px-4 py-3 text-sm wrap-break-word'>
            {value ? (
              <MarkdownViewer content={value} />
            ) : (
              <p className='text-muted-foreground'>Nothing to preview yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </FormCard>
  );
}
