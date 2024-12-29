import Contact from '@/components/sections/contact';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Nikki',
  description: "Here you'll find all the ways to contact me.\nI'm looking forward to hearing from you!",
};

export default function ContactPage() {
  return (
    <main className='relative overflow-hidden'>
      <Contact />
    </main>
  );
}
