import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import Home from './components/Home';
import WhyShouldICare from './components/WhyShouldICare';
import Philosophy from './components/Philosophy';
import ProjectsGallery from './components/ProjectsGallery';
import AboutUs from './components/AboutUs';
import StartProject from './components/StartProject';
import Footer from './components/Footer';

export default function App() {
  // stage 0: Initial Load (Home)
  // stage 1: Home Complete (WhyShouldICare added)
  // stage 2: WhyShouldICare Complete (Philosophy added)
  // stage 3: Philosophy Complete (Full Site Unlocked)
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* The Intro & Home Sequence */}
      <Home onComplete={() => setStage(prev => Math.max(prev, 1))} />
      
      {stage >= 1 && (
        <WhyShouldICare onComplete={() => setStage(prev => Math.max(prev, 2))} />
      )}

      {stage >= 2 && (
        <Philosophy onComplete={() => setStage(prev => Math.max(prev, 3))} />
      )}

      {stage >= 3 && (
        <>
          {/* Selected Works Intro - STARK WHITE EDITORIAL SPREAD */}
          <div className="snap-section" style={{ backgroundColor: '#fff', color: '#000', padding: '25vh 5vw 15vh 5vw', borderTop: '1px solid #111', position: 'relative' }}>
            <div style={{ fontSize: '0.8rem', letterSpacing: '0.2em', opacity: 0.6, marginBottom: '3rem', fontWeight: 500 }}>
              [ 04 — ROXTEN ARCHIVES ]
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
              <h2 style={{ fontSize: 'clamp(4rem, 12vw, 14rem)', textTransform: 'uppercase', margin: 0, fontWeight: 500, lineHeight: 0.85, letterSpacing: '-0.04em' }}>
                Selected<br/>Works
              </h2>
              <div style={{ textAlign: 'left', fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', opacity: 0.6, lineHeight: 1.5, maxWidth: '300px' }}>
                A curated selection of our most impactful digital experiences, platforms, and brand identities.
              </div>
            </div>
          </div>

          {/* Selected Works Gallery Grid */}
          <ProjectsGallery />

          {/* About Us Ideology Statements */}
          <AboutUs />

          {/* Spacer Gap */}
          <div style={{ height: '20vh', backgroundColor: '#000' }}></div>

          {/* Start Project Consultation Engine */}
          <StartProject />

          {/* Final Footer */}
          <Footer />
        </>
      )}
    </>
  );
}
