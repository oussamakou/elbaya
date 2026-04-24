'use client';

import {useRef} from 'react';
import Image from 'next/image';
import {motion, useScroll, useTransform} from 'framer-motion';
import Button from '@/components/ui/Button';

export default function HeroSection({headline, subhead, cta, image}: {headline: string; subhead: string; cta?: string; image: string}) {
  const containerRef = useRef<HTMLElement>(null);
  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Split headline into lines or words for staggered reveal
  const lines = headline.split('\n');

  return (
    <section ref={containerRef} className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dusk px-5 text-center text-cream">
      {/* Parallax Background */}
      <motion.div style={{y, opacity}} className="absolute inset-0 z-0">
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-80" />
      </motion.div>
      
      {/* Gradients & Texture */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-dusk/40 via-transparent to-dusk" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-dusk/20 to-dusk/80" />
      <div className="grain absolute inset-0 z-0 mix-blend-overlay" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl pt-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {transition: {staggerChildren: 0.15, delayChildren: 0.2}}
          }}
          className="flex flex-col items-center"
        >
          <h1 className="font-serif text-[clamp(3rem,9vw,6rem)] font-normal italic leading-[0.95] tracking-tight text-balance">
            {lines.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-2">
                <motion.span
                  className="block"
                  variants={{
                    hidden: {y: '100%', rotate: 2},
                    visible: {y: '0%', rotate: 0, transition: {duration: 1.2, ease: [0.16, 1, 0.3, 1]}}
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          
          <motion.p
            variants={{
              hidden: {opacity: 0, y: 20},
              visible: {opacity: 1, y: 0, transition: {duration: 1, ease: 'easeOut', delay: 0.6}}
            }}
            className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-cream/80 md:text-xl text-balance"
          >
            {subhead}
          </motion.p>
          
          {cta && (
            <motion.div
              variants={{
                hidden: {opacity: 0, scale: 0.95},
                visible: {opacity: 1, scale: 1, transition: {duration: 0.8, ease: 'easeOut', delay: 0.9}}
              }}
              className="mt-12"
            >
              <Button href="/book">{cta}</Button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Custom Scroll Indicator */}
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 1.5, duration: 1}}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 z-10"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-cream/50">Scroll</span>
        <div className="h-14 w-[1px] overflow-hidden bg-cream/20">
          <motion.div
            animate={{y: ['-100%', '100%']}}
            transition={{repeat: Infinity, duration: 1.5, ease: 'linear'}}
            className="h-full w-full bg-cream"
          />
        </div>
      </motion.div>
    </section>
  );
}
