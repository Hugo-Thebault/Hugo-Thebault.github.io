import React from 'react';

export default function Partners({ onTestWelcome }) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gray-50 text-gray-800">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Nos partenaires</h1>
      <p className="max-w-2xl text-lg md:text-xl mb-8">
        Page partenaires (contenu à compléter).
      </p>

      <button
        type="button"
        onClick={onTestWelcome}
        className="rounded-full bg-gray-900 px-6 py-3 text-white font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        Test overlay (Bienvenue)
      </button>
    </section>
  );
}
