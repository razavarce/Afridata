# Entregables - Viceministerio de África para Venezuela

## 1. Arquitectura de la Información

### Estructura del Sitio Web

```
Viceministerio de África para Venezuela
│
├── HEADER (Fijo)
│   ├── Logo institucional
│   ├── Navegación principal
│   │   ├── Inicio
│   │   ├── Sobre Nosotros
│   │   ├── Ejes de Acción
│   │   ├── Cooperación
│   │   ├── Noticias
│   │   ├── Inversiones
│   │   └── Contacto
│   ├── Selector de idioma (ES/EN/FR)
│   └── Buscador
│
├── HERO SECTION
│   ├── Slider de imágenes de alto impacto
│   ├── Titular principal
│   ├── Subtítulo descriptivo
│   ├── CTAs principales
│   └── Estadísticas destacadas
│
├── SOBRE NOSOTROS
│   ├── Presentación institucional
│   ├── Misión y Visión
│   ├── Valores institucionales
│   ├── Mensaje del Viceministro
│   └── Estadísticas de cooperación
│
├── EJES DE ACCIÓN (Interactivo)
│   ├── Comercio
│   ├── Cultura
│   ├── Energía
│   ├── Salud
│   └── Educación
│
├── MAPA DE COOPERACIÓN (Interactivo)
│   ├── Mapa SVG de África
│   ├── Marcadores de países
│   ├── Indicadores de embajadas
│   ├── Líneas de conexión
│   └── Panel de información por país
│
├── SALA DE PRENSA
│   ├── Grid de noticias
│   ├── Filtros por categoría
│   ├── Sistema de tags
│   └── Archivo histórico
│
├── INVERSIONES
│   ├── Sectores estratégicos
│   │   ├── Petróleo y Gas
│   │   ├── Minería
│   │   ├── Agricultura
│   │   ├── Turismo
│   │   ├── Industria
│   │   └── Energías Renovables
│   ├── Fichas técnicas
│   └── Formulario de contacto
│
└── FOOTER
    ├── Información institucional
    ├── Enlaces rápidos
    ├── Datos de contacto
    ├── Redes sociales
    ├── Boletín informativo
    └── Instituciones relacionadas
```

### Jerarquía Visual

1. **Nivel 1 - Hero**: Impacto visual máximo, mensaje principal
2. **Nivel 2 - Secciones principales**: Contenido institucional clave
3. **Nivel 3 - Componentes interactivos**: Mapa, ejes de acción
4. **Nivel 4 - Contenido dinámico**: Noticias, inversiones
5. **Nivel 5 - Navegación de cierre**: Footer con información de contacto

---

## 2. Código HTML/CSS Estructural

### Header/Navbar

```tsx
<header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 
  bg-diplomatic-blue-dark/90 backdrop-blur-xl shadow-lg py-3">
  <div className="w-full section-padding">
    <div className="flex items-center justify-between">
      {/* Logo */}
      <a href="#inicio" className="flex items-center gap-3 group">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-wealth-gold 
            to-wealth-gold-dark rounded-lg transform rotate-45 
            group-hover:rotate-90 transition-transform duration-500" />
          <span className="relative text-diplomatic-blue-dark font-heading 
            font-bold text-xl">VA</span>
        </div>
        <div className="hidden sm:block">
          <p className="text-white font-heading font-bold text-sm">Viceministerio</p>
          <p className="text-wealth-gold text-xs">de África</p>
        </div>
      </a>

      {/* Navigation */}
      <nav className="hidden lg:flex items-center gap-8">
        {navLinks.map((link) => (
          <a key={link.name} href={link.href} className="nav-link text-sm font-medium">
            {link.name}
          </a>
        ))}
      </nav>

      {/* Utilities */}
      <div className="flex items-center gap-3">
        {/* Search & Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="flex items-center gap-2 glass rounded-full px-3 py-2">
              <Globe className="w-4 h-4 text-wealth-gold" />
              <span className="text-white text-sm">ES</span>
            </button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
    </div>
  </div>
</header>
```

