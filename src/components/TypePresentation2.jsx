import React from 'react';
import { Link } from 'react-router-dom';

const TypePresentation2 = () => (
  <section className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-4">
    <h2 className="text-3xl md:text-4xl font-bold mb-4">Site E-commerce</h2>
    <p className="max-w-xl text-center mb-6">Une boutique en ligne moderne, rapide et sécurisée pour vendre vos produits.</p>
    <Link to="/site-ecommerce" className="btn btn-primary">Découvrir un exemple</Link>
  </section>
);

export default TypePresentation2;
