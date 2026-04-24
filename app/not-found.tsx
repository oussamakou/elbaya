import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-5 text-center text-earth">
      <div>
        <h1 className="font-serif text-6xl italic">Farm El Baya</h1>
        <Link href="/en" className="mt-6 inline-flex rounded-full bg-terracotta px-6 py-3 text-sm font-medium text-cream">Return home</Link>
      </div>
    </main>
  );
}
