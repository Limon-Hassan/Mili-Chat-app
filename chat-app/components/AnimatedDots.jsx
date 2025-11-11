// 'use client';

// import React, { useEffect, useState, useMemo } from 'react';

// export default function AnimatedDots({
//   count = 60,
//   colors = [
//     '#FF0000',
//     '#FF4500',
//     '#FF6347',
//     '#FF7F50',
//     '#FF8C00',
//     '#FFA500',
//     '#FFD700',
//     '#FFFF00',
//     '#FFFFE0',
//     '#FFFACD',
//     '#FAFAD2',
//     '#FFEFD5',
//     '#FFE4B5',
//     '#FFDAB9',
//     '#EEE8AA',
//     '#F0E68C',
//     '#BDB76B',
//     '#ADFF2F',
//     '#7FFF00',
//     '#7CFC00',
//     '#00FF00',
//     '#32CD32',
//     '#98FB98',
//     '#90EE90',
//     '#00FA9A',
//     '#00FF7F',
//     '#3CB371',
//     '#2E8B57',
//     '#228B22',
//     '#008000',
//     '#006400',
//     '#9ACD32',
//     '#6B8E23',
//     '#556B2F',
//     '#66CDAA',
//     '#8FBC8F',
//     '#20B2AA',
//     '#008B8B',
//     '#008080',
//     '#00FFFF',
//     '#00CED1',
//     '#40E0D0',
//     '#48D1CC',
//     '#AFEEEE',
//     '#7FFFD4',
//     '#B0E0E6',
//     '#5F9EA0',
//     '#4682B4',
//     '#1E90FF',
//     '#00BFFF',
//     '#4169E1',
//     '#0000FF',
//     '#0000CD',
//     '#00008B',
//     '#000080',
//     '#8A2BE2',
//     '#9400D3',
//     '#9932CC',
//     '#8B008B',
//     '#800080',
//     '#BA55D3',
//     '#DDA0DD',
//     '#EE82EE',
//     '#FF00FF',
//     '#FF1493',
//     '#FF69B4',
//     '#FFC0CB',
//   ],
//   maxSize = 60,
//   minSize = 50,
//   blur = 8,
// }) {
//   const [dots, setDots] = useState([]);

//   const stableColors = useMemo(() => colors, []);

//   useEffect(() => {
//     const newDots = Array.from({ length: count }).map((_, i) => {
//       const size = Math.round(minSize + Math.random() * (maxSize - minSize));
//       const left = Math.random() * 100;
//       const top = Math.random() * 100;

//       // Pick a random color from the array
//       const color =
//         stableColors[Math.floor(Math.random() * stableColors.length)];

//       const duration = (30 + Math.random() * 40).toFixed(2) + 's';
//       const delay = (-Math.random() * 40).toFixed(2) + 's';
//       return { key: i, size, left, top, color, duration, delay };
//     });
//     setDots(newDots);
//   }, [count, stableColors, maxSize, minSize]);

//   useEffect(() => {
//     const id = 'animated-dots-keyframes';
//     if (!document.getElementById(id)) {
//       const style = document.createElement('style');
//       style.id = id;
//       style.innerHTML = `
//         @keyframes ads-float {
//           0% { transform: translate3d(0,0,0) scale(1); opacity: 0.9; }
//           25% { transform: translate3d(10vw,-8vh,0) scale(1.2); opacity: 0.8; }
//           50% { transform: translate3d(-15vw,10vh,0) scale(1.1); opacity: 0.9; }
//           75% { transform: translate3d(10vw,8vh,0) scale(1.3); opacity: 0.85; }
//           100% { transform: translate3d(-10vw,-10vh,0) scale(1); opacity: 0.9; }
//         }
//         .ads-container {
//           position: fixed;
//           inset: 0;
//           pointer-events: none;
//           z-index: 0;
//           overflow: hidden;
//         }
//       `;
//       document.head.appendChild(style);
//     }
//   }, []);

//   if (dots.length === 0) return null;