### Hero Section

```tsx
<section id="inicio" className="relative min-h-screen flex items-center justify-center 
  overflow-hidden">
  {/* Background Images with Slider */}
  <div className="absolute inset-0">
    {images.map((img, index) => (
      <div key={img} className={`absolute inset-0 transition-opacity duration-2000 
        ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}>
        <img src={img} alt={`Hero ${index + 1}`} className="w-full h-full object-cover" />
      </div>
    ))}
    <div className="absolute inset-0 bg-gradient-to-b from-diplomatic-blue-dark/80 
      via-diplomatic-blue-dark/50 to-diplomatic-blue-dark" />
  </div>

  {/* Content */}
  <div className="relative z-10 w-full section-padding pt-24">
    <div className="max-w-5xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
        <span className="w-2 h-2 bg-growth-emerald rounded-full animate-pulse" />
        <span className="text-white/80 text-sm">República Bolivariana de Venezuela</span>
      </div>

      <h1 className="heading-xl text-white mb-6">
        <span className="block">Fortaleciendo Lazos,</span>
        <span className="block text-gradient mt-2">Construyendo Futuro</span>
      </h1>

      <p className="body-lg text-white/80 max-w-2xl mx-auto mb-10">
        Venezuela y África: Una visión compartida de prosperidad y cooperación sur-sur.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button className="btn-primary group flex items-center gap-2">
          Conoce nuestras iniciativas
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        <Button variant="outline" className="btn-secondary group flex items-center gap-2">
          <Play className="w-5 h-5" />
          Ver video institucional
        </Button>
      </div>
    </div>
  </div>
</section>
```

### CSS Classes Personalizadas (Tailwind)

```css
/* Colores Institucionales */
--diplomatic-blue: #1e3a8a;
--wealth-gold: #d4af37;
--passion-red: #dc2626;
--growth-emerald: #059669;

/* Glassmorphism */
.glass {
  @apply bg-white/5 backdrop-blur-xl border border-white/10;
}

/* Gradientes */
.text-gradient {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-wealth-gold 
    via-wealth-gold-light to-wealth-gold;
}

/* Botones */
.btn-primary {
  @apply px-6 py-3 bg-gradient-to-r from-wealth-gold to-wealth-gold-dark 
    text-diplomatic-blue-dark font-semibold rounded-lg 
    transition-all duration-300 hover:shadow-glow hover:scale-105;
}

.btn-secondary {
  @apply px-6 py-3 border-2 border-wealth-gold text-wealth-gold font-semibold 
    rounded-lg transition-all duration-300 hover:bg-wealth-gold 
    hover:text-diplomatic-blue-dark;
}

/* Navegación */
.nav-link {
  @apply relative text-white/80 hover:text-white transition-colors duration-300 py-2;
}

.nav-link::after {
  content: '';
  @apply absolute bottom-0 left-0 w-0 h-0.5 bg-wealth-gold transition-all duration-300;
}

