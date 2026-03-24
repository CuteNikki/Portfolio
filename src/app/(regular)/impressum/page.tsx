import { SITE_METADATA } from '@/constants/metadata';

import { ImprintContent } from '@/components/legal/imprint';

export const metadata = SITE_METADATA.impressum;

export default function Imprint() {
  return <ImprintContent defaultLanguage='de' />;
}
