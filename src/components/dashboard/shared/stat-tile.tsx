import { STORAGE_QUOTA_BYTES, storageUsage } from '@/lib/uploads';
import { cn } from '@/lib/utils';

// Shared with the loading placeholders, so nothing moves when a tile streams in
export const TILE_HEIGHT = 'min-h-30';

// A number with a label and a note, as on the dashboard overview. Every tile has the same height, also while one
// streams in, and children such as a bar sit along the bottom edge without adding to it.
export function StatTile({
  label,
  value,
  note,
  children,
}: {
  label: string;
  value: string | number;
  note: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'bg-card relative flex h-full flex-col gap-1 rounded-xl border px-4 py-4 sm:px-5',
        TILE_HEIGHT,
      )}
    >
      <dt className='text-muted-foreground text-xs'>{label}</dt>
      <dd className='text-[28px] leading-tight font-bold tracking-[-0.05em] tabular-nums'>
        {value}
      </dd>
      <dd className='text-muted-foreground text-xs'>{note}</dd>
      {children}
    </div>
  );
}

const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? '' : 's'}`;

export function formatBytes(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value >= 10 || unit === 0 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`;
}

// How much space the site's pictures take, with a bar against the bucket's quota. It lists the bucket, which can take
// a moment, so put it behind a Suspense boundary. Where no storage keys are set, it says so.
export async function StorageTile() {
  const usage = await storageUsage();
  if (!usage) {
    return (
      <StatTile
        label='Image storage'
        value='—'
        note='No storage keys on this server'
      />
    );
  }

  const share = usage.bytes / STORAGE_QUOTA_BYTES;
  return (
    <StatTile
      label='Image storage'
      value={formatBytes(usage.bytes)}
      note={`${plural(usage.pictures, 'picture')} · of ${formatBytes(STORAGE_QUOTA_BYTES)}`}
    >
      <dd
        aria-hidden
        className='bg-muted absolute inset-x-4 bottom-3.5 h-1.5 overflow-hidden rounded-full sm:inset-x-5'
      >
        <span
          className='bg-primary block h-full rounded-full'
          style={{ width: `${Math.max(share * 100, 1)}%` }}
        />
      </dd>
    </StatTile>
  );
}
