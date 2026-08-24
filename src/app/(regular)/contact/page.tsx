import { SITE_METADATA } from '@/constants/metadata';

import { ContactContent } from '@/components/contact/content';

export const { contact: metadata } = SITE_METADATA;

export default function Contact() {
  return (
    <div className='flex flex-1 items-center'>
      <ContactContent />
    </div>
  );
}
