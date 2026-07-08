'use client';

import {useEffect, useRef, useState} from 'react';
import type {CSSProperties, ReactNode} from 'react';

// IntersectionObserver + CSS transition (see .reveal in globals.css) — same
// scroll-into-view rise as the old framer-motion version without shipping the
// motion runtime. `variant="zoom"` reproduces the scale-in used by QuoteBanner.
export default function Reveal({
  children,
  delay = 0,
  className = '',
  variant = 'rise'
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: 'rise' | 'zoom';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {rootMargin: '0px 0px -80px 0px'}
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${variant === 'zoom' ? 'reveal-zoom' : ''} ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{'--reveal-delay': `${delay}s`} as CSSProperties}
    >
      {children}
    </div>
  );
}
