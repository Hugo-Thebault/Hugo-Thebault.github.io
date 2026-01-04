import React from 'react';
import { Link } from 'react-router-dom';

const TypePresentation3 = () => (
  <section
    id="produit-entreprise"
    className="min-h-screen flex flex-col items-center justify-center px-4 text-gray-800"
    style={{ backgroundColor: '#F8F8FF' }}
  >
    <h2 className="text-3xl md:text-4xl font-bold mb-4">Site Application</h2>
    <p className="max-w-xl text-center mb-6">Des applications web interactives et sur-mesure pour répondre à tous vos besoins.</p>
    <Link to="/site-application" className="btn btn-primary">Découvrir un exemple</Link>
  </section>
);

export default TypePresentation3;
