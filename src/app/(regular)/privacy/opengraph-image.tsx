import { OG_SIZE, renderOgImage } from '@/lib/og';

export const alt =
  'Privacy Policy on niso.moe: How this site handles your data.';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    eyebrow: 'Privacy Policy',
    title: 'How this site handles your data.',
    subtitle: 'What is stored, why, and for how long.',
  });
}
