import { NOT_FOUND_METADATA } from '@/constants/metadata';

import { NotFoundContent } from '@/components/pages/not-found';

export const metadata = NOT_FOUND_METADATA;

export default function NotFoundPage() {
  return <NotFoundContent />;
}
