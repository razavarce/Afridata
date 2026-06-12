import { useEffect, useRef, useState } from 'react';
import { 
  Droplets, 
  Mountain, 
  Wheat, 
  Plane, 
  Factory, 
  Zap,
  ArrowRight,
  FileText,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

interface Sector {
  id: string;
  icon: React.ElementType;
  titleKey: string;
  descKey: string;
  opKeys: string[];
  statKeys: { label: string; value: string }[];
  color: string;
  image: string;
}

export default function Inversiones() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [expandedSector, setExpandedSector] = useState<string | null>(null);
  const { t } = useLanguage();

  const sectors: Sector[] = [
    {
      id: 'petroleo',
      icon: Droplets,
      titleKey: 'sector.petroleo.title',
      descKey: 'sector.petroleo.desc',
      opKeys: ['sector.petroleo.op1', 'sector.petroleo.op2', 'sector.petroleo.op3', 'sector.petroleo.op4'],
      statKeys: [
        { label: 'sector.petroleo.stat1', value: '300B+' },
        { label: 'sector.petroleo.stat2', value: '1M+ bpd' },
      ],
      color: 'from-amber-600 to-amber-800',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2068&auto=format&fit=crop',
    },
    {
      id: 'mineria',
      icon: Mountain,
      titleKey: 'sector.mineria.title',
      descKey: 'sector.mineria.desc',
      opKeys: ['sector.mineria.op1', 'sector.mineria.op2', 'sector.mineria.op3', 'sector.mineria.op4'],
      statKeys: [
        { label: 'sector.mineria.stat1', value: 'Top 10' },
        { label: 'sector.mineria.stat2', value: '30+' },
      ],
      color: 'from-slate-600 to-slate-800',
      image: 'https://images.unsplash.com/photo-1605218427306-022ba6c5546f?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 'agricultura',
      icon: Wheat,
      titleKey: 'sector.agricultura.title',
      descKey: 'sector.agricultura.desc',
      opKeys: ['sector.agricultura.op1', 'sector.agricultura.op2', 'sector.agricultura.op3', 'sector.agricultura.op4'],
      statKeys: [
        { label: 'sector.agricultura.stat1', value: '30M ha' },
        { label: 'sector.agricultura.stat2', value: '12' },
      ],
      color: 'from-growth-emerald to-growth-emerald-dark',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2232&auto=format&fit=crop',
    },
    {
      id: 'turismo',
      icon: Plane,
      titleKey: 'sector.turismo.title',
      descKey: 'sector.turismo.desc',
      opKeys: ['sector.turismo.op1', 'sector.turismo.op2', 'sector.turismo.op3', 'sector.turismo.op4'],
      statKeys: [
        { label: 'sector.turismo.stat1', value: '2,800 km' },
        { label: 'sector.turismo.stat2', value: '43' },
      ],
      color: 'from-cyan-600 to-cyan-800',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 'industria',
      icon: Factory,
      titleKey: 'sector.industria.title',
      descKey: 'sector.industria.desc',
      opKeys: ['sector.industria.op1', 'sector.industria.op2', 'sector.industria.op3', 'sector.industria.op4'],
      statKeys: [
        { label: 'sector.industria.stat1', value: '15+' },
        { label: 'sector.industria.stat2', value: '8%' },
      ],
      color: 'from-purple-600 to-purple-800',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 'energia',
      icon: Zap,
      titleKey: 'sector.energia.title',
      descKey: 'sector.energia.desc',
      opKeys: ['sector.energia.op1', 'sector.energia.op2', 'sector.energia.op3', 'sector.energia.op4'],
      statKeys: [
        { label: 'sector.energia.stat1', value: '5 kWh/m²' },
        { label: 'sector.energia.stat2', value: '200+' },
      ],
      color: 'from-green-500 to-green-700',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop',
    },
  ];

  const benefits = [
    'inversiones.ubicacion',
    'inversiones.tratados',
    'inversiones.recursos',
    'inversiones.mano',
    'inversiones.zonas',
    'inversiones.mercado',
    'inversiones.infraestructura',
    'inversiones.marco',
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current?.children || [],
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
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
      id="inversiones"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-diplomatic-blue-dark via-diplomatic-blue/30 to-diplomatic-blue-dark" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-wealth-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-growth-emerald/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full section-padding">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-wealth-gold text-sm font-semibold tracking-wider uppercase">
            {t('inversiones.subtitle')}
          </span>
          <h2 className="heading-lg text-white mt-2 mb-4">
            {t('inversiones.title').toString().split(' ').slice(0, -1).join(' ')}{' '}
            <span className="text-gradient">{t('inversiones.title').toString().split(' ').pop()}</span>
          </h2>
          <p className="body-lg text-white/70">
            {t('inversiones.description')}
          </p>
        </div>

        {/* Why invest */}
        <div className="glass rounded-2xl p-6 md:p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-wealth-gold" />
            <h3 className="text-white font-heading font-bold text-xl">
              {t('inversiones.porque')}
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-growth-emerald flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">{t(benefit)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sectors Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map((sector) => {
            const Icon = sector.icon;
            const isExpanded = expandedSector === sector.id;

            return (
              <Dialog key={sector.id}>
                <DialogTrigger asChild>
                  <div
                    className={`group relative glass rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
                      isExpanded ? 'md:col-span-2 lg:col-span-2' : ''
                    }`}
                    onMouseEnter={() => setExpandedSector(sector.id)}
                    onMouseLeave={() => setExpandedSector(null)}
                  >
                    {/* Background image */}
                    <div className="absolute inset-0">
                      <img
                        src={sector.image}
                        alt={t(sector.titleKey) as string}
                        className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${sector.color} opacity-60`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-diplomatic-blue-dark via-diplomatic-blue-dark/80 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative p-6 h-full flex flex-col">
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-white font-heading font-bold text-xl mb-2">
                        {t(sector.titleKey)}
                      </h3>

                      {/* Description */}
                      <p className="text-white/70 text-sm mb-4 flex-grow">
                        {t(sector.descKey)}
                      </p>

                      {/* Stats */}
                      <div className="flex gap-4 mb-4">
                        {sector.statKeys.map((stat) => (
                          <div key={stat.label}>
                            <p className="text-wealth-gold font-heading font-bold text-lg">
                              {stat.value}
                            </p>
                            <p className="text-white/50 text-xs">{t(stat.label)}</p>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm flex items-center gap-2">
                          {t('inversiones.guia')}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>

                    {/* Border glow */}
                    <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-wealth-gold/30 transition-colors duration-500" />
                  </div>
                </DialogTrigger>

                <DialogContent className="bg-diplomatic-blue-dark/95 backdrop-blur-xl border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sector.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-white font-heading font-bold text-2xl">
                        {t(sector.titleKey)}
                      </span>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6 mt-4">
                    {/* Image */}
                    <div className="relative h-48 rounded-xl overflow-hidden">
                      <img
                        src={sector.image}
                        alt={t(sector.titleKey) as string}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${sector.color} opacity-40`} />
                    </div>

                    {/* Description */}
                    <p className="text-white/80">{t(sector.descKey)}</p>

                    {/* Opportunities */}
                    <div>
                      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-wealth-gold" />
                        {t('inversiones.subtitle')}
                      </h4>
                      <ul className="space-y-2">
                        {sector.opKeys.map((opKey, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-white/70"
                          >
                            <CheckCircle2 className="w-5 h-5 text-growth-emerald flex-shrink-0 mt-0.5" />
                            {t(opKey)}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      {sector.statKeys.map((stat) => (
                        <div
                          key={stat.label}
                          className="glass rounded-xl p-4 text-center"
                        >
                          <p className="text-2xl font-heading font-bold text-wealth-gold">
                            {stat.value}
                          </p>
                          <p className="text-white/60 text-sm">{t(stat.label)}</p>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex gap-3">
                      <Button className="btn-primary flex-1">
                        <FileText className="w-4 h-4 mr-2" />
                        {t('inversiones.ficha')}
                      </Button>
                      <Button variant="outline" className="btn-secondary">
                        {t('inversiones.contactar')}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 glass rounded-2xl p-8 text-center">
          <h3 className="text-white font-heading font-bold text-2xl mb-3">
            {t('inversiones.proyecto')}
          </h3>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            {t('inversiones.asesoria')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="btn-primary">
              {t('inversiones.reunion')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" className="btn-secondary">
              <FileText className="w-4 h-4 mr-2" />
              {t('inversiones.guia')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
