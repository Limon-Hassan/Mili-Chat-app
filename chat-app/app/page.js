import AnimatedDots from '@/components/AnimatedDots';
import HomePage from '@/components/HomePage';
import SubItems from '@/components/SubItems';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#080a10] text-white overflow-hidden">
      <AnimatedDots />

      <div className="flex gap-4 relative z-10">
        <HomePage />
        <SubItems />
      </div>
    </div>
  );
}
