'use client';
import { useEffect } from 'react';

export default function ViewportFix() {
  useEffect(() => {
    const setVH = () => {
      const vh = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;

      document.documentElement.style.setProperty('--app-height', `${vh}px`);
    };

    setVH();

    window.addEventListener('resize', setVH);
    window.visualViewport?.addEventListener('resize', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.visualViewport?.removeEventListener('resize', setVH);
    };
  }, []);

  return null;
}
