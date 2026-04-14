import React, { useState } from 'react';
import githubIcon from '../assets/icone github.webp';
import soundcloudIcon from '../assets/icone soundcloud.png';

const Thanks = ({ onTestWelcome }) => {
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 text-gray-800 relative"
      style={{ backgroundColor: '#F8F8FF' }}
    >
      <h2 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900 title-sc leading-[1.1]">
        <span className="title-display">M</span>erci pour votre visite !
      </h2>
      <p className="max-w-3xl text-lg md:text-2xl leading-relaxed text-gray-600 mb-6">
        N'hésitez pas à me contacter pour toute demande de projet ou collaboration.
      </p>
      <p className="text-base md:text-lg text-gray-500">
        À très bientôt !
      </p>

      {import.meta.env.DEV && typeof onTestWelcome === 'function' && (
        <button
          type="button"
          onClick={onTestWelcome}
          className="mt-12 rounded-full bg-gray-900 px-6 py-3 text-white font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Tester l'écran de bienvenue
        </button>
      )}

      {/* Boutons centraux en bas */}
      <div className="absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 items-center gap-6 sm:gap-8">
        <a
          href="https://github.com/Hugo-Thebault"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 hover:scale-110 transition-transform duration-300 group"
          aria-label="Voir mon GitHub"
          title="pour les devs"
        >
          <img src={githubIcon} alt="GitHub" className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-105 transition-transform duration-300 block" />
        </a>

        <a
          href="https://soundcloud.com/sammmusics"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 hover:scale-110 transition-transform duration-300 group"
          aria-label="Écouter ma musique sur SoundCloud"
          title="Je fais aussi un peu de musique"
        >
          <img src={soundcloudIcon} alt="SoundCloud" className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-105 transition-transform duration-300" />
        </a>
      </div>
    </section>
  );
};

export default Thanks;
