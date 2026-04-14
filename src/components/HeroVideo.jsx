import React from 'react';

import presentationHaut from '../assets/PresentationHaut.png';
import vitrineImg from '../assets/vitrinePresentation.png';
import entrepriseImg from '../assets/entreprisePresentation.png';
import ecommerceImg from '../assets/ecommerce.jpg';


import { useMemo, useRef, useEffect, useState } from 'react';

const steps = [
  {
    number: '01',
    title: 'Discussion client',
    subtitle: 'Comprendre votre besoin, vos objectifs et votre cible.',
    image: presentationHaut,
    alt: 'Discussion avec le client',
  },
  {
    number: '02',
    title: 'Maquettage',
    subtitle: 'Structurer l’interface et valider la direction visuelle.',
    image: vitrineImg,
    alt: 'Maquettage du site',
  },
  {
    number: '03',
    title: 'Realisation',
    subtitle: 'Construire votre site sur mesure avec un code solide, fluide et evolutif.',
    image: entrepriseImg,
    alt: 'Phase de realisation du site',
  },
  {
    number: '04',
    title: 'Mise en ligne',
    subtitle: 'Finaliser les tests, deployer en production et assurer une mise en ligne sans friction.',
    image: ecommerceImg,
    alt: 'Mise en ligne du site',
  },
];

