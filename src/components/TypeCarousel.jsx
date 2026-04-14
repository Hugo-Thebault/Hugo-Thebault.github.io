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
    anchorId: 'produit-vitrine',
  },
  {
    src: entrepriseImg,
    alt: 'App intra entreprise',
    title: 'Entreprise',
    description: "Une application web interactive et sur-mesure pour vos besoins spécifiques.",
    anchorId: 'produit-entreprise',
  },
  {
    src: venteImg,
    alt: 'Site E-commerce',
    title: 'E-commerce',
    description: "Une boutique e-commerce moderne, rapide et sécurisée pour vendre vos produits.",
    anchorId: 'produit-ecommerce',
  },
];

const TypeCarousel = () => {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);
  const [order, setOrder] = useState([0, 1, 2]); // [dessous, milieu, dessus]
  const [desktopOrder, setDesktopOrder] = useState([0, 1, 2]); // [gauche, centre, droite]
  const [desktopAnimating, setDesktopAnimating] = useState(false);
  const [desktopWrapCardIndex, setDesktopWrapCardIndex] = useState(null);
  const [isDescriptionModeOn, setIsDescriptionModeOn] = useState(false);
  const [isDescriptionOverlayMounted, setIsDescriptionOverlayMounted] = useState(false);
  const [isDescriptionOverlayOpen, setIsDescriptionOverlayOpen] = useState(false);
  const [descriptionOverlayOrigin, setDescriptionOverlayOrigin] = useState('bottom');
  const cardRefs = useRef({});
  const hammersRef = useRef({});
  const initTimerRef = useRef(null);
  const orderTimerRef = useRef(null);
  const isDesktopRef = useRef(isDesktop);

  const DESCRIPTION_ANIM_MS = 220;
  const DESKTOP_FAN_ANIM_MS = 1000;
  // Mobile: taille proportionnelle à la largeur écran, avec bornes raisonnables
  // - iPhone SE (375px): 52.5vw ≈ 197px
  // - iPhone 14 Pro Max (430px): 52.5vw ≈ 226px
  const CARD_WIDTH_MOBILE = 'clamp(180px, 52.5vw, 240px)';
  // Desktop/tablette paysage: permettre des cards plus étroites pour que l'éventail tienne dès 768px
  const CARD_WIDTH_DESKTOP = 'clamp(220px, 24vw, 340px)';

  useEffect(() => {
    const checkDesktop = () => {
      const val = window.innerWidth >= 768;
      setIsDesktop(val);
      isDesktopRef.current = val;
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setDesktopOrder([0, 1, 2]);
      setIsDescriptionModeOn(false);
      setIsDescriptionOverlayMounted(false);
      setIsDescriptionOverlayOpen(false);
    } else {
      setOrder([0, 1, 2]);
    }
  }, [isDesktop]);

  // Fonction pour réinitialiser les positions des cards
  const initCards = useCallback(() => {
    if (isDesktop || isDesktopRef.current) return;
    cards.forEach((_, cardIndex) => {
      const el = cardRefs.current[cardIndex];
      if (!el) return;
      
      const position = order.indexOf(cardIndex);
      const scale = (20 - position * 2) / 20; // scale: 1, 0.9, 0.8
      const translateY = -30 * position; // offset vertical: 0, -30px, -60px
      
      el.style.zIndex = cards.length - position;
      // Combiner le centrage avec les transformations de pile
      el.style.transform = `translate(-50%, -50%) scale(${scale}) translateY(${translateY}px)`;
      // Ne pas atténuer les cartes derrière (évite l'effet "transparent")
      el.style.opacity = '1';
    });
  }, [order, isDesktop]);

  // Setup Hammer.js sur chaque card (une seule fois au montage)
  useEffect(() => {
    if (isDesktop) return;

    const setupHammer = (el, cardIndex) => {
      if (!el || hammersRef.current[cardIndex]) return;
      
      const hammer = new Hammer(el);
      hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 8 });
      hammersRef.current[cardIndex] = hammer;

      // Événement pan (drag)
      hammer.on('pan', (event) => {
        if (event.deltaX === 0) return;
        if (event.center.x === 0 && event.center.y === 0) return;

        // Vérifier que c'est bien la card du dessus (position 0)
        const currentPosition = order.indexOf(cardIndex);
        if (currentPosition !== 0) return; // Ne permettre le drag que sur la card du dessus

        el.classList.add('moving');

        const rotate = event.deltaX * 0.02;

        // Désactiver temporairement la transition pendant le drag
        el.style.transition = 'none';
        // Garder le centrage pendant le drag
        el.style.transform = `translate(-50%, -50%) translateX(${event.deltaX}px) rotate(${rotate}deg)`;
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
          const rotate = event.deltaX > 0 ? 12 : -12;

          el.style.transition = 'all 0.4s ease-out';
          el.style.transform = `translate(-50%, -50%) translateX(${toX}px) rotate(${rotate}deg)`;
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
    initTimerRef.current = setTimeout(initCards, 100);

    // Cleanup
    return () => {
      if (initTimerRef.current) clearTimeout(initTimerRef.current);
      Object.values(hammersRef.current).forEach(h => h && h.destroy());
      hammersRef.current = {};
    };
  }, [initCards, order, isDesktop]); // Dépend de initCards et order pour la vérification de position

  // Réinitialiser les positions quand l'ordre change
  useEffect(() => {
    if (isDesktop) return;
    // Attendre que la card removed soit sortie
    orderTimerRef.current = setTimeout(() => {
      initCards();
    }, 50);
    return () => {
      if (orderTimerRef.current) clearTimeout(orderTimerRef.current);
    };
  }, [order, initCards, isDesktop]);

  const scrollToProduct = (anchorId) => {
    if (!anchorId) return;
    const el = document.getElementById(anchorId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    window.location.hash = `#${anchorId}`;
  };

  const rotateFromLeft = () => {
    if (!isDesktop || desktopAnimating) return;
    const [left, center, right] = desktopOrder;

    // droite -> gauche en passant "derrière"
    setDesktopWrapCardIndex(right);
    setDesktopAnimating(true);
    setDesktopOrder([right, left, center]);

    window.setTimeout(() => {
      setDesktopAnimating(false);
      setDesktopWrapCardIndex(null);
    }, DESKTOP_FAN_ANIM_MS);
  };

  const rotateFromRight = () => {
    if (!isDesktop || desktopAnimating) return;
    const [left, center, right] = desktopOrder;

    // gauche -> droite en passant "derrière"
    setDesktopWrapCardIndex(left);
    setDesktopAnimating(true);
    setDesktopOrder([center, right, left]);

    window.setTimeout(() => {
      setDesktopAnimating(false);
      setDesktopWrapCardIndex(null);
    }, DESKTOP_FAN_ANIM_MS);
  };

  const openDescriptionOverlay = () => {
    setIsDescriptionModeOn(true);
    setIsDescriptionOverlayMounted(true);
    setDescriptionOverlayOrigin('bottom');
    // Démarre à 0 puis ouvre (remplissage bas -> haut)
    setIsDescriptionOverlayOpen(false);
    requestAnimationFrame(() => {
      setIsDescriptionOverlayOpen(true);
    });
  };

  const closeDescriptionOverlay = () => {
    setIsDescriptionModeOn(false);
    // Fermeture : le haut disparaît d'abord, le bas en dernier
    // (rétraction vers le bas)
    setDescriptionOverlayOrigin('bottom');
    setIsDescriptionOverlayOpen(false);
    window.setTimeout(() => {
      setIsDescriptionOverlayMounted(false);
    }, DESCRIPTION_ANIM_MS);
  };

  const toggleDescriptionOverlay = () => {
    // Si c'est déjà monté + ouvert, on ferme (vidage haut -> bas)
    if (isDescriptionOverlayMounted && isDescriptionOverlayOpen) {
      closeDescriptionOverlay();
      return;
    }

    // Sinon on ouvre
    openDescriptionOverlay();
  };

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
      {!isDesktop ? (
        <div
          className="relative w-full mx-auto flex items-center justify-center z-10"
          style={{
            height: 'min(54vh, 400px)',
            maxWidth: '100vw',
            touchAction: 'none',
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
                  width: CARD_WIDTH_MOBILE,
                  height: 'auto',
                  cursor: isTopCard ? 'grab' : 'default',
                  willChange: 'transform',
                  touchAction: 'none',
                  left: '50%',
                  top: '50%',
                  transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
                }}
              >
                {/* Overlay description animé (remplissage bas->haut / vidage haut->bas) */}
                {isDescriptionOverlayMounted && isTopCard && (
                  <div
                    className="absolute inset-0 bg-gray-900/70 flex items-center justify-center p-4 z-40 rounded-lg pointer-events-none"
                    style={{
                      transformOrigin: descriptionOverlayOrigin,
                      transform: `scaleY(${isDescriptionOverlayOpen ? 1 : 0})`,
                      transition: `transform ${DESCRIPTION_ANIM_MS}ms ease-out`,
                    }}
                  >
                    <p className="text-white text-sm text-center leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                )}

                <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Étiquette en haut à gauche */}
                  <div className="absolute top-0 left-2 bg-white px-3 pt-0 pb-1 z-20 pointer-events-none border-l border-r border-b border-black rounded-b-md">
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
      ) : (
        <div
          className="relative w-full mx-auto flex items-center justify-center z-10"
          style={{
            height: 'min(64vh, 520px)',
            maxWidth: '100vw',
          }}
        >
          {cards.map((card, cardIndex) => {
            const position = desktopOrder.indexOf(cardIndex); // 0=gauche 1=centre 2=droite
            const isCenter = position === 1;

            // Décalage garanti sans superposition: largeur de la card (100%) + un gap fixe
            const translateX =
              position === 0
                ? 'calc(-100% - 2.5rem)'
                : position === 2
                  ? 'calc(100% + 2.5rem)'
                  : '0px';
            const rotate = position === 0 ? '-5deg' : position === 2 ? '5deg' : '0deg';
            const baseScale = isCenter ? 1 : 0.96;
            const isWrap = desktopAnimating && desktopWrapCardIndex === cardIndex;
            const scale = isWrap ? 0.92 : baseScale;

            let zIndex = isCenter ? 30 : 20;
            if (isWrap) zIndex = 10;

            const isLeft = position === 0;
            const isRight = position === 2;

            return (
              <div
                key={cardIndex}
                className="absolute"
                style={{
                  width: CARD_WIDTH_DESKTOP,
                  left: '50%',
                  top: '50%',
                  zIndex,
                  willChange: 'transform',
                  transform: `translate(-50%, -50%) translateX(${translateX}) rotate(${rotate}) scale(${scale})`,
                  transition: `transform ${DESKTOP_FAN_ANIM_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
                  cursor: isCenter ? 'default' : 'pointer',
                }}
                onClick={() => {
                  if (isLeft) rotateFromLeft();
                  if (isRight) rotateFromRight();
                }}
              >
                <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Étiquette en haut à gauche */}
                  <div className="absolute top-0 left-2 bg-white px-3 pt-0 pb-1 z-20 pointer-events-none border-l border-r border-b border-black rounded-b-md">
                    <span className="text-xs font-semibold text-gray-800">{card.title}</span>
                  </div>

                  {/* Bandeau centre (gris + explications + découvrir) */}
                  {isCenter && (
                    <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gray-900/75 p-4 z-30 text-white">
                      <div className="relative h-full">
                        <p className="text-base text-white leading-snug pr-24">
                          {card.description}
                        </p>

                        <button
                          type="button"
                          className="absolute bottom-0 right-0 bg-transparent border-0 p-0 text-base font-semibold text-white hover:text-gray-200 focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToProduct(card.anchorId);
                          }}
                        >
                          découvrir
                        </button>
                      </div>
                    </div>
                  )}

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
      )}

      {/* Panneau de contrôle en dessous (mobile uniquement) */}
      {!isDesktop && (
        <div className="flex items-center justify-center gap-6 mt-6 sm:mt-8 relative z-10">
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
            onClick={toggleDescriptionOverlay}
            className={`p-3 rounded-full shadow-lg transition-all border-2 ${
              isDescriptionModeOn 
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
