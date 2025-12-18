import AnimatedDots from '@/components/AnimatedDots';
import React from 'react';
import ViewportFix from './ViewportFix';
import MobileAnimatedDots from '@/components/MobileAnimatedDots';

export const ClientProvider = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-[#080a10] text-white overflow-hidden">
      <AnimatedDots />
      <MobileAnimatedDots />
      <ViewportFix />
      {children}
    </div>
  );
};
