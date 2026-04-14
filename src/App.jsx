
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroVideo from './components/HeroVideo';
import AboutMe from './components/AboutMe';
import TypeCarousel from './components/TypeCarousel';
import TypePresentation1 from './components/TypePresentation1';
import TypePresentation2 from './components/TypePresentation2';
import TypePresentation3 from './components/TypePresentation3';
import Thanks from './components/Thanks';
import Logo from './components/Logo';
import PaginationDots from './components/PaginationDots';
import BackgroundPattern from './components/BackgroundPattern';
import WelcomeOverlay from './components/WelcomeOverlay';
import SiteVitrinePage from './components/SiteVitrinePage';
import SiteApplicationPage from './components/SiteApplicationPage';

import vitrineImg from './assets/vitrinePresentation.png';
import entrepriseImg from './assets/entreprisePresentation.png';
import venteImg from './assets/ventePresentation.png';

function ProjectPage({ title, description, imageSrc, imageAlt, imageSide = 'left' }) {
  const isImageRight = imageSide === 'right';

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 py-16" style={{ backgroundColor: '#F8F8FF' }}>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className={isImageRight ? 'md:order-2' : 'md:order-1'}>
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-auto rounded-3xl shadow-2xl object-cover"
            loading="lazy"
            draggable={false}
          />
        </div>

        <div className={isImageRight ? 'md:order-1' : 'md:order-2'}>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
            {title}
          </h1>
          <p className="mt-4 text-gray-700 text-base md:text-lg leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

const SiteVitrine = () => (
  <ProjectPage
    title="Site Vitrine"
    description="Un site élégant pour présenter votre activité, votre marque ou votre portfolio personnel. Idéal pour informer, rassurer et convertir vos visiteurs."
    imageSrc={vitrineImg}
    imageAlt="Aperçu site vitrine"
    imageSide="left"
  />
);

const SiteApplication = () => (
  <ProjectPage
    title="Site Application"
    description="Des applications web interactives et sur-mesure pour répondre à tous vos besoins : espaces clients, tableaux de bord, outils internes, automatisations…"
    imageSrc={entrepriseImg}
    imageAlt="Aperçu site application"
    imageSide="left"
  />
);

const SiteEcommerce = () => (
  <ProjectPage
    title="Site E-commerce"
    description="Une boutique en ligne moderne, rapide et sécurisée pour vendre vos produits : catalogue, paiement, gestion des commandes et expérience utilisateur fluide."
    imageSrc={venteImg}
    imageAlt="Aperçu site e-commerce"
    imageSide="right"
  />
);


function Home({ onTestWelcome }) {
  // Réfs pour chaque écran
  const section0 = useRef(null);
  const section1 = useRef(null);
  const section2 = useRef(null);
  const section3 = useRef(null);
  const section4 = useRef(null);
  const section5 = useRef(null);
  const section6 = useRef(null);
  const sections = React.useMemo(() => [section0, section1, section2, section3, section4, section5, section6], [section0, section1, section2, section3, section4, section5, section6]);
  const [activeIndex, setActiveIndex] = useState(0);


  useEffect(() => {
    const observers = [];
    sections.forEach((ref, idx) => {
      if (!ref.current) return;
      const observer = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveIndex(idx);
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(ref.current);
      observers.push(observer);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [sections]);

  // Gestion du scroll fluide à la molette
  const containerRef = useRef(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onWheel = (e) => {
      if (isScrolling.current) return;
      e.preventDefault();
      const delta = e.deltaY;
      let next = activeIndex;
      if (delta > 0 && activeIndex < sections.length - 1) next = activeIndex + 1;
      if (delta < 0 && activeIndex > 0) next = activeIndex - 1;
      if (next !== activeIndex) {
        isScrolling.current = true;
        sections[next]?.current?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => { isScrolling.current = false; }, 700);
      }
    };
    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, [activeIndex, sections]);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-scroll scroll-smooth snap-y snap-mandatory"
      style={{ scrollBehavior: 'smooth' }}
    >
      <PaginationDots
        count={sections.length}
        activeIndex={activeIndex}
        onDotClick={i => {
          sections[i]?.current?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
  <div ref={section0} className="snap-start h-screen"><HeroVideo isActive={activeIndex === 0} /></div>
        <div ref={section1} className="snap-start h-screen relative">
          <BackgroundPattern />
          <AboutMe />
        </div>
      <div ref={section2} className="snap-start h-screen"><TypeCarousel /></div>
      <div ref={section3} className="snap-start min-h-screen"><TypePresentation1 /></div>
      <div ref={section4} className="snap-start min-h-screen"><TypePresentation2 /></div>
      <div ref={section5} className="snap-start min-h-screen"><TypePresentation3 /></div>
      <div ref={section6} className="snap-start h-screen"><Thanks onTestWelcome={onTestWelcome} /></div>
    </div>
  );
}

function App() {
  const WELCOME_DISMISSED_KEY = 'welcomeDismissed';

  const [welcomeOpen, setWelcomeOpen] = useState(() => {
    try {
      return sessionStorage.getItem(WELCOME_DISMISSED_KEY) !== '1';
    } catch {
      return true;
    }
  });

  const handleWelcomeClose = useCallback(() => {
    try {
      sessionStorage.setItem(WELCOME_DISMISSED_KEY, '1');
    } catch {
      // ignore
    }
    setWelcomeOpen(false);
  }, []);

  const handleTestWelcome = useCallback(() => {
    setWelcomeOpen(true);
  }, []);

  return (
    <Router>
      <WelcomeOverlay open={welcomeOpen} onClose={handleWelcomeClose} />
      <BackgroundPattern />
      <Logo />
      <Routes>
        <Route path="/" element={<Home onTestWelcome={handleTestWelcome} />} />
        <Route path="/site-vitrine" element={<SiteVitrinePage />} />
        <Route path="/site-ecommerce" element={<SiteEcommerce />} />
        <Route path="/site-application" element={<SiteApplicationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
