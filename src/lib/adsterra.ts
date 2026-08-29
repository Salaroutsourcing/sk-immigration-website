/**
 * Adsterra inventory for SK Immigration content pages only
 * (blog articles, country guides, news). Kept lean to avoid clutter.
 *
 * Kept: Social Bar, Native, 300x250, 728x90, 320x50
 * Skipped: 468x60 (obsolete), 160x600 / 160x300 (crowd the consult sidebar)
 */
export const ADSTERRA = {
  enabled: true,
  /** Path prefixes where Adsterra may load */
  allowPaths: ['/blog', '/blog.html', '/guides/', '/news/'] as const,
  socialBar: {
    id: 'SocialBar_1',
    src: 'https://pl31086248.profitableratecpmnetwork.com/3f/73/43/3f73439fbb844ab44c84fadd6864bb9b.js',
  },
  native: {
    id: 'NativeBanner_1',
    key: '848fbe3f200288b029c7ffe3543cc1e3',
    src: 'https://pl31086298.profitableratecpmnetwork.com/848fbe3f200288b029c7ffe3543cc1e3/invoke.js',
    containerId: 'container-848fbe3f200288b029c7ffe3543cc1e3',
  },
  banners: {
    '300x250': {
      id: '300x250_1',
      key: '62c64f4856d8516fc7a07be41075bdde',
      width: 300,
      height: 250,
      invoke: 'https://www.highrevenueformat.com/62c64f4856d8516fc7a07be41075bdde/invoke.js',
    },
    '728x90': {
      id: '728x90_1',
      key: '0258ccdf7bd202ade60d0337cdf548f6',
      width: 728,
      height: 90,
      invoke: 'https://www.highrevenueformat.com/0258ccdf7bd202ade60d0337cdf548f6/invoke.js',
    },
    '320x50': {
      id: '320x50_1',
      key: 'f8391902dbc87b54ed1cc4841abcaf94',
      width: 320,
      height: 50,
      invoke: 'https://www.highrevenueformat.com/f8391902dbc87b54ed1cc4841abcaf94/invoke.js',
    },
  },
} as const;

export type AdsterraBannerSize = keyof typeof ADSTERRA.banners;

export function isAdsterraPath(pathname: string): boolean {
  const path = pathname.split('?')[0] || '/';
  if (path === '/blog' || path === '/blog/' || path === '/blog.html') return true;
  if (path.startsWith('/blog/')) return true;
  if (path.startsWith('/guides/')) return true;
  if (path.startsWith('/news/')) return true;
  return false;
}
