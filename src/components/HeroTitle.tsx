import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { playHoverSound, playClickSound } from '../audio/soundEffects';

export const HeroTitle: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coordinates for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Apple-style critically damped springs
  const springConfig = { damping: 25, stiffness: 200, mass: 0.8 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 3D rotation angles
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-9, 9]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const letters = ['M', '4', '3', 'S', 'T', 'R', 'O'];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-5xl mx-auto py-12 sm:py-20 flex flex-col items-center justify-center text-center select-none perspective-[1000px]"
    >
      {/* Decorative subtitle badge */}
      <motion.div
        initial={{ opacity: 0, transform: 'translateY(12px) scale(0.96)' }}
        animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="mb-4 sm:mb-6 flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#a1a1aa] font-mono"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] inline-block animate-pulse" />
        Architect of the Invisible
      </motion.div>

      {/* 3D Tilted Hero Letters */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative cursor-default"
      >
        {/* Ambient backlight glow behind M43STRO */}
        <div
          className="absolute inset-0 -inset-x-8 blur-3xl opacity-30 pointer-events-none transition-opacity duration-500"
          style={{
            background: isHovered
              ? 'radial-gradient(ellipse at center, rgba(160, 185, 230, 0.35) 0%, rgba(90, 120, 190, 0.15) 50%, transparent 80%)'
              : 'radial-gradient(ellipse at center, rgba(140, 160, 200, 0.2) 0%, transparent 70%)',
          }}
        />

        {/* Main letters container */}
        <h1 
          className="display-title flex items-center justify-center font-black tracking-[-0.04em] text-[4rem] sm:text-[7.5rem] md:text-[9.2rem] lg:text-[10.5rem] leading-[0.88] select-none"
          aria-label="M43STRO"
        >
          {letters.map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, transform: 'translateY(36px) scale(0.95)' }}
              animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
              transition={{
                duration: 0.5,
                delay: 0.1 + index * 0.05, // 50ms stagger per Emil Kowalski
                ease: [0.23, 1, 0.32, 1], // Custom strong ease-out
              }}
              whileHover={{
                transform: 'translateY(-4px) scale(1.05)',
                transition: { type: 'spring', stiffness: 400, damping: 15 },
              }}
              onMouseEnter={() => playHoverSound()}
              onClick={() => playClickSound()}
              className="relative inline-block transition-colors duration-200"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Metallic Titanium Base */}
              <span className="relative z-10 titanium-text drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                {char}
              </span>

              {/* Specular edge light */}
              <span 
                className="absolute inset-0 z-20 text-white/30 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
              >
                {char}
              </span>
            </motion.span>
          ))}
        </h1>
      </motion.div>

      {/* Titanium precision accent rule with moving light point */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-48 sm:w-72 h-[1px] mt-6 sm:mt-8 bg-gradient-to-r from-transparent via-white/20 to-transparent overflow-hidden"
      >
        <motion.div
          className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          animate={{
            x: ['-100%', '300%'],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Refined tagline */}
      <motion.p
        initial={{ opacity: 0, transform: 'translateY(16px)' }}
        animate={{ opacity: 1, transform: 'translateY(0px)' }}
        transition={{ duration: 0.5, delay: 0.55, ease: [0.23, 1, 0.32, 1] }}
        className="mt-4 sm:mt-5 text-sm sm:text-base text-[#8e8e99] font-normal tracking-wide max-w-md mx-auto"
      >
        Designing software where every unseen detail compounds into elegance.
      </motion.p>
    </div>
  );
};
