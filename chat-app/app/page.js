import AnimatedDots from '@/components/AnimatedDots';
import Navber from '@/components/Navber';
import Registation from '@/components/Registation';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0f172a] text-white overflow-hidden">
      <AnimatedDots />

      <div className="relative z-10">
        <Registation />
      </div>
    </div>
  );
}
