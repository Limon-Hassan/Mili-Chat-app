'use client';

import React, { useEffect, useState } from 'react';

const LiveWaveform = ({ analyser }) => {
  const [bars, setBars] = useState(new Array(20).fill(0));

  useEffect(() => {
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateWave = () => {
      analyser.getByteFrequencyData(dataArray);

      const newBars = bars.map((_, index) => {
        let v = dataArray[index * 5] / 255;
        return Math.max(4, v * 30);
      });

      setBars([...newBars]);
      requestAnimationFrame(updateWave);
    };

    updateWave();
  }, [analyser]);
  return (
    <div className="flex gap-0.5 items-end h-10">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-[3px] bg-white rounded"
          style={{ height: `${h}px`, transition: 'height 0.1s linear' }}
        ></div>
      ))}
    </div>
  );
};

export default LiveWaveform;
