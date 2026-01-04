import React from 'react';
import { Link } from 'react-router-dom';

const TypePresentation1 = () => (
  <section
    id="produit-vitrine"
    className="min-h-screen flex flex-col items-center justify-center px-4 text-gray-800"
    style={{ backgroundColor: '#F8F8FF' }}
  >
    <h2 className="text-3xl md:text-4xl font-bold mb-4">Site Vitrine</h2>
    <p className="max-w-xl text-center mb-6">Un site élégant pour présenter votre activité, votre marque ou votre portfolio personnel.</p>
    <Link to="/site-vitrine" className="btn btn-primary">Découvrir un exemple</Link>
  </section>
);

export default TypePresentation1;
