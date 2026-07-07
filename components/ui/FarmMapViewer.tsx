'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {Expand, X, Download} from 'lucide-react';

type Labels = {
  expand: string;
  close: string;
  download: string;
  alt: string;
};

// The illustrated farm map: click (or tap) opens it fullscreen in a native
// <dialog>, where it can also be downloaded. Esc, the close button, or a
// click on the empty area around the map all close it.
export default function FarmMapViewer({src, labels}: {src: string; labels: Labels}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    }
    if (!open && dialog.open) dialog.close();
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="group relative mt-10 block w-full cursor-zoom-in overflow-hidden rounded-card shadow-sm"
      >
        <Image
          src={src}
          alt={labels.alt}
          width={1600}
          height={1100}
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-olive/0 transition-[background-color] duration-500 group-hover:bg-olive/10" />
        <span className="absolute bottom-4 right-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-cream/90 px-4 text-xs font-semibold uppercase tracking-label text-earth shadow-sm backdrop-blur-sm transition-[background-color,scale] duration-300 group-hover:bg-cream group-active:scale-[0.96]">
          <Expand className="h-4 w-4 text-olive" strokeWidth={1.8} />
          {labels.expand}
        </span>
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => {
          setOpen(false);
          document.body.style.overflow = '';
        }}
        aria-label={labels.alt}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-dusk p-0 text-cream backdrop:bg-dusk/80"
      >
        {open && (
          <div className="flex h-full w-full flex-col">
            <div className="flex items-center justify-end gap-3 p-4">
              <a
                href={src}
                download="farm-elbaya-map"
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-cream px-4 text-xs font-semibold uppercase tracking-label text-earth transition-[background-color] hover:bg-mist"
              >
                <Download className="h-4 w-4 text-olive" strokeWidth={1.8} />
                {labels.download}
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={labels.close}
                className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-cream/40 transition-[background-color] hover:bg-cream/15"
              >
                <X className="h-5 w-5" strokeWidth={1.8} />
              </button>
            </div>
            <div
              className="relative min-h-0 flex-1 cursor-zoom-out p-4 pt-0"
              onClick={(event) => {
                if (event.target === event.currentTarget) setOpen(false);
              }}
            >
              <Image src={src} alt={labels.alt} fill sizes="100vw" className="pointer-events-none object-contain" />
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
