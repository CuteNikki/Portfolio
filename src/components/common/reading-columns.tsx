import { cn } from '@/lib/utils';

// The text of a post or a legal page, in a column down the middle of the page, with something like an "On this page"
// list beside it on wide screens; narrower ones just read on. The column beside the centered text is narrow, so the
// list is a little wider than it and reaches into the page's margin. The side columns may be narrower than what's in
// them (minmax(0, …)): a plain 1fr would grow to fit the list and push the text off-centre.
export function ReadingColumns({
  aside,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & { aside?: React.ReactNode }) {
  return (
    <div
      {...props}
      className={cn(
        'mx-auto grid w-full max-w-3xl gap-10 xl:max-w-none xl:grid-cols-[minmax(0,1fr)_minmax(0,48rem)_minmax(0,1fr)]',
        className,
      )}
    >
      <div className='min-w-0 xl:col-start-2'>{children}</div>
      {aside && <div className='hidden xl:col-start-3 xl:block'>{aside}</div>}
    </div>
  );
}
