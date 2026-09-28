import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

// Hex equivalents of the dark theme tokens in globals.css
const COLORS = {
  background: '#09090b',
  foreground: '#fafafa',
  muted: '#9f9fa9',
  primary: '#9336ea',
  primaryText: '#b46fff',
};

const fontsDir = join(process.cwd(), 'src/assets/fonts');
const fonts = Promise.all([
  readFile(join(fontsDir, 'JetBrainsMono-Regular.ttf')),
  readFile(join(fontsDir, 'JetBrainsMono-Bold.ttf')),
]);

export async function renderOgImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  const [regular, bold] = await fonts;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        background: COLORS.background,
        backgroundImage: `radial-gradient(circle at 100% 0%, ${COLORS.primary}40, transparent 55%)`,
        color: COLORS.foreground,
        fontFamily: 'JetBrains Mono',
      }}
    >
      <div style={{ display: 'flex', fontSize: 36, fontWeight: 700 }}>
        niso<span style={{ color: COLORS.primaryText }}>.moe</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: COLORS.primaryText,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            display: 'block',
            lineClamp: 3,
            fontSize: title.length > 40 ? 60 : 76,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              display: 'block',
              lineClamp: 2,
              fontSize: 28,
              lineHeight: 1.4,
              color: COLORS.muted,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: 'JetBrains Mono', data: regular, weight: 400, style: 'normal' },
        { name: 'JetBrains Mono', data: bold, weight: 700, style: 'normal' },
      ],
    },
  );
}
