import { OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'Impressum auf niso.moe: Wer hinter dieser Website steht.';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    eyebrow: 'Impressum',
    title: 'Wer hinter dieser Website steht.',
    subtitle: 'Rechtliche Angaben und Kontakt.',
  });
}
