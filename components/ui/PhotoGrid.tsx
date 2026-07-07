'use client';

import Image from 'next/image';
import {motion} from 'framer-motion';
import {img} from '@/content';

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
      <div className="mx-auto columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3 max-w-7xl">
        {photos.map((photo, index) => (
          <motion.div 
            key={photo} 
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: '-50px'}}
            transition={{duration: 0.7, delay: (index % 3) * 0.15, ease: 'easeOut'}}
            className="group relative mb-6 break-inside-avoid overflow-hidden bg-mist rounded-card"
          >
            {/* The image itself */}
            <Image
              src={img(photo)}
              alt={ALT_TEXT[photo] || 'Farm El Baya'}
              width={900}
              height={index % 3 === 0 ? 1100 : index % 2 === 0 ? 800 : 950}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
            />
            {/* Elegant overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-olive/50 via-dusk/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-multiply" />

            {/* Subtle border to frame the image */}
            <div className="absolute inset-0 border border-olive/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
