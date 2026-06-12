import { useEffect, useRef, useState } from 'react';
import { Building2, Handshake, TrendingUp, Info } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

interface Country {
  id: string;
  name: string;
  nameEs: string;
  x: number;
  y: number;
  projects: number;
  embassy: boolean;
  type: 'alto' | 'medio' | 'bajo';
}

const countries: Country[] = [
  { id: 'DZ', name: 'Algeria', nameEs: 'Argelia', x: 48, y: 28, projects: 8, embassy: true, type: 'alto' },
  { id: 'AO', name: 'Angola', nameEs: 'Angola', x: 52, y: 62, projects: 12, embassy: true, type: 'alto' },
  { id: 'EG', name: 'Egypt', nameEs: 'Egipto', x: 58, y: 22, projects: 6, embassy: true, type: 'alto' },
  { id: 'ET', name: 'Ethiopia', nameEs: 'Etiopía', x: 68, y: 42, projects: 4, embassy: false, type: 'medio' },
  { id: 'GH', name: 'Ghana', nameEs: 'Ghana', x: 38, y: 48, projects: 5, embassy: false, type: 'medio' },
  { id: 'KE', name: 'Kenya', nameEs: 'Kenia', x: 72, y: 52, projects: 7, embassy: true, type: 'alto' },
  { id: 'LY', name: 'Libya', nameEs: 'Libia', x: 52, y: 24, projects: 3, embassy: false, type: 'medio' },
  { id: 'MA', name: 'Morocco', nameEs: 'Marruecos', x: 35, y: 24, projects: 6, embassy: true, type: 'alto' },
  { id: 'NG', name: 'Nigeria', nameEs: 'Nigeria', x: 48, y: 46, projects: 10, embassy: true, type: 'alto' },
  { id: 'ZA', name: 'South Africa', nameEs: 'Sudáfrica', x: 58, y: 82, projects: 9, embassy: true, type: 'alto' },
  { id: 'SD', name: 'Sudan', nameEs: 'Sudán', x: 62, y: 36, projects: 4, embassy: false, type: 'medio' },
  { id: 'TZ', name: 'Tanzania', nameEs: 'Tanzania', x: 68, y: 58, projects: 5, embassy: false, type: 'medio' },
  { id: 'TN', name: 'Tunisia', nameEs: 'Túnez', x: 45, y: 22, projects: 4, embassy: false, type: 'medio' },
  { id: 'ZW', name: 'Zimbabwe', nameEs: 'Zimbabue', x: 62, y: 72, projects: 3, embassy: false, type: 'bajo' },
  { id: 'ML', name: 'Mali', nameEs: 'Malí', x: 38, y: 38, projects: 2, embassy: false, type: 'bajo' },
  { id: 'SN', name: 'Senegal', nameEs: 'Senegal', x: 28, y: 38, projects: 3, embassy: false, type: 'bajo' },
];

