import { useEffect, useRef, useState } from 'react';
import { Calendar, Clock, ArrowRight, Tag, Filter } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Venezuela y Angola fortalecen acuerdos de cooperación energética',
    excerpt: 'Ambas naciones suscribieron nuevos convenios para el intercambio de tecnología y conocimientos en el sector petrolero y gasífero.',
    category: 'Energía',
    date: '2024-02-20',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2068&auto=format&fit=crop',
    featured: true,
  },
  {
    id: '2',
    title: 'Encuentro cultural Venezuela-África reunió a más de 10,000 personas',
    excerpt: 'El festival celebró la herencia africana en Venezuela con música, danza, gastronomía y arte tradicional.',
    category: 'Cultura',
    date: '2024-02-15',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Nueva embajada de Venezuela en Nairobi comienza operaciones',
    excerpt: 'La apertura de la sede diplomática fortalece los lazos con la región de África Oriental.',
    category: 'Política',
    date: '2024-02-10',
    readTime: '3 min',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2232&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Acuerdo educativo beneficiará a 500 estudiantes africanos',
    excerpt: 'El programa de becas permitirá a jóvenes de diversos países africanos estudiar en universidades venezolanas.',
    category: 'Educación',
    date: '2024-02-05',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '5',
    title: 'Exportaciones venezolanas a África crecen un 35%',
    excerpt: 'Los productos agrícolas y manufacturados venezolanos ganan espacio en los mercados africanos.',
    category: 'Economía',
    date: '2024-01-28',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '6',
    title: 'Misión médica venezolana atiende a comunidades rurales de Ghana',
    excerpt: 'El equipo de salud realizó más de 2,000 atenciones médicas gratuitas en zonas de difícil acceso.',
    category: 'Salud',
    date: '2024-01-22',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=2070&auto=format&fit=crop',
  },
];

export default function SalaPrensa() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [filteredNews, setFilteredNews] = useState(newsItems);
  const { t, currentLang } = useLanguage();

  const categories = [
    { key: 'noticias.todas', value: 'Todas' },
    { key: 'noticias.politica', value: 'Política' },
    { key: 'noticias.economia', value: 'Economía' },
    { key: 'noticias.cultura', value: 'Cultura' },
    { key: 'noticias.energia', value: 'Energía' },
    { key: 'noticias.educacion', value: 'Educación' },
    { key: 'noticias.salud', value: 'Salud' },
  ];

  useEffect(() => {
    if (selectedCategory === 'Todas') {
      setFilteredNews(newsItems);
    } else {
      setFilteredNews(newsItems.filter((item) => item.category === selectedCategory));
    }
  }, [selectedCategory]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current?.children || [],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
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
  }, [filteredNews]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = currentLang === 'ES' ? 'es-ES' : currentLang === 'EN' ? 'en-US' : 'fr-FR';
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <section
      id="noticias"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-diplomatic-blue-dark via-diplomatic-blue/10 to-diplomatic-blue-dark" />

      <div className="relative z-10 w-full section-padding">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="text-wealth-gold text-sm font-semibold tracking-wider uppercase">
              {t('noticias.subtitle')}
            </span>
            <h2 className="heading-lg text-white mt-2">
              {t('noticias.title').toString().split(' ')[0]}{' '}
              <span className="text-gradient">{t('noticias.title').toString().split(' ').slice(1).join(' ')}</span>
            </h2>
          </div>

          {/* Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="glass border-white/20 text-white hover:bg-white/10 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {t(`noticias.${selectedCategory.toLowerCase()}` as string) || selectedCategory}
                <span className="ml-2 px-2 py-0.5 bg-wealth-gold/20 text-wealth-gold text-xs rounded-full">
                  {filteredNews.length}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-diplomatic-blue-dark/95 backdrop-blur-xl border-white/10">
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`text-white hover:bg-white/10 cursor-pointer ${
                    selectedCategory === cat.value ? 'bg-white/10' : ''
                  }`}
                >
                  {t(cat.key)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* News Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item, index) => (
            <article
              key={item.id}
              className={`group relative glass rounded-2xl overflow-hidden card-hover ${
                item.featured ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className={`relative overflow-hidden ${item.featured ? 'h-64' : 'h-48'}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-diplomatic-blue-dark via-diplomatic-blue-dark/50 to-transparent" />
                
                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-wealth-gold/90 text-diplomatic-blue-dark text-xs font-semibold rounded-full">
                    {item.category}
                  </span>
                </div>

                {/* Featured badge */}
                {item.featured && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-passion-red/90 text-white text-xs font-semibold rounded-full">
                      Destacado
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta */}
                <div className="flex items-center gap-4 text-white/50 text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(item.date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {item.readTime}
                  </div>
                </div>

                {/* Title */}
                <h3 className={`text-white font-heading font-bold mb-2 group-hover:text-wealth-gold transition-colors ${
                  item.featured ? 'text-xl md:text-2xl' : 'text-lg'
                }`}>
                  {item.title}
                </h3>

                {/* Excerpt */}
                <p className="text-white/60 text-sm line-clamp-2 mb-4">
                  {item.excerpt}
                </p>

                {/* Read more */}
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-wealth-gold text-sm font-medium hover:gap-3 transition-all"
                >
                  {t('noticias.leerMas')}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-wealth-gold/5 via-transparent to-wealth-gold/5" />
              </div>
            </article>
          ))}
        </div>

        {/* Load more */}
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            className="btn-secondary"
          >
            {t('noticias.verTodas')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Tags cloud */}
        <div className="mt-16">
          <h3 className="text-white/60 text-sm mb-4 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            {t('noticias.temas')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Cooperación Sur-Sur', 'Petróleo', 'Cultura Africana', 'Becas', 'Diplomacia', 'Comercio', 'Salud', 'Energías Renovables'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 glass rounded-full text-white/70 text-sm hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
