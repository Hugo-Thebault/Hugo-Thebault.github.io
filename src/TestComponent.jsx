import React from 'react';

const TestComponent = () => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-primary">Hello Tailwind 4!</h1>
          <p className="py-6 text-base-content">
            Tailwind CSS 4 et DaisyUI 5 sont maintenant installés et configurés.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="btn btn-primary">Primary</button>
            <button className="btn btn-secondary">Secondary</button>
            <button className="btn btn-outline">Outline</button>
          </div>
          <div className="mt-6">
            <div className="card w-full bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Test Card DaisyUI 5</h2>
                <p>Cette carte teste les nouveaux composants de DaisyUI 5</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-sm btn-primary">Action</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;
