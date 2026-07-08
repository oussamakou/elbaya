import type {ReactNode} from 'react';

// Pure-CSS page fade: the server HTML paints immediately (no JS needed),
// and the animation replays on client-side navigation because templates
// remount per route. Keyframes live in globals.css (.page-fade).
export default function Template({children}: {children: ReactNode}) {
  return <div className="page-fade">{children}</div>;
}
