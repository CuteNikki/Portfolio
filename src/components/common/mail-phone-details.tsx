import Link from 'next/link';

import { AtSignIcon, PhoneIcon } from 'lucide-react';

import { PERSONAL_DETAILS } from '@/constants/personal';

export function EmailAndPhone({ language }: { language: 'en' | 'de' }) {
  const CONTENT = {
    en: {
      phone: 'Phone:',
      email: 'Email:',
    },
    de: {
      phone: 'Telefon:',
      email: 'E-Mail:',
    },
  };

  return (
    <div className='flex flex-col gap-2 text-sm'>
      <Link
        href={PERSONAL_DETAILS.emailLink}
        className='group hover:text-primary-text flex items-center gap-2 transition-colors'
      >
        <AtSignIcon className='text-primary-text size-4 shrink-0' />
        {CONTENT[language].email} <span>{PERSONAL_DETAILS.email}</span>
      </Link>
      <Link
        href={PERSONAL_DETAILS.phoneLink}
        className='group hover:text-primary-text flex items-center gap-2 transition-colors'
      >
        <PhoneIcon className='text-primary-text size-4 shrink-0' />
        {CONTENT[language].phone} <span>{PERSONAL_DETAILS.phone}</span>
      </Link>
    </div>
  );
}
