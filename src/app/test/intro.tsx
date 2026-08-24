'use client';

import { stagger, useAnimate } from 'framer-motion';
import { useEffect } from 'react';

export function Intro({ images }: { images: string[] }) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const runAnimationSequence = async () => {
      await animate(
        'img',
        { clipPath: 'inset(0% 0% 0% 0%)' },
        {
          duration: 1,
          delay: stagger(0.25, { startDelay: 0.35 }),
          ease: 'easeOut',
        },
      );

      await animate(
        '#intro-container',
        {
          width: '100%',
          height: '100dvh',
          maxWidth: 'none',
          margin: 0,
        },
        {
          duration: 1,
          ease: 'easeInOut',
        },
      );

      if (scope.current) {
        const container = scope.current.querySelector(
          '#intro-container',
        ) as HTMLDivElement;
        if (container) container.style.aspectRatio = 'unset';
      }

      await animate(
        '#radial-overlay',
        { opacity: 1 },
        {
          duration: 0.85,
          ease: 'easeOut',
        },
      );
    };

    runAnimationSequence();
  }, [animate, scope]);

  return (
    <div
      ref={scope}
      className='absolute inset-0 flex items-center justify-center'
    >
      <div
        id='intro-container'
        className='relative aspect-video w-[min(88vw,28rem)] overflow-hidden md:w-[42vw]'
      >
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=''
            className='absolute inset-0 size-full object-cover'
            style={{ zIndex: i, clipPath: 'inset(0% 0% 100% 0%)' }}
          />
        ))}
        <div
          id='radial-overlay'
          className='pointer-events-none absolute inset-0 z-10 opacity-0'
          style={{
            background:
              'radial-gradient(ellipse 100% 88% at 50% 42%, transparent 22%, rgba(0,0,0,0.6) 58%, rgba(0,0,0,0.82) 100%)',
          }}
          aria-hidden
        />
      </div>
    </div>
  );
}
