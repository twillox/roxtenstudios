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
  const [isIntroComplete, setIsIntroComplete] = useState(false);

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

    if (!isIntroComplete) {
      lenis.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis.start();
      document.body.style.overflow = '';
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    }

    const handlePause = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const target = customEvent.detail as HTMLElement;
        const top = target.getBoundingClientRect().top + window.scrollY;
        lenis.scrollTo(top, { immediate: true });
      }
      lenis.stop();
    };
    const handleResume = () => {
      lenis.start();
    };

    window.addEventListener('pause-scroll', handlePause);
    window.addEventListener('resume-scroll', handleResume);

    return () => {
      window.removeEventListener('pause-scroll', handlePause);
      window.removeEventListener('resume-scroll', handleResume);
      lenis.destroy();
    };
  }, [isIntroComplete]);

  return (
    <>
      {/* The Intro & Home Sequence */}
      <Home onComplete={() => setIsIntroComplete(true)} />
      
      {/* The 3D Corridor */}
      <WhyShouldICare />

      {/* The Roxten Process Typography Sequence */}
      <Philosophy />

      {/* Selected Works Intro - STARK WHITE EDITORIAL SPREAD */}
      <div style={{ backgroundColor: '#fff', color: '#000', padding: '25vh 5vw 15vh 5vw', borderTop: '1px solid #111', position: 'relative' }}>
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
  );
}
