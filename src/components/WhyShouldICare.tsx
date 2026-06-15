import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PANELS = [
  {
    num: "01",
    title: "BUILT FOR MEMORY",
    desc: "Most websites are forgotten.\n\nWe create digital experiences\npeople remember.",
    align: "left",
    zOffset: -2000
  },
  {
    num: "02",
    title: "DESIGN BEFORE FEATURES",
    desc: "Features can be copied.\n\nStrong design cannot.",
    align: "right",
    zOffset: -4000
  },
  {
    num: "03",
    title: "SYSTEMS OVER SCREENS",
    desc: "We don't design pages.\n\nWe design complete experiences.",
    align: "left",
    zOffset: -6000
  },
  {
    num: "04",
    title: "BUILT TO LAST",
    desc: "Not trends.\nNot templates.\n\nTimeless digital craftsmanship.",
    align: "right",
    zOffset: -8000
  }
];

export default function WhyShouldICare() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const titleWrapperRef = useRef<HTMLDivElement>(null);
  const titleBorderRef = useRef<HTMLDivElement>(null);
  const corridorRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video Scrubbing Logic
  useEffect(() => {
    let targetTime = 0;
    let smoothedTime = 0;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!videoRef.current || isNaN(videoRef.current.duration)) return;
      
      // Map mouse X directly to video duration for 1:1 control
      const progress = e.clientX / window.innerWidth;
      targetTime = progress * videoRef.current.duration;
    };

    const render = () => {
      if (videoRef.current && !isNaN(videoRef.current.duration)) {
        // Heavy buttery smooth lerp (easing) to prevent decoder overload
        smoothedTime += (targetTime - smoothedTime) * 0.04;
        
        // Prevent unnecessary micro-updates that cause decoder stutter
        if (Math.abs(videoRef.current.currentTime - smoothedTime) > 0.05) {
          if (videoRef.current.readyState >= 2) { // HAVE_CURRENT_DATA or higher
            try {
              videoRef.current.currentTime = smoothedTime;
            } catch (e) {
              // Ignore
            }
          }
        }
      }
      rafId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    const v = videoRef.current;
    if (v) {
      v.addEventListener('loadedmetadata', () => {
        // Initialize at center if mouse hasn't moved
        targetTime = v.duration / 2;
        smoothedTime = v.duration / 2;
      });
    }

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;

    // --- Title Morph Sequence ---
    gsap.set(titleWrapperRef.current, {
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      scale: 1,
      z: 0
    });
    
    gsap.set(titleBorderRef.current, { opacity: 0, scaleX: 0 });

    // Set initial states for title and video
    gsap.set(titleBorderRef.current, { scale: 1.1, opacity: 0 });
    gsap.set(titleWrapperRef.current, { scale: 1.2, opacity: 0 });
    gsap.set(videoRef.current, { opacity: 0 });

    // Pre-set panel states to prevent FOUC
    PANELS.forEach((panel, i) => {
      const panelEl = panelRefs.current[i];
      const content = panelContentRefs.current[i];
      if (!panelEl || !content) return;

      const isLeft = panel.align === 'left';
      gsap.set(panelEl, {
        opacity: 0,
        z: -200,
        x: isLeft ? -50 : 50,
        filter: "blur(10px)",
      });

      const splitText = new SplitType(content, { types: 'lines,words,chars' });
      gsap.set(splitText.chars, { 
        opacity: 0, 
        filter: "blur(20px)", 
        y: () => gsap.utils.random(-15, 15),
        x: () => gsap.utils.random(-10, 10),
        rotationZ: () => gsap.utils.random(-5, 5)
      });
      
      // Store the splitText instance on the element for later use
      (panelEl as any)._splitText = splitText;
    });

    // Master Timeline for auto-playing the entire section
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      once: true,
      onEnter: () => {
        // Lock scroll immediately at the top of the section
        window.dispatchEvent(new CustomEvent('pause-scroll', { detail: containerRef.current }));

        const masterTl = gsap.timeline({
          onComplete: () => {
            // Unlock scroll when everything is done playing
            window.dispatchEvent(new Event('resume-scroll'));
          }
        });

        // 1. Title Sequence (Text only Fade In on black screen)
        masterTl.to(titleWrapperRef.current, {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: 'expo.out'
        }, 0);

        // 2. Hold text in center for a moment, then morph up while fading in the video and border
        const morphStartTime = 1.5;

        masterTl.to(titleWrapperRef.current, {
          top: '2.5rem',
          scale: 0.25,
          ease: "power2.inOut",
          duration: 1.5
        }, morphStartTime);
        
        masterTl.to(titleBorderRef.current, {
          opacity: 1,
          scale: 1,
          scaleX: 1,
          ease: "power2.inOut",
          duration: 1.5
        }, morphStartTime);

        masterTl.to(videoRef.current, {
          opacity: 0.5,
          duration: 2,
          ease: "power2.inOut"
        }, morphStartTime);

        masterTl.to(corridorRef.current, {
          scale: 1,
          duration: 2,
          ease: "power2.inOut"
        }, morphStartTime);

        // 3. Sequence the panels (after morph is done)
        PANELS.forEach((panel, i) => {
          const panelEl = panelRefs.current[i];
          if (!panelEl) return;
          const splitText = (panelEl as any)._splitText;

          // Stagger starting after morph finishes (1.5 + 1.5 = 3.0)
          const startTime = 3.0 + (i * 0.8);

          masterTl.to(panelEl, {
            opacity: 1,
            z: 0,
            x: 0,
            filter: "blur(0px)",
            duration: 1.5,
            ease: "power2.out"
          }, startTime);

          masterTl.to(splitText.chars, {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            x: 0,
            rotationZ: 0,
            duration: 1.2,
            stagger: 0.015,
            ease: "power3.out"
          }, startTime + 0.5);
        });
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="snap-section" style={{ width: '100%', backgroundColor: '#000', position: 'relative' }}>
      
      {/* The Pinned Viewport */}
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
          perspective: '1500px', // True 3D Camera depth
          background: '#000'
        }}
      >
        {/* Background Video */}
        <video 
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4"
          muted 
          playsInline 
          preload="auto"
          className="care-video"
          style={{ 
            position: 'absolute', 
            inset: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            zIndex: 0,
            opacity: 0.5 // Restored to lighter visibility
          }}
        />
        
        {/* Fixed Title UI - Exists OUTSIDE the moving corridor so it stays on screen */}
        <div 
          ref={titleWrapperRef}
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
            zIndex: 100
          }}
        >
          <div 
            ref={titleBorderRef}
            style={{
              position: 'absolute',
              inset: 'clamp(-1.5rem, -3vw, -2.5rem) clamp(-3rem, -6vw, -5rem)',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
              borderRadius: '100px',
              transformOrigin: 'center'
            }}
          />
          <h2 style={{
              fontSize: 'clamp(2.5rem, 10vw, 10rem)',
              fontWeight: 500,
              textTransform: 'uppercase',
              margin: 0,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              textShadow: '0 4px 12px rgba(0,0,0,0.5)',
              zIndex: 1
            }}>
            Why should I care?
          </h2>
        </div>

        {/* 3D Exhibition Room */}
        <div 
          ref={corridorRef}
          style={{ 
            position: 'absolute', 
            inset: '0', 
            transformStyle: 'preserve-3d',
            pointerEvents: 'none'
          }}
        >
          {PANELS.map((panel, i) => {
            const isLeft = panel.align === 'left';
            const isTopRow = i < 2; // Panels 0 and 1 are top row
            
            return (
              <div 
                key={i}
                ref={el => { panelRefs.current[i] = el; }}
                style={{
                  position: 'absolute',
                  top: isTopRow ? '15%' : '58%',
                  bottom: 'auto',
                  left: isLeft ? 'clamp(1rem, 5vw, 8vw)' : 'auto',
                  right: isLeft ? 'auto' : 'clamp(1rem, 5vw, 8vw)',
                  width: 'clamp(140px, 42vw, 450px)', // Better responsive width
                  // 3D Wall angle based on side
                  transform: `rotateY(${isLeft ? 12 : -12}deg)`,
                  transformOrigin: isLeft ? 'left center' : 'right center',
                  transformStyle: 'preserve-3d',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <div 
                  ref={el => { panelContentRefs.current[i] = el; }}
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 'clamp(0.5rem, 1.5vw, 1.5rem)',
                    textAlign: 'left', // Force left alignment for a clean 'down by down' reading structure
                    alignItems: 'flex-start',
                    
                    // --- Super Class Glass Effect ---
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    borderLeft: '1px solid rgba(255, 255, 255, 0.04)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.01)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.01)',
                    borderRadius: '32px',
                    padding: 'clamp(2rem, 4vw, 3rem)',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                    transform: 'translateZ(0)' // Hardware acceleration for the blur
                  }}
                >
                  <div style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1.1rem)', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.15em', fontWeight: 500 }}>
                    {panel.num}
                  </div>
                  <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 2.5rem)', fontWeight: 500, textTransform: 'uppercase', margin: 0, letterSpacing: '0.05em', lineHeight: 1.1, color: '#fff' }}>
                    {panel.title}
                  </h3>
                  <p style={{ fontSize: 'clamp(0.75rem, 1.2vw, 1.1rem)', color: '#a0a0a0', lineHeight: 1.6, margin: 0 }}>
                    {panel.desc.split('\n').map((line, idx) => (
                      <React.Fragment key={idx}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
