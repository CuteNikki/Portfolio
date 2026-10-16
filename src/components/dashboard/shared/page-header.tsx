// The top of every dashboard page: its title, a line on what it's for, and its main actions on the right
export function DashboardPageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  // Buttons, e.g. New post
  children?: React.ReactNode;
}) {
  return (
    <header className='flex flex-wrap items-end justify-between gap-4'>
      <div>
        <h1 className='text-[28px] leading-tight font-bold tracking-[-0.05em]'>
          {title}
        </h1>
        <p className='text-muted-foreground mt-1 text-[13px]'>{description}</p>
      </div>
      {children && <div className='flex flex-wrap gap-2'>{children}</div>}
    </header>
  );
}
