import React, { useState, useEffect, useRef } from 'react';

const socialLinks = [
  {
    href: 'https://instagram.com/',
    label: 'Instagram',
    icon: (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
      </svg>
    ),
  },
  {
    href: 'https://github.com/',
    label: 'GitHub',
    icon: (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.203 2.397.1 2.65.64.699 1.028 1.593 1.028 2.686 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.578.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
      </svg>
    ),
  },
  {
    href: 'https://linkedin.com/',
    label: 'LinkedIn',
    icon: (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.599v5.597z" />
      </svg>
    ),
  },
];

const AboutMe = () => {
  const [showBubbles, setShowBubbles] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => {
    if (showBubbles) {
      setVisible(true);
      timeoutRef.current = setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      timeoutRef.current = setTimeout(() => setVisible(false), 400);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [showBubbles]);

  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-50 text-gray-800 px-4 md:px-36">
      <div className="flex-shrink-0 flex justify-center md:w-[28.75rem] md:h-[48.75rem] w-[16rem] h-[25rem] mt-0 md:mt-0 relative">
        <div className="w-full h-full flex items-center justify-center relative">
          <img
            src="/src/assets/MoiARefaire.png"
            alt="Portrait Hugo"
            className="rounded-xl md:w-[28.75rem] md:h-[48.75rem] w-[16rem] h-[25rem] object-cover shadow-xl"
          />
          <div
            className="absolute"
            style={{
              top: '83%',
              left: '40%',
              transform: 'translate(-30%, -60%)',
              width: '35%',
              height: '25%',
              borderRadius: '40%',
              cursor: 'pointer',
              zIndex: 10,
            }}
            onMouseEnter={() => setShowBubbles(true)}
            onMouseLeave={() => setShowBubbles(false)}
          >
          </div>
          {visible && (
            <div
              className="absolute z-20"
              style={{
                top: '57%',
                left: '43%',
                transform: 'translateX(-50%)',
                width: '180px',
                height: '100px',
                pointerEvents: 'auto',
              }}
              onMouseEnter={() => setShowBubbles(true)}
              onMouseLeave={() => setShowBubbles(false)}
            >
              {socialLinks.map((link, i) => {
                const angle = (-60 + i * 60) * (Math.PI / 180);
                const radius = 60;
                const progress = animate ? 1 : 0;
                const x = 90 + Math.cos(angle - Math.PI / 2) * radius * progress;
                const y = 80 + Math.sin(angle - Math.PI / 2) * radius * progress;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 shadow-lg rounded-full p-3 flex items-center justify-center text-xl hover:bg-blue-500 hover:text-white transition-all duration-300 pointer-events-auto"
                    style={{
                      position: 'absolute',
                      left: `${x}px`,
                      top: `${y}px`,
                      opacity: animate ? 1 : 0,
                      transition: 'left 0.4s cubic-bezier(.5,1.5,.5,1), top 0.4s cubic-bezier(.5,1.5,.5,1), opacity 0.2s',
                    }}
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="block md:hidden h-16" />
      <div className="hidden md:block flex-grow" />
      <div className="flex-shrink-0 flex flex-col justify-start w-11/12 md:w-[28.75rem] md:h-[48.75rem]">
      <div className="w-full h-full flex flex-col justify-start text-justify gap-12">
          <h2 className="text-4xl md:text-5xl font-semibold title-sc w-full">Bienvenue sur mon portefolio</h2>
          <p className="text-xl md:text-2xl font-medium w-full">
            Moi c'est Hugo, j'ai 25 ans et je suis développeur de site internet.<br />
            Créer des sites est devenu une passion et je me ferai un plaisir de créer le vôtre !
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
