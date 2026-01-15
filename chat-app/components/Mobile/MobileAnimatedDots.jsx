import React from 'react';

const colors = [
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
  '#663399',
];

const MobileAnimatedDots = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {colors.map((color, i) => (
        <span
          key={i}
          className="absolute rounded-full opacity-80 blur-sm animate-float"
          style={{
            width: 50,
            height: 50,
            backgroundColor: color,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 1}s`,
          }}
        />
      ))}
    </div>
  );
};

export default MobileAnimatedDots;
