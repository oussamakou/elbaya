import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-sand px-5 text-center text-earth">
      <p className="text-xs font-semibold uppercase tracking-label text-bark">404</p>
      <h1 className="mt-4 font-serif text-5xl italic md:text-6xl">This page wandered off the trail.</h1>
      <p className="mt-3 font-serif text-2xl italic text-earth/75">Cette page s&apos;est égarée.</p>
      <p className="mx-auto mt-5 max-w-md leading-7 text-earth/75">The page you&apos;re looking for isn&apos;t here — but the farm still is.</p>
      <Link href="/" className="mt-8 inline-flex rounded-full bg-terracotta px-6 py-3 text-sm font-medium text-cream transition-[background-color] hover:bg-terracotta-dark">
        Return home · Retour
      </Link>
    </main>
  );
}
