import Link from 'next/link';

import { HomeIcon } from 'lucide-react';

import { LINKS } from '@/constants/links';

import { Button } from '@/components/ui/button';

// The main way out of a page that leads nowhere, or a quieter one beside the page's main button (`quiet`)
export function HomeButton({ quiet }: { quiet?: boolean }) {
  return (
    <Button size='lg' variant={quiet ? 'outline' : 'default'} asChild>
      <Link href={LINKS.home.url}>
        <HomeIcon className='shrink-0' />
        {quiet ? 'Home' : 'Go to Home'}
      </Link>
    </Button>
  );
}
