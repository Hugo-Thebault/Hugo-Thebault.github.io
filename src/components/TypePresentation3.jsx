import React from 'react';
import { Link } from 'react-router-dom';

import entrepriseImg from '../assets/entreprisePresentation.png';

const TypePresentation3 = () => (
  <section
    id="produit-entreprise"
    className="min-h-screen flex items-center justify-center px-6 py-16 text-gray-800"
    style={{ backgroundColor: '#F8F8FF' }}
  >
    <div className="w-full max-w-none md:px-10 lg:px-20">
      <div className="w-full flex flex-col md:flex-row md:items-stretch md:justify-between gap-10">
        <div className="md:order-1 flex justify-center md:justify-start">
          <img
            src={entrepriseImg}
            alt="Site application"
            className="w-11/12 sm:w-full max-w-xs sm:max-w-sm md:max-w-sm lg:max-w-md h-auto rounded-3xl shadow-2xl object-cover"
            loading="lazy"
            draggable={false}
          />
        </div>

        <div className="md:order-2 md:ml-auto md:text-right flex flex-col md:self-stretch md:justify-between">
          <div className="w-fit max-w-[28rem] self-end">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900 leading-[1.05] title-sc">
              <span className="title-display">S</span>ite Application
            </h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed w-full">
              Des applications web interactives et sur-mesure pour répondre à tous vos besoins.
            </p>
          </div>

          <div className="mt-8 md:mt-0 md:flex md:justify-end">
            <Link
              to="/site-application"
              className="inline-flex items-center justify-center rounded-full border-2 border-gray-800/60 bg-transparent px-6 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-900/5 hover:border-gray-900/80 transition"
            >
              Découvrir un exemple
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default TypePresentation3;
