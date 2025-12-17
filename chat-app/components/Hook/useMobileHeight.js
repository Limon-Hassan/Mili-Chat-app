import React, { useEffect, useState } from 'react';

const useMobileHeight = () => {
  let [vh, setVh] = useState(null);
  useEffect(() => {
    const calculateVh = () => {
      if (window.innerWidth >= 1024) {
        setVh(null);
        return;
      }

      const h = window.innerHeight;

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
    window.addEventListener('resize', calculateVh);
    return () => window.removeEventListener('resize', calculateVh);
  }, []);
  return vh;
};

export default useMobileHeight;
