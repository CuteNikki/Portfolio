import { SITE_METADATA } from '@/constants/metadata';

import { ContactContent } from '@/components/contact/content';

export const metadata = SITE_METADATA.contact;

export default function Contact() {
  return <ContactContent />;
}
