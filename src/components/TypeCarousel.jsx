import CarouselPatternBg from './CarouselPatternBg';
import vitrineImg from '../assets/vitrinePresentation.png';
import entrepriseImg from '../assets/entreprisePresentation.png';
import venteImg from '../assets/ventePresentation.png';

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const [showDescription, setShowDescription] = useState(false); // true/false pour afficher la description
  const cardRefs = useRef({});
  const hammersRef = useRef({});

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Fonction pour réinitialiser les positions des cards
  const initCards = useCallback(() => {
    cards.forEach((_, cardIndex) => {
      const el = cardRefs.current[cardIndex];
      if (!el) return;
      
      const position = order.indexOf(cardIndex);
      const scale = (20 - position * 2) / 20; // scale: 1, 0.9, 0.8
      const translateY = -30 * position; // offset vertical: 0, -30px, -60px
      const opacity = (10 - position) / 10; // opacity: 1, 0.9, 0.8
      
      el.style.zIndex = cards.length - position;
      // Combiner le centrage avec les transformations de pile
      el.style.transform = `translate(-50%, -50%) scale(${scale}) translateY(${translateY}px)`;
      el.style.opacity = opacity;
    });
  }, [order]);

  // Setup Hammer.js sur chaque card (une seule fois au montage)
  useEffect(() => {
    const setupHammer = (el, cardIndex) => {
      if (!el || hammersRef.current[cardIndex]) return;
      
      const hammer = new Hammer(el);
      hammersRef.current[cardIndex] = hammer;

      // Événement pan (drag)
      hammer.on('pan', (event) => {
        if (event.deltaX === 0) return;
        if (event.center.x === 0 && event.center.y === 0) return;

        // Vérifier que c'est bien la card du dessus (position 0)
        const currentPosition = order.indexOf(cardIndex);
        if (currentPosition !== 0) return; // Ne permettre le drag que sur la card du dessus

        el.classList.add('moving');

        const xMulti = event.deltaX * 0.02;
        const yMulti = event.deltaY / 100;
        const rotate = xMulti * yMulti;

        // Désactiver temporairement la transition pendant le drag
        el.style.transition = 'none';
        // Garder le centrage pendant le drag
        el.style.transform = `translate(-50%, -50%) translate(${event.deltaX}px, ${event.deltaY}px) rotate(${rotate}deg)`;
      });

      // Événement panend (fin du drag)
      hammer.on('panend', (event) => {
        // Vérifier que c'est bien la card du dessus (position 0)
        const currentPosition = order.indexOf(cardIndex);
        if (currentPosition !== 0) return; // Ne permettre le drag que sur la card du dessus

        el.classList.remove('moving');

        const moveOutWidth = document.body.clientWidth;
        const keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

        if (keep) {
          // Revenir à la position initiale avec transition
          el.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
          initCards();
        } else {
          // Sortir avec fondu
          el.classList.add('removed');
          
          const endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth * 0.8);
          const toX = event.deltaX > 0 ? endX : -endX;
          const xMulti = event.deltaX * 0.02;
          const yMulti = event.deltaY / 100;
          const rotate = xMulti * yMulti * 10; // Rotation sobre (max ~10-15deg)

          el.style.transition = 'all 0.4s ease-out';
          el.style.transform = `translate(-50%, -50%) translate(${toX}px, ${event.deltaY}px) rotate(${rotate}deg)`;
          el.style.opacity = '0';

          // Après l'animation, mettre la card derrière
          setTimeout(() => {
            el.classList.remove('removed');
            el.style.opacity = '';
            setOrder(prev => [...prev.slice(1), prev[0]]);
          }, 400);
        }
      });
    };

    // Setup Hammer sur toutes les cards
    cards.forEach((_, cardIndex) => {
      const el = cardRefs.current[cardIndex];
      if (el) setupHammer(el, cardIndex);
    });

    // Initialiser les positions au montage
    setTimeout(initCards, 100);

    // Cleanup
    return () => {
      Object.values(hammersRef.current).forEach(h => h && h.destroy());
      hammersRef.current = {};
    };
  }, [initCards, order]); // Dépend de initCards et order pour la vérification de position

  // Réinitialiser les positions quand l'ordre change
  useEffect(() => {
    // Attendre que la card removed soit sortie
    setTimeout(() => {
      initCards();
    }, 50);
  }, [order, initCards]);

  // Fonction pour swiper vers la gauche (avancer)
  const swipeLeft = () => {
    // La card du dessus est order[0] (position 0 = plus haut z-index)
    const topCardIndex = order[0];
    const topCard = cardRefs.current[topCardIndex];
    if (!topCard) return;

    topCard.classList.add('removed');
    topCard.style.transition = 'all 0.4s ease-out';
    topCard.style.transform = 'translate(-50%, -50%) translateX(-400px) rotate(-15deg)';
    topCard.style.opacity = '0';

    setTimeout(() => {
      topCard.classList.remove('removed');
      topCard.style.opacity = '';
      // Changer l'ordre d'abord
      setOrder(prev => {
        const newOrder = [...prev.slice(1), prev[0]];
        // Puis repositionner toutes les cards après un court délai
        setTimeout(() => {
          initCards();
        }, 50);
        return newOrder;
      });
    }, 400);
  };

  // Fonction pour swiper vers la droite (avancer aussi)
  const swipeRight = () => {
    // La card du dessus est order[0] (position 0 = plus haut z-index)
    const topCardIndex = order[0];
    const topCard = cardRefs.current[topCardIndex];
    if (!topCard) return;

    topCard.classList.add('removed');
    topCard.style.transition = 'all 0.4s ease-out';
    topCard.style.transform = 'translate(-50%, -50%) translateX(400px) rotate(15deg)';
    topCard.style.opacity = '0';

    setTimeout(() => {
      topCard.classList.remove('removed');
      topCard.style.opacity = '';
      // Changer l'ordre d'abord
      setOrder(prev => {
        const newOrder = [...prev.slice(1), prev[0]];
        // Puis repositionner toutes les cards après un court délai
        setTimeout(() => {
          initCards();
        }, 50);
        return newOrder;
      });
    }, 400);
  };

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
        {order.map((cardIndex) => {
          const card = cards[cardIndex];
          const position = order.indexOf(cardIndex);
          const isTopCard = position === 0; // Position 0 = z-index le plus haut = card du dessus

          return (
            <div
              key={cardIndex}
              ref={(el) => {
                if (el) cardRefs.current[cardIndex] = el;
              }}
              className="carousel-card absolute"
              style={{
                width: isDesktop ? '280px' : '200px',
                height: 'auto',
                cursor: isTopCard ? 'grab' : 'default',
                willChange: 'transform',
                touchAction: 'none',
                left: '50%',
                top: '50%',
                transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
              }}
            >
              {/* Overlay avec description (contrôlé par le bouton œil externe) */}
              {showDescription && isTopCard && (
                <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center p-4 z-40 rounded-lg">
                  <p className="text-white text-sm text-center leading-relaxed">
                    {card.description}
                  </p>
                </div>
              )}

              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Étiquette en haut à gauche */}
                <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded shadow-md z-20 pointer-events-none">
                  <span className="text-xs font-semibold text-gray-800">{card.title}</span>
                </div>

                {/* Image */}
                <img
                  src={card.src}
                  alt={card.alt}
                  className="w-full h-auto select-none pointer-events-none"
                  draggable="false"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Panneau de contrôle en dessous (mobile uniquement) */}
      {!isDesktop && (
        <div className="flex items-center justify-center gap-6 mt-8 relative z-10">
          {/* Bouton Flèche Gauche */}
          <button
            onClick={swipeLeft}
            className="bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all border-2 border-gray-200"
            aria-label="Card précédente"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-gray-800" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
          </button>

          {/* Bouton Œil */}
          <button
            onClick={() => setShowDescription(!showDescription)}
            className={`p-3 rounded-full shadow-lg transition-all border-2 ${
              showDescription 
                ? 'bg-blue-500 border-blue-600 text-white' 
                : 'bg-white hover:bg-gray-100 border-gray-200 text-gray-800'
            }`}
            aria-label="Voir la description"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
              />
            </svg>
          </button>

          {/* Bouton Flèche Droite */}
          <button
            onClick={swipeRight}
            className="bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all border-2 border-gray-200"
            aria-label="Card suivante"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-gray-800" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};

export default TypeCarousel;
