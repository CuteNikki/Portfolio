import { ThemeSwitcher } from '@/components/theme/switcher';
import Link from 'next/link';

export function Footer() {
  const FOOTER_LINKS = [
    { href: '/imprint', label: 'Imprint' },
    { href: '/privacy', label: 'Privacy' },
  ];

  return (
    <footer className='bg-background/95 w-full border-t'>
      <div className='container mx-auto flex items-center justify-between gap-4 p-4 tracking-tight'>
        <p className='text-muted-foreground text-sm'>
          &copy; {new Date().getFullYear()} niso.moe
        </p>
        <div className='text-muted-foreground text-sm'>
          <ul className='flex flex-wrap gap-4'>
            {FOOTER_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className='hover:text-primary-text transition-colors'
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <ThemeSwitcher />
      </div>
    </footer>
  );
}
