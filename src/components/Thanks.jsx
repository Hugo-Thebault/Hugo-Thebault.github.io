import React, { useState } from 'react';
import soundcloudIcon from '../assets/icone soundcloud.png';

const Thanks = ({ onTestWelcome }) => {
  const [hovered, setHovered] = useState(false);
  const [hoveredGithub, setHoveredGithub] = useState(false);

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

      {/* Bouton GitHub — positionné dans la section, bas gauche */}
      <div className="absolute bottom-10 left-20 z-30 flex flex-col items-center">
        {/* Texte au hover */}
        <div
          className={`absolute bottom-[34px] pointer-events-none transition-opacity duration-300 ${
            hoveredGithub ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ width: '240px', height: '90px' }}
        >
          <svg
            viewBox="0 0 240 90"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <path id="arc-github" d="M 30,70 A 110,110 0 0,1 210,70" fill="none" />
            </defs>
            <text fontSize="12" fontWeight="600" fill="#374151" textAnchor="middle" fontFamily="'Maven Pro', sans-serif">
              <textPath href="#arc-github" startOffset="50%">pour les devs</textPath>
            </text>
          </svg>
        </div>

        {/* Bouton */}
        <a
          href="https://github.com/Hugo-Thebault"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-16 h-16 hover:scale-110 transition-all duration-300"
          onMouseEnter={() => setHoveredGithub(true)}
          onMouseLeave={() => setHoveredGithub(false)}
          aria-label="Voir mon GitHub"
        >
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.203 2.397.1 2.65.64.699 1.028 1.593 1.028 2.686 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.578.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
          </svg>
        </a>
      </div>

      {/* Bouton SoundCloud — positionné dans la section, bas droite */}
      <div className="absolute bottom-10 right-20 z-30 flex flex-col items-center">
        {/* Texte en arc au hover */}
        <div
          className={`absolute bottom-[60px] pointer-events-none transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ width: '240px', height: '90px' }}
        >
          <svg
            viewBox="0 0 240 90"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <path id="arc-top" d="M 30,60 A 200,200 0 0,1 210,60" fill="none" />
              <path id="arc-bottom" d="M 30,78 A 200,200 0 0,1 210,78" fill="none" />
            </defs>
            <text fontSize="12" fontWeight="600" fill="#374151" textAnchor="middle" fontFamily="'Maven Pro', sans-serif">
              <textPath href="#arc-top" startOffset="50%">Je fais aussi un peu de musique</textPath>
            </text>
            <text fontSize="12" fontWeight="600" fill="#374151" textAnchor="middle" fontFamily="'Maven Pro', sans-serif">
              <textPath href="#arc-bottom" startOffset="50%">si ça vous intéresse !</textPath>
            </text>
          </svg>
        </div>

        {/* Bouton */}
        <a
          href="https://soundcloud.com/sammmusics"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-16 h-16 hover:scale-110 transition-all duration-300"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label="Écouter ma musique sur SoundCloud"
        >
          <img src={soundcloudIcon} alt="SoundCloud" className="w-full h-full object-contain" />
        </a>
      </div>
    </section>
  );
};

export default Thanks;
