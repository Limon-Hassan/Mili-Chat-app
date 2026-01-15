'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let speed = '4g';

    if (navigator.connection?.effectiveType) {
      speed = navigator.connection.effectiveType;
    }

    let intervalTime = 30;
    if (speed === '3g') intervalTime = 50;
    if (speed === '2g') intervalTime = 80;
    if (speed === 'slow-2g') intervalTime = 120;

    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : prev));
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        router.replace('/', { scroll: false });
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [progress, router]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-red-200 text-white fixed z-50 ">
      <div className="flex items-center gap-0">
        <img
          className="w-50 h-auto -rotate-40"
          src="/whiteLove-Photoroom.png"
          alt=""
        />
        <img
          className="w-52 h-auto rotate-40 -ml-16.25"
          src="/BlackLove-Photoroom.png"
          alt=""
        />
      </div>
      <h1 className="mobile:text-[30px] tablet:text-[40px] laptop:text-[50px] computer:text-[50px] font-open_sens font-bold mb-5">
        Welcome <span className="text-pink-500 mx-2">to</span>
        <span className="text-black">Mili Chat</span>
      </h1>
      <p className="text-[16px] font-medium font-inter text-center animate-pulse mb-3">
        Loading...
      </p>
      <div className="flex items-center gap-1">
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500  transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm opacity-70">{progress}%</p>
      </div>
    </div>
  );
}
