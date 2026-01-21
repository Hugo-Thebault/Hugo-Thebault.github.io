import React from 'react';



import { useMemo, useRef, useEffect, useState } from 'react';

const HeroVideo = ({ isActive }) => {
  const heroRootRef = useRef(null);
  const videoRefDesktop = useRef(null);
  const videoRefMobile = useRef(null);
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
    const ref = window.innerWidth >= 768 ? videoRefDesktop : videoRefMobile;
    if (!ref.current) return;

    if (runIntro) {
      try {
        ref.current.currentTime = 0;
        ref.current.play();
      } catch {
        // ignore autoplay/play errors
      }
    } else {
      ref.current.pause();
    }
  }, [runIntro]);

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
      <video
        ref={videoRefDesktop}
        className="hidden md:block w-full h-full object-cover"
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        loop
        muted
        playsInline
      />
      <video
        ref={videoRefMobile}
        className="block md:hidden w-full h-full object-cover"
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Optionnel : logo ou texte par-dessus */}
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
