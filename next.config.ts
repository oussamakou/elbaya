import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

export default withNextIntl({
  async headers() {
    return [
      {
        source: '/:locale/admin/:path*',
        headers: [
          {key: 'X-Frame-Options', value: 'DENY'},
          {key: 'Referrer-Policy', value: 'same-origin'},
          {key: 'X-Content-Type-Options', value: 'nosniff'},
          {key: 'Cache-Control', value: 'private, no-store'},
        ],
      },
      {
        source: '/api/shop/admin/:path*',
        headers: [
          {key: 'X-Frame-Options', value: 'DENY'},
          {key: 'Referrer-Policy', value: 'same-origin'},
        ],
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    // Inline the (small, ~11KB) global stylesheet into the HTML instead of a
    // render-blocking <link>, removing one round-trip before first paint.
    inlineCss: true,
  },
});
