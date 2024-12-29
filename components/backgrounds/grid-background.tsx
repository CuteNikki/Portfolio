export function Grid({ type }: { type: 'default' | 'small' | 'dot' }) {
  switch (type) {
    case 'small':
      return <div className='absolute inset-0 -z-20 h-full w-full bg-grid-small-black/[0.3] dark:bg-grid-small-white/[0.3]' />;
    case 'dot':
      return <div className='absolute inset-0 -z-20 h-full w-full bg-dot-black/[0.3] dark:bg-dot-white/[0.3]' />;
    default:
      return <div className='absolute inset-0 -z-20 h-full w-full bg-grid-black/[0.1] dark:bg-grid-white/[0.1]' />;
  }
}
