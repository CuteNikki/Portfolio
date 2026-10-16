import { OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'Contact on niso.moe: Get in touch.';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    eyebrow: 'Contact',
    title: 'Get in touch.',
    subtitle: 'Questions, ideas or work together: send me a message.',
  });
}
