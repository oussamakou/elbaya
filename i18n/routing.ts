import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'always',
  // hreflang is declared explicitly in each page's metadata (see
  // pageMetadata in content/index.ts); the middleware's Link header would
  // duplicate it with an x-default that points at redirecting URLs.
  alternateLinks: false
});

export const {Link, redirect, usePathname, useRouter, getPathname} = createNavigation(routing);
