export default function ReviewCard({review}: {review: {quote: string; name: string; detail: string}}) {
  return (
    <article className="min-w-[78vw] rounded-[8px] border border-mist bg-cream p-7 md:min-w-0">
      <p className="font-serif text-2xl italic leading-snug text-earth">“{review.quote}”</p>
      <p className="mt-7 text-sm font-medium text-bark">{review.name} · {review.detail}</p>
    </article>
  );
}
