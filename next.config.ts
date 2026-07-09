import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

export default withNextIntl({
  images: {
    formats: ['image/avif', 'image/webp']
  },
  experimental: {
    // Inline the (small, ~11KB) global stylesheet into the HTML instead of a
    // render-blocking <link>, removing one round-trip before first paint.
    inlineCss: true
  }
});
