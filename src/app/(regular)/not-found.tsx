import { SITE_METADATA } from '@/constants/metadata';

import { NotFoundContent } from '@/components/common/not-found-content';

export const { notFound: metadata } = SITE_METADATA;

export default function NotFound() {
  return <NotFoundContent />;
}
