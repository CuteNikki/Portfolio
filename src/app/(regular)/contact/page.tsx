import { SITE_METADATA } from '@/constants/metadata';

import { ContactContent } from '@/components/contact/content';

export const { contact: metadata } = SITE_METADATA;

export default function Contact() {
  return (
    <div className='flex min-h-[calc(100vh-13rem)] items-center'>
      <ContactContent />
    </div>
  );
}
