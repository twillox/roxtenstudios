import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STATEMENTS = [
  { num: "01", text: "EVERYONE BUILDS WEBSITES.", duration: 15 },
  { num: "02", text: "WE BUILD SYSTEMS.", duration: 15 },
  { num: "03", text: "SYSTEMS CREATE BRANDS.", duration: 25 },
  { num: "04", text: "BRANDS CREATE CULTURE.", duration: 15 },
  { num: "05", text: "CULTURE CREATES GROWTH.", duration: 15 },
];

export default function Philosophy({ onComplete }: { onComplete?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stmtRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finalRef = useRef<HTMLDivElement>(null);
  const replayBtnRef = useRef<HTMLButtonElement>(null);
  
  const hasPlayed = useRef(false);
  const masterTlRef = useRef<gsap.core.Timeline | null>(null);

  const handleReplay = () => {
    if (!masterTlRef.current) return;
    
    // Fade out current state
    gsap.to([finalRef.current, replayBtnRef.current], { opacity: 0, pointerEvents: 'none', duration: 0.3, onComplete: () => {
      masterTlRef.current?.restart();
    }});
  };

  useGSAP(() => {
    if (!containerRef.current) return;

    // Real-time Glitch IN Animation (No Jiggle)
    const playGlitchIn = (el: Element | null) => {
      const tl = gsap.timeline();
      if (!el) return tl;
      const h2 = el.querySelector('h2');
      const num = el.querySelector('.stmt-num');
      
      tl.set(el, { opacity: 1, zIndex: 10 });
      
      if (num) tl.fromTo(num, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 0);
      
      if (h2) {
        // Slow vertical drift (calm float)
        tl.fromTo(el, { y: 20 }, { y: -10, duration: 3, ease: "none" }, 0);
        
        // The Fade In
        tl.fromTo(h2, { opacity: 0, filter: "blur(20px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.5 }, 0);
        
        // Digital Glitch Stutter (Pure Opacity & Blur, No Jiggle)
        tl.to(h2, { opacity: 0.1, filter: "blur(5px)", duration: 0.05 }, 0.1);
        tl.to(h2, { opacity: 1, filter: "blur(0px)", duration: 0.05 }, 0.15);
        tl.to(h2, { opacity: 0.4, filter: "blur(2px)", duration: 0.05 }, 0.2);
        tl.to(h2, { opacity: 0.9, filter: "blur(0px)", duration: 0.05 }, 0.25);
        tl.to(h2, { opacity: 1, filter: "blur(0px)", duration: 0.05 }, 0.3);
      }
      return tl;
    };

    // Calm Fade OUT Animation
    const playFadeOut = (el: Element | null) => {
      const tl = gsap.timeline();
      if (!el) return tl;
      const h2 = el.querySelector('h2');
      const num = el.querySelector('.stmt-num');
      
      tl.set(el, { zIndex: 1 });
      if (num) tl.to(num, { opacity: 0, y: -10, duration: 0.3 }, 0);
      
      if (h2) {
        // Calmly dissolve away
        tl.to(h2, { opacity: 0, filter: "blur(20px)", duration: 0.5, ease: "power2.inOut" }, 0);
      }
      tl.to(el, { opacity: 0, duration: 0.1 }, 0.5); // Hide container
      return tl;
    };

    // --- Master Auto-playing Sequence ---
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      once: true,
      onEnter: () => {
        gsap.set(finalRef.current, { opacity: 0 });
        gsap.set(replayBtnRef.current, { opacity: 0, pointerEvents: 'none' });

        const masterTl = gsap.timeline({
          onComplete: () => {
            gsap.killTweensOf(finalRef.current);
            gsap.to(finalRef.current, { opacity: 1, duration: 0.5 });
            gsap.to(replayBtnRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.5 });
            
            if (onComplete && !hasPlayed.current) onComplete();
            hasPlayed.current = true;
          }
        });
        
        masterTlRef.current = masterTl;

        STATEMENTS.forEach((_, i) => {
          const el = stmtRefs.current[i];
          if (el) gsap.set(el, { opacity: 0 });
          
          const startTime = i * 2.2; // 2.2 seconds per statement
          masterTl.add(playGlitchIn(el), startTime);
          masterTl.add(playFadeOut(el), startTime + 1.8);
        });
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="snap-section" style={{ width: '100%', backgroundColor: '#000', position: 'relative' }}>
      <div 
        ref={pinRef} 
        style={{ 
          height: '100vh', 
          width: '100vw', 
          position: 'relative', 
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          background: '#000'
        }}
      >
        
        {/* The 5 Process Statements */}
        {STATEMENTS.map((stmt, i) => (
          <div 
            key={i}
            ref={el => { stmtRefs.current[i] = el; }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              padding: '0 5vw',
              opacity: 0
            }}
          >
            <div className="stmt-num" style={{ 
              fontSize: '1rem', 
              color: 'rgba(255,255,255,0.4)', 
              letterSpacing: '0.15em', 
              marginBottom: '2rem'
            }}>
              {stmt.num}
            </div>
            <h2 style={{ 
              fontSize: 'clamp(1.5rem, 5vw, 6rem)', 
              fontWeight: 500, 
              textTransform: 'uppercase', 
              textAlign: 'center',
              margin: 0, 
              lineHeight: 1.1,
              maxWidth: '90vw'
            }}>
              {stmt.text}
            </h2>
          </div>
        ))}

        <div 
          ref={finalRef}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none', // parent doesn't block
            padding: '0 5vw',
            opacity: 0
          }}
        >
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 5vw, 6rem)', 
            fontWeight: 500, 
            textTransform: 'uppercase', 
            textAlign: 'center',
            margin: 0, 
            lineHeight: 1.1,
            color: '#fff',
            maxWidth: '90vw'
          }}>
            THAT IS THE ROXTEN PROCESS.
          </h2>
          
          <button
            ref={replayBtnRef}
            onClick={handleReplay}
            style={{
              marginTop: '3rem',
              padding: '1rem 2.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              borderRadius: '100px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '0.8rem',
              cursor: 'pointer',
              opacity: 0,
              pointerEvents: 'none',
              backdropFilter: 'blur(10px)',
              transition: 'background 0.3s ease, border-color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Replay Process
          </button>
        </div>

      </div>
    </section>
  );
}
