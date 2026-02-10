import { SITE_METADATA } from '@/constants/metadata';

import { PrivacyContent } from '@/components/legal/privacy';

export const metadata = SITE_METADATA.privacy;

export default function Privacy() {
  return <PrivacyContent defaultLanguage='en' />;
}
