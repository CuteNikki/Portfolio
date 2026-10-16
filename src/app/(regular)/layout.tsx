import { RevealOnScroll } from '@/components/common/reveal-on-scroll';
import { Footer } from '@/components/navigation/footer';
import { Navbar } from '@/components/navigation/navbar';

export default function RegularPageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='flex min-h-svh flex-col'>
      <Navbar />
      <main className='flex flex-1 overflow-x-clip'>
        <div className='container mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6 sm:py-16 lg:px-8'>
          {children}
        </div>
      </main>
      <Footer />
      <RevealOnScroll />
    </div>
  );
}
