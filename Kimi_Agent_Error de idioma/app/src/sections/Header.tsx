import { useState, useEffect } from 'react';
import { Menu, X, Search, Globe, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/context/LanguageContext';
import type { Language } from '@/context/LanguageContext';

const languages = [
  { code: 'ES' as Language, name: 'Español', flag: '🇻🇪' },
  { code: 'EN' as Language, name: 'English', flag: '🇬🇧' },
  { code: 'FR' as Language, name: 'Français', flag: '🇫🇷' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { currentLang, setLanguage, t } = useLanguage();

  const navLinks = [
    { name: t('nav.inicio') as string, href: '#inicio' },
    { name: t('nav.sobre') as string, href: '#sobre-nosotros' },
    { name: t('nav.ejes') as string, href: '#ejes-accion' },
    { name: t('nav.cooperacion') as string, href: '#cooperacion' },
    { name: t('nav.noticias') as string, href: '#noticias' },
    { name: t('nav.inversiones') as string, href: '#inversiones' },
    { name: t('nav.contacto') as string, href: '#contacto' },
  ];

  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-diplomatic-blue-dark/90 backdrop-blur-xl shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="w-full section-padding">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#inicio');
            }}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-wealth-gold to-wealth-gold-dark rounded-lg transform rotate-45 group-hover:rotate-90 transition-transform duration-500" />
              <span className="relative text-diplomatic-blue-dark font-heading font-bold text-xl">
                VA
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-heading font-bold text-sm leading-tight">
                Viceministerio
              </p>
              <p className="text-wealth-gold text-xs leading-tight">
                de África
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="nav-link text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Utilities */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className={`relative transition-all duration-300 ${isSearchOpen ? 'w-48' : 'w-10'}`}>
              {isSearchOpen ? (
                <div className="flex items-center gap-2 glass rounded-full px-3 py-2">
                  <Search className="w-4 h-4 text-white/60" />
                  <input
                    type="text"
                    placeholder={t('search.placeholder') as string}
                    className="bg-transparent text-white text-sm outline-none w-full placeholder:text-white/40"
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="w-10 h-10 flex items-center justify-center rounded-full glass hover:bg-white/10 transition-colors"
                  aria-label={t('search.buscar') as string}
                >
                  <Search className="w-4 h-4 text-white" />
                </button>
              )}
            </div>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 glass rounded-full px-3 py-2 hover:bg-white/10 transition-colors">
                  <Globe className="w-4 h-4 text-wealth-gold" />
                  <span className="text-white text-sm font-medium hidden sm:inline">
                    {currentLanguage.code}
                  </span>
                  <ChevronDown className="w-3 h-3 text-white/60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-diplomatic-blue-dark/95 backdrop-blur-xl border-white/10"
              >
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`text-white hover:bg-white/10 cursor-pointer ${
                      currentLang === lang.code ? 'bg-white/10' : ''
                    }`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full glass hover:bg-white/10 transition-colors"
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            isMobileMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'
          }`}
        >
          <nav className="glass rounded-2xl p-4 space-y-2">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="block text-white py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
