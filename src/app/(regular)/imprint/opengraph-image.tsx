import { OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'Imprint on niso.moe: Who is behind this site.';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    eyebrow: 'Imprint',
    title: 'Who is behind this site.',
    subtitle: 'Legal information and contact details.',
  });
}
