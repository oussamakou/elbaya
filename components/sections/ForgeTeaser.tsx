'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';

export default function ForgeTeaser({content}: {content: {label: string; heading: string; text: string; button: string}}) {
  const t = useTranslations('common');
  const [sent, setSent] = useState(false);

  async function submit(formData: FormData) {
    const email = String(formData.get('email') || '');
    await fetch('/api/waitlist', {method: 'POST', body: JSON.stringify({email, source: 'home-forge'}), headers: {'Content-Type': 'application/json'}});
    setSent(true);
  }

  return (
    <section className="relative overflow-hidden bg-dusk px-5 py-32 md:py-48 text-cream">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-[radial-gradient(ellipse_at_top,_rgba(196,98,45,0.15),_transparent_70%)] pointer-events-none" />
      <div className="grain absolute inset-0 mix-blend-overlay pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{once: true, margin: '-100px'}}
          variants={{
            hidden: {},
            visible: {transition: {staggerChildren: 0.15}}
          }}
          className="flex flex-col items-center text-center"
        >
          <motion.p 
            variants={{
              hidden: {opacity: 0, y: 10},
              visible: {opacity: 1, y: 0, transition: {duration: 0.6}}
            }}
            className="text-[11px] font-medium uppercase tracking-[0.3em] text-olive mb-6"
          >
            {content.label}
          </motion.p>
          
          <motion.h2 
            variants={{
              hidden: {opacity: 0, y: 20},
              visible: {opacity: 1, y: 0, transition: {duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
            }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl italic font-normal tracking-tight text-balance mb-8"
          >
            {content.heading}
          </motion.h2>
          
          <motion.p 
            variants={{
              hidden: {opacity: 0, y: 20},
              visible: {opacity: 1, y: 0, transition: {duration: 0.8, ease: 'easeOut'}}
            }}
            className="max-w-xl text-lg md:text-xl leading-relaxed text-cream/70 text-balance mb-12 font-light"
          >
            {content.text}
          </motion.p>
          
          <motion.form 
            variants={{
              hidden: {opacity: 0, scale: 0.95},
              visible: {opacity: 1, scale: 1, transition: {duration: 0.8, ease: 'easeOut', delay: 0.2}}
            }}
            action={submit} 
            className="flex w-full max-w-lg flex-col sm:flex-row gap-3 relative"
          >
            <input 
              className="w-full bg-cream/5 border border-cream/10 rounded-full px-6 py-4 text-cream placeholder:text-cream/40 focus:outline-none focus:border-terracotta/50 focus:bg-cream/10 transition-all duration-300 font-light" 
              name="email" 
              type="email" 
              required 
              placeholder={t('email')} 
            />
            <button 
              className="shrink-0 rounded-full bg-terracotta px-8 py-4 text-sm font-medium tracking-wide text-cream transition-all duration-300 hover:bg-cream hover:text-dusk active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={sent}
            >
              {sent ? t('notify') : content.button}
            </button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}
