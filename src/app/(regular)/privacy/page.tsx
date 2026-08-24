import { SITE_METADATA } from '@/constants/metadata';

import { PrivacyContent } from '@/components/legal/privacy';

export const { privacy: metadata } = SITE_METADATA;

export default function Privacy() {
  return <PrivacyContent defaultLanguage='en' />;
}
