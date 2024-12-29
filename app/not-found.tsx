import { Metadata } from 'next';

import NotFound from '@/components/sections/not-found';

export const metadata: Metadata = {
  title: 'Nikki not found',
  description: "Oops! It seems you've stumbled upon a page that doesn't exist.\nDon't worry, you can always go back to the home page.",
};

export default function NotFoundPage() {
  return (
    <main className='relative overflow-hidden'>
      <NotFound />
    </main>
  );
}
