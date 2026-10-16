// The top of the projects and posts pages: a violet label, a large title and a short description, over the same
// faded grid as the home page
export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className='relative isolate flex flex-col gap-4 pt-6 pb-2 sm:pt-10'>
      {/* Reaches out of the page's column to the window's edges, and up behind the navbar */}
      <div
        aria-hidden
        className='grid-backdrop pointer-events-none absolute -top-16 left-1/2 -z-10 h-120 w-screen -translate-x-1/2 sm:-top-24'
      />
      <p className='animate-hero-in text-primary-text text-[13px] font-semibold tracking-[0.14em] uppercase'>
        {eyebrow}
      </p>
      <h1 className='animate-hero-in text-5xl leading-[1.04] font-bold tracking-[-0.06em] delay-1 sm:text-[64px]'>
        {title}
      </h1>
      <p className='animate-hero-in text-body max-w-xl text-pretty delay-2'>
        {description}
      </p>
    </header>
  );
}
