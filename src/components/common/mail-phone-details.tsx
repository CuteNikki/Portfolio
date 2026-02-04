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
      phone: 'Telef.:',
      email: 'E-Mail:',
    },
  };

  return (
    <div className='flex flex-col gap-2 text-sm sm:text-base'>
      <Link
        href={PERSONAL_DETAILS.emailLink}
        className='group flex items-center gap-2'
      >
        <AtSignIcon className='text-primary-text size-4 shrink-0' />
        {CONTENT[language].email}{' '}
        <span className='group-hover:underline'>{PERSONAL_DETAILS.email}</span>
      </Link>
      <Link
        href={PERSONAL_DETAILS.phoneLink}
        className='group flex items-center gap-2'
      >
        <PhoneIcon className='text-primary-text size-4 shrink-0' />
        {CONTENT[language].phone}{' '}
        <span className='group-hover:underline'>{PERSONAL_DETAILS.phone}</span>
      </Link>
    </div>
  );
}
