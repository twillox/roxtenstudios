import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const services = [
  { num: '01', title: 'DESIGN', desc: 'Crafting meaningful visual experiences that connect.' },
  { num: '02', title: 'DEVELOPMENT', desc: 'Building fast, scalable and future-ready digital products.' },
  { num: '03', title: 'BRANDING', desc: 'Creating identities that are distinct, timeless and iconic.' },
  { num: '04', title: 'INTERACTION', desc: 'Designing intuitive interactions that feel natural and effortless.' },
  { num: '05', title: 'MOTION', desc: 'Bringing ideas to life through purposeful motion and rhythm.' },
  { num: '06', title: 'SYSTEMS', desc: 'Building design systems that scale and create consistency.' }
];

const GlitchText = ({ text, containerClass, style }: { text: React.ReactNode, containerClass: string, style?: React.CSSProperties }) => (
  <div className={containerClass} style={{ position: 'relative', display: 'inline-block', ...style }}>
    <div className="glitch-base" style={{ opacity: 0 }}>{text}</div>
    <div className="glitch-slice1" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 40%)', opacity: 0, color: 'rgba(255,255,255,0.9)' }} aria-hidden="true">{text}</div>
    <div className="glitch-slice2" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, clipPath: 'polygon(0 40%, 100% 40%, 100% 70%, 0 70%)', opacity: 0, color: 'rgba(255,255,255,0.8)' }} aria-hidden="true">{text}</div>
  </div>
);

function addGlitchToTimeline(tl: gsap.core.Timeline, targetClass: string, startTime: string | number) {
  const base = `${targetClass} .glitch-base`;
  const s1 = `${targetClass} .glitch-slice1`;
  const s2 = `${targetClass} .glitch-slice2`;
  
  const dur = 1.0;

  tl.fromTo([base, s1, s2], 
    { opacity: 0, filter: "blur(15px)" },
    { opacity: 1, filter: "blur(4px)", duration: dur * 0.3, ease: "power2.out" },
    startTime
  );

  tl.to(s1, {
    x: () => gsap.utils.random(-2, 2),
    opacity: () => gsap.utils.random(0.6, 0.9),
    duration: 0.08, repeat: Math.floor(dur * 6), yoyo: true, ease: "steps(1)"
  }, `<`);

  tl.to(s2, {
    x: () => gsap.utils.random(-3, 3),
    opacity: () => gsap.utils.random(0.5, 0.8),
    duration: 0.12, repeat: Math.floor(dur * 4), yoyo: true, ease: "steps(1)"
  }, `<`);

  tl.to(base, { filter: "blur(0px)", opacity: 1, duration: dur * 0.3, ease: "power2.inOut" }, `+=${dur * 0.4}`);
  tl.to([s1, s2], { x: 0, filter: "blur(0px)", opacity: 0, duration: dur * 0.3, ease: "power2.inOut" }, `<`);
}

