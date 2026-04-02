import { LucideIcon } from 'lucide-react';

import { CardDescription, CardTitle } from '@/components/ui/card';

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
      <CardTitle className='text-primary-text flex items-center gap-2'>
        <Icon className='shrink-0' />
        {title}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </div>
  );
}
