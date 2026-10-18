'use client';

import type {ReactNode} from 'react';
import {usePathname} from '@/i18n/routing';

// The owner dashboard is a work tool: it gets its own bar instead of the
// guest navigation and footer. Resolved during the server render, so nothing flashes.
export default function HideOnAdmin({children}: {children: ReactNode}) {
  const pathname = usePathname();
  return pathname === '/admin' || pathname.startsWith('/admin/') ? null : children;
}
