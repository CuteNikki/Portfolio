import { SITE_METADATA } from '@/constants/metadata';

import { NotFoundContent } from '@/components/common/not-found-content';
import { Footer } from '@/components/navigation/footer';
import { Navbar } from '@/components/navigation/navbar';

export const { notFound: metadata } = SITE_METADATA;

// The fallback for addresses no group catches, such as /api. Public pages have their own inside the usual layout, and
// the dashboard its own.
export default function NotFound() {
  return (
    <div className='flex min-h-svh flex-col'>
      <Navbar />
      <main className='flex flex-1 overflow-x-clip'>
        <div className='container mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6 sm:py-16 lg:px-8'>
          <NotFoundContent />
        </div>
      </main>
      <Footer />
    </div>
  );
}
