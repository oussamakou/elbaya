import TrackedLink from './TrackedLink';

type Review = {
  quote: string;
  name: string;
  detail: string;
  href?: string;
};

export default function ReviewCard({review}: {review: Review}) {
  const content = (
    <>
      <p className="mb-5 text-sm font-semibold tracking-[0.18em] text-terracotta">{review.detail}</p>
      <p className="font-serif text-2xl italic leading-snug text-earth">&ldquo;{review.quote}&rdquo;</p>
      <p className="mt-7 text-sm font-medium text-bark">{review.name}</p>
    </>
  );

  if (review.href) {
    return (
      <TrackedLink href={review.href} event="review_click" target="_blank" rel="noreferrer" className="min-w-[78vw] rounded-[8px] border border-mist bg-cream p-7 transition hover:border-terracotta/40 md:min-w-0">
        {content}
      </TrackedLink>
    );
  }

  return (
    <article className="min-w-[78vw] rounded-[8px] border border-mist bg-cream p-7 md:min-w-0">
      {content}
    </article>
  );
}
