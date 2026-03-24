import { Footer } from '@/components/navigation/footer';
import { Navbar } from '@/components/navigation/navbar';

export default function RegularPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <Navbar />
      <div className='flex w-full flex-1'>
        <main className='xs:py-8 xs:px-4 container mx-auto flex flex-col items-center justify-center gap-8 p-4 px-2'>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
