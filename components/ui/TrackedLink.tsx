'use client';

import type {ReactNode} from 'react';
import {track} from '@vercel/analytics';

export default function TrackedLink({
  href,
  event,
  children,
  className = '',
  target,
  rel
}: {
  href: string;
  event: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={className}
      onClick={() => track(event, {href})}
    >
      {children}
    </a>
  );
}
