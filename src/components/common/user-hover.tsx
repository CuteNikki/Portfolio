'use client';

import { useRef, useState } from 'react';

import type { PublicUser } from '@/lib/data';

export interface UserHoverProps {
  user: PublicUser;
  // For the trigger, e.g. to let a long name shrink
  className?: string;
  children: React.ReactNode;
}

type Card = React.ComponentType<UserHoverProps & { defaultOpen?: boolean }>;

// A user's name or avatar that shows a card about them on hover. The card's code loads when the pointer first gets
// there, and the card opens then if the pointer is still over the name.
export function UserHover(props: UserHoverProps) {
  // The card, and whether the pointer was still there when it arrived
  const [loaded, setLoaded] = useState<{ Card: Card; open: boolean } | null>(
    null,
  );
  const loading = useRef(false);
  const hovering = useRef(false);

  if (loaded) return <loaded.Card {...props} defaultOpen={loaded.open} />;

  const load = () => {
    hovering.current = true;
    if (loading.current) return;
    loading.current = true;
    import('@/components/common/user-hover-card').then(
      (module) => setLoaded({ Card: module.default, open: hovering.current }),
      // Tried again on the next hover
      () => {
        loading.current = false;
      },
    );
  };

  return (
    <span
      className={props.className}
      onPointerEnter={load}
      onPointerLeave={() => {
        hovering.current = false;
      }}
    >
      {props.children}
    </span>
  );
}
