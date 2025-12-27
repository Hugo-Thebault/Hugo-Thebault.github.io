
import React, { useRef, useEffect, useState } from 'react';
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

// Pages projets (à créer plus tard)
const SiteVitrine = () => <div className="min-h-screen flex items-center justify-center text-3xl">Page Site Vitrine (à détailler)</div>;
const SiteEcommerce = () => <div className="min-h-screen flex items-center justify-center text-3xl">Page Site E-commerce (à détailler)</div>;
const SiteApplication = () => <div className="min-h-screen flex items-center justify-center text-3xl">Page Site Application (à détailler)</div>;


function Home() {
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
      <div ref={section3} className="snap-start h-screen"><TypePresentation1 /></div>
      <div ref={section4} className="snap-start h-screen"><TypePresentation2 /></div>
      <div ref={section5} className="snap-start h-screen"><TypePresentation3 /></div>
      <div ref={section6} className="snap-start h-screen"><Thanks /></div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <BackgroundPattern />
      <Logo />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/site-vitrine" element={<SiteVitrine />} />
        <Route path="/site-ecommerce" element={<SiteEcommerce />} />
        <Route path="/site-application" element={<SiteApplication />} />
      </Routes>
    </Router>
  );
}

export default App;
