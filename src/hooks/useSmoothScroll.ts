import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const l = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easing
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    setLenis(l);

    // Sync Lenis with GSAP ScrollTrigger
    l.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      l.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      l.destroy();
      gsap.ticker.remove((time) => l.raf(time * 1000));
    };
  }, []);

  return lenis;
}
