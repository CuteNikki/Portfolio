import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <h1 className='text-4xl font-bold'>404 — Page Not Found</h1>
      <p className='text-lg'>
        Sorry, the page you are looking for does not exist.
      </p>
      <Button asChild>
        <Link href='/'>
          <HomeIcon className='shrink-0' />
          Go to Home</Link>
      </Button>
    </>
  );
}
