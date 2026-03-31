import { SITE_METADATA } from '@/constants/metadata';

import { NewPostContent } from '@/components/dashboard/posts/new';

export const { dashboardNewPost: metadata } = SITE_METADATA;

export default function NewPostPage() {
  return <NewPostContent />;
}
