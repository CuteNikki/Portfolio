'use client';

import { useId, useState } from 'react';

import { cn } from '@/lib/utils';

// All five colours in one swatch, for Auto before there's a cover to match
export const ALL_TONES =
  'conic-gradient(var(--chart-1), var(--chart-2), var(--chart-3), var(--chart-4), var(--chart-5), var(--chart-1))';

// The five chart colours a project can have, by number (see projectTone), named after how they look
const TONES = [
  { value: '1', name: 'Violet' },
  { value: '2', name: 'Blue' },
  { value: '3', name: 'Teal' },
  { value: '4', name: 'Amber' },
  { value: '5', name: 'Rose' },
];

const isCustom = (tone: string | null): tone is string =>
  !!tone && tone.startsWith('#');

// The look of one choice; the selected one gets the light violet chip look
const choice = (selected: boolean) =>
  cn(
    'has-focus-visible:ring-ring/50 flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors has-focus-visible:ring-3',
    selected
      ? 'border-primary-text/40 bg-primary-soft text-foreground'
      : 'text-muted-foreground hover:border-line-strong',
  );

// A project's colour, which tints its cards and thumbnails: Auto, the chart colour closest to its cover's main colour,
// one of the five chart colours, or any colour picked by hand. The choice goes to the form as `tone`: empty for Auto,
// "1" to "5" for a chart colour, or "#rrggbb".
export function ToneField({
  defaultValue,
  autoTone,
}: {
  defaultValue: string | null;
  // The colour Auto gives this project now, a CSS colour
  autoTone: string;
}) {
  const [tone, setTone] = useState<string | null>(defaultValue);
  // Kept while another choice is selected, so going back to Custom restores it
  const [custom, setCustom] = useState(
    isCustom(defaultValue) ? defaultValue : '#a78bfa',
  );
  const labelId = useId();
  const group = `${labelId}-tone`;

  const options = [
    { value: null, name: 'Auto', colour: autoTone },
    ...TONES.map(({ value, name }) => ({
      value,
      name,
      colour: `var(--chart-${value})`,
    })),
  ];

  return (
    <div className='flex flex-col gap-2'>
      <span id={labelId} className='text-sm font-medium'>
        Colour
      </span>
      <input type='hidden' name='tone' value={tone ?? ''} />
      <div
        role='radiogroup'
        aria-labelledby={labelId}
        className='flex flex-wrap gap-2'
      >
        {options.map(({ value, name, colour }) => (
          <label key={name} className={choice(tone === value)}>
            <input
              type='radio'
              name={group}
              checked={tone === value}
              onChange={() => setTone(value)}
              className='sr-only'
            />
            <span
              aria-hidden
              className='size-4 rounded-full'
              style={{ background: colour }}
            />
            {name}
          </label>
        ))}

        {/* Any colour: choosing it selects Custom, and the swatch opens the browser's colour picker */}
        <label className={choice(isCustom(tone))}>
          <input
            type='radio'
            name={group}
            checked={isCustom(tone)}
            onChange={() => setTone(custom)}
            className='sr-only'
          />
          <span className='relative size-4 overflow-hidden rounded-full'>
            <input
              type='color'
              aria-label='Custom colour'
              value={custom}
              onChange={(event) => {
                setCustom(event.target.value);
                setTone(event.target.value);
              }}
              className='absolute -inset-2 size-8 cursor-pointer border-0 p-0'
            />
          </span>
          Custom
        </label>
      </div>
      <span className='text-muted-foreground text-xs'>
        Tints the project’s cards and thumbnails. Auto matches the cover’s main
        colour.
      </span>
    </div>
  );
}
