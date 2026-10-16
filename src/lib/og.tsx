import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { cacheLife } from 'next/cache';
import { ImageResponse } from 'next/og';

import sharp from 'sharp';

import { imageUrl } from '@/lib/images';
import { IMAGE_PUBLIC_URL } from '@/lib/storage';

export const OG_SIZE = { width: 1200, height: 630 };

// The cover takes the right part of the image when there is one
const COVER_WIDTH = 540;

// Hex equivalents of the dark theme tokens in globals.css
const COLORS = {
  background: '#0b0b0f',
  foreground: '#ededf2',
  muted: '#9b9aa6',
  primaryText: '#a78bfa',
  grid: 'rgba(255,255,255,0.05)',
  coverBackground: '#121218',
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
  // The post's or project's cover, shown on the right
  coverUrl?: string | null;
}

export async function renderOgImage(props: OgImageProps) {
  const png = await renderOgPng(props);
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}

// The cover cropped to fill its part of the image, as PNG: the image renderer can't read WebP. Only pictures from our
// own image server are fetched. Any failure just leaves the cover out.
async function coverDataUrl(url: string) {
  if (!url.startsWith(`${IMAGE_PUBLIC_URL}/`)) return null;

  try {
    const response = await fetch(imageUrl(url, 'large'), {
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return null;

    const png = await sharp(Buffer.from(await response.arrayBuffer()))
      .resize(COVER_WIDTH, OG_SIZE.height, { fit: 'cover' })
      .png()
      .toBuffer();

    return `data:image/png;base64,${png.toString('base64')}`;
  } catch (error) {
    console.error('Could not load the cover for a link preview:', error);
    return null;
  }
}

// Rendering the image looks like uncached work to Next.js, which would make the route dynamic. Caching the PNG by
// its text and cover lets the image be prerendered; a new cover always has a new address.
async function renderOgPng({
  eyebrow,
  title,
  subtitle,
  coverUrl,
}: OgImageProps) {
  'use cache';
  cacheLife('max');

  const [[regular, bold], cover] = await Promise.all([
    fonts,
    coverUrl ? coverDataUrl(coverUrl) : null,
  ]);

  const image = new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: COLORS.background,
        color: COLORS.foreground,
        fontFamily: 'JetBrains Mono',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          // The same faded grid as behind the site's page headers
          backgroundImage: `linear-gradient(${COLORS.grid} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.grid} 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
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
              fontSize: cover
                ? title.length > 24
                  ? 50
                  : 64
                : title.length > 40
                  ? 60
                  : 76,
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
        </div>
      </div>

      {cover && (
        <div
          style={{
            width: COVER_WIDTH,
            height: '100%',
            display: 'flex',
            background: COLORS.coverBackground,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={cover} width={COVER_WIDTH} height={OG_SIZE.height} />
        </div>
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
