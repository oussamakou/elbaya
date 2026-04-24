import Button from '@/components/ui/Button';

const mapSrc = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d818818.2669424629!2d8.80395109557902!3d36.710338520382045!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fcbf00137dc5b9%3A0x403d5bedd2361d8c!2sFarm%20elbaya!5e0!3m2!1sen!2stn!4v1777031837659!5m2!1sen!2stn';

export default function GettingHere({locale}: {locale: string}) {
  const fr = locale === 'fr';
  return (
    <section className="px-5 py-20">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-bark">{fr ? 'Arriver a la ferme' : 'Getting here'}</p>
          <h2 className="mt-3 font-serif text-5xl italic leading-tight">{fr ? 'Pres de Testour, a une heure de Tunis.' : 'Near Testour, one hour from Tunis.'}</h2>
          <p className="mt-5 max-w-xl leading-8 text-earth/72">
            {fr
              ? 'La ferme est facile a rejoindre en voiture et les details exacts sont envoyes apres votre demande. Parking gratuit sur place.'
              : 'The farm is easiest to reach by car, and exact arrival details are shared after your booking request. Free parking is available on site.'}
          </p>
          <Button href="/book" className="mt-8">{fr ? 'Demander les disponibilites' : 'Request availability'}</Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {(fr
            ? [['Tunis', 'Environ 1 heure en voiture'], ['Testour', 'Environ 15 minutes'], ['Parking', 'Gratuit sur place'], ['Arrivee', 'Details envoyes apres confirmation']]
            : [['Tunis', 'About 1 hour by car'], ['Testour', 'About 15 minutes away'], ['Parking', 'Free on site'], ['Arrival', 'Exact details sent after confirmation']]
          ).map(([label, value]) => (
            <div key={label} className="border border-mist bg-cream p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bark">{label}</p>
              <p className="mt-2 text-lg font-medium">{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl overflow-hidden rounded-[8px] border border-mist bg-cream">
        <iframe
          src={mapSrc}
          width="600"
          height="450"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[360px] w-full border-0 md:h-[450px]"
          title="Farm El Baya on Google Maps"
        />
      </div>
    </section>
  );
}