//   return (
//     <div className="ads-container" aria-hidden>
//       {dots.map(d => (
//         <span
//           key={d.key}
//           style={{
//             position: 'absolute',
//             left: `${d.left}%`,
//             top: `${d.top}%`,
//             width: `${d.size}px`,
//             height: `${d.size}px`,
//             borderRadius: '50%',
//             background: d.color,
//             filter: `blur(${blur}px)`,
//             opacity: 0.95,
//             mixBlendMode: 'screen',
//             animation: `ads-float ${d.duration} ease-in-out infinite`,
//             animationDelay: d.delay,
//           }}
//         />
//       ))}
//     </div>
//   );
// }

'use client';

import React, { useEffect, useState, useMemo } from 'react';

export default function AnimatedDots({
  count = 60,
  colors = [
    '#FF0000',
    '#FF4500',
    '#FF6347',
    '#FF7F50',
    '#FF8C00',
    '#FFA500',
    '#FFD700',
    '#FFFF00',
    '#FFFFE0',
    '#FFFACD',
    '#FAFAD2',
    '#FFEFD5',
    '#FFE4B5',
    '#FFDAB9',
    '#EEE8AA',
    '#F0E68C',
    '#BDB76B',
    '#ADFF2F',
    '#7FFF00',
    '#7CFC00',
    '#00FF00',
    '#32CD32',
    '#98FB98',
    '#90EE90',
    '#00FA9A',
    '#00FF7F',
    '#3CB371',
    '#2E8B57',
    '#228B22',
    '#008000',
    '#006400',
    '#9ACD32',
    '#6B8E23',
    '#556B2F',
    '#66CDAA',
    '#8FBC8F',
    '#20B2AA',
    '#008B8B',
    '#008080',
    '#00FFFF',
    '#00CED1',
    '#40E0D0',
    '#48D1CC',
    '#AFEEEE',
    '#7FFFD4',
    '#B0E0E6',
    '#5F9EA0',
    '#4682B4',
    '#1E90FF',
    '#00BFFF',
    '#4169E1',
    '#0000FF',
    '#0000CD',
    '#00008B',
    '#000080',
    '#8A2BE2',
    '#9400D3',
    '#9932CC',
    '#8B008B',
    '#800080',
    '#BA55D3',
    '#DDA0DD',
    '#EE82EE',
    '#FF00FF',
    '#FF1493',
    '#FF69B4',
    '#FFC0CB',
  ],
  maxSize = 70,
  minSize = 60,
  blur = 8,
}) {
  const [dots, setDots] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 640);
    }
  }, []);

  const stableColors = useMemo(() => colors, []);

  useEffect(() => {
    const newDots = Array.from({ length: count }).map((_, i) => {
      const actualMax = isMobile ? 40 : maxSize;
      const actualMin = isMobile ? 20 : minSize;

      const size = Math.round(
        actualMin + Math.random() * (actualMax - actualMin)
      );
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const color =
        stableColors[Math.floor(Math.random() * stableColors.length)];
      const duration = (30 + Math.random() * 40).toFixed(2) + 's';
      const delay = (-Math.random() * 40).toFixed(2) + 's';
      return { key: i, size, left, top, color, duration, delay };
    });
    setDots(newDots);
  }, [count, stableColors, isMobile, maxSize, minSize]);

  useEffect(() => {
    const id = 'animated-dots-keyframes';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.innerHTML = `
        @keyframes ads-float {
          0% { transform: translate3d(0,0,0) scale(1); opacity: 0.9; }
          25% { transform: translate3d(10vw,-8vh,0) scale(1.2); opacity: 0.8; }
          50% { transform: translate3d(-15vw,10vh,0) scale(1.1); opacity: 0.9; }
          75% { transform: translate3d(10vw,8vh,0) scale(1.3); opacity: 0.85; }
          100% { transform: translate3d(-10vw,-10vh,0) scale(1); opacity: 0.9; }
        }
        .ads-container {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (dots.length === 0) return null;

  return (
    <div className="ads-container" aria-hidden>
      {dots.map(d => (
        <span
          key={d.key}
          style={{
            position: 'absolute',
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            borderRadius: '50%',
            background: d.color,
            filter: `blur(${blur}px)`,
            opacity: 0.95,
            mixBlendMode: 'screen',
            animation: `ads-float ${d.duration} ease-in-out infinite`,
            animationDelay: d.delay,
          }}
        />
      ))}
    </div>
  );
}
