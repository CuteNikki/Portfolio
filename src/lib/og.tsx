import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { cacheLife } from 'next/cache';
import { ImageResponse } from 'next/og';

import sharp from 'sharp';

import { imageUrl } from '@/lib/images';
import { IMAGE_PUBLIC_URL } from '@/lib/storage';

export const OG_SIZE = { width: 1200, height: 630 };

const PADDING = 72;

// The cover is shown large on the right, tilted a little and running off the right and bottom edges. It keeps its
// own shape; only the part past the edges is cut off.
const COVER = { width: 780, left: 570, top: 150, tilt: -5 };
const COVER_GAP = 48;

// Hex equivalents of the dark theme tokens in globals.css
const COLORS = {
  background: '#0b0b0f',
  foreground: '#ededf2',
  muted: '#9b9aa6',
  primaryText: '#a78bfa',
  glow: 'rgba(139,92,246,0.45)',
  grid: 'rgba(255,255,255,0.07)',
  coverBorder: 'rgba(255,255,255,0.12)',
};

const fontsDir = join(process.cwd(), 'src/assets/fonts');
const fonts = Promise.all([
  readFile(join(fontsDir, 'JetBrainsMono-Regular.ttf')),
  readFile(join(fontsDir, 'JetBrainsMono-Bold.ttf')),
]);

interface OgImageProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  // Short items such as technologies, each kept on one line
  details?: string[];
  // The post's or project's cover, shown on the right
  coverUrl?: string | null;
}

export async function renderOgImage(props: OgImageProps) {
  const png = await renderOgPng(props);
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}

// The cover scaled to its width, as PNG: the image renderer can't read WebP. Only pictures from our own image server
// are fetched. Any failure just leaves the cover out.
async function loadCover(url: string) {
  if (!url.startsWith(`${IMAGE_PUBLIC_URL}/`)) return null;

  try {
    const response = await fetch(imageUrl(url, 'large'), {
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return null;

    const { data, info } = await sharp(
      Buffer.from(await response.arrayBuffer()),
    )
      .resize(COVER.width, OG_SIZE.height * 2, { fit: 'inside' })
      .png()
      .toBuffer({ resolveWithObject: true });

    return {
      src: `data:image/png;base64,${data.toString('base64')}`,
      width: info.width,
      height: info.height,
    };
  } catch (error) {
    console.error('Could not load the cover for a link preview:', error);
    return null;
  }
}

// The largest size at which the title fits in three lines of the given width. JetBrains Mono's letters are 0.6em
// wide, and wrapping at spaces wastes some of each line.
function titleSize(title: string, width: number, max: number) {
  for (let size = max; size > 36; size -= 2) {
    const perLine = Math.floor(width / (size * 0.6 - 2.5));
    if (Math.ceil((title.length * 1.15) / perLine) <= 3) return size;
  }
  return 36;
}

// Rendering the image looks like uncached work to Next.js, which would make the route dynamic. Caching the PNG by
// its text and cover lets the image be prerendered; a new cover always has a new address.
async function renderOgPng({
  eyebrow,
  title,
  subtitle,
  details,
  coverUrl,
}: OgImageProps) {
  'use cache';
  cacheLife('max');

  const [[regular, bold], cover] = await Promise.all([
    fonts,
    coverUrl ? loadCover(coverUrl) : null,
  ]);

  const textWidth = cover
    ? COVER.left - PADDING - COVER_GAP
    : OG_SIZE.width - 2 * PADDING;

  const image = new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        background: COLORS.background,
        color: COLORS.foreground,
        fontFamily: 'JetBrains Mono',
      }}
    >
      {/* A violet glow in the bottom right corner */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `radial-gradient(circle at 100% 100%, ${COLORS.glow} 0%, transparent 62%)`,
        }}
      />
      {/* The site's grid, fading out into the glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `linear-gradient(${COLORS.grid} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.grid} 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
          maskImage:
            'linear-gradient(to bottom right, black 10%, transparent 75%)',
        }}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          padding: PADDING,
        }}
      >
        <div
          style={{
            width: textWidth,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: -1.4,
            }}
          >
            niso<span style={{ color: COLORS.primaryText }}>.moe</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div
              style={{
                fontSize: 24,
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
                fontSize: titleSize(title, textWidth, cover ? 64 : 76),
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: -2.5,
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  display: 'block',
                  lineClamp: 2,
                  fontSize: 26,
                  lineHeight: 1.4,
                  color: COLORS.muted,
                }}
              >
                {subtitle}
              </div>
            )}
            {details && details.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  columnGap: 16,
                  rowGap: 4,
                  fontSize: 26,
                  lineHeight: 1.4,
                  color: COLORS.muted,
                }}
              >
                {details.map((detail, index) => (
                  <div
                    key={detail}
                    style={{ display: 'flex', whiteSpace: 'nowrap' }}
                  >
                    {index < details.length - 1 ? `${detail} ·` : detail}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {cover && (
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        <img
          src={cover.src}
          width={cover.width}
          height={cover.height}
          style={{
            position: 'absolute',
            left: COVER.left,
            top: COVER.top,
            transform: `rotate(${COVER.tilt}deg)`,
            borderRadius: 18,
            border: `1px solid ${COLORS.coverBorder}`,
            boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          }}
        />
      )}
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: 'JetBrains Mono', data: regular, weight: 400, style: 'normal' },
        { name: 'JetBrains Mono', data: bold, weight: 700, style: 'normal' },
      ],
    },
  );

  return new Uint8Array(await image.arrayBuffer());
}
