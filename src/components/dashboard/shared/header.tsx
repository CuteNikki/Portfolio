import { LucideIcon } from 'lucide-react';

export function DashboardHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className='flex flex-col gap-2'>
      <h1 className='text-primary-text flex items-center gap-2 text-xl font-semibold'>
        <Icon className='shrink-0' />
        {title}
      </h1>
      <p className='text-muted-foreground'>{description}</p>
    </div>
  );
}
