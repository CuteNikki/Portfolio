import Link from 'next/link';

import { HomeIcon } from 'lucide-react';

import { LINKS } from '@/constants/links';

import { Button } from '@/components/ui/button';

export function HomeButton() {
  return (
    <Button size='lg' asChild>
      <Link href={LINKS.home.url}>
        <HomeIcon className='shrink-0' />
        Go to Home
      </Link>
    </Button>
  );
}
