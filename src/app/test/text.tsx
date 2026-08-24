'use client';

import { motion, type Variants } from 'framer-motion';

type TextProps = {
  delay?: number;
  children: string;
  variant?: 'hero' | 'logo';
};

const Text = ({ delay = 0, children, variant = 'hero' }: TextProps) => {
  const words = children.split(' ');
  const isLogo = variant === 'logo';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isLogo ? 0.05 : 0.075,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { y: '110%', opacity: 0 },
    visible: {
      y: '0%',
      opacity: 1,
      transition: {
        duration: isLogo ? 0.75 : 0.95,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };

  const shadow = ' [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]';

  const animatedContent = (
    <span aria-hidden='true'>
      {words.map((word, i) => (
        <span key={i} className='inline-block whitespace-nowrap'>
          <span className='inline-block overflow-hidden align-bottom'>
            <motion.span variants={wordVariants} className='inline-block'>
              {word}
            </motion.span>
          </span>
          {i !== words.length - 1 && (
            <span className='inline-block'>&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );

  if (isLogo) {
    return (
      <div className='pointer-events-none absolute top-5 left-5 z-20 md:top-6 md:left-20'>
        <span className='sr-only'>{children}</span>
        <motion.p
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className={`text-right text-lg leading-none font-normal tracking-tight text-white sm:text-xl md:text-2xl${shadow}`}
        >
          {animatedContent}
        </motion.p>
      </div>
    );
  }

  return (
    <div className='pointer-events-none absolute inset-x-0 bottom-10 z-20 sm:bottom-20 sm:left-20'>
      <span className='sr-only'>{children}</span>
      <motion.h1
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className={`text-[clamp(2.25rem,7vw,4.75rem)] leading-[1.05] font-normal tracking-tight text-white max-sm:text-center md:text-left${shadow}`}
      >
        {animatedContent}
      </motion.h1>
    </div>
  );
};

export default Text;
