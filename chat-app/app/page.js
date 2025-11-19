import AnimatedDots from '@/components/AnimatedDots';
import HomePage from '@/components/HomePage';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#080a10] text-white overflow-hidden">
      <AnimatedDots />

      <div className=" relative z-10">
        <HomePage />
      </div>
    </div>
  );
}
