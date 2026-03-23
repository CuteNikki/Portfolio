import { SITE_METADATA } from '@/constants/metadata';

import { HomeButton } from '@/components/common/home-button';

export const metadata = SITE_METADATA.notFound;

export default function NotFound() {
  return (
    <div className='flex flex-col items-start gap-4'>
      <div className='flex max-w-3xl flex-col gap-2'>
        <h1 className='text-3xl font-bold text-balance'>
          Page Not Found — <span className='text-primary-text'>Error 404</span>!
        </h1>
        <p>
          Sorry, the page you are looking for does not exist. It might have been
          removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>
      <p>Please check the URL for errors or return to the homepage.</p>
      <HomeButton />
    </div>
  );
}
