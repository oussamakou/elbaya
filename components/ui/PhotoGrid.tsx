import Image from 'next/image';
import {img} from '@/content';

export default function PhotoGrid({photos}: {photos: string[]}) {
  return (
    <section className="px-4 pb-24 md:px-8">
      <div className="mx-auto columns-1 gap-4 space-y-4 md:columns-2 lg:columns-3">
        {photos.map((photo, index) => (
          <div key={photo} className="group relative mb-4 break-inside-avoid overflow-hidden rounded-[8px] bg-mist">
            <Image
              src={img(photo)}
              alt=""
              width={900}
              height={index % 3 === 0 ? 1100 : 760}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-terracotta/0 transition duration-500 group-hover:bg-terracotta/10" />
          </div>
        ))}
      </div>
    </section>
  );
}
