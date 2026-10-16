// A rough description of a browser from its user agent, for the account page's device list, e.g. "Firefox on Linux".
// It only needs to tell someone's own devices apart, so it knows the common browsers and systems and nothing more.

export type DeviceKind = 'phone' | 'tablet' | 'computer';

export function describeDevice(userAgent: string | null): {
  name: string;
  kind: DeviceKind;
} {
  if (!userAgent) return { name: 'Unknown device', kind: 'computer' };
  const ua = userAgent;

  // Order matters: Edge and Opera also say Chrome, and Chrome also says Safari
  const browser = /Edg\//.test(ua)
    ? 'Edge'
    : /OPR\/|Opera/.test(ua)
      ? 'Opera'
      : /Firefox\//.test(ua)
        ? 'Firefox'
        : /Chrome\/|CriOS\//.test(ua)
          ? 'Chrome'
          : /Safari\//.test(ua)
            ? 'Safari'
            : 'A browser';

  const system = /iPhone|iPad|iPod/.test(ua)
    ? /iPad/.test(ua)
      ? 'iPadOS'
      : 'iOS'
    : /Android/.test(ua)
      ? 'Android'
      : /Windows/.test(ua)
        ? 'Windows'
        : /Mac OS X|Macintosh/.test(ua)
          ? 'macOS'
          : /CrOS/.test(ua)
            ? 'ChromeOS'
            : /Linux/.test(ua)
              ? 'Linux'
              : null;

  const kind: DeviceKind = /iPad|Tablet/.test(ua)
    ? 'tablet'
    : /Mobi|iPhone|Android/.test(ua)
      ? 'phone'
      : 'computer';

  return { name: system ? `${browser} on ${system}` : browser, kind };
}
