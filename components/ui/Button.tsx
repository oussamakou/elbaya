import {Link} from '@/i18n/routing';
import type {ComponentProps, ReactNode} from 'react';

type Props = {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'ghost' | 'dark';
  className?: string;
} & ComponentProps<'button'>;

const styles = {
  primary: 'bg-terracotta text-cream hover:bg-[#A8501C]',
  ghost: 'border border-earth/40 text-earth hover:bg-earth hover:text-cream',
  dark: 'border border-cream/55 text-cream hover:bg-cream/20'
};

export default function Button({children, href, variant = 'primary', className = '', ...props}: Props) {
  const base = `inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-[scale,background-color,color] duration-300 active:scale-[0.96] ${styles[variant]} ${className}`;
  if (href) return <Link href={href} className={base}>{children}</Link>;
  return <button className={base} {...props}>{children}</button>;
}
