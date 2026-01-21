'use client';

import React, { useEffect, useState } from 'react';

const LiveWaveform = ({ analyser }) => {
  const isMobile = window.innerWidth < 768;
  const barCount = isMobile ? 10 : 20;
  const [bars, setBars] = useState(new Array(barCount).fill(0));

  useEffect(() => {
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateWave = () => {
      analyser.getByteFrequencyData(dataArray);

      const newBars = bars.map((_, index) => {
        const step = Math.floor(dataArray.length / bars.length);
        const value = dataArray[index * step] || 0;
        return Math.max(4, (value / 255) * 30);
      });


      setBars([...newBars]);
      requestAnimationFrame(updateWave);
    };

    updateWave();
  }, [analyser]);
  return (
    <div className="flex gap-3 items-end h-10 w-full">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex w-0.5 bg-white"
          style={{
            height: `${h}px`,
            borderRadius: '2px',
            transition: 'height 0.1s linear',
          }}
        />
      ))}
    </div>
  );

};

export default LiveWaveform;