export default function MapaCooperacion() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<SVGSVGElement>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const { t } = useLanguage();

  const cooperationTypes = [
    { name: t('mapa.alto'), color: 'bg-wealth-gold', count: 7 },
    { name: t('mapa.medio'), color: 'bg-growth-emerald', count: 6 },
    { name: t('mapa.inicial'), color: 'bg-diplomatic-blue-light', count: 3 },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Map animation
      gsap.fromTo(
        mapRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Country markers animation
      gsap.fromTo(
        '.country-marker',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: 'back.out(1.7)',
          delay: 0.5,
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

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'alto': return 'bg-wealth-gold';
      case 'medio': return 'bg-growth-emerald';
      default: return 'bg-diplomatic-blue-light';
    }
  };

  return (
    <section
      id="cooperacion"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-diplomatic-blue-dark via-diplomatic-blue/20 to-diplomatic-blue-dark" />

      <div className="relative z-10 w-full section-padding">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-wealth-gold text-sm font-semibold tracking-wider uppercase">
            {t('mapa.subtitle')}
          </span>
          <h2 className="heading-lg text-white mt-2 mb-4">
            {t('mapa.title').toString().split(' ')[0]}{' '}
            <span className="text-gradient">{t('mapa.title').toString().split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="body-lg text-white/70">
            {t('mapa.description')}
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {cooperationTypes.map((type) => (
            <div
              key={type.name as string}
              className="flex items-center gap-2 glass rounded-full px-4 py-2"
            >
              <div className={`w-3 h-3 rounded-full ${type.color}`} />
              <span className="text-white/80 text-sm">
                {type.name} ({type.count})
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
            <Building2 className="w-4 h-4 text-wealth-gold" />
            <span className="text-white/80 text-sm">{t('mapa.embajada')}</span>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* SVG Map */}
          <svg
            ref={mapRef}
            viewBox="0 0 100 100"
            className="w-full h-auto aspect-[4/3]"
            style={{ filter: 'drop-shadow(0 0 30px rgba(30, 58, 138, 0.5))' }}
          >
            {/* Africa continent shape (simplified) */}
            <defs>
              <linearGradient id="africaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Simplified Africa outline */}
            <path
              d="M45,5 
                 Q55,5 60,10 
                 L65,15 
                 Q70,20 75,25 
                 L80,30 
                 Q85,35 82,40 
                 L78,45 
                 Q75,50 78,55 
                 L82,60 
                 Q85,65 80,70 
                 L75,75 
                 Q70,80 65,85 
                 L60,90 
                 Q55,95 50,92 
                 L45,88 
                 Q40,85 38,80 
                 L35,75 
                 Q32,70 30,65 
                 L28,60 
                 Q25,55 22,50 
                 L20,45 
                 Q18,40 20,35 
                 L25,30 
                 Q30,25 35,20 
                 L40,15 
                 Q42,10 45,5 Z"
              fill="url(#africaGradient)"
              stroke="#d4af37"
              strokeWidth="0.3"
              strokeOpacity="0.5"
            />

            {/* Grid lines */}
            <g stroke="#ffffff" strokeWidth="0.05" strokeOpacity="0.1">
              {Array.from({ length: 11 }, (_, i) => (
                <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" />
              ))}
              {Array.from({ length: 11 }, (_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} />
              ))}
            </g>

            {/* Connection line from Venezuela */}
            <line
              x1="15"
              y1="35"
              x2={hoveredCountry ? countries.find(c => c.id === hoveredCountry)?.x : '50'}
              y2={hoveredCountry ? countries.find(c => c.id === hoveredCountry)?.y : '50'}
              stroke="#d4af37"
              strokeWidth="0.3"
              strokeDasharray="2,1"
              strokeOpacity={hoveredCountry ? 0.8 : 0.3}
              className="transition-all duration-500"
            />

            {/* Venezuela marker */}
            <g>
              <circle cx="15" cy="35" r="2" fill="#dc2626" />
              <circle cx="15" cy="35" r="3" fill="none" stroke="#dc2626" strokeWidth="0.3" opacity="0.5">
                <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="15" y="32" textAnchor="middle" fill="white" fontSize="2.5" fontWeight="bold">
                Venezuela
              </text>
            </g>

            {/* Country markers */}
            {countries.map((country) => (
              <g
                key={country.id}
                className="country-marker cursor-pointer"
                onMouseEnter={() => setHoveredCountry(country.id)}
                onMouseLeave={() => setHoveredCountry(null)}
                onClick={() => setSelectedCountry(country)}
              >
                {/* Pulse animation */}
                <circle
                  cx={country.x}
                  cy={country.y}
                  r="4"
                  fill="none"
                  stroke={getMarkerColor(country.type).replace('bg-', '#')}
                  strokeWidth="0.2"
                  opacity={hoveredCountry === country.id ? 0.8 : 0.3}
                >
                  <animate
                    attributeName="r"
                    values="3;5;3"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.5;0;0.5"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Main marker */}
                <circle
                  cx={country.x}
                  cy={country.y}
                  r={country.type === 'alto' ? 2 : country.type === 'medio' ? 1.5 : 1}
                  fill={getMarkerColor(country.type).replace('bg-', '#')}
                  filter={hoveredCountry === country.id ? 'url(#glow)' : ''}
                  className="transition-all duration-300"
                  style={{
                    transform: hoveredCountry === country.id ? 'scale(1.3)' : 'scale(1)',
                    transformOrigin: `${country.x}px ${country.y}px`,
                  }}
                />

                {/* Embassy indicator */}
                {country.embassy && (
                  <rect
                    x={country.x - 1}
                    y={country.y - 4}
                    width="2"
                    height="2"
                    fill="#d4af37"
                    rx="0.3"
                  />
                )}

                {/* Country name on hover */}
                {hoveredCountry === country.id && (
                  <text
                    x={country.x}
                    y={country.y - 6}
                    textAnchor="middle"
                    fill="white"
                    fontSize="2.5"
                    fontWeight="bold"
                    className="animate-fade-in"
                  >
                    {country.nameEs}
                  </text>
                )}
              </g>
            ))}
          </svg>

          {/* Country info card */}
          {selectedCountry && (
            <div className="absolute top-4 right-4 glass rounded-xl p-4 max-w-xs animate-scale-in">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-heading font-bold text-lg">
                  {selectedCountry.nameEs}
                </h3>
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Handshake className="w-4 h-4 text-wealth-gold" />
                  <span className="text-white/80 text-sm">
                    {selectedCountry.projects} {t('mapa.proyectos')}
                  </span>
                </div>
                
                {selectedCountry.embassy && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-growth-emerald" />
                    <span className="text-white/80 text-sm">
                      {t('mapa.embajadaEst')}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-diplomatic-blue-light" />
                  <span className="text-white/80 text-sm">
                    {t('mapa.cooperacion')}{' '}
                    {selectedCountry.type === 'alto' ? t('mapa.alto') : 
                     selectedCountry.type === 'medio' ? t('mapa.medio') : t('mapa.inicial')}
                  </span>
                </div>
              </div>

              <button className="mt-4 w-full py-2 bg-wealth-gold/20 hover:bg-wealth-gold/30 text-wealth-gold text-sm rounded-lg transition-colors">
                {t('mapa.verDetalles')}
              </button>
            </div>
          )}

          {/* Info tooltip */}
          {!selectedCountry && (
            <div className="absolute bottom-4 left-4 glass rounded-lg px-3 py-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-wealth-gold" />
              <span className="text-white/60 text-xs">
                {t('mapa.info')}
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { value: '16', label: t('mapa.stats.paises') },
            { value: '7', label: t('mapa.stats.embajadas') },
            { value: '78', label: t('mapa.stats.proyectos') },
            { value: '1.2M', label: t('mapa.stats.beneficiarios') },
          ].map((stat) => (
            <div key={stat.label as string} className="glass rounded-xl p-4 text-center">
              <p className="text-2xl md:text-3xl font-heading font-bold text-wealth-gold">
                {stat.value}
              </p>
              <p className="text-white/60 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
