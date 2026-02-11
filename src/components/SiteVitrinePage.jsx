import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import desk1 from '../assets/Site chef 1.jpg';
import desk2 from '../assets/Site chef 2.jpg';
import desk3 from '../assets/Site chef 3.jpg';
import phone1 from '../assets/Site chef phone 1.jpg';
import phone2 from '../assets/Site chef phone 2.jpg';
import phone3 from '../assets/Site chef phone 3.jpg';

const desktopShots = [desk1, desk2, desk3];
const phoneShots = [phone1, phone2, phone3];

const SiteVitrinePage = () => {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#F8F8FF' }}>
      {/* ─── Hero ─── */}
      <section className="w-full flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-gray-400 mb-4 font-semibold">
          Réalisation — Site Vitrine
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 leading-[1.05] title-sc mb-6">
          <span className="title-display">L</span>e Moulin de la Marigotière
        </h1>
        <p className="max-w-2xl text-gray-600 text-base md:text-lg leading-relaxed">
          Un site vitrine élégant conçu pour un chef traiteur d'exception.
          L'objectif&nbsp;: refléter le savoir-faire culinaire et l'identité raffinée
          de l'établissement, tout en offrant une navigation fluide sur tous les écrans.
        </p>
      </section>

      {/* ─── Photo principale (desktop 1) ─── */}
      <section className="w-full px-6 md:px-16 lg:px-28 pb-24">
        <div className="overflow-hidden rounded-2xl shadow-2xl">
          <img
            src={desk1}
            alt="Le Moulin de la Marigotière — Accueil desktop"
            className="w-full h-auto object-cover cursor-pointer hover:scale-[1.01] transition-transform duration-500"
            loading="lazy"
            draggable={false}
            onClick={() => setLightbox(desk1)}
          />
        </div>
      </section>

      {/* ─── Bloc : texte + phone mockup ─── */}
      <section className="w-full px-6 md:px-16 lg:px-28 pb-24">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="md:w-1/2 order-2 md:order-1">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight title-sc mb-5">
              <span className="title-display">U</span>ne identité sur-mesure
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4">
              Chaque page a été pensée pour mettre en valeur les créations du chef&nbsp;:
              photographies plein cadre, typographies soignées et palette de couleurs
              qui évoquent l'univers gastronomique haut de gamme.
            </p>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Le site s'adapte parfaitement aux mobiles pour toucher une clientèle
              connectée, que ce soit pour découvrir la carte, réserver une prestation
              ou simplement s'inspirer.
            </p>
          </div>

          {/* Phone mockup */}
          <div className="md:w-1/2 order-1 md:order-2 flex justify-center">
            <div
              className="relative rounded-[2.5rem] border-[6px] border-gray-900 bg-gray-900 shadow-2xl overflow-hidden cursor-pointer hover:shadow-3xl transition-shadow duration-300"
              style={{ width: 'clamp(200px, 28vw, 300px)' }}
              onClick={() => setLightbox(phone1)}
            >
              <img
                src={phone1}
                alt="Le Moulin de la Marigotière — Vue mobile"
                className="w-full h-auto object-cover"
                loading="lazy"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Galerie desktop (2 captures restantes) ─── */}
      <section className="w-full px-6 md:px-16 lg:px-28 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[desk2, desk3].map((src, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl shadow-xl cursor-pointer group"
              onClick={() => setLightbox(src)}
            >
              <img
                src={src}
                alt={`Le Moulin de la Marigotière — Desktop ${i + 2}`}
                className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ─── Galerie mobile (3 captures) ─── */}
      <section className="w-full px-6 md:px-16 lg:px-28 pb-24">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight title-sc mb-10 text-center">
          <span className="title-display">E</span>xpérience mobile
        </h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {phoneShots.map((src, i) => (
            <div
              key={i}
              className="relative rounded-[2.5rem] border-[6px] border-gray-900 bg-gray-900 shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow duration-300"
              style={{ width: 'clamp(140px, 20vw, 220px)' }}
              onClick={() => setLightbox(src)}
            >
              <img
                src={src}
                alt={`Le Moulin de la Marigotière — Mobile ${i + 1}`}
                className="w-full h-auto object-cover"
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ─── Fiche technique ─── */}
      <section className="w-full px-6 md:px-16 lg:px-28 pb-24">
        <div className="max-w-3xl mx-auto border border-gray-200 rounded-2xl p-8 md:p-12 bg-white/60 backdrop-blur-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 title-sc mb-6 text-center">
            <span className="title-display">D</span>étails du projet
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-gray-700 text-base">
            <div><span className="font-semibold text-gray-900">Client</span><br />Le Moulin de la Marigotière</div>
            <div><span className="font-semibold text-gray-900">Type</span><br />Site vitrine responsive</div>
            <div><span className="font-semibold text-gray-900">Secteur</span><br />Restauration / Traiteur</div>
            <div><span className="font-semibold text-gray-900">Technologies</span><br />React, Tailwind CSS, Vite</div>
          </div>
        </div>
      </section>

      {/* ─── Retour ─── */}
      <section className="w-full flex justify-center pb-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border-2 border-gray-800/60 bg-transparent px-8 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-900/5 hover:border-gray-900/80 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour au portfolio
        </Link>
      </section>

      {/* ─── Lightbox ─── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Agrandissement photo"
        >
          <img
            src={lightbox}
            alt="Agrandissement"
            className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl object-contain"
            draggable={false}
          />
          <button
            type="button"
            className="absolute top-6 right-6 text-white/80 hover:text-white text-3xl font-light leading-none"
            onClick={() => setLightbox(null)}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default SiteVitrinePage;
