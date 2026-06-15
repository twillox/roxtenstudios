import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function Home({ onComplete }: { onComplete?: () => void }) {
  const mainWrapperRef = useRef<HTMLDivElement>(null);
  const cameraContainerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const lightBeamRef = useRef<HTMLDivElement>(null);
  
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const uiRefs = useRef<(HTMLElement | null)[]>([]);

  useGSAP(() => {
    if (!mainWrapperRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // Initial strict states
    gsap.set(gridRef.current, { opacity: 0 });
    gsap.set(lightBeamRef.current, { xPercent: -100 });
    gsap.set(letterRefs.current, { 
      opacity: 0, 
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      y: 20
    });
    // Start zoomed in to allow a dramatic pull-back
    gsap.set(cameraContainerRef.current, { scale: 1.4 });
    // Hide UI elements initially
    gsap.set(uiRefs.current, { opacity: 0, y: 10 });

    // Phase 1: Hold briefly on pure black, then grid points slowly appear
    tl.to(gridRef.current, {
      opacity: 0.15,
      duration: 1.5,
      ease: "power2.inOut"
    }, "+=0.2");

    // Phase 2: Cinematic volumetric light sweep begins
    tl.to(lightBeamRef.current, {
      xPercent: 100,
      duration: 2.5,
      ease: "power2.inOut"
    }, "+=0.2");

    // Phase 3: Assembly from geometric fragments
    tl.to(letterRefs.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: "expo.out"
    }, "<0.3");

    // Phase 4 & 5: The Pull-Back & Elegant UI Reveal
    tl.to(cameraContainerRef.current, {
      scale: 1,
      duration: 4,
      ease: "power2.inOut"
    }, "+=0.5");

    tl.to(uiRefs.current, {
      opacity: 1,
      y: 0,
      duration: 2,
      stagger: 0.2,
      ease: "power2.out"
    }, "-=2.5"); // Start revealing UI as the camera finishes pulling back

    // Fade out light beam to clean up the screen
    tl.to(lightBeamRef.current, {
      opacity: 0,
      duration: 1
    }, "-=2");

  }, { scope: mainWrapperRef });

  return (
    <div 
      ref={mainWrapperRef}
      style={{ 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 100,
        padding: '2.5rem 4vw'
      }}
    >
      {/* Tiny architectural grid points */}
      <div 
        ref={gridRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          backgroundPosition: 'center center',
          zIndex: 0
        }}
      />

      {/* Cinematic Volumetric Light Sweep Container */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div 
          ref={lightBeamRef}
          style={{
            width: '30vw',
            height: '100vh',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.03) 50%, transparent)',
            transform: 'skewX(-15deg)',
            filter: 'blur(20px)'
          }}
        />
      </div>

      {/* Top Navigation */}
      <nav 
        ref={el => { uiRefs.current[0] = el; }}
        style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between', 
          zIndex: 2,
          textTransform: 'uppercase',
          fontSize: 'clamp(0.65rem, 1.5vw, 0.85rem)',
          letterSpacing: '0.1em',
          fontWeight: 500,
          color: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', gap: 'clamp(0.8rem, 3vw, 2rem)' }}>
          <span style={{ cursor: 'pointer' }}>Work</span>
          <span style={{ cursor: 'pointer' }}>Process</span>
        </div>
        <div style={{ display: 'flex', gap: 'clamp(0.8rem, 3vw, 2rem)' }}>
          <span style={{ cursor: 'pointer' }}>Studio</span>
          <span style={{ cursor: 'pointer' }}>Contact</span>
        </div>
      </nav>

      {/* Main Camera Container for Zoom Out */}
      <div 
        ref={cameraContainerRef}
        style={{ 
          position: 'absolute', 
          inset: 0, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <h1 style={{ 
            fontSize: 'clamp(3rem, 15vw, 15rem)', 
            fontWeight: 500, 
            letterSpacing: '-0.02em', 
            lineHeight: 0.8,
            margin: 0,
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            textAlign: 'center'
          }}>
            {['R', 'O', 'X', 'T', 'E', 'N'].map((char, i) => (
              <span 
                key={i} 
                ref={el => { letterRefs.current[i] = el; }}
                style={{ display: 'inline-block' }}
              >
                {char}
              </span>
            ))}
          </h1>
          
          {/* Sub-typography */}
          <div 
            ref={el => { uiRefs.current[1] = el; }}
            style={{
              color: '#ffffff',
              fontSize: 'clamp(0.6rem, 1.5vw, 1.5rem)',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: 'clamp(0.6em, 1.2em, 1.2em)',
              marginRight: 'calc(clamp(0.6em, 1.2em, 1.2em) * -1)', // Offset tracking dynamically
              marginTop: 'clamp(1rem, 3vw, 2.5rem)',
              opacity: 0,
              textAlign: 'center'
            }}
          >
            Studios
          </div>
        </div>
      </div>

      {/* Bottom Brand Statement */}
      <footer 
        ref={el => { uiRefs.current[2] = el; }}
        style={{ 
          zIndex: 2,
          color: '#888888',
          fontSize: 'clamp(0.6rem, 2vw, 0.9rem)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          fontWeight: 400,
          textAlign: 'center',
          width: '100%'
        }}
      >
        Creative technology studio.
      </footer>

    </div>
  );
}
