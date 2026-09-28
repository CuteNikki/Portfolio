import { OG_SIZE, renderOgImage } from '@/lib/og';

import { PERSONAL_DETAILS } from '@/constants/personal';

export const alt = 'niso.moe - Portfolio';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    eyebrow: 'Portfolio',
    title: 'Building useful things for the web.',
    subtitle: `${PERSONAL_DETAILS.fullName} · ${PERSONAL_DETAILS.title}`,
  });
}