.nav-link:hover::after {
  @apply w-full;
}
```

---

## 3. Ideas de Contenido Multimedia para Audiencia Joven

### Idea 1: "Venezuela-África Challenge" - Serie de Videos Cortos
- **Formato**: Videos verticales (TikTok/Reels/Shorts) de 30-60 segundos
- **Contenido**: Jóvenes venezolanos y africanos compartiendo:
  - Palabras comunes en ambas culturas
  - Bailes tradicionales mezclados
  - Recetas fusionadas
  - Retos de idiomas (aprendiendo frases básicas)
- **Objetivo**: Viralizar la conexión cultural de forma divertida
- **Hashtag**: #VenezuelaAfricaChallenge

### Idea 2: Podcast "Puentes" - Historias de Cooperación Real
- **Formato**: Episodios semanales de 20-30 minutos
- **Contenido**: Entrevistas a:
  - Jóvenes profesionales en programas de intercambio
  - Emprendedores con negocios Venezuela-África
  - Estudiantes con becas binacionales
  - Artistas colaborando en proyectos conjuntos
- **Distribución**: Spotify, YouTube, Apple Podcasts
- **Estilo**: Narrativa cercana, lenguaje juvenil, música afro-venezolana

### Idea 3: Plataforma Gamificada "Diplomático Virtual"
- **Concepto**: Juego web/app educativo tipo simulador
- **Mecánica**: Los usuarios asumen el rol de diplomático y deben:
  - Resolver desafíos de cooperación internacional
  - Negociar acuerdos comerciales
  - Organizar eventos culturales
  - Gestionar crisis diplomáticas simuladas
- **Recompensas**: Insignias, certificados, oportunidades reales de pasantías
- **Objetivo**: Educar sobre diplomacia de forma interactiva y atractiva

---

## 4. Texto de Bienvenida Institucional

---

### Bienvenida al Viceministerio de África para Venezuela

**"Bienvenidos al puente que une dos continentes, una sola visión."**

En el Viceministerio de África para Venezuela, creemos firmemente que el futuro de nuestras naciones se construye sobre los pilares de la solidaridad, el respeto mutuo y la cooperación genuina. Somos la voz que amplifica los lazos históricos que unen a Venezuela con el continente africano, lazos forjados en la lucha por la libertad y la dignidad de nuestros pueblos.

Nuestra misión trasciende las fronteras geográficas. Trabajamos cada día para tejer alianzas estratégicas que impulsen el desarrollo económico, fortalezcan nuestras culturas compartidas y garanticen el bienestar de las generaciones presentes y futuras. Desde proyectos energéticos hasta intercambios educativos, desde acuerdos comerciales hasta iniciativas culturales, cada acción que emprendemos está guiada por el principio de que juntos somos más fuertes.

A quienes nos visitan desde África: les extendemos la mano fraterna de un pueblo que comparte su historia, sus sueños y su esperanza en un mundo más justo. A los venezolanos: los invitamos a descubrir las infinitas oportunidades que nuestra hermandad con África nos ofrece.

Este sitio web es su ventana a un mundo de posibilidades. Aquí encontrarán información sobre nuestros programas, las últimas noticias de nuestra cooperación, oportunidades de inversión y las múltiples formas en que pueden ser parte de esta histórica relación bilateral.

**Juntos, construimos el futuro.**

*Viceministerio de África para Venezuela*  
*"Fortaleciendo Lazos, Construyendo Futuro"*

---

## Especificaciones Técnicas del Proyecto

### Stack Tecnológico
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui
- **Animation**: GSAP + ScrollTrigger
- **Icons**: Lucide React

### Características Implementadas
- ✅ Diseño responsive (Mobile-First)
- ✅ Navegación fija con efecto glassmorphism
- ✅ Selector de idiomas (ES/EN/FR)
- ✅ Slider de imágenes en Hero
- ✅ Animaciones GSAP en scroll
- ✅ Mapa SVG interactivo de África
- ✅ Grid de noticias con filtros
- ✅ Cards de inversión con modales
- ✅ Footer institucional completo
- ✅ Accesibilidad WCAG 2.1 compliant

### Paleta de Colores
| Color | Hex | Uso |
|-------|-----|-----|
| Azul Profundo | #1e3a8a | Fondos, elementos principales |
| Dorado | #d4af37 | Acentos, CTAs, elementos destacados |
| Rojo Vibrante | #dc2626 | Alertas, elementos de énfasis |
| Verde Esmeralda | #059669 | Éxito, crecimiento |
| Blanco | #ffffff | Texto, fondos claros |

### Tipografía
- **Títulos**: Montserrat (700/800)
- **Cuerpo**: Inter (400/500/600)
- **Decorativa**: Playfair Display (Itálica)

---

**URL del sitio desplegado**: https://c2snbck6pjzvw.ok.kimi.link
