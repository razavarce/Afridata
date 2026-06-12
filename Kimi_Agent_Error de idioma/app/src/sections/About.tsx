import { useEffect, useRef } from 'react';
import { Target, Eye, Quote, Award, Users, Handshake } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content animation
      gsap.fromTo(
        contentRef.current?.children || [],
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Image animation
      gsap.fromTo(
        imageRef.current,
        { x: 50, opacity: 0, scale: 0.95 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const values = [
    {
      icon: Handshake,
      title: t('about.cooperacion'),
      description: t('about.cooperacionDesc'),
    },
    {
      icon: Users,
      title: t('about.inclusion'),
      description: t('about.inclusionDesc'),
    },
    {
      icon: Award,
      title: t('about.excelencia'),
      description: t('about.excelenciaDesc'),
    },
  ];

  return (
    <section
      id="sobre-nosotros"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-diplomatic-blue/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-wealth-gold/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full section-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div ref={contentRef} className="space-y-8">
            {/* Section header */}
            <div>
              <span className="text-wealth-gold text-sm font-semibold tracking-wider uppercase">
                {t('about.subtitle')}
              </span>
              <h2 className="heading-lg text-white mt-2">
                {t('about.title').toString().split(' ').slice(0, -1).join(' ')}{' '}
                <span className="text-gradient">{t('about.title').toString().split(' ').pop()}</span>
              </h2>
            </div>

            <p className="body-lg text-white/70">
              {t('about.description')}
            </p>

            {/* Mission & Vision */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6 card-hover">
                <div className="w-12 h-12 rounded-lg bg-wealth-gold/20 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-wealth-gold" />
                </div>
                <h3 className="text-white font-heading font-bold text-lg mb-2">
                  {t('about.mision')}
                </h3>
                <p className="text-white/60 text-sm">
                  {t('about.misionText')}
                </p>
              </div>

              <div className="glass rounded-xl p-6 card-hover">
                <div className="w-12 h-12 rounded-lg bg-growth-emerald/20 flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-growth-emerald" />
                </div>
                <h3 className="text-white font-heading font-bold text-lg mb-2">
                  {t('about.vision')}
                </h3>
                <p className="text-white/60 text-sm">
                  {t('about.visionText')}
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="space-y-4">
              <h3 className="text-white font-heading font-semibold">
                {t('about.valores')}
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {values.map((value) => (
                  <div
                    key={value.title as string}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <value.icon className="w-5 h-5 text-wealth-gold flex-shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">{value.title}</p>
                      <p className="text-white/50 text-xs">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Minister Quote */}
            <div className="glass rounded-xl p-6 border-l-4 border-wealth-gold">
              <Quote className="w-8 h-8 text-wealth-gold/50 mb-3" />
              <p className="text-white/80 font-decorative italic text-lg leading-relaxed">
                {t('about.quote')}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-wealth-gold to-wealth-gold-dark flex items-center justify-center">
                  <span className="text-diplomatic-blue-dark font-bold">VM</span>
                </div>
                <div>
                  <p className="text-white font-semibold">{t('about.viceministro')}</p>
                  <p className="text-white/50 text-sm">{t('about.gobierno')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div ref={imageRef} className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              {/* Hexagon mask effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-diplomatic-blue to-diplomatic-blue-dark opacity-20 z-10" />
              <img
                src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=2070&auto=format&fit=crop"
                alt="Reunión diplomática"
                className="w-full h-full object-cover"
              />
              
              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 right-6 glass rounded-xl p-4 z-20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-wealth-gold font-heading font-bold text-2xl">15+</p>
                    <p className="text-white/70 text-sm">{t('about.stats.cooperacion')}</p>
                  </div>
                  <div className="h-12 w-px bg-white/20" />
                  <div>
                    <p className="text-growth-emerald font-heading font-bold text-2xl">54</p>
                    <p className="text-white/70 text-sm">{t('about.stats.paises')}</p>
                  </div>
                  <div className="h-12 w-px bg-white/20" />
                  <div>
                    <p className="text-passion-red font-heading font-bold text-2xl">100%</p>
                    <p className="text-white/70 text-sm">{t('stats.compromiso')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-wealth-gold/30 rounded-lg transform rotate-12" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 border-2 border-growth-emerald/20 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
