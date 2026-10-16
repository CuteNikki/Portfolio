import { OG_SIZE, renderOgImage } from '@/lib/og';

import { PERSONAL_DETAILS } from '@/constants/personal';

// Only the initial of the last name, since link previews travel further than the site
const NAME = `${PERSONAL_DETAILS.firstName} ${PERSONAL_DETAILS.middleName} ${PERSONAL_DETAILS.lastName[0]}.`;

export const alt = `niso.moe, the portfolio of ${NAME}: Building useful things for the web.`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    eyebrow: 'Portfolio',
    title: 'Building useful things for the web.',
    subtitle: `${NAME} · Full-stack developer`,
  });
}
