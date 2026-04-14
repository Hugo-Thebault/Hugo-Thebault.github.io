import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import logoSrc from '../assets/LogoB.png';

const DOT_X_PCT = 0.5;
const DOT_Y_PCT = 0.5;

const Logo = () => {
  const imgRef = useRef(null);

  const updateDotVars = () => {
    const img = imgRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    const dotX = rect.left + rect.width * DOT_X_PCT;
    const dotY = rect.top + rect.height * DOT_Y_PCT;
    document.documentElement.style.setProperty('--logo-dot-x', `${dotX}px`);
    document.documentElement.style.setProperty('--logo-dot-y', `${dotY}px`);
  };

  useLayoutEffect(() => {
    updateDotVars(); 
  }, []);

  useEffect(() => {
    const onResize = () => updateDotVars();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="fixed top-0 left-0 z-50">
      <Link to="/" aria-label="Retour à l'accueil" className="inline-block">
        <img
          ref={imgRef}
          onLoad={updateDotVars}
          src={logoSrc}
          alt="Logo Hugo"
          className="md:w-32 md:h-32 w-16 h-16 object-contain drop-shadow-lg"
          draggable={false}
        />
      </Link>
    </div>
  );
};

export default Logo;