const HeroVideo = ({ isActive }) => {
  const heroRootRef = useRef(null);
  const [typedCount, setTypedCount] = useState(0);
  const [introKey, setIntroKey] = useState(0);
  const [runIntro, setRunIntro] = useState(false);
  const startRef = useRef(0);
  const pendingStopRef = useRef(false);
  const prevIsActiveRef = useRef(isActive);

  useEffect(() => {
    const updateHeroDotVars = () => {
      const root = heroRootRef.current;
      if (!root) return;

      const styles = getComputedStyle(document.documentElement);
      const xStr = styles.getPropertyValue('--logo-dot-x');
      const yStr = styles.getPropertyValue('--logo-dot-y');
      const logoX = Number.parseFloat(xStr);
      const logoY = Number.parseFloat(yStr);
      if (!Number.isFinite(logoX) || !Number.isFinite(logoY)) return;

      const rect = root.getBoundingClientRect();
      const heroX = logoX - rect.left;
      const heroY = logoY - rect.top;

      root.style.setProperty('--hero-dot-x', `${heroX}px`);
      root.style.setProperty('--hero-dot-y', `${heroY}px`);
    };

    updateHeroDotVars();
    window.addEventListener('resize', updateHeroDotVars);
    // Capture scrolls des containers (le scroll est sur un div, pas la window)
    window.addEventListener('scroll', updateHeroDotVars, true);

    return () => {
      window.removeEventListener('resize', updateHeroDotVars);
      window.removeEventListener('scroll', updateHeroDotVars, true);
    };
  }, []);

  const message = useMemo(() => 'Développons votre avenir ensemble !', []);

  const ACTIVE_MS = 8800;
  const PAUSE_MS = 20000;
  const CYCLE_MS = ACTIVE_MS + PAUSE_MS;

  // Timeline (sur la partie active uniquement): tape plus tôt, efface complètement, puis seulement après le masque se rétracte.
  const TYPE_START_MS = Math.round(ACTIVE_MS * 0.22);
  const TYPE_END_MS = Math.round(ACTIVE_MS * 0.52);
  const HOLD_END_MS = Math.round(ACTIVE_MS * 0.64);
  const ERASE_END_MS = Math.round(ACTIVE_MS * 0.74);

  useEffect(() => {
    const wasActive = prevIsActiveRef.current;

    if (isActive) {
      // Quand l'écran redevient actif, on (re)lance l'intro.
      pendingStopRef.current = false;

      // Si on revient après avoir quitté, on redémarre proprement.
      if (!wasActive || !runIntro) {
        startRef.current = performance.now();
        setTypedCount(0);
        setIntroKey((k) => k + 1);
        setRunIntro(true);
      }
    } else {
      // Quand l'écran devient inactif, on ne coupe pas: on finit la phase "active".
      if (runIntro) pendingStopRef.current = true;
    }

    prevIsActiveRef.current = isActive;
  }, [isActive, runIntro]);

  useEffect(() => {
    const onWelcomeDismissed = () => {
      setTypedCount(0);
      setIntroKey((k) => k + 1);
      // Si l'intro tourne, on la relance depuis le début.
      if (runIntro) startRef.current = performance.now();
    };
    window.addEventListener('welcome:dismissed', onWelcomeDismissed);
    return () => window.removeEventListener('welcome:dismissed', onWelcomeDismissed);
  }, [runIntro]);

  useEffect(() => {
    if (!runIntro) {
      setTypedCount(0);
      return;
    }

    let rafId = 0;
    if (!startRef.current) startRef.current = performance.now();
    const start = startRef.current;

    const tick = (now) => {
      const t = (now - start) % CYCLE_MS;
      const totalChars = message.length;

      // Si on a quitté l'écran, on laisse l'intro aller jusqu'à la fin de la phase active
      // (masque + texte), puis on stoppe proprement.
      if (pendingStopRef.current && t >= ACTIVE_MS) {
        pendingStopRef.current = false;
        startRef.current = 0;
        setTypedCount(0);
        setRunIntro(false);
        return;
      }

      if (t > ACTIVE_MS) {
        setTypedCount((prev) => (prev === 0 ? prev : 0));
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      let nextCount = 0;
      if (t < TYPE_START_MS) {
        nextCount = 0;
      } else if (t < TYPE_END_MS) {
        const p = (t - TYPE_START_MS) / Math.max(1, TYPE_END_MS - TYPE_START_MS);
        nextCount = Math.max(0, Math.min(totalChars, Math.floor(p * totalChars)));
      } else if (t < HOLD_END_MS) {
        nextCount = totalChars;
      } else if (t < ERASE_END_MS) {
        const p = (t - HOLD_END_MS) / Math.max(1, ERASE_END_MS - HOLD_END_MS);
        nextCount = Math.max(0, Math.min(totalChars, totalChars - Math.floor(p * totalChars)));
      } else {
        nextCount = 0;
      }

      setTypedCount((prev) => (prev === nextCount ? prev : nextCount));
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [runIntro, introKey, message, CYCLE_MS, ACTIVE_MS, TYPE_START_MS, TYPE_END_MS, HOLD_END_MS, ERASE_END_MS]);

  return (
    <div ref={heroRootRef} className="w-full h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_36%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.10),transparent_34%),linear-gradient(135deg,#09090b,#18181b)]" />

      <div className="relative z-10 w-full max-w-6xl px-6 md:px-10 py-10">
        <div className="text-center mb-8 md:mb-12">
          <p className="text-xs md:text-sm uppercase tracking-[0.28em] text-gray-300 mb-3">Methodologie</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white title-sc leading-tight">
            <span className="title-display">4</span> etapes de creation d&apos;un site
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-10">
          {steps.map((step, idx) => (
            <article
              key={step.number}
              className={`relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-5 md:p-6 shadow-2xl hero-step-card hero-step-card-${idx + 1}`}
              style={{
                transform:
                  idx === 0
                    ? 'translate(-12px, -8px) rotate(-2.4deg)'
                    : idx === 1
                      ? 'translate(14px, -2px) rotate(2.1deg)'
                      : idx === 2
                        ? 'translate(-10px, 10px) rotate(1.9deg)'
                        : 'translate(10px, 12px) rotate(-2.2deg)',
              }}
            >
              <span className="absolute top-3 right-4 text-4xl md:text-5xl font-bold text-white/25">
                {step.number}
              </span>

              <div className="flex items-center gap-4 pr-14">
                <img
                  src={step.image}
                  alt={step.alt}
                  className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover border border-white/30"
                  draggable={false}
                />

                <div className="text-left">
                  <h2 className="text-lg md:text-2xl font-semibold text-white title-sc leading-tight">
                    <span className="title-display">{step.title.charAt(0)}</span>{step.title.slice(1)}
                  </h2>
                  <p className="mt-1 text-sm md:text-base text-gray-200 leading-relaxed">
                    {step.subtitle}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {runIntro && (
        <>
          <div key={`hero-overlay-${introKey}`} className="hero-intro-overlay" aria-hidden="true" />
          <div key={`hero-text-${introKey}`} className="hero-intro-text" aria-hidden="true">
            <span className="hero-intro-type">{message.slice(0, typedCount)}</span>
            <span className="hero-intro-caret" />
          </div>
        </>
      )}
    </div>
  );
};

export default HeroVideo;
