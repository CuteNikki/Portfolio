import Link from 'next/link';

// A titled card on the dashboard, e.g. Recently updated on the overview, with an optional link to the full list
export function Panel({
  title,
  href,
  linkLabel,
  children,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className='bg-card min-w-0 overflow-hidden rounded-xl border'>
      <div className='flex items-center justify-between gap-3 border-b px-5 py-3.5'>
        <h2 className='text-[15px] font-bold'>{title}</h2>
        {href && (
          <Link
            href={href}
            className='nav-underline text-muted-foreground hover:text-foreground text-xs transition-colors'
          >
            {linkLabel}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export function PanelEmpty({ children }: { children: React.ReactNode }) {
  return (
    <p className='text-muted-foreground px-5 py-6 text-[13px]'>{children}</p>
  );
}
