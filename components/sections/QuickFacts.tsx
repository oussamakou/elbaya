type Fact = {
  label: string;
  value: string;
};

export default function QuickFacts({facts, dark = false}: {facts: Fact[]; dark?: boolean}) {
  return (
    <section className={dark ? 'bg-dusk px-5 py-5 text-cream' : 'bg-cream px-5 py-5 text-earth'}>
      <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {facts.map((fact) => (
          <div key={fact.label} className={`border px-4 py-4 ${dark ? 'border-cream/12 bg-cream/5' : 'border-mist bg-sand/55'}`}>
            <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${dark ? 'text-cream/55' : 'text-bark'}`}>{fact.label}</p>
            <p className="mt-1 text-base font-medium">{fact.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
