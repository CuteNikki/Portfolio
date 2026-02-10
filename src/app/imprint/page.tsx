import { SITE_METADATA } from '@/constants/metadata';

import { ImprintContent } from '@/components/legal/imprint';

export const metadata = SITE_METADATA.imprint;

export default function Imprint() {
  return <ImprintContent defaultLanguage='en' />;
}
