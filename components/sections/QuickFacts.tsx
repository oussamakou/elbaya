type Fact = {
  label: string;
  value: string;
};

// Tailwind needs the full class name present in source to generate it, so
// the column count can't be interpolated — map the counts actually in use
// (5 on Home/Stay/Book, 4 on the guide pages) instead.
const lgCols: Record<number, string> = {4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5'};

export default function QuickFacts({facts, dark = false}: {facts: Fact[]; dark?: boolean}) {
  return (
    <section className={dark ? 'bg-dusk px-5 py-5 text-cream' : 'bg-cream px-5 py-5 text-earth'}>
      <div className={`mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 ${lgCols[facts.length] ?? 'lg:grid-cols-5'}`}>
        {facts.map((fact) => (
          <div key={fact.label} className={`border px-4 py-4 ${dark ? 'border-cream/12 bg-cream/5' : 'border-olive/15 bg-sand/55'}`}>
            <p className={`text-[11px] font-semibold uppercase tracking-label ${dark ? 'text-cream/70' : 'text-olive'}`}>{fact.label}</p>
            <p className="mt-1 text-base font-medium">{fact.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
