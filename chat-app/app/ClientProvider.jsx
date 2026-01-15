import AnimatedDots from '@/components/AnimatedDots';
import React from 'react';
import ViewportFix from './ViewportFix';
import MobileAnimatedDots from '@/components/Mobile/MobileAnimatedDots';
import { GoogleOAuthProvider } from '@react-oauth/google';
import WelcomePage from './welcome/page';

export const ClientProvider = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <div className="relative min-h-screen bg-[#080a10] text-white overflow-hidden">
        <AnimatedDots />
        <MobileAnimatedDots />
        <ViewportFix />
        {children}
      </div>
    </GoogleOAuthProvider>
  );
};
