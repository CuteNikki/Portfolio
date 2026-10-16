import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  partialPrefetching: true,

  images: {
    // Vercel bills every image transformation, and nothing here needs them: the only remote images are Discord
    // avatars, which Discord already sends resized as webp
    unoptimized: true,
  },

  async rewrites() {
    // Discord avatars load through this site (see proxiedAvatarUrl), so visitors' browsers never contact Discord's
    // CDN, which sets a third-party cookie. Only avatar paths are forwarded, so this isn't a proxy for the whole CDN.
    return [
      {
        source: '/discord-cdn/avatars/:path*',
        destination: 'https://cdn.discordapp.com/avatars/:path*',
      },
      {
        source: '/discord-cdn/embed/avatars/:path*',
        destination: 'https://cdn.discordapp.com/embed/avatars/:path*',
      },
    ];
  },
};

export default nextConfig;
