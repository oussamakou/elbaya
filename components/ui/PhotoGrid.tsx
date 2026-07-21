import Image from 'next/image';
import {img} from '@/content';
import Reveal from '@/components/ui/Reveal';

const ALT_TEXT: Record<string, string> = {
  'breakfast.webp': 'Farm breakfast spread at Farm El Baya',
  'room-interior.webp': 'Inside a private room at Farm El Baya',
  'trail_in_thefarm.webp': 'A walking trail through the farm',
  'startgazing_nightsky.webp': 'Stargazing under the night sky',
  'pullups_dips_bars_in_thefarm.webp': 'Calisthenics bars set among the trees',
  'handstand_practice.webp': 'Handstand practice on the farm',
  'open_air_kitchen.webp': 'The open-air farm kitchen',
  'beekeeping_activity.webp': 'Beekeeping among the olive groves',
  'baby_goat_looking_at_camera.webp': 'A baby goat on the farm'
};

export default function PhotoGrid({photos}: {photos: string[]}) {
  return (
    <section className="px-4 pb-32 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, index) => (
          <Reveal
            key={photo}
            delay={(index % 3) * 0.15}
            className="group overflow-hidden rounded-card bg-mist"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-mist">
              <Image
                src={img(photo)}
                alt={ALT_TEXT[photo] || 'Farm El Baya'}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-olive/50 via-dusk/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-multiply" />
              <div className="absolute inset-0 border border-olive/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
