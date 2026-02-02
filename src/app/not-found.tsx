import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className='flex flex-1 items-center justify-center'>
      <main className='container mx-auto flex flex-col items-start gap-8 p-8 py-16 md:py-32'>
        <h1 className='text-4xl font-bold'>404 — Page Not Found</h1>
        <p className='text-lg'>
          Sorry, the page you are looking for does not exist.
        </p>
        <Button asChild>
          <Link href='/'>Go back to Home</Link>
        </Button>
      </main>
    </div>
  );
}
