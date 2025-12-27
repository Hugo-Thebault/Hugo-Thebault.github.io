import React from 'react';



import { useRef, useEffect } from 'react';

const HeroVideo = ({ isActive }) => {
  const videoRefDesktop = useRef(null);
  const videoRefMobile = useRef(null);

  useEffect(() => {
    const ref = window.innerWidth >= 768 ? videoRefDesktop : videoRefMobile;
    if (!ref.current) return;
    if (isActive) {
      ref.current.currentTime = 0;
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isActive]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black relative">
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
    </div>
  );
};

export default HeroVideo;
