import { useEffect, useRef, useState } from 'react';
import { 
  TrendingUp, 
  Palette, 
  Zap, 
  Heart, 
  GraduationCap,
  ArrowRight
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

interface Eje {
  id: string;
  icon: React.ElementType;
  titleKey: string;
  shortKey: string;
  fullKey: string;
  statsKey: string;
  color: string;
}

export default function EjesAccion() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeEje, setActiveEje] = useState<string | null>(null);
  const { t } = useLanguage();

  const ejes: Eje[] = [
    {
      id: 'comercio',
      icon: TrendingUp,
      titleKey: 'eje.comercio.title',
      shortKey: 'eje.comercio.short',
      fullKey: 'eje.comercio.full',
      statsKey: 'eje.comercio.stats',
      color: 'from-wealth-gold to-wealth-gold-dark',
    },
    {
      id: 'cultura',
      icon: Palette,
      titleKey: 'eje.cultura.title',
      shortKey: 'eje.cultura.short',
      fullKey: 'eje.cultura.full',
      statsKey: 'eje.cultura.stats',
      color: 'from-passion-red to-passion-red-dark',
    },
    {
      id: 'energia',
      icon: Zap,
      titleKey: 'eje.energia.title',
      shortKey: 'eje.energia.short',
      fullKey: 'eje.energia.full',
      statsKey: 'eje.energia.stats',
      color: 'from-growth-emerald to-growth-emerald-dark',
    },
    {
      id: 'salud',
      icon: Heart,
      titleKey: 'eje.salud.title',
      shortKey: 'eje.salud.short',
      fullKey: 'eje.salud.full',
      statsKey: 'eje.salud.stats',
      color: 'from-diplomatic-blue-light to-diplomatic-blue',
    },
    {
      id: 'educacion',
      icon: GraduationCap,
      titleKey: 'eje.educacion.title',
      shortKey: 'eje.educacion.short',
      fullKey: 'eje.educacion.full',
      statsKey: 'eje.educacion.stats',
      color: 'from-purple-500 to-purple-700',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cards animation
      gsap.fromTo(
        cardsRef.current?.children || [],
        { y: 80, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="ejes-accion"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-diplomatic-blue-dark via-diplomatic-blue/30 to-diplomatic-blue-dark" />
      
      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-wealth-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-growth-emerald/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full section-padding">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-wealth-gold text-sm font-semibold tracking-wider uppercase">
            {t('ejes.subtitle')}
          </span>
          <h2 className="heading-lg text-white mt-2 mb-4">
            {t('ejes.title').toString().split(' ')[0]}{' '}
            <span className="text-gradient">{t('ejes.title').toString().split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="body-lg text-white/70">
            {t('ejes.description')}
          </p>
        </div>

        {/* Cards Grid */}
        <div
          ref={cardsRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {ejes.map((eje) => {
            const Icon = eje.icon;
            const isActive = activeEje === eje.id;

            return (
              <div
                key={eje.id}
                className={`relative group cursor-pointer transition-all duration-500 ${
                  isActive ? 'lg:col-span-2 xl:col-span-2' : ''
                }`}
                onMouseEnter={() => setActiveEje(eje.id)}
                onMouseLeave={() => setActiveEje(null)}
              >
                <div
                  className={`relative h-full glass rounded-2xl p-6 overflow-hidden transition-all duration-500 ${
                    isActive ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  {/* Background gradient on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${eje.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />

                  {/* Icon */}
                  <div
                    className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${eje.color} flex items-center justify-center mb-4 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-white font-heading font-bold text-xl mb-2">
                    {t(eje.titleKey)}
                  </h3>
                  
                  <p className="text-white/60 text-sm mb-4">
                    {isActive ? t(eje.fullKey) : t(eje.shortKey)}
                  </p>

                  {/* Stats badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-wealth-gold text-xs font-semibold">
                      {t(eje.statsKey)}
                    </span>
                    <ArrowRight
                      className={`w-5 h-5 text-white/40 transition-all duration-300 ${
                        isActive ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
                      }`}
                    />
                  </div>

                  {/* Animated border */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-wealth-gold to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-white/60 mb-4">
            {t('ejes.cta')}
          </p>
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 text-wealth-gold hover:text-wealth-gold-light transition-colors"
          >
            {t('ejes.contacto')}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
