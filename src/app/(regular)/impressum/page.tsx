import { SITE_METADATA } from '@/constants/metadata';

import { ImprintContent } from '@/components/legal/imprint';

export const { impressum: metadata } = SITE_METADATA;

export default function Imprint() {
  return <ImprintContent defaultLanguage='de' />;
}
