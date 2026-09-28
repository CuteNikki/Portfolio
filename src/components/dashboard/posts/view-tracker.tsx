'use client';

import { useEffect, useRef } from 'react';

import { addView } from '@/actions/post';

// Counts a view once the post is open in the browser. Posts are prerendered, so
// counting while rendering on the server would miss almost every visit.
export function ViewTracker({ postId }: { postId: string }) {
  const hasCounted = useRef(false);

  useEffect(() => {
    if (hasCounted.current) return;
    hasCounted.current = true;

    const formData = new FormData();
    formData.append('postId', postId);
    addView(formData).catch(() => {});
  }, [postId]);

  return null;
}
