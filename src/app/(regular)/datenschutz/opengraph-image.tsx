import { OG_SIZE, renderOgImage } from '@/lib/og';

export const alt =
  'Datenschutz auf niso.moe: Wie diese Website mit Ihren Daten umgeht.';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    eyebrow: 'Datenschutz',
    title: 'Wie diese Website mit Ihren Daten umgeht.',
    subtitle: 'Was gespeichert wird, wozu und wie lange.',
  });
}
