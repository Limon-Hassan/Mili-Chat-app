import { useEffect, useState } from 'react';

const useMobileHeight = () => {
  const [vh, setVh] = useState(null);

  useEffect(() => {
    const calculateVh = () => {
      const isMobile = window.matchMedia('(pointer: coarse)').matches;

      if (!isMobile) {
        setVh(null);
        return;
      }

      const h = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;

      const minH = 475;
      const maxH = 800;

      const minVh = 28;
      const maxVh = 58;

      if (h <= minH) {
        setVh(minVh);
        return;
      }

      if (h >= maxH) {
        setVh(maxVh);
        return;
      }

      const ratio = (h - minH) / (maxH - minH);
      const calculatedVh = minVh + ratio * (maxVh - minVh);

      setVh(Number(calculatedVh.toFixed(1)));
    };

    calculateVh();

    window.visualViewport?.addEventListener('resize', calculateVh);
    window.addEventListener('resize', calculateVh);

    return () => {
      window.visualViewport?.removeEventListener('resize', calculateVh);
      window.removeEventListener('resize', calculateVh);
    };
  }, []);

  return vh;
};

export default useMobileHeight;
