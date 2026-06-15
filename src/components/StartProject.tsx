import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const QUESTIONS = [
  { id: 'name', type: 'text', label: "What's your name?", placeholder: "Type your name..." },
  { id: 'email', type: 'email', label: "What's your email?", placeholder: "hello@example.com" },
  { id: 'type', type: 'choice', label: "What are you building?", options: ['Website', 'Web Application', 'Brand Identity', 'Custom Product'] },
  { id: 'vision', type: 'textarea', label: "Describe your vision.", placeholder: "Briefly explain the goal..." },
  { id: 'budget', type: 'text', label: "Budget range?", placeholder: "e.g. $10k - $20k" },
  { id: 'timeline', type: 'text', label: "Expected timeline?", placeholder: "e.g. 2-3 months" },
  { id: 'extra', type: 'textarea', label: "Anything else you'd like us to know?", placeholder: "Optional details..." }
];

export default function StartProject() {
  const [step, setStep] = useState(-1); // -1 = idle, 0-6 = questions, 7 = summary, 8 = success
  const [displayStep, setDisplayStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const rightPanelRef = useRef<HTMLDivElement>(null);
  const leftHeadingRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const leftFooterRef = useRef<HTMLDivElement>(null);

  // ----------------------------------------------------
  // Continuous Left Heading Glitch Loop
  // ----------------------------------------------------
  useGSAP(() => {
    if (!leftHeadingRef.current) return;
    
    // A master timeline that plays infinitely, occasionally triggering a glitch
    const tl = gsap.timeline({ repeat: -1 });

    tl.to({}, { duration: 3 }); // wait 3 seconds

    // Slight shift and blur to mimic broadcast interference (no opacity changes to prevent vanishing)
    tl.to(leftHeadingRef.current, {
      x: () => gsap.utils.random(-3, 3),
      skewX: () => gsap.utils.random(-2, 2),
      filter: "blur(2px)",
      duration: 0.1,
      ease: "steps(1)"
    });
    tl.to(leftHeadingRef.current, {
      x: 0,
      skewX: 0,
      filter: "blur(0px)",
      duration: 0.1,
      ease: "steps(1)"
    });

    tl.to({}, { duration: gsap.utils.random(2, 5) }); // Random wait before next glitch

  }, { scope: leftHeadingRef });

  // ----------------------------------------------------
  // Right Panel Transition Engine
  // ----------------------------------------------------
  useEffect(() => {
    if (step !== displayStep && !isAnimating && rightPanelRef.current) {
      setIsAnimating(true);
      
      const tl = gsap.timeline({
        onComplete: () => {
          setDisplayStep(step);
          
          // Animate the new step IN using the Luxury Broadcast Lock
          gsap.fromTo(rightPanelRef.current,
            { opacity: 0, filter: "blur(15px)", x: -10 },
            { opacity: 1, filter: "blur(4px)", x: 0, duration: 0.4, ease: "power2.out" }
          );
          
          // Micro fragment lock (simulated via rapid x shifts on the whole container)
          gsap.to(rightPanelRef.current, {
            x: () => gsap.utils.random(-3, 3),
            duration: 0.05,
            repeat: 6,
            yoyo: true,
            ease: "steps(1)",
            delay: 0.4,
            onComplete: () => {
              gsap.to(rightPanelRef.current, { x: 0, filter: "blur(0px)", duration: 0.3, ease: "power2.inOut" });
              setIsAnimating(false);
            }
          });
        }
      });

      // Animate the old step OUT
      tl.to(rightPanelRef.current, {
        filter: "blur(10px)",
        opacity: 0,
        x: 10,
        duration: 0.4,
        ease: "power2.in"
      });
    }
  }, [step, displayStep, isAnimating]);

  const handleNext = () => {
    if (step < 8 && !isAnimating) setStep(step + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  const renderContent = () => {
    if (displayStep === -1) {
      return (
        <div className="start-idle">
          <button className="start-btn" onClick={() => setStep(0)}>
            START PROJECT
          </button>
        </div>
      );
    }

    if (displayStep >= 0 && displayStep < 7) {
      const q = QUESTIONS[displayStep];
      return (
        <div className="question-container">
          <div className="progress-indicator">
            [ 0{displayStep + 1} / 07 ]
          </div>
          
          <label className="question-label">{q.label}</label>
          
          {q.type === 'choice' ? (
            <div className="choice-list">
              {q.options?.map(opt => (
                <button 
                  key={opt} 
                  className={`choice-btn ${answers[q.id] === opt ? 'selected' : ''}`}
                  onClick={() => {
                    setAnswers(prev => ({ ...prev, [q.id]: opt }));
                    setTimeout(handleNext, 300); // Auto advance on choice
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : q.type === 'textarea' ? (
            <textarea 
              className="premium-input"
              placeholder={q.placeholder}
              value={answers[q.id] || ''}
              onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
              onKeyDown={handleKeyDown}
              autoFocus
              rows={3}
            />
          ) : (
            <input 
              className="premium-input"
              type={q.type}
              placeholder={q.placeholder}
              value={answers[q.id] || ''}
              onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          )}

          <div className="next-action">
            <button className="next-btn" onClick={handleNext}>NEXT <span className="arrow">→</span></button>
            <span className="hint">or press Enter</span>
          </div>
        </div>
      );
    }

    if (displayStep === 7) {
      return (
        <div className="summary-container">
          <h3 className="summary-heading">CONSULTATION SUMMARY</h3>
          <div className="summary-list">
            {QUESTIONS.map(q => (
              <div key={q.id} className="summary-item">
                <div className="summary-label">{q.label}</div>
                <div className="summary-value">{answers[q.id] || '—'}</div>
              </div>
            ))}
          </div>
          <button className="submit-btn" onClick={() => setStep(8)}>SUBMIT REQUEST</button>
        </div>
      );
    }

    if (displayStep === 8) {
      return (
        <div className="success-container">
          <h2 className="success-heading">REQUEST RECEIVED.</h2>
          <p className="success-desc">
            Thank you for reaching out.<br/>
            ROXTEN will review your project and get back to you shortly.
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <section ref={sectionRef} className="start-project-section snap-section">
      <style>{`
        .start-project-section {
          --border-color: rgba(0,0,0,0.1);
          width: 100%;
          width: 100%;
          min-height: 100vh;
          background-color: #fff;
          color: #000;
          display: flex;
          border-top: 1px solid var(--border-color);
          position: relative;
        }
        
        /* Subtle architectural grain */
        .start-project-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url('data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="0.03"/%3E%3C/svg%3E');
          pointer-events: none;
          z-index: 10;
        }

        .col-left {
          flex: 6; /* 60% */
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 4vw;
        }

        .col-right {
          flex: 4; /* 40% */
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4vw;
          position: relative;
        }

        .left-header h2 {
          font-size: clamp(3rem, 12vw, 12rem);
          line-height: 0.85;
          margin: 0 0 2rem 0;
          font-weight: 500;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          will-change: transform, filter;
        }

        .left-copy {
          font-size: clamp(1rem, 1.5vw, 1.5rem);
          line-height: 1.5;
          color: rgba(0,0,0,0.8);
          max-width: 80%;
        }

        .left-footer {
          display: flex;
          gap: 4vw;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          color: rgba(0,0,0,0.5);
          text-transform: uppercase;
        }
        .left-footer a { color: #000; text-decoration: none; border-bottom: 1px solid rgba(0,0,0,0.3); padding-bottom: 2px; }

        /* Right Panel Engine */
        .engine-wrapper {
          width: 100%;
          max-width: 500px;
          position: relative;
          z-index: 20;
        }

        .start-idle {
          display: flex;
          justify-content: center;
        }

        .start-btn {
          background: transparent;
          color: #000;
          border: 1px solid rgba(0,0,0,0.2);
          padding: 1.5rem 3rem;
          font-size: 1rem;
          letter-spacing: 0.2em;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }
        .start-btn:hover {
          border-color: rgba(0,0,0,0.8);
          box-shadow: 0 0 20px rgba(0,0,0,0.05);
          transform: scale(1.02);
        }

        /* Question UI */
        .progress-indicator {
          position: absolute;
          top: -3rem;
          right: 0;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: rgba(0,0,0,0.4);
        }

        .question-label {
          display: block;
          font-size: 1.5rem;
          margin-bottom: 2rem;
          color: rgba(0,0,0,0.9);
        }

        .premium-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(0,0,0,0.2);
          color: #000;
          font-size: 2rem;
          padding: 0.5rem 0;
          outline: none;
          transition: border-color 0.3s ease;
          font-family: inherit;
        }
        .premium-input:focus {
          border-bottom: 1px solid rgba(0,0,0,1);
        }
        .premium-input::placeholder {
          color: rgba(0,0,0,0.2);
        }

        .choice-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .choice-btn {
          background: transparent;
          color: #000;
          border: 1px solid rgba(0,0,0,0.1);
          padding: 1rem;
          text-align: left;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .choice-btn:hover, .choice-btn.selected {
          border-color: #000;
          padding-left: 1.5rem;
        }

        .next-action {
          margin-top: 3rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .next-btn {
          background: #000;
          color: #fff;
          border: none;
          padding: 0.8rem 2rem;
          font-size: 0.9rem;
          letter-spacing: 0.1em;
          cursor: pointer;
          font-weight: 500;
        }
        .next-btn .arrow { margin-left: 0.5rem; }
        .hint {
          font-size: 0.7rem;
          color: rgba(0,0,0,0.3);
        }

        /* Summary & Success */
        .summary-heading {
          font-size: 1rem;
          letter-spacing: 0.2em;
          margin-bottom: 2rem;
          color: rgba(0,0,0,0.5);
        }
        .summary-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .summary-label { font-size: 0.7rem; color: rgba(0,0,0,0.4); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.3rem; }
        .summary-value { font-size: 1.1rem; color: #000; }
        
        .submit-btn {
          background: #000;
          color: #fff;
          border: none;
          padding: 1rem 3rem;
          font-size: 1rem;
          letter-spacing: 0.1em;
          cursor: pointer;
          width: 100%;
        }

        .success-heading {
          font-size: 3rem;
          font-weight: 500;
          margin-bottom: 1rem;
          color: #000;
        }
        .success-desc {
          font-size: 1rem;
          color: rgba(0,0,0,0.6);
          line-height: 1.6;
        }

        @media (max-width: 1024px) {
          .start-project-section { 
            flex-direction: column; 
          }
          .col-left { 
            border-right: none; 
            border-bottom: 1px solid var(--border-color); 
            min-height: auto;
            justify-content: flex-start;
            gap: 3rem;
            padding: 12vw 6vw 10vw 6vw;
          }
          .left-header h2 {
            margin-bottom: 1.5rem;
          }
          .left-footer { 
            flex-direction: row; 
            flex-wrap: wrap; 
            gap: 2rem 3rem; 
          }
          .col-right { 
            min-height: 50vh; 
            padding: 10vw 6vw; 
            align-items: flex-start;
          }
          .engine-wrapper {
            max-width: 100%;
          }
          .start-idle {
            width: 100%;
          }
          .start-btn {
            width: 100%;
            padding: 1.5rem;
          }
        }
      `}</style>

      <div className="col-left">
        <div className="left-header">
          <h2 ref={leftHeadingRef}>START A<br/>PROJECT</h2>
          <p className="left-copy">
            Tell us what you're building.<br/>
            We'll tell you what it could become.
          </p>
        </div>

        <div className="left-footer" ref={leftFooterRef}>
          <div>
            <div style={{ marginBottom: '0.5rem', color: '#000' }}>Email</div>
            <a href="mailto:hello@roxten.studio">hello@roxten.studio</a>
          </div>
          <div>
            <div style={{ marginBottom: '0.5rem', color: '#000' }}>Location</div>
            <div>India • Worldwide</div>
          </div>
          <div>
            <div style={{ marginBottom: '0.5rem', color: '#000' }}>Studio</div>
            <div>ROXTEN STUDIOS</div>
          </div>
        </div>
      </div>

      <div className="col-right">
        <div className="engine-wrapper" ref={rightPanelRef}>
          {renderContent()}
        </div>
      </div>
    </section>
  );
}
