import AnimatedDots from '@/components/AnimatedDots';
import React from 'react';

export const ClientProvider = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-[#080a10] text-white overflow-hidden">
      <AnimatedDots />
      {children}
    </div>
  );
};
