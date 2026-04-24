'use client';

import {motion} from 'framer-motion';

export default function QuoteBanner({quote}: {quote: string}) {
  return (
    <section className="relative overflow-hidden bg-earth px-5 py-32 md:py-48 text-center text-sand">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(196,98,45,0.15),_transparent_60%)]" />
      <div className="grain absolute inset-0 z-0" />
      
      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div
          initial={{opacity: 0, scale: 0.9}}
          whileInView={{opacity: 1, scale: 1}}
          viewport={{once: true, margin: '-100px'}}
          transition={{duration: 1, ease: [0.16, 1, 0.3, 1]}}
        >
          {/* Massive decorative quotation marks */}
          <span className="absolute -top-16 left-1/2 -translate-x-1/2 font-serif text-[180px] leading-none text-terracotta/20 select-none md:-top-24 md:text-[240px]">
            “
          </span>
          
          <p className="relative font-serif text-3xl italic leading-[1.3] md:text-5xl lg:text-6xl text-balance">
            {quote}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