export default function AboutUs() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        window.dispatchEvent(new Event('resume-scroll'));
      },
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 5%", 
        once: true,
        onEnter: () => {
          window.dispatchEvent(new CustomEvent('pause-scroll', { detail: containerRef.current }));
        }
      }
    });

    // 1. Grid lines fade in
    tl.to(containerRef.current, {
      "--border-color": "rgba(255,255,255,0.1)",
      duration: 1.5,
      ease: "power2.inOut"
    });

    // 2. Heading appears with slow glitch
    addGlitchToTimeline(tl, ".reveal-heading", "-=0.5");

    // 3. Description appears
    addGlitchToTimeline(tl, ".reveal-desc", "+=0.2");

    // 4. Portrait fades in
    tl.fromTo(".reveal-portrait", 
      { opacity: 0, filter: "blur(10px)" }, 
      { opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power2.out" },
      "-=0.5"
    );

    // 5. Service blocks reveal sequentially
    services.forEach((_, i) => {
      const startTime = i === 0 ? "-=0.5" : "-=0.8"; // Stagger them
      
      tl.fromTo(`.service-block-${i}`, 
        { opacity: 0 }, 
        { opacity: 1, duration: 1, ease: "power2.out" }, 
        startTime
      );
      
      addGlitchToTimeline(tl, `.reveal-service-${i}`, startTime);
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="editorial-section">
      <style>{`
        .editorial-section {
          --border-color: rgba(255,255,255,0);
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #000;
          color: #fff;
          border-top: 1px solid var(--border-color);
          overflow: hidden;
        }
        .editorial-row-top {
          display: flex;
          flex: 1;
          border-bottom: 1px solid var(--border-color);
        }
        .editorial-col-left {
          flex: 5;
          border-right: 1px solid var(--border-color);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .editorial-col-mid {
          flex: 2;
          border-right: 1px solid var(--border-color);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .editorial-col-right {
          flex: 3;
          position: relative;
          overflow: hidden;
        }
        .editorial-row-bottom {
          display: flex;
          min-height: 30vh;
        }
        .editorial-service {
          flex: 1;
          border-right: 1px solid var(--border-color);
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }
        .editorial-service:last-child {
          border-right: none;
        }

        @media (max-width: 1024px) {
          .editorial-row-top {
            flex-direction: column;
          }
          .editorial-col-left, .editorial-col-mid, .editorial-col-right {
            border-right: none;
            border-bottom: 1px solid var(--border-color);
            width: 100%;
          }
          .editorial-col-right {
            min-height: 50vh;
          }
          .editorial-row-bottom {
            flex-direction: column;
          }
          .editorial-service {
            border-right: none;
            border-bottom: 1px solid var(--border-color);
            min-height: 25vh;
          }
          .editorial-service:last-child {
            border-bottom: none;
          }
        }
      `}</style>

      {/* Top Content Row */}
      <div className="editorial-row-top">
        
        {/* Left Column: Massive Heading */}
        <div className="editorial-col-left">
          <div style={{ fontSize: '0.8rem', letterSpacing: '0.1em', opacity: 0.8 }}>[ ABOUT ]</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', marginTop: '4rem', marginBottom: '4rem' }}>
            <GlitchText 
              containerClass="reveal-heading" 
              text={<>ROXTEN<br/>STUDIOS</>} 
              style={{ fontSize: 'clamp(3.5rem, 12vw, 16rem)', lineHeight: 0.85, margin: 0, fontWeight: 500, letterSpacing: '-0.02em', textTransform: 'uppercase' }} 
            />
          </div>
        </div>

        {/* Middle Column: Description */}
        <div className="editorial-col-mid">
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>01</div>
          <div style={{ margin: '4rem 0' }}>
            <GlitchText 
              containerClass="reveal-desc" 
              text={<>We create digital experiences that combine design, technology and motion into memorable brands, products and systems. <span style={{ opacity: 0.5 }}>_</span></>} 
              style={{ fontSize: 'clamp(1.2rem, 1.8vw, 2.5rem)', lineHeight: 1.4, fontWeight: 400 }} 
            />
          </div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', lineHeight: 1.6 }}>
            INDIA • WORLDWIDE<br/>
            EST. 2026
          </div>
        </div>

        {/* Right Column: Monochrome Portrait */}
        <div className="editorial-col-right">
          <div style={{ position: 'absolute', top: '2rem', right: '2rem', fontSize: '0.8rem', zIndex: 10 }}>RXTN®</div>
          <img src="/portrait.png" className="reveal-portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Editorial Portrait" />
        </div>

      </div>

      {/* Bottom Service Row */}
      <div className="editorial-row-bottom">
        {services.map((service, i) => (
          <div key={i} className={`editorial-service service-block-${i}`}>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '3rem' }}>
              {service.num}
            </div>
            
            <GlitchText 
              containerClass={`reveal-service-${i}`} 
              text={service.title} 
              style={{ fontSize: 'clamp(1rem, 1.5vw, 2rem)', letterSpacing: '0.05em', marginBottom: '1rem' }} 
            />
            
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginTop: 'auto' }}>
              {service.desc}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
