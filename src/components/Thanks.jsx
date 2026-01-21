import React from 'react';

const Thanks = ({ onTestWelcome }) => (
  <section
    className="min-h-screen flex flex-col items-center justify-center text-center px-4 text-gray-800"
    style={{ backgroundColor: '#F8F8FF' }}
  >
    <h2 className="text-4xl md:text-5xl font-bold mb-6">Merci pour votre visite !</h2>
    <p className="max-w-2xl text-lg md:text-xl mb-8">N'hésitez pas à me contacter pour toute demande de projet ou collaboration. À très bientôt !</p>

    {import.meta.env.DEV && typeof onTestWelcome === 'function' && (
      <button
        type="button"
        onClick={onTestWelcome}
        className="rounded-full bg-gray-900 px-6 py-3 text-white font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        Tester l’écran de bienvenue
      </button>
    )}
    {/* Ajoute ici un effet spécial ou une animation si tu veux */}
  </section>
);

export default Thanks;
