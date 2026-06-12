import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Language = 'ES' | 'EN' | 'FR';

interface LanguageContextType {
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string | string[];
}

const translations = {
  ES: {
    // Navigation
    'nav.inicio': 'Inicio',
    'nav.sobre': 'Sobre Nosotros',
    'nav.ejes': 'Ejes de Acción',
    'nav.cooperacion': 'Cooperación',
    'nav.noticias': 'Noticias',
    'nav.inversiones': 'Inversiones',
    'nav.contacto': 'Contacto',
    
    // Hero
    'hero.badge': 'República Bolivariana de Venezuela',
    'hero.title1': 'Fortaleciendo Lazos,',
    'hero.title2': 'Construyendo Futuro',
    'hero.subtitle': 'Venezuela y África: Una visión compartida de prosperidad y cooperación sur-sur. Juntos construimos un mundo multipolar más justo.',
    'hero.cta1': 'Conoce nuestras iniciativas',
    'hero.cta2': 'Ver video institucional',
    'hero.scroll': 'Desplaza para explorar',
    
    // Stats
    'stats.paises': 'Países Aliados',
    'stats.proyectos': 'Proyectos Activos',
    'stats.anos': 'Años de Cooperación',
    'stats.compromiso': 'Compromiso',
    
    // About
    'about.subtitle': 'Sobre Nosotros',
    'about.title': 'Un Puente Entre Continentes',
    'about.description': 'El Viceministerio de África para Venezuela es la entidad encargada de fortalecer las relaciones bilaterales entre Venezuela y el continente africano, promoviendo el multilateralismo, la solidaridad sur-sur y el desarrollo compartido.',
    'about.mision': 'Misión',
    'about.misionText': 'Fortalecer los lazos de cooperación entre Venezuela y África mediante políticas públicas inclusivas y participativas.',
    'about.vision': 'Visión',
    'about.visionText': 'Ser el referente diplomático en la consolidación de una alianza estratégica Venezuela-África para el desarrollo mutuo.',
    'about.valores': 'Nuestros Valores',
    'about.cooperacion': 'Cooperación',
    'about.cooperacionDesc': 'Trabajo conjunto basado en el respeto mutuo',
    'about.inclusion': 'Inclusión',
    'about.inclusionDesc': 'Participación activa de todos los sectores',
    'about.excelencia': 'Excelencia',
    'about.excelenciaDesc': 'Compromiso con los más altos estándares',
    'about.quote': 'La cooperación entre Venezuela y África no es solo una alianza política, es un compromiso histórico con la liberación de nuestros pueblos y la construcción de un mundo más justo.',
    'about.viceministro': 'Viceministro de África',
    'about.gobierno': 'Gobierno Bolivariano de Venezuela',
    'about.stats.cooperacion': 'Años de cooperación',
    'about.stats.paises': 'Países africanos',
    
    // Ejes de Acción
    'ejes.subtitle': 'Nuestro Trabajo',
    'ejes.title': 'Ejes de Acción',
    'ejes.description': 'Cinco pilares fundamentales que guían nuestra labor diplomática y de cooperación internacional con el continente africano.',
    'ejes.cta': '¿Quieres conocer más sobre nuestros programas?',
    'ejes.contacto': 'Contáctanos',
    
    // Ejes individuales
    'eje.comercio.title': 'Comercio',
    'eje.comercio.short': 'Intercambio comercial bilateral',
    'eje.comercio.full': 'Facilitamos el intercambio comercial entre Venezuela y África, promoviendo la exportación de productos venezolanos y la importación de bienes africanos. Creamos alianzas estratégicas entre empresas de ambos continentes.',
    'eje.comercio.stats': '+200% Intercambio',
    
    'eje.cultura.title': 'Cultura',
    'eje.cultura.short': 'Intercambio cultural y artístico',
    'eje.cultura.full': 'Promovemos el intercambio cultural, artístico y académico entre nuestros pueblos. Organizamos festivales, exposiciones, residencias artísticas y programas de intercambio estudiantil.',
    'eje.cultura.stats': '50+ Eventos/año',
    
    'eje.energia.title': 'Energía',
    'eje.energia.short': 'Cooperación energética',
    'eje.energia.full': 'Colaboramos en el desarrollo de proyectos energéticos, incluyendo petróleo, gas, energías renovables y tecnología de punta para el aprovechamiento sostenible de recursos naturales.',
    'eje.energia.stats': '15 Proyectos',
    
    'eje.salud.title': 'Salud',
    'eje.salud.short': 'Cooperación sanitaria',
    'eje.salud.full': 'Desarrollamos programas de cooperación sanitaria, incluyendo envío de medicamentos, capacitación de personal médico, intercambio de conocimientos y atención especializada.',
    'eje.salud.stats': '100k+ Beneficiarios',
    
    'eje.educacion.title': 'Educación',
    'eje.educacion.short': 'Formación académica',
    'eje.educacion.full': 'Ofrecemos becas educativas, programas de intercambio estudiantil, capacitación profesional y colaboración entre universidades venezolanas y africanas.',
    'eje.educacion.stats': '5k+ Becas',
    
    // Mapa
    'mapa.subtitle': 'Cooperación Sur-Sur',
    'mapa.title': 'Mapa de Cooperación',
    'mapa.description': 'Explora los países africanos donde Venezuela mantiene relaciones diplomáticas y proyectos de cooperación activos.',
    'mapa.alto': 'Alto',
    'mapa.medio': 'Medio',
    'mapa.inicial': 'Inicial',
    'mapa.embajada': 'Embajada',
    'mapa.info': 'Haz clic en un país para ver más información',
    'mapa.proyectos': 'proyectos activos',
    'mapa.embajadaEst': 'Embajada establecida',
    'mapa.cooperacion': 'Cooperación',
    'mapa.verDetalles': 'Ver detalles',
    'mapa.stats.paises': 'Países con cooperación',
    'mapa.stats.embajadas': 'Embajadas activas',
    'mapa.stats.proyectos': 'Proyectos en marcha',
    'mapa.stats.beneficiarios': 'Beneficiarios',
    
    // Noticias
    'noticias.subtitle': 'Actualidad',
    'noticias.title': 'Sala de Prensa',
    'noticias.description': 'Las últimas noticias sobre nuestra cooperación bilateral, eventos y actividades del Viceministerio.',
    'noticias.todas': 'Todas',
    'noticias.politica': 'Política',
    'noticias.economia': 'Economía',
    'noticias.cultura': 'Cultura',
    'noticias.energia': 'Energía',
    'noticias.educacion': 'Educación',
    'noticias.salud': 'Salud',
    'noticias.leerMas': 'Leer más',
    'noticias.verTodas': 'Ver todas las noticias',
    'noticias.temas': 'Temas populares',
    
    // Inversiones
    'inversiones.subtitle': 'Oportunidades',
    'inversiones.title': 'Invierte en Venezuela',
    'inversiones.description': 'Descubre los sectores estratégicos donde Venezuela ofrece oportunidades únicas de inversión para empresarios africanos.',
    'inversiones.porque': '¿Por qué invertir?',
    'inversiones.ubicacion': 'Ubicación estratégica en América',
    'inversiones.tratados': 'Tratados de cooperación Sur-Sur',
    'inversiones.recursos': 'Recursos naturales abundantes',
    'inversiones.mano': 'Mano de obra calificada',
    'inversiones.zonas': 'Zonas francas y beneficios fiscales',
    'inversiones.mercado': 'Mercado regional de 500M+ personas',
    'inversiones.infraestructura': 'Infraestructura portuaria desarrollada',
    'inversiones.marco': 'Marco legal de protección a inversores',
    'inversiones.proyecto': '¿Tienes un proyecto de inversión?',
    'inversiones.asesoria': 'Nuestro equipo de atención al inversionista está listo para asesorarte y facilitar tu entrada al mercado venezolano.',
    'inversiones.reunion': 'Agendar reunión',
    'inversiones.guia': 'Guía del inversionista',
    'inversiones.ficha': 'Descargar ficha técnica',
    'inversiones.contactar': 'Contactar',
    
    // Sectores
    'sector.petroleo.title': 'Petróleo y Gas',
    'sector.petroleo.desc': 'Venezuela posee las reservas de petróleo más grandes del mundo. Oportunidades en exploración, producción, refinación y petroquímica.',
    'sector.petroleo.op1': 'Joint ventures en campos petroleros',
    'sector.petroleo.op2': 'Tecnología de recuperación mejorada',
    'sector.petroleo.op3': 'Proyectos de refinación',
    'sector.petroleo.op4': 'Desarrollo petroquímico',
    'sector.petroleo.stat1': 'Reservas probadas',
    'sector.petroleo.stat2': 'Producción diaria',
    
    'sector.mineria.title': 'Minería',
    'sector.mineria.desc': 'Riqueza mineral diversa incluyendo oro, diamantes, bauxita, hierro y coltán. Oportunidades en explotación sostenible.',
    'sector.mineria.op1': 'Explotación de oro y diamantes',
    'sector.mineria.op2': 'Minería de hierro y bauxita',
    'sector.mineria.op3': 'Procesamiento de minerales',
    'sector.mineria.op4': 'Tecnología minera sostenible',
    'sector.mineria.stat1': 'Reservas de oro',
    'sector.mineria.stat2': 'Diversidad mineral',
    
    'sector.agricultura.title': 'Agricultura',
    'sector.agricultura.desc': 'Tierras fértiles y clima tropical ideal para cultivos diversos. Oportunidades en agroindustria y tecnología agrícola.',
    'sector.agricultura.op1': 'Cultivos tropicales de exportación',
    'sector.agricultura.op2': 'Agroindustria y procesamiento',
    'sector.agricultura.op3': 'Tecnología agrícola',
    'sector.agricultura.op4': 'Proyectos de riego',
    'sector.agricultura.stat1': 'Tierra cultivable',
    'sector.agricultura.stat2': 'Zonas agrícolas',
    
    'sector.turismo.title': 'Turismo',
    'sector.turismo.desc': 'Destinos únicos que van desde el Caribe hasta la Amazonía. Oportunidades en ecoturismo y turismo de aventura.',
    'sector.turismo.op1': 'Desarrollo de resorts',
    'sector.turismo.op2': 'Ecoturismo sostenible',
    'sector.turismo.op3': 'Turismo de aventura',
    'sector.turismo.op4': 'Cruceros y náutica',
    'sector.turismo.stat1': 'Costas',
    'sector.turismo.stat2': 'Parques nacionales',
    
    'sector.industria.title': 'Industria',
    'sector.industria.desc': 'Sector industrial en crecimiento con oportunidades en manufactura, textiles y producción de bienes.',
    'sector.industria.op1': 'Zonas industriales',
    'sector.industria.op2': 'Manufactura ligera',
    'sector.industria.op3': 'Industria textil',
    'sector.industria.op4': 'Ensamblaje automotriz',
    'sector.industria.stat1': 'Zonas francas',
    'sector.industria.stat2': 'Crecimiento anual',
    
    'sector.energia.title': 'Energías Renovables',
    'sector.energia.desc': 'Potencial excepcional para energía solar, eólica e hidroeléctrica. Proyectos de energía limpia en desarrollo.',
    'sector.energia.op1': 'Parques solares',
    'sector.energia.op2': 'Energía eólica',
    'sector.energia.op3': 'Hidroelectricidad',
    'sector.energia.op4': 'Biocombustibles',
    'sector.energia.stat1': 'Potencial solar',
    'sector.energia.stat2': 'Ríos principales',
    
    // Footer
    'footer.descripcion': 'Fortaleciendo los lazos de hermandad y cooperación entre Venezuela y el continente africano para construir un futuro de prosperidad compartida.',
    'footer.enlaces': 'Enlaces Rápidos',
    'footer.contacto': 'Contacto',
    'footer.direccion1': 'Torre MPPRE, Piso 12',
    'footer.direccion2': 'Avenida Urdaneta, Caracas',
    'footer.direccion3': 'Venezuela',
    'footer.boletin': 'Boletín Informativo',
    'footer.boletinDesc': 'Suscríbete para recibir las últimas noticias sobre nuestra cooperación con África.',
    'footer.suscribir': 'Al suscribirte, aceptas nuestra política de privacidad.',
    'footer.instituciones': 'Instituciones relacionadas',
    'footer.copyright': 'Viceministerio de África para Venezuela. Todos los derechos reservados.',
    'footer.privacidad': 'Política de privacidad',
    'footer.terminos': 'Términos de uso',
    'footer.accesibilidad': 'Accesibilidad',
    
    // Search
    'search.placeholder': 'Buscar...',
    'search.buscar': 'Buscar',
  },
  EN: {
    // Navigation
    'nav.inicio': 'Home',
    'nav.sobre': 'About Us',
    'nav.ejes': 'Areas of Action',
    'nav.cooperacion': 'Cooperation',
    'nav.noticias': 'News',
    'nav.inversiones': 'Investment',
    'nav.contacto': 'Contact',
    
    // Hero
    'hero.badge': 'Bolivarian Republic of Venezuela',
    'hero.title1': 'Strengthening Ties,',
    'hero.title2': 'Building the Future',
    'hero.subtitle': 'Venezuela and Africa: A shared vision of prosperity and South-South cooperation. Together we build a fairer multipolar world.',
    'hero.cta1': 'Discover our initiatives',
    'hero.cta2': 'Watch institutional video',
    'hero.scroll': 'Scroll to explore',
    
    // Stats
    'stats.paises': 'Allied Countries',
    'stats.proyectos': 'Active Projects',
    'stats.anos': 'Years of Cooperation',
    'stats.compromiso': 'Commitment',
    
    // About
    'about.subtitle': 'About Us',
    'about.title': 'A Bridge Between Continents',
    'about.description': 'The Vice Ministry of Africa for Venezuela is the entity responsible for strengthening bilateral relations between Venezuela and the African continent, promoting multilateralism, South-South solidarity and shared development.',
    'about.mision': 'Mission',
    'about.misionText': 'Strengthen cooperation ties between Venezuela and Africa through inclusive and participatory public policies.',
    'about.vision': 'Vision',
    'about.visionText': 'To be the diplomatic benchmark in consolidating a strategic Venezuela-Africa alliance for mutual development.',
    'about.valores': 'Our Values',
    'about.cooperacion': 'Cooperation',
    'about.cooperacionDesc': 'Joint work based on mutual respect',
    'about.inclusion': 'Inclusion',
    'about.inclusionDesc': 'Active participation of all sectors',
    'about.excelencia': 'Excellence',
    'about.excelenciaDesc': 'Commitment to the highest standards',
    'about.quote': 'The cooperation between Venezuela and Africa is not just a political alliance, it is a historical commitment to the liberation of our peoples and the construction of a fairer world.',
    'about.viceministro': 'Vice Minister of Africa',
    'about.gobierno': 'Bolivarian Government of Venezuela',
    'about.stats.cooperacion': 'Years of cooperation',
    'about.stats.paises': 'African countries',
    
    // Ejes de Acción
    'ejes.subtitle': 'Our Work',
    'ejes.title': 'Areas of Action',
    'ejes.description': 'Five fundamental pillars that guide our diplomatic work and international cooperation with the African continent.',
    'ejes.cta': 'Want to know more about our programs?',
    'ejes.contacto': 'Contact us',
    
    // Ejes individuales
    'eje.comercio.title': 'Trade',
    'eje.comercio.short': 'Bilateral trade exchange',
    'eje.comercio.full': 'We facilitate trade exchange between Venezuela and Africa, promoting the export of Venezuelan products and the import of African goods. We create strategic alliances between companies from both continents.',
    'eje.comercio.stats': '+200% Exchange',
    
    'eje.cultura.title': 'Culture',
    'eje.cultura.short': 'Cultural and artistic exchange',
    'eje.cultura.full': 'We promote cultural, artistic and academic exchange between our peoples. We organize festivals, exhibitions, artistic residencies and student exchange programs.',
    'eje.cultura.stats': '50+ Events/year',
    
    'eje.energia.title': 'Energy',
    'eje.energia.short': 'Energy cooperation',
    'eje.energia.full': 'We collaborate in the development of energy projects, including oil, gas, renewable energies and cutting-edge technology for the sustainable use of natural resources.',
    'eje.energia.stats': '15 Projects',
    
    'eje.salud.title': 'Health',
    'eje.salud.short': 'Health cooperation',
    'eje.salud.full': 'We develop health cooperation programs, including sending medicines, training medical personnel, exchanging knowledge and specialized care.',
    'eje.salud.stats': '100k+ Beneficiaries',
    
    'eje.educacion.title': 'Education',
    'eje.educacion.short': 'Academic training',
    'eje.educacion.full': 'We offer educational scholarships, student exchange programs, professional training and collaboration between Venezuelan and African universities.',
    'eje.educacion.stats': '5k+ Scholarships',
    
    // Mapa
    'mapa.subtitle': 'South-South Cooperation',
    'mapa.title': 'Cooperation Map',
    'mapa.description': 'Explore the African countries where Venezuela maintains diplomatic relations and active cooperation projects.',
    'mapa.alto': 'High',
    'mapa.medio': 'Medium',
    'mapa.inicial': 'Initial',
    'mapa.embajada': 'Embassy',
    'mapa.info': 'Click on a country to see more information',
    'mapa.proyectos': 'active projects',
    'mapa.embajadaEst': 'Embassy established',
    'mapa.cooperacion': 'Cooperation',
    'mapa.verDetalles': 'View details',
    'mapa.stats.paises': 'Countries with cooperation',
    'mapa.stats.embajadas': 'Active embassies',
    'mapa.stats.proyectos': 'Projects underway',
    'mapa.stats.beneficiarios': 'Beneficiaries',
    
    // Noticias
    'noticias.subtitle': 'Newsroom',
    'noticias.title': 'Press Room',
    'noticias.description': 'The latest news about our bilateral cooperation, events and activities of the Vice Ministry.',
    'noticias.todas': 'All',
    'noticias.politica': 'Politics',
    'noticias.economia': 'Economy',
    'noticias.cultura': 'Culture',
    'noticias.energia': 'Energy',
    'noticias.educacion': 'Education',
    'noticias.salud': 'Health',
    'noticias.leerMas': 'Read more',
    'noticias.verTodas': 'View all news',
    'noticias.temas': 'Popular topics',
    
    // Inversiones
    'inversiones.subtitle': 'Opportunities',
    'inversiones.title': 'Invest in Venezuela',
    'inversiones.description': 'Discover the strategic sectors where Venezuela offers unique investment opportunities for African entrepreneurs.',
    'inversiones.porque': 'Why invest?',
    'inversiones.ubicacion': 'Strategic location in America',
    'inversiones.tratados': 'South-South cooperation treaties',
    'inversiones.recursos': 'Abundant natural resources',
    'inversiones.mano': 'Qualified workforce',
    'inversiones.zonas': 'Free zones and tax benefits',
    'inversiones.mercado': 'Regional market of 500M+ people',
    'inversiones.infraestructura': 'Developed port infrastructure',
    'inversiones.marco': 'Legal framework for investor protection',
    'inversiones.proyecto': 'Do you have an investment project?',
    'inversiones.asesoria': 'Our investor attention team is ready to advise you and facilitate your entry into the Venezuelan market.',
    'inversiones.reunion': 'Schedule meeting',
    'inversiones.guia': "Investor's guide",
    'inversiones.ficha': 'Download technical sheet',
    'inversiones.contactar': 'Contact',
    
    // Sectores
    'sector.petroleo.title': 'Oil & Gas',
    'sector.petroleo.desc': 'Venezuela has the largest oil reserves in the world. Opportunities in exploration, production, refining and petrochemicals.',
    'sector.petroleo.op1': 'Joint ventures in oil fields',
    'sector.petroleo.op2': 'Enhanced recovery technology',
    'sector.petroleo.op3': 'Refining projects',
    'sector.petroleo.op4': 'Petrochemical development',
    'sector.petroleo.stat1': 'Proven reserves',
    'sector.petroleo.stat2': 'Daily production',
    
    'sector.mineria.title': 'Mining',
    'sector.mineria.desc': 'Diverse mineral wealth including gold, diamonds, bauxite, iron and coltan. Opportunities in sustainable exploitation.',
    'sector.mineria.op1': 'Gold and diamond exploitation',
    'sector.mineria.op2': 'Iron and bauxite mining',
    'sector.mineria.op3': 'Mineral processing',
    'sector.mineria.op4': 'Sustainable mining technology',
    'sector.mineria.stat1': 'Gold reserves',
    'sector.mineria.stat2': 'Mineral diversity',
    
    'sector.agricultura.title': 'Agriculture',
    'sector.agricultura.desc': 'Fertile lands and tropical climate ideal for diverse crops. Opportunities in agroindustry and agricultural technology.',
    'sector.agricultura.op1': 'Export tropical crops',
    'sector.agricultura.op2': 'Agroindustry and processing',
    'sector.agricultura.op3': 'Agricultural technology',
    'sector.agricultura.op4': 'Irrigation projects',
    'sector.agricultura.stat1': 'Arable land',
    'sector.agricultura.stat2': 'Agricultural zones',
    
    'sector.turismo.title': 'Tourism',
    'sector.turismo.desc': 'Unique destinations ranging from the Caribbean to the Amazon. Opportunities in ecotourism and adventure tourism.',
    'sector.turismo.op1': 'Resort development',
    'sector.turismo.op2': 'Sustainable ecotourism',
    'sector.turismo.op3': 'Adventure tourism',
    'sector.turismo.op4': 'Cruises and nautical',
    'sector.turismo.stat1': 'Coastlines',
    'sector.turismo.stat2': 'National parks',
    
    'sector.industria.title': 'Industry',
    'sector.industria.desc': 'Growing industrial sector with opportunities in manufacturing, textiles and goods production.',
    'sector.industria.op1': 'Industrial zones',
    'sector.industria.op2': 'Light manufacturing',
    'sector.industria.op3': 'Textile industry',
    'sector.industria.op4': 'Automotive assembly',
    'sector.industria.stat1': 'Free zones',
    'sector.industria.stat2': 'Annual growth',
    
    'sector.energia.title': 'Renewable Energy',
    'sector.energia.desc': 'Exceptional potential for solar, wind and hydroelectric energy. Clean energy projects under development.',
    'sector.energia.op1': 'Solar parks',
    'sector.energia.op2': 'Wind energy',
    'sector.energia.op3': 'Hydroelectricity',
    'sector.energia.op4': 'Biofuels',
    'sector.energia.stat1': 'Solar potential',
    'sector.energia.stat2': 'Main rivers',
    
    // Footer
    'footer.descripcion': 'Strengthening the bonds of brotherhood and cooperation between Venezuela and the African continent to build a future of shared prosperity.',
    'footer.enlaces': 'Quick Links',
    'footer.contacto': 'Contact',
    'footer.direccion1': 'MPPRE Tower, 12th Floor',
    'footer.direccion2': 'Urdaneta Avenue, Caracas',
    'footer.direccion3': 'Venezuela',
    'footer.boletin': 'Newsletter',
    'footer.boletinDesc': 'Subscribe to receive the latest news about our cooperation with Africa.',
    'footer.suscribir': 'By subscribing, you agree to our privacy policy.',
    'footer.instituciones': 'Related institutions',
    'footer.copyright': 'Vice Ministry of Africa for Venezuela. All rights reserved.',
    'footer.privacidad': 'Privacy policy',
    'footer.terminos': 'Terms of use',
    'footer.accesibilidad': 'Accessibility',
    
    // Search
    'search.placeholder': 'Search...',
    'search.buscar': 'Search',
  },
  FR: {
    // Navigation
    'nav.inicio': 'Accueil',
    'nav.sobre': 'À Propos',
    'nav.ejes': "Axes d'Action",
    'nav.cooperacion': 'Coopération',
    'nav.noticias': 'Actualités',
    'nav.inversiones': 'Investissement',
    'nav.contacto': 'Contact',
    
    // Hero
    'hero.badge': 'République Bolivarienne du Venezuela',
    'hero.title1': 'Renforcer les Liens,',
    'hero.title2': 'Construire le Futur',
    'hero.subtitle': 'Venezuela et Afrique: Une vision partagée de prospérité et de coopération Sud-Sud. Ensemble, nous construisons un monde multipolaire plus juste.',
    'hero.cta1': 'Découvrez nos initiatives',
    'hero.cta2': "Voir la vidéo institutionnelle",
    'hero.scroll': 'Défilez pour explorer',
    
    // Stats
    'stats.paises': 'Pays Alliés',
    'stats.proyectos': 'Projets Actifs',
    'stats.anos': 'Années de Coopération',
    'stats.compromiso': 'Engagement',
    
    // About
    'about.subtitle': 'À Propos de Nous',
    'about.title': 'Un Pont Entre les Continents',
    'about.description': "Le Vice-ministère de l'Afrique pour le Venezuela est l'entité chargée de renforcer les relations bilatérales entre le Venezuela et le continent africain, en promouvant le multilatéralisme, la solidarité Sud-Sud et le développement partagé.",
    'about.mision': 'Mission',
    'about.misionText': 'Renforcer les liens de coopération entre le Venezuela et l\'Afrique par des politiques publiques inclusives et participatives.',
    'about.vision': 'Vision',
    'about.visionText': "Être la référence diplomatique dans la consolidation d'une alliance stratégique Venezuela-Afrique pour le développement mutuel.",
    'about.valores': 'Nos Valeurs',
    'about.cooperacion': 'Coopération',
    'about.cooperacionDesc': 'Travail conjoint basé sur le respect mutuel',
    'about.inclusion': 'Inclusion',
    'about.inclusionDesc': 'Participation active de tous les secteurs',
    'about.excelencia': 'Excellence',
    'about.excelenciaDesc': 'Engagement envers les plus hauts standards',
    'about.quote': "La coopération entre le Venezuela et l'Afrique n'est pas seulement une alliance politique, c'est un engagement historique envers la libération de nos peuples et la construction d'un monde plus juste.",
    'about.viceministro': 'Vice-ministre de Afrique',
    'about.gobierno': 'Gouvernement Bolivarien du Venezuela',
    'about.stats.cooperacion': 'Années de coopération',
    'about.stats.paises': 'Pays africains',
    
    // Ejes de Acción
    'ejes.subtitle': 'Notre Travail',
    'ejes.title': "Axes d'Action",
    'ejes.description': "Cinq piliers fondamentaux qui guident notre travail diplomatique et de coopération internationale avec le continent africain.",
    'ejes.cta': 'Vous voulez en savoir plus sur nos programmes?',
    'ejes.contacto': 'Contactez-nous',
    
    // Ejes individuales
    'eje.comercio.title': 'Commerce',
    'eje.comercio.short': 'Échange commercial bilatéral',
    'eje.comercio.full': "Nous facilitons les échanges commerciaux entre le Venezuela et l'Afrique, en promouvant l'exportation de produits vénézuéliens et l'importation de biens africains. Nous créons des alliances stratégiques entre entreprises des deux continents.",
    'eje.comercio.stats': '+200% Échange',
    
    'eje.cultura.title': 'Culture',
    'eje.cultura.short': 'Échange culturel et artistique',
    'eje.cultura.full': "Nous promouvons les échanges culturels, artistiques et académiques entre nos peuples. Nous organisons des festivals, des expositions, des résidences artistiques et des programmes d'échange étudiant.",
    'eje.cultura.stats': '50+ Événements/an',
    
    'eje.energia.title': 'Énergie',
    'eje.energia.short': 'Coopération énergétique',
    'eje.energia.full': "Nous collaborons au développement de projets énergétiques, y compris le pétrole, le gaz, les énergies renouvelables et les technologies de pointe pour l'utilisation durable des ressources naturelles.",
    'eje.energia.stats': '15 Projets',
    
    'eje.salud.title': 'Santé',
    'eje.salud.short': 'Coopération sanitaire',
    'eje.salud.full': "Nous développons des programmes de coopération sanitaire, incluant l'envoi de médicaments, la formation du personnel médical, l'échange de connaissances et les soins spécialisés.",
    'eje.salud.stats': '100k+ Bénéficiaires',
    
    'eje.educacion.title': 'Éducation',
    'eje.educacion.short': 'Formation académique',
    'eje.educacion.full': "Nous offrons des bourses éducatives, des programmes d'échange étudiant, de formation professionnelle et de collaboration entre universités vénézuéliennes et africaines.",
    'eje.educacion.stats': '5k+ Bourses',
    
    // Mapa
    'mapa.subtitle': 'Coopération Sud-Sud',
    'mapa.title': 'Carte de Coopération',
    'mapa.description': "Explorez les pays africains où le Venezuela maintient des relations diplomatiques et des projets de coopération actifs.",
    'mapa.alto': 'Élevé',
    'mapa.medio': 'Moyen',
    'mapa.inicial': 'Initial',
    'mapa.embajada': 'Ambassade',
    'mapa.info': 'Cliquez sur un pays pour voir plus d\'informations',
    'mapa.proyectos': 'projets actifs',
    'mapa.embajadaEst': 'Ambassade établie',
    'mapa.cooperacion': 'Coopération',
    'mapa.verDetalles': 'Voir les détails',
    'mapa.stats.paises': 'Pays avec coopération',
    'mapa.stats.embajadas': 'Ambassades actives',
    'mapa.stats.proyectos': 'Projets en cours',
    'mapa.stats.beneficiarios': 'Bénéficiaires',
    
    // Noticias
    'noticias.subtitle': 'Actualité',
    'noticias.title': 'Salle de Presse',
    'noticias.description': 'Les dernières nouvelles sur notre coopération bilatérale, les événements et les activités du Vice-ministère.',
    'noticias.todas': 'Toutes',
    'noticias.politica': 'Politique',
    'noticias.economia': 'Économie',
    'noticias.cultura': 'Culture',
    'noticias.energia': 'Énergie',
    'noticias.educacion': 'Éducation',
    'noticias.salud': 'Santé',
    'noticias.leerMas': 'Lire plus',
    'noticias.verTodas': 'Voir toutes les actualités',
    'noticias.temas': 'Sujets populaires',
    
    // Inversiones
    'inversiones.subtitle': 'Opportunités',
    'inversiones.title': 'Investissez au Venezuela',
    'inversiones.description': "Découvrez les secteurs stratégiques où le Venezuela offre des opportunités d'investissement uniques pour les entrepreneurs africains.",
    'inversiones.porque': 'Pourquoi investir?',
    'inversiones.ubicacion': 'Emplacement stratégique en Amérique',
    'inversiones.tratados': 'Traités de coopération Sud-Sud',
    'inversiones.recursos': 'Ressources naturelles abondantes',
    'inversiones.mano': 'Main-d\'œuvre qualifiée',
    'inversiones.zonas': 'Zones franches et avantages fiscaux',
    'inversiones.mercado': 'Marché régional de 500M+ personnes',
    'inversiones.infraestructura': 'Infrastructure portuaire développée',
    'inversiones.marco': 'Cadre juridique de protection des investisseurs',
    'inversiones.proyecto': 'Vous avez un projet d\'investissement?',
    'inversiones.asesoria': "Notre équipe d'attention aux investisseurs est prête à vous conseiller et à faciliter votre entrée sur le marché vénézuélien.",
    'inversiones.reunion': 'Planifier une réunion',
    'inversiones.guia': "Guide de l'investisseur",
    'inversiones.ficha': 'Télécharger la fiche technique',
    'inversiones.contactar': 'Contacter',
    
    // Sectores
    'sector.petroleo.title': 'Pétrole et Gaz',
    'sector.petroleo.desc': 'Le Venezuela possède les plus grandes réserves de pétrole au monde. Opportunités en exploration, production, raffinage et pétrochimie.',
    'sector.petroleo.op1': 'Joint ventures dans les champs pétroliers',
    'sector.petroleo.op2': 'Technologie de récupération améliorée',
    'sector.petroleo.op3': 'Projets de raffinage',
    'sector.petroleo.op4': 'Développement pétrochimique',
    'sector.petroleo.stat1': 'Réserves prouvées',
    'sector.petroleo.stat2': 'Production quotidienne',
    
    'sector.mineria.title': 'Mines',
    'sector.mineria.desc': 'Richesse minérale diversifiée incluant or, diamants, bauxite, fer et coltan. Opportunités dans exploitation durable.',
    'sector.mineria.op1': 'Exploitation aurifère et diamantifère',
    'sector.mineria.op2': 'Mines de fer et de bauxite',
    'sector.mineria.op3': 'Traitement des minéraux',
    'sector.mineria.op4': 'Technologie minière durable',
    'sector.mineria.stat1': 'Réserves d\'or',
    'sector.mineria.stat2': 'Diversité minérale',
    
    'sector.agricultura.title': 'Agriculture',
    'sector.agricultura.desc': 'Terres fertiles et climat tropical idéal pour diverses cultures. Opportunités en agroindustrie et technologie agricole.',
    'sector.agricultura.op1': 'Cultures tropicales d\'exportation',
    'sector.agricultura.op2': 'Agroindustrie et transformation',
    'sector.agricultura.op3': 'Technologie agricole',
    'sector.agricultura.op4': 'Projets d\'irrigation',
    'sector.agricultura.stat1': 'Terres arables',
    'sector.agricultura.stat2': 'Zones agricoles',
    
    'sector.turismo.title': 'Tourisme',
    'sector.turismo.desc': "Destinations uniques allant de la Caraïbe à l'Amazonie. Opportunités en écotourisme et tourisme d'aventure.",
    'sector.turismo.op1': 'Développement de resorts',
    'sector.turismo.op2': 'Écotourisme durable',
    'sector.turismo.op3': "Tourisme d'aventure",
    'sector.turismo.op4': 'Croisières et nautisme',
    'sector.turismo.stat1': 'Côtes',
    'sector.turismo.stat2': 'Parcs nationaux',
    
    'sector.industria.title': 'Industrie',
    'sector.industria.desc': 'Secteur industriel en croissance avec opportunités en fabrication, textiles et production de biens.',
    'sector.industria.op1': 'Zones industrielles',
    'sector.industria.op2': 'Manufacture légère',
    'sector.industria.op3': 'Industrie textile',
    'sector.industria.op4': 'Assemblage automobile',
    'sector.industria.stat1': 'Zones franches',
    'sector.industria.stat2': 'Croissance annuelle',
    
    'sector.energia.title': 'Énergies Renouvelables',
    'sector.energia.desc': 'Potentiel exceptionnel pour énergie solaire, éolienne et hydroélectrique. Projets énergie propre en développement.',
    'sector.energia.op1': 'Parcs solaires',
    'sector.energia.op2': 'Énergie éolienne',
    'sector.energia.op3': 'Hydroélectricité',
    'sector.energia.op4': 'Biocarburants',
    'sector.energia.stat1': 'Potentiel solaire',
    'sector.energia.stat2': 'Principales rivières',
    
    // Footer
    'footer.descripcion': "Renforcer les liens de fraternité et de coopération entre le Venezuela et le continent africain pour construire un avenir de prospérité partagée.",
    'footer.enlaces': 'Liens Rapides',
    'footer.contacto': 'Contact',
    'footer.direccion1': 'Tour MPPRE, 12ème étage',
    'footer.direccion2': 'Avenue Urdaneta, Caracas',
    'footer.direccion3': 'Venezuela',
    'footer.boletin': 'Bulletin',
    'footer.boletinDesc': "Abonnez-vous pour recevoir les dernières nouvelles sur notre coopération avec l'Afrique.",
    'footer.suscribir': "En vous abonnant, vous acceptez notre politique de confidentialité.",
    'footer.instituciones': 'Institutions liées',
    'footer.copyright': "Vice-ministère de l'Afrique pour le Venezuela. Tous droits réservés.",
    'footer.privacidad': 'Politique de confidentialité',
    'footer.terminos': "Conditions d'utilisation",
    'footer.accesibilidad': 'Accessibilité',
    
    // Search
    'search.placeholder': 'Rechercher...',
    'search.buscar': 'Rechercher',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLang] = useState<Language>('ES');

  const setLanguage = (lang: Language) => {
    setCurrentLang(lang);
    // Guardar preferencia en localStorage
    localStorage.setItem('preferredLanguage', lang);
  };

  // Cargar preferencia guardada al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('preferredLanguage') as Language;
    if (saved && ['ES', 'EN', 'FR'].includes(saved)) {
      setCurrentLang(saved);
    }
  }, []);

  const t = (key: string): string | string[] => {
    const translation = translations[currentLang][key as keyof typeof translations['ES']];
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

