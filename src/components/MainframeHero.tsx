import React, { useState, useEffect, useRef } from 'react';

function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeoutId: number;
    let charIndex = 0;
    
    timeoutId = window.setTimeout(() => {
      const intervalId = setInterval(() => {
        setDisplayed(text.substring(0, charIndex + 1));
        charIndex++;
        if (charIndex === text.length) {
          setDone(true);
          clearInterval(intervalId);
        }
      }, speed);
      return () => clearInterval(intervalId);
    }, startDelay);

    return () => clearTimeout(timeoutId);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export default function MainframeHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPills, setShowPills] = useState(false);

  const { displayed, done } = useTypewriter(
    "Glad you stopped in. Good taste tends to find us. Now, what are we building?"
  );

  useEffect(() => {
    const t = setTimeout(() => setShowPills(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Video Scrubbing Logic
  useEffect(() => {
    let prevX: number | null = null;
    let targetTime = 0;
    let isSeeking = false;
    let queuedSeek = false;
    const SENSITIVITY = 0.8;

    const handleMouseMove = (e: MouseEvent) => {
      if (!videoRef.current || isNaN(videoRef.current.duration)) return;
      
      if (prevX === null) {
        prevX = e.clientX;
        return;
      }
      
      const currentX = e.clientX;
      const delta = currentX - prevX;
      prevX = currentX;

      const deltaSeconds = (delta / window.innerWidth) * SENSITIVITY * videoRef.current.duration;
      targetTime += deltaSeconds;
      targetTime = Math.max(0, Math.min(targetTime, videoRef.current.duration));

      if (!isSeeking) {
        isSeeking = true;
        videoRef.current.currentTime = targetTime;
      } else {
        queuedSeek = true;
      }
    };

    const handleSeeked = () => {
      isSeeking = false;
      if (queuedSeek && videoRef.current) {
        queuedSeek = false;
        isSeeking = true;
        videoRef.current.currentTime = targetTime;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    const v = videoRef.current;
    if (v) {
      v.addEventListener('seeked', handleSeeked);
      // Ensure we get the duration if the video is already loaded
      if (!isNaN(v.duration)) {
        targetTime = v.currentTime;
      } else {
        v.addEventListener('loadedmetadata', () => {
          targetTime = v.currentTime;
        });
      }
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (v) v.removeEventListener('seeked', handleSeeked);
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText("hello@mainframe.co");
  };

  return (
    <div className="w-full h-screen relative bg-black text-white animate-[fadeIn_1s_ease-out]" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Background Video */}
      <video 
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4"
        muted 
        playsInline 
        preload="auto"
        className="fixed inset-0 w-full h-full object-cover z-[0]"
        style={{ objectPosition: '70% center' }}
      />
      {/* Dark overlay for contrast */}
      <div className="fixed inset-0 bg-black/30 z-[0] pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center z-10 mix-blend-difference">
        <div className="flex flex-row gap-3 items-center">
          <span className="text-[21px] sm:text-[26px] tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
            MAINFRAME®
          </span>
          <span className="text-[25px] sm:text-[30px] text-white select-none -mt-1" style={{ letterSpacing: '-0.02em' }}>
            ✳︎
          </span>
        </div>

        <div className="hidden md:flex flex-row text-[23px] text-white gap-2">
          {["Labs", "Studio", "Openings", "Shop"].map((link, i, arr) => (
            <React.Fragment key={link}>
              <a href="#" className="hover:opacity-60 transition-opacity">{link}</a>
              {i < arr.length - 1 && <span>, </span>}
            </React.Fragment>
          ))}
        </div>

        <a href="#" className="hidden md:block text-[23px] text-white underline underline-offset-2 hover:opacity-60 transition-opacity">
          Get in touch
        </a>

        {/* Mobile Hamburger */}
        <button 
          className="md:hidden flex flex-col gap-[5px] z-50 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`w-6 h-[2px] bg-white transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`w-6 h-[2px] bg-white transition-opacity duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`w-6 h-[2px] bg-white transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/95 backdrop-blur-md z-[9] flex flex-col justify-center px-8 gap-8 transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="flex flex-col gap-6 text-[32px] font-medium text-white">
          {["Labs", "Studio", "Openings", "Shop"].map(link => (
            <a href="#" key={link} className="hover:opacity-60 transition-opacity">{link}</a>
          ))}
          <a href="#" className="underline underline-offset-2 hover:opacity-60 transition-opacity mt-4">
            Get in touch
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <main className="w-full h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden relative z-[1]">
        <div className="max-w-xl relative z-10 mix-blend-difference">
          
          <div className="pointer-events-none select-none mb-5 sm:mb-6 text-white blur-[2px] opacity-80" style={{ fontSize: 'clamp(18px, 4vw, 26px)', lineHeight: 1.3, fontWeight: 400 }}>
            Hey there, meet A.R.I.A,<br />
            Mainframe's Adaptive Response Interface Agent
          </div>

          <div className="text-white mb-5 sm:mb-6 min-h-[54px]" style={{ fontSize: 'clamp(18px, 4vw, 26px)', lineHeight: 1.35, fontWeight: 400 }}>
            {displayed}
            {!done && (
              <span className="inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px] animate-[blink_1s_step-end_infinite]" />
            )}
          </div>

          <div 
            className={`flex flex-wrap gap-y-1 transition-all duration-400 ease-out ${showPills ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
          >
            {["Pitch us an idea", "Come work here", "Send a brief hello", "See how we operate"].map(label => (
              <button 
                key={label}
                className="inline-flex items-center justify-center bg-white text-black border border-white/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white hover:border-white transition-colors duration-200"
              >
                {label}
              </button>
            ))}
            
            <button 
              onClick={handleCopy}
              className="inline-flex items-center justify-center text-white bg-transparent border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap gap-2 sm:gap-3 hover:bg-white hover:text-black transition-colors duration-200 group"
            >
              <span>Reach us: <span className="underline underline-offset-1">hello@mainframe.co</span></span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-black">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>

        </div>
      </main>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
