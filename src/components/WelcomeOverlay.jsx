import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import logo from '../assets/LogoB.png';
import ventePresentation from '../assets/ventePresentation.png';
import vitrinePresentation from '../assets/vitrinePresentation.png';
import entreprisePresentation from '../assets/entreprisePresentation.png';
import ecommerce from '../assets/ecommerce.jpg';

const CLOSE_ANIM_MS = 1400;

export default function WelcomeOverlay({ open, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [arePhotosExiting, setArePhotosExiting] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const closeTimeoutRef = useRef(null);
  const isClosingRef = useRef(false);
  const previousOverflowRef = useRef('');

  const photos = useMemo(
    () => [vitrinePresentation, entreprisePresentation, ecommerce, ventePresentation],
    []
  );

  const requestClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    try {
      sessionStorage.setItem('welcomeDismissed', '1');
    } catch {
      // ignore
    }

    try {
      window.dispatchEvent(new Event('welcome:dismissed'));
    } catch {
      // ignore
    }

    // Réactive le scroll tout de suite (pendant l’animation)
    document.body.style.overflow = previousOverflowRef.current;

    setArePhotosExiting(true);
    setIsClosing(true);
    closeTimeoutRef.current = window.setTimeout(() => {
      onClose?.();
    }, CLOSE_ANIM_MS);
  }, [onClose]);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setIsClosing(false);
      setArePhotosExiting(false);
      setImagesReady(false);
      isClosingRef.current = false;
    } else {
      setIsVisible(false);
      setIsClosing(false);
      setArePhotosExiting(false);
      setImagesReady(false);
      isClosingRef.current = false;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const urlsToPreload = [logo, ...photos];

    const preload = (url) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });

    Promise.all(urlsToPreload.map(preload)).then(() => {
      if (!cancelled) setImagesReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [open, photos]);

  useEffect(() => {
    if (!open) return;

    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflowRef.current;
      window.removeEventListener('keydown', onKeyDown);
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
  }, [open, requestClose]);

  if (!isVisible) return null;

  return (
    <div
      className={
        `fixed inset-0 z-[100] transition-opacity ease-out ` +
        (isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100')
      }
      style={{ transitionDuration: `${CLOSE_ANIM_MS}ms` }}
      role="dialog"
      aria-modal="true"
      aria-label="Bienvenue"
    >
      {/* Fond : gris uni + blobs animés (monochrome) */}
      <div className="absolute inset-0" style={{ backgroundColor: '#D7DAE3' }} />
      <div className="absolute inset-0 overflow-hidden">
        <div className="welcome-bg-blob welcome-bg-blob-1" />
        <div className="welcome-bg-blob welcome-bg-blob-2" />
        <div className="welcome-bg-blob welcome-bg-blob-3" />
      </div>

      {/* Photos dispersées autour (moins nombreuses) */}
      <div
        className={
          `absolute inset-0 transition-opacity duration-500 ` +
          (imagesReady ? 'opacity-100' : 'opacity-0')
        }
        aria-hidden={!imagesReady}
      >
        {/* Desktop/tablette */}
        <div className="hidden md:block">
          <div
            className={`absolute left-[10%] top-[18%] welcome-photo-shell ${arePhotosExiting ? 'welcome-photo-exit' : ''}`}
            style={{ '--exit-x': '-70vw', '--exit-y': '-70vh' }}
          >
            <div className="welcome-photo-drift">
              <div className="w-56 h-56 lg:w-64 lg:h-64 rounded-3xl overflow-hidden border border-white/15 bg-white/10 shadow-2xl" style={{ transform: 'rotate(-7deg)' }}>
                <img src={photos[0]} alt="" className="h-full w-full object-cover opacity-70 blur-[1px]" loading="lazy" draggable={false} />
              </div>
            </div>
          </div>
          <div
            className={`absolute right-[8%] top-[24%] welcome-photo-shell ${arePhotosExiting ? 'welcome-photo-exit' : ''}`}
            style={{ '--exit-x': '70vw', '--exit-y': '-70vh' }}
          >
            <div className="welcome-photo-drift welcome-photo-drift-2">
              <div className="w-52 h-52 lg:w-60 lg:h-60 rounded-3xl overflow-hidden border border-white/15 bg-white/10 shadow-2xl" style={{ transform: 'rotate(8deg)' }}>
                <img src={photos[1]} alt="" className="h-full w-full object-cover opacity-70 blur-[1px]" loading="lazy" draggable={false} />
              </div>
            </div>
          </div>
          <div
            className={`absolute left-[16%] bottom-[12%] welcome-photo-shell ${arePhotosExiting ? 'welcome-photo-exit' : ''}`}
            style={{ '--exit-x': '-70vw', '--exit-y': '70vh' }}
          >
            <div className="welcome-photo-drift welcome-photo-drift-3">
              <div className="w-60 h-60 lg:w-72 lg:h-72 rounded-3xl overflow-hidden border border-white/15 bg-white/10 shadow-2xl" style={{ transform: 'rotate(6deg)' }}>
                <img src={photos[2]} alt="" className="h-full w-full object-cover opacity-65 blur-[1px]" loading="lazy" draggable={false} />
              </div>
            </div>
          </div>
          <div
            className={`absolute right-[10%] bottom-[10%] welcome-photo-shell ${arePhotosExiting ? 'welcome-photo-exit' : ''}`}
            style={{ '--exit-x': '70vw', '--exit-y': '70vh' }}
          >
            <div className="welcome-photo-drift welcome-photo-drift-4">
              <div className="w-52 h-52 lg:w-60 lg:h-60 rounded-3xl overflow-hidden border border-white/15 bg-white/10 shadow-2xl" style={{ transform: 'rotate(-5deg)' }}>
                <img src={photos[3]} alt="" className="h-full w-full object-cover opacity-65 blur-[1px]" loading="lazy" draggable={false} />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile : 2 photos discrètes */}
        <div className="md:hidden">
          <div
            className={`absolute left-[8%] top-[14%] welcome-photo-shell ${arePhotosExiting ? 'welcome-photo-exit' : ''}`}
            style={{ '--exit-x': '-70vw', '--exit-y': '-70vh' }}
          >
            <div className="welcome-photo-drift">
              <div className="w-28 h-28 rounded-2xl overflow-hidden border border-white/15 bg-white/10 shadow-xl" style={{ transform: 'rotate(-8deg)' }}>
                <img src={photos[0]} alt="" className="h-full w-full object-cover opacity-65 blur-[1px]" loading="lazy" draggable={false} />
              </div>
            </div>
          </div>
          <div
            className={`absolute right-[6%] bottom-[16%] welcome-photo-shell ${arePhotosExiting ? 'welcome-photo-exit' : ''}`}
            style={{ '--exit-x': '70vw', '--exit-y': '70vh' }}
          >
            <div className="welcome-photo-drift welcome-photo-drift-2">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border border-white/15 bg-white/10 shadow-xl" style={{ transform: 'rotate(9deg)' }}>
                <img src={photos[2]} alt="" className="h-full w-full object-cover opacity-60 blur-[1px]" loading="lazy" draggable={false} />
              </div>
            </div>
          </div>
          <div
            className={`absolute right-[8%] bottom-[8%] welcome-photo-shell ${arePhotosExiting ? 'welcome-photo-exit' : ''}`}
            style={{ '--exit-x': '70vw', '--exit-y': '70vh' }}
          >
            <div className="welcome-photo-drift welcome-photo-drift-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/15 bg-white/10 shadow-xl" style={{ transform: 'rotate(-6deg)' }}>
                <img src={photos[3]} alt="" className="h-full w-full object-cover opacity-55 blur-[1px]" loading="lazy" draggable={false} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voile lisibilité */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Bloc central portrait */}
      <div className="absolute inset-0 flex items-center justify-center px-6 py-10">
        <div className="relative w-full max-w-[420px] aspect-[3/4]">
          {/* Carte verre par-dessus */}
          <button
            type="button"
            onClick={requestClose}
            className="absolute inset-0 rounded-[2rem] border border-white/25 bg-black/55 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center px-6 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Cliquer sur la carte pour découvrir le site"
          >
            {/* Fond animé léger */}
            <div className="absolute inset-0 welcome-card-anim" />

            <img
              src={logo}
              alt="Logo"
              className="w-32 h-32 sm:w-36 sm:h-36 object-contain drop-shadow-xl transition-transform duration-300 hover:scale-105"
              draggable={false}
            />

            <p className="mt-6 text-white text-base sm:text-lg font-semibold tracking-wide text-center">
              Cliquez sur la carte
            </p>
            <p className="mt-1 text-white/75 text-sm text-center">
              pour découvrir le site
            </p>

            <div className="mt-6 h-px w-16 bg-white/25" />
            <p className="mt-6 text-white/85 text-sm text-center">
              Bienvenue sur mon portefolio
            </p>

            {!imagesReady && (
              <div className="mt-6 flex flex-col items-center gap-3" aria-live="polite">
                <div className="h-6 w-6 rounded-full border-2 border-white/25 border-t-white/70 animate-spin" />
                <p className="text-white/70 text-xs tracking-wide">Chargement…</p>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
