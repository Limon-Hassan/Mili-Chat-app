// 'use client';
// import { useEffect, useState } from 'react';

// export function useDynamicHeight() {
//   const [vh, setVh] = useState(430);

//   useEffect(() => {
//     const calculateVH = () => {
//       const h = window.innerHeight;

//       const baseHeight = 555;
//       const basePx = 180;
//       const maxPx = 430;

//       if (h <= baseHeight) {
//         setVh(basePx);
//         return;
//       }

//       const calculatedVh = basePx + (h - baseHeight);

//       setVh(Math.min(calculatedVh, maxPx));
//     };

//     calculateVH();
//     window.addEventListener('resize', calculateVH);
//     return () => window.removeEventListener('resize', calculateVH);
//   }, []);

//   return vh;
// }

'use client';
import { useEffect, useState } from 'react';

export function useDynamicHeight({
  baseHeight = 555,
  basePx = 180,
  maxPx = 430,
  computerHeight = 265,
} = {}) {
  const [height, setHeight] = useState(maxPx);

  useEffect(() => {
    const calculateHeight = () => {
      const h = window.innerHeight;
      let isComputer = window.innerWidth > 1024;

      if (isComputer) {
        setHeight(computerHeight);
        return;
      }

      if (h <= baseHeight) {
        setHeight(basePx);
        return;
      }

      const calculated = basePx + (h - baseHeight);
      setHeight(Math.min(calculated, maxPx));
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);

    return () => window.removeEventListener('resize', calculateHeight);
  }, [baseHeight, basePx, maxPx]);

  return height;
}
