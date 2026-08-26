import React, { useMemo } from 'react';

interface PetalProps {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotateStart: number;
  rotateEnd: number;
  color: string;
}

export const RosePetals: React.FC<{ count?: number; active?: boolean }> = ({ count = 24, active = true }) => {
  const petals: PetalProps[] = useMemo(() => {
    const colors = [
      'rgba(219, 68, 85, 0.65)',
      'rgba(244, 114, 137, 0.55)',
      'rgba(189, 38, 59, 0.7)',
      'rgba(255, 182, 193, 0.6)',
      'rgba(199, 44, 65, 0.5)'
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      size: 12 + Math.random() * 16, // px
      duration: 7 + Math.random() * 8, // seconds
      delay: Math.random() * 6, // seconds
      rotateStart: Math.random() * 360,
      rotateEnd: Math.random() * 360 + 360,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }, [count]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute -top-10 opacity-0 animate-petal-fall"
          style={{
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${petal.size * 1.3}px`,
            backgroundColor: petal.color,
            borderRadius: '50% 0% 50% 50%',
            transform: `rotate(${petal.rotateStart}deg)`,
            animation: `petalFall ${petal.duration}s linear infinite`,
            animationDelay: `${petal.delay}s`,
            filter: 'blur(0.4px) drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          }}
        />
      ))}
      <style>{`
        @keyframes petalFall {
          0% {
            top: -5%;
            opacity: 0;
            transform: translateX(0px) rotate(0deg) scale(0.8);
          }
          10% {
            opacity: 0.85;
          }
          50% {
            transform: translateX(60px) rotate(180deg) scale(1);
          }
          90% {
            opacity: 0.85;
          }
          100% {
            top: 105%;
            opacity: 0;
            transform: translateX(-40px) rotate(360deg) scale(0.9);
          }
        }
      `}</style>
    </div>
  );
};
