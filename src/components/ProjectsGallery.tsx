import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PROJECTS = [
  { num: '01', name: 'ASTROVERN', service: 'Digital Platform', year: '2025', category: 'E-Commerce', statement: 'REDEFINING THE LUXURY SHOPPING EXPERIENCE.', theme: 'dark' },
  { num: '02', name: 'goSAFARI', service: 'Mobile Experience', year: '2026', category: 'Travel', statement: 'CONNECTING EXPLORERS WITH THE WILD.', theme: 'light' },
  { num: '03', name: 'GTRV', service: 'Brand Identity', year: '2026', category: 'Automotive', statement: 'THE FUTURE OF PERFORMANCE MOBILITY.', theme: 'dark' },
  { num: '04', name: 'LUMINIA', service: 'Creative Direction', year: '2026', category: 'Fashion', statement: 'ILLUMINATING MODERN HAUTE COUTURE.', theme: 'light' },
  { num: '05', name: 'NEXUS', service: 'Web Application', year: '2027', category: 'Finance', statement: 'ARCHITECTING DECENTRALIZED WEALTH.', theme: 'dark' },
  { num: '06', name: 'AURA', service: 'Immersive Web', year: '2027', category: 'Technology', statement: 'CRAFTING SPATIAL DIGITAL ENVIRONMENTS.', theme: 'light' }
];

const ProjectRoom = ({ project }: { project: typeof PROJECTS[0] }) => {
  const isLight = project.theme === 'light';
  const bg = isLight ? '#fff' : '#000';
  const fg = isLight ? '#000' : '#fff';
  const muted = isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)';
  const border = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
  const bgNumber = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)';
  const gradient = isLight ? 'linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.00) 100%)' : 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.00) 100%)';
  const fillBox = isLight ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)';

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', backgroundColor: bg, color: fg, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '5vw', boxSizing: 'border-box' }}>
      
      {/* Massive Background Number */}
      <div style={{ position: 'absolute', right: '-2vw', bottom: '-8vw', fontSize: 'clamp(20rem, 40vw, 40rem)', fontWeight: 600, color: bgNumber, lineHeight: 0.8, pointerEvents: 'none', zIndex: 0 }}>
        {project.num}
      </div>

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
        
        {/* Top Header: Title & Meta */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 8vw, 10rem)', fontWeight: 500, margin: 0, textTransform: 'uppercase', lineHeight: 0.9 }}>
            {project.name}
          </h2>
          <div style={{ display: 'flex', gap: 'clamp(1rem, 3vw, 3rem)', textAlign: 'right', fontSize: '0.8rem', letterSpacing: '0.1em', color: muted, textTransform: 'uppercase' }}>
            <div>
              <div style={{ color: fg, marginBottom: '0.5rem' }}>Service</div>
              <div>{project.service}</div>
            </div>
            <div>
              <div style={{ color: fg, marginBottom: '0.5rem' }}>Year</div>
              <div>{project.year}</div>
            </div>
          </div>
        </div>

        {/* Center: Hero Visual Placeholder */}
        <div style={{ flex: 1, margin: '4vh 0', border: `1px solid ${border}`, background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: '60%', height: '80%', border: `1px solid ${border}`, position: 'absolute', left: '10%', top: '10%' }} />
          <div style={{ width: '40%', height: '50%', border: `1px solid ${border}`, position: 'absolute', right: '15%', bottom: '15%', background: fillBox, backdropFilter: 'blur(10px)' }} />
          <span style={{ position: 'absolute', bottom: '2rem', left: '2rem', fontSize: '0.7rem', letterSpacing: '0.2em', color: muted, textTransform: 'uppercase' }}>
            HERO COMPOSITION — {project.name}
          </span>
        </div>

        {/* Bottom: Project Statement */}
        <div style={{ fontSize: 'clamp(1rem, 3vw, 3rem)', fontWeight: 400, maxWidth: '90%', textTransform: 'uppercase', lineHeight: 1.1, color: fg }}>
          {project.statement}
        </div>

      </div>
    </div>
  );
};

export default function ProjectsGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const slicesCount = useRef(typeof window !== 'undefined' && window.innerWidth <= 768 ? 15 : window.innerWidth <= 1024 ? 25 : 40).current;

  useGSAP(() => {
    if (!containerRef.current || !pinRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${PROJECTS.length * 300}vh`, // 300vh scroll duration per transition (much slower physically)
        scrub: 2.5, // High scrub value for extreme smoothness and momentum
        pin: pinRef.current,
        anticipatePin: 1
      }
    });

    // Add an initial buffer hold so the first project is clearly visible before any scrolling shatters it
    tl.to({}, { duration: 2.0 });

    // We have 3 projects. 
    // Transition 1: Project 1 slices rotate away to reveal Project 2.
    // Transition 2: Project 2 slices rotate away to reveal Project 3.
    for (let i = 0; i < PROJECTS.length - 1; i++) {
      const slices = gsap.utils.toArray(`.proj-${i}-slice`);
      
      tl.to(slices, {
        rotateY: 90,
        opacity: 0, 
        stagger: {
          each: 0.12, // Slower stagger
          from: "random"
        },
        duration: 2.5, // Slower flip animation
        ease: "power2.inOut"
      });
      tl.to({}, { duration: 2.0 }); // Longer hold between projects
    }

  }, { scope: containerRef });

  return (
    <section ref={containerRef} style={{ width: '100%', backgroundColor: '#000', position: 'relative' }}>
      <div 
        ref={pinRef} 
        style={{ 
          height: '100vh', 
          width: '100vw', 
          position: 'relative', 
          overflow: 'hidden',
          background: '#000'
        }}
      >
        {PROJECTS.map((project, projIdx) => {
          const isLast = projIdx === PROJECTS.length - 1;
          const zIndex = PROJECTS.length - projIdx;

          if (isLast) {
            // The final project doesn't need to be sliced because it never rotates away
            return (
              <div key={projIdx} style={{ position: 'absolute', inset: 0, zIndex }}>
                <ProjectRoom project={project} />
              </div>
            );
          }

          // Render other projects as perfect vertical slices so they can physically rotate away
          return (
            <div 
              key={projIdx} 
              style={{ 
                position: 'absolute', 
                inset: 0, 
                zIndex, 
                display: 'flex', 
                perspective: '2000px', 
                transformStyle: 'preserve-3d',
                pointerEvents: 'none' // Ensures they don't block interaction with the layer underneath when rotated
              }}
            >
              {Array.from({ length: slicesCount }).map((_, sliceIdx) => (
                <div 
                  key={sliceIdx} 
                  className={`proj-${projIdx}-slice`}
                  style={{ 
                    width: `${100 / slicesCount}vw`, 
                    height: '100vh', 
                    overflow: 'hidden', 
                    transformOrigin: 'center center',
                    transformStyle: 'preserve-3d',
                    pointerEvents: 'auto' // Re-enable interaction for the slices themselves while they are visible
                  }}
                >
                  <div style={{ width: '100vw', height: '100vh', transform: `translateX(-${(100 / slicesCount) * sliceIdx}vw)` }}>
                    <ProjectRoom project={project} />
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
