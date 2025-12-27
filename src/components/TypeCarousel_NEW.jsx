import CarouselPatternBg from './CarouselPatternBg';
import vitrineImg from '../assets/vitrinePresentation.png';
import entrepriseImg from '../assets/entreprisePresentation.png';
import venteImg from '../assets/ventePresentation.png';

import React, { useState, useRef, useEffect } from 'react';
import Hammer from 'hammerjs';

const cards = [
  {
    src: vitrineImg,
    alt: 'Site Vitrine',
    title: 'Vitrine',
    description: "Un site vitrine pour présenter votre activité, votre marque ou votre portfolio.",
  },
  {
    src: entrepriseImg,
    alt: 'App intra entreprise',
    title: 'Entreprise',
    description: "Une application web interactive et sur-mesure pour vos besoins spécifiques.",
  },
  {
    src: venteImg,
    alt: 'Site E-commerce',
    title: 'E-commerce',
    description: "Une boutique e-commerce moderne, rapide et sécurisée pour vendre vos produits.",
  },
];

const TypeCarousel = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [order, setOrder] = useState([0, 1, 2]); // [dessous, milieu, dessus]
  const [dragging, setDragging] = useState(null); // index de la card en cours de drag
  const [showDescription, setShowDescription] = useState(null); // index de la card avec description visible
  const cardRefs = useRef([]);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Fonction pour réinitialiser les positions des cards
  const initCards = () => {
    const allCards = document.querySelectorAll('.carousel-card:not(.removed)');
    allCards.forEach((card, index) => {
      const scale = (20 - index * 2) / 20; // scale: 1, 0.9, 0.8
      const translateY = -40 * index; // offset vertical: 0, -40px, -80px
      const opacity = (10 - index * 2) / 10; // opacity: 1, 0.8, 0.6
      
      card.style.zIndex = allCards.length - index;
      card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
      card.style.opacity = opacity;
    });
  };

  // Setup Hammer.js sur chaque card
  useEffect(() => {
    if (!cardRefs.current || cardRefs.current.length === 0) return;

    const hammers = cardRefs.current.map((el, idx) => {
      if (!el) return null;
      
      const hammer = new Hammer(el);
      const cardIndex = order[order.length - 1 - idx]; // L'index de la card dans le tableau cards

      // Événement pan (drag)
      hammer.on('pan', (event) => {
        if (event.deltaX === 0) return;
        if (event.center.x === 0 && event.center.y === 0) return;

        el.classList.add('moving');
        setDragging(cardIndex);
        setShowDescription(cardIndex);

        const xMulti = event.deltaX * 0.02;
        const yMulti = event.deltaY / 100;
        const rotate = xMulti * yMulti;

        el.style.transform = `translate(${event.deltaX}px, ${event.deltaY}px) rotate(${rotate}deg)`;
      });

      // Événement panend (fin du drag)
      hammer.on('panend', (event) => {
        el.classList.remove('moving');
        setDragging(null);
        setShowDescription(null);

        const moveOutWidth = document.body.clientWidth;
        const keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

        if (keep) {
          // Revenir à la position initiale
          el.style.transform = '';
        } else {
          // Sortir avec fondu
          el.classList.add('removed');
          
          const endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth * 0.8);
          const toX = event.deltaX > 0 ? endX : -endX;
          const xMulti = event.deltaX * 0.02;
          const yMulti = event.deltaY / 100;
          const rotate = xMulti * yMulti * 10; // Rotation sobre (max ~10-15deg)

          el.style.transform = `translate(${toX}px, ${event.deltaY}px) rotate(${rotate}deg)`;
          el.style.opacity = '0';
          el.style.transition = 'all 0.4s ease-out';

          // Après l'animation, mettre la card derrière
          setTimeout(() => {
            el.classList.remove('removed');
            el.style.transition = '';
            el.style.opacity = '';
            el.style.transform = '';
            setOrder(prev => [...prev.slice(1), prev[0]]);
            setTimeout(initCards, 50);
          }, 400);
        }
      });

      return hammer;
    });

    // Initialiser les positions
    setTimeout(initCards, 100);

    // Cleanup
    return () => {
      hammers.forEach(h => h && h.destroy());
    };
  }, [order]);

  return (
    <section 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#F8F8FF' }}
    >
      <CarouselPatternBg />
      
      {/* Titre */}
      <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-8 md:mb-16 relative z-10">
        Produits proposés
      </h2>

      {/* Container des cards */}
      <div
        className="relative w-full mx-auto flex items-center justify-center z-10"
        style={{ 
          height: '500px',
          maxWidth: '100vw',
        }}
      >
        {order.map((cardIndex, position) => {
          const card = cards[cardIndex];
          const isTopCard = position === order.length - 1;

          return (
            <div
              key={`${cardIndex}-${position}`}
              ref={(el) => (cardRefs.current[order.length - 1 - position] = el)}
              className="carousel-card absolute"
              style={{
                width: isDesktop ? '280px' : '200px',
                height: 'auto',
                cursor: isTopCard ? 'grab' : 'default',
                willChange: 'transform',
                touchAction: 'none',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div 
                className="relative bg-white rounded-lg shadow-lg overflow-hidden"
                onMouseEnter={() => isDesktop && isTopCard && setShowDescription(cardIndex)}
                onMouseLeave={() => isDesktop && setShowDescription(null)}
              >
                {/* Étiquette en haut à gauche */}
                <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded shadow-md z-20">
                  <span className="text-xs font-semibold text-gray-800">{card.title}</span>
                </div>

                {/* Image */}
                <img
                  src={card.src}
                  alt={card.alt}
                  className="w-full h-auto select-none pointer-events-none"
                  draggable="false"
                />

                {/* Overlay avec description (visible pendant drag ou hover) */}
                {(dragging === cardIndex || showDescription === cardIndex) && (
                  <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center p-4 z-10 rounded-lg">
                    <p className="text-white text-sm text-center leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TypeCarousel;
