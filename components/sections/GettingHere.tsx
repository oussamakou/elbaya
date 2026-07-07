import Button from '@/components/ui/Button';
import MapEmbed from '@/components/ui/MapEmbed';

const mapSrc = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d818818.2669424629!2d8.80395109557902!3d36.710338520382045!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fcbf00137dc5b9%3A0x403d5bedd2361d8c!2sFarm%20elbaya!5e0!3m2!1sen!2stn!4v1777031837659!5m2!1sen!2stn';

export default function GettingHere({locale}: {locale: string}) {
  const fr = locale === 'fr';
  return (
    <section className="px-5 py-20">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-label text-olive">{fr ? 'Arriver à la ferme' : 'Getting here'}</p>
          <h2 className="mt-3 font-serif text-5xl italic leading-tight">{fr ? 'Près de Testour, à une heure de Tunis.' : 'Near Testour, one hour from Tunis.'}</h2>
          <p className="mt-5 max-w-xl leading-8 text-earth/75">
            {fr
              ? 'La ferme se trouve au village de Slouguia, près de Testour - prenez la sortie de Testour sur l\'autoroute de Béja. Les détails exacts sont envoyés après votre demande, et le parking est gratuit sur place.'
              : 'The farm is in Slouguia village, near Testour - take the Testour exit off the Béja highway. Exact directions are shared after your booking request, and free parking is available on site.'}
          </p>
          <Button href="/book" className="mt-8">{fr ? 'Demander les disponibilités' : 'Request availability'}</Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {(fr
            ? [['Tunis', 'Environ 1 heure en voiture'], ['Testour', 'Environ 15 minutes'], ['Parking', 'Gratuit sur place'], ['Arrivée', 'Détails envoyés après confirmation']]
            : [['Tunis', 'About 1 hour by car'], ['Testour', 'About 15 minutes away'], ['Parking', 'Free on site'], ['Arrival', 'Exact details sent after confirmation']]
          ).map(([label, value]) => (
            <div key={label} className="border border-olive/15 bg-cream p-6">
              <p className="text-xs font-semibold uppercase tracking-label text-olive">{label}</p>
              <p className="mt-2 text-lg font-medium">{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl overflow-hidden rounded-card border border-olive/15 bg-cream">
        <MapEmbed src={mapSrc} title="Farm El Baya on Google Maps" label={fr ? 'Afficher la carte' : 'Show map'} />
      </div>
    </section>
  );
}
