import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { useLanguage } from '@/context/LanguageContext';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const { t } = useLanguage();

  const images = [
    'https://images.unsplash.com/photo-1589519160732-57fc498494f8?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop',
  ];

  // Canvas animation for ripple effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const drawRipple = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.max(canvas.width, canvas.height) * 0.8;

      for (let i = 0; i < 5; i++) {
        const radius = ((time * 50 + i * 100) % maxRadius);
        const alpha = 1 - (radius / maxRadius);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212, 175, 55, ${alpha * 0.3})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      time += 0.02;
      animationId = requestAnimationFrame(drawRipple);
    };

    drawRipple();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.3 }
      );

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.6 }
      );

      // CTA animation
      gsap.fromTo(
        ctaRef.current,
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 0.9 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [images.length]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="inicio"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Images */}
      <div className="absolute inset-0">
        {images.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={img}
              alt={`Hero background ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-diplomatic-blue-dark/80 via-diplomatic-blue-dark/50 to-diplomatic-blue-dark" />
        <div className="absolute inset-0 bg-gradient-to-r from-diplomatic-blue-dark/70 via-transparent to-diplomatic-blue-dark/70" />
      </div>

      {/* Canvas for ripple effect */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: 'overlay' }}
      />

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 border border-wealth-gold/20 rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-48 h-48 border border-wealth-gold/10 rounded-full animate-pulse animation-delay-500" />
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-wealth-gold rounded-full animate-float" />
      <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-wealth-gold/50 rounded-full animate-float animation-delay-300" />

      {/* Content */}
      <div className="relative z-10 w-full section-padding pt-24">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-growth-emerald rounded-full animate-pulse" />
            <span className="text-white/80 text-sm font-medium">
              {t('hero.badge')}
            </span>
          </div>

          {/* Title */}
          <h1
            ref={titleRef}
            className="heading-xl text-white mb-6 overflow-hidden"
          >
            <span className="block">{t('hero.title1')}</span>
            <span className="block text-gradient mt-2">{t('hero.title2')}</span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="body-lg text-white/80 max-w-2xl mx-auto mb-10"
          >
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => scrollToSection('#ejes-accion')}
              className="btn-primary group flex items-center gap-2 text-base"
            >
              {t('hero.cta1')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => scrollToSection('#sobre-nosotros')}
              variant="outline"
              className="btn-secondary group flex items-center gap-2 text-base"
            >
              <Play className="w-5 h-5" />
              {t('hero.cta2')}
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '20+', label: t('stats.paises') },
              { value: '50+', label: t('stats.proyectos') },
              { value: '15', label: t('stats.anos') },
              { value: '100%', label: t('stats.compromiso') },
            ].map((stat, index) => (
              <div
                key={stat.label as string}
                className="glass rounded-xl p-4 animate-slide-up"
                style={{ animationDelay: `${1.2 + index * 0.1}s` }}
              >
                <p className="text-3xl md:text-4xl font-heading font-bold text-wealth-gold">
                  {stat.value}
                </p>
                <p className="text-white/70 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/50 text-xs">{t('hero.scroll')}</span>
        <ChevronDown className="w-5 h-5 text-wealth-gold" />
      </div>
    </section>
  );
}
