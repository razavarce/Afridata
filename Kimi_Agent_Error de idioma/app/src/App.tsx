import { useEffect } from 'react';
import './App.css';
import Header from './sections/Header';
import Hero from './sections/Hero';
import About from './sections/About';
import EjesAccion from './sections/EjesAccion';
import MapaCooperacion from './sections/MapaCooperacion';
import SalaPrensa from './sections/SalaPrensa';
import Inversiones from './sections/Inversiones';
import Footer from './sections/Footer';

function App() {
  useEffect(() => {
    // Smooth scroll behavior for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';

    // Preload critical images
    const imagesToPreload = [
      'https://images.unsplash.com/photo-1589519160732-57fc498494f8?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop',
    ];

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-diplomatic-blue-dark">
      <a
        href="/afridata/"
        className="fixed bottom-4 right-4 z-50 rounded-lg border border-white/20 bg-black/50 px-4 py-2 text-sm text-white backdrop-blur hover:bg-black/70"
      >
        Abrir AFRIDATA
      </a>
      <Header />
      <main>
        <Hero />
        <About />
        <EjesAccion />
        <MapaCooperacion />
        <SalaPrensa />
        <Inversiones />
      </main>
      <Footer />
    </div>
  );
}

export default App;
