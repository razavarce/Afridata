import { 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';

const relatedInstitutions = [
  { name: 'MPPRE', url: 'https://mppre.gob.ve' },
  { name: 'Presidencia', url: 'https://presidencia.gob.ve' },
  { name: 'ANC', url: '#' },
  { name: 'PDVSA', url: '#' },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  const { t } = useLanguage();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickLinks = [
    { name: t('nav.inicio'), href: '#inicio' },
    { name: t('nav.sobre'), href: '#sobre-nosotros' },
    { name: t('nav.ejes'), href: '#ejes-accion' },
    { name: t('nav.cooperacion'), href: '#cooperacion' },
    { name: t('nav.noticias'), href: '#noticias' },
    { name: t('nav.inversiones'), href: '#inversiones' },
  ];

  return (
    <footer id="contacto" className="relative bg-diplomatic-blue-dark pt-20 pb-8 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-wealth-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-diplomatic-blue/20 rounded-full blur-3xl" />
      </div>

      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-wealth-gold to-transparent" />

      <div className="relative z-10 w-full section-padding">
        {/* Main footer content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-wealth-gold to-wealth-gold-dark rounded-lg transform rotate-45" />
                <span className="relative text-diplomatic-blue-dark font-heading font-bold text-xl">
                  VA
                </span>
              </div>
              <div>
                <p className="text-white font-heading font-bold text-sm leading-tight">
                  Viceministerio
                </p>
                <p className="text-wealth-gold text-xs leading-tight">
                  de África
                </p>
              </div>
            </div>

            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              {t('footer.descripcion')}
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-wealth-gold/20 hover:text-wealth-gold transition-colors"
                >
                  <social.icon className="w-5 h-5 text-white/70" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-heading font-bold text-lg mb-6">
              {t('footer.enlaces')}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-white/60 hover:text-wealth-gold transition-colors text-sm flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-wealth-gold/50" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-white font-heading font-bold text-lg mb-6">
              {t('footer.contacto')}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-wealth-gold flex-shrink-0 mt-0.5" />
                <span className="text-white/60 text-sm">
                  {t('footer.direccion1')}<br />
                  {t('footer.direccion2')}<br />
                  {t('footer.direccion3')}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-wealth-gold flex-shrink-0" />
                <span className="text-white/60 text-sm">
                  +58 212 555-0000
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-wealth-gold flex-shrink-0" />
                <span className="text-white/60 text-sm">
                  info@africa.ve
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-heading font-bold text-lg mb-6">
              {t('footer.boletin')}
            </h3>
            <p className="text-white/60 text-sm mb-4">
              {t('footer.boletinDesc')}
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="email@example.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pr-12"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-wealth-gold hover:bg-wealth-gold-light text-diplomatic-blue-dark"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-white/40 text-xs">
                {t('footer.suscribir')}
              </p>
            </form>
          </div>
        </div>

        {/* Related institutions */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <p className="text-white/40 text-sm mb-4 text-center">
            {t('footer.instituciones')}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {relatedInstitutions.map((inst) => (
              <a
                key={inst.name}
                href={inst.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-wealth-gold transition-colors text-sm flex items-center gap-1"
              >
                {inst.name}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm text-center md:text-left">
            © {new Date().getFullYear()} {t('footer.copyright')}
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/40 hover:text-white/60 text-sm transition-colors">
              {t('footer.privacidad')}
            </a>
            <a href="#" className="text-white/40 hover:text-white/60 text-sm transition-colors">
              {t('footer.terminos')}
            </a>
            <a href="#" className="text-white/40 hover:text-white/60 text-sm transition-colors">
              {t('footer.accesibilidad')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
