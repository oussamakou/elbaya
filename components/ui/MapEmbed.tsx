'use client';

import {useState} from 'react';
import {MapPin} from 'lucide-react';

// Facade for the Google Maps embed: shows a lightweight placeholder and only
// loads the (heavy, third-party) iframe when the guest asks for it.
export default function MapEmbed({src, title, label}: {src: string; title: string; label: string}) {
  const [show, setShow] = useState(false);

  if (show) {
    return (
      <iframe
        src={src}
        width="600"
        height="450"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="h-[360px] w-full border-0 md:h-[450px]"
        title={title}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShow(true)}
      aria-label={title}
      className="flex h-[360px] w-full flex-col items-center justify-center gap-3 bg-sand/60 transition-[background-color] hover:bg-sand md:h-[450px]"
    >
      <MapPin className="h-7 w-7 text-terracotta" strokeWidth={1.5} />
      <span className="text-sm font-semibold uppercase tracking-label text-bark">{label}</span>
    </button>
  );
}
