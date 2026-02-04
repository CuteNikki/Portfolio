import { HomeButton } from '@/components/common/home-button';

export default function NotFound() {
  return (
    <>
      <h1 className='text-4xl font-bold'>404 — Page Not Found</h1>
      <p className='text-lg'>
        Sorry, the page you are looking for does not exist.
      </p>
      <HomeButton />
    </>
  );
}
