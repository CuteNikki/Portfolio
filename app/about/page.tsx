import { About } from '@/components/sections/about';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Nikki',
  description: "Everything you need to know about me.\nI'm excited to share my story with you!",
};

export default function AboutPage() {
  return (
    <main className='relative overflow-hidden'>
      <About />
    </main>
  );
}
