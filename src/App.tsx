import { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { TelegramIcon } from './icons/TelegramIcon';
import { GithubIcon } from './icons/GithubIcon';
import { DiscordIcon } from './icons/DiscordIcon';

/* ─── Data ─── */

const QUOTE = {
  text: 'Совершенство достигается не тогда, когда нечего добавить, а когда нечего убрать.',
  author: 'Антуан де Сент-Экзюпери',
};

const SOCIALS = [
  {
    name: 'Telegram',
    icon: TelegramIcon,
    href: 'https://t.me/m43stro_channel',
    label: '@m43stro_channel',
  },
  {
    name: 'GitHub',
    icon: GithubIcon,
    href: 'https://github.com/m43stro-original',
    label: 'm43stro-original',
  },
  {
    name: 'Discord',
    icon: DiscordIcon,
    href: 'https://discord.gg/m43stro',
    label: 'm43stro',
  },
] as const;

const HERO_LETTERS = ['M', '4', '3', 'S', 'T', 'R', 'O'];
const SCRAMBLE_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

/* ═══════════════════════════════════════════════
   MAGNETIC LETTER — the heart of the beast
   ═══════════════════════════════════════════════ */

function MagneticLetter({ char, index }: { char: string; index: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayChar, setDisplayChar] = useState(
    SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
  );

  // Magnetic pull values
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 150, damping: 12 });
  const springY = useSpring(my, { stiffness: 150, damping: 12 });

  // Scramble → decode effect
  useEffect(() => {
    const decodeAt = 600 + index * 200;
    const scrambleSpeed = 45;

    const scrambleInterval = setInterval(() => {
      setDisplayChar(SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]);
    }, scrambleSpeed);

    const decodeTimeout = setTimeout(() => {
      clearInterval(scrambleInterval);
      setDisplayChar(char);
    }, decodeAt);

    return () => {
      clearInterval(scrambleInterval);
      clearTimeout(decodeTimeout);
    };
  }, [char, index]);

  // Magnetic hover — letter pulls toward cursor
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mx.set((e.clientX - centerX) * 0.35);
      my.set((e.clientY - centerY) * 0.35);
    },
    [mx, my]
  );

  const handleMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <motion.span
      ref={ref}
      className="hero-letter holographic-text inline-block relative select-none"
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-char={char}
      initial={{
        opacity: 0,
        y: 80,
        rotateX: -90,
        scale: 0.3,
        filter: 'blur(20px)',
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      transition={{
        type: 'spring',
        stiffness: 80,
        damping: 10,
        mass: 1.2,
        delay: index * 0.1,
      }}
      whileHover={{
        scale: 1.2,
        rotate: [0, -3, 3, -2, 0],
        transition: { duration: 0.4, ease: 'easeInOut' },
      }}
    >
      {displayChar}
    </motion.span>
  );
}

/* ═══════════════════════════════════════════════
   HERO SECTION — 3D tilt + dual layer text
   ═══════════════════════════════════════════════ */

function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 40, damping: 25 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Stronger tilt
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="relative" style={{ perspective: '800px' }}>
      {/* Hero glow — pulsing radial behind text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
        <div
          className="w-[700px] h-[250px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(120, 80, 255, 0.2) 0%, rgba(0, 200, 255, 0.1) 40%, transparent 70%)',
            animation: 'glow-pulse 4s ease-in-out infinite',
            filter: 'blur(50px)',
          }}
        />
      </div>

      {/* The hero container with periodic glitch + scan line */}
      <motion.div
        className="hero-container scan-line relative"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        {/* Layer 1: Neon glow (behind) */}
        <h1
          className="display-title hero-glow-layer text-[clamp(3.5rem,15vw,13rem)] font-black absolute inset-0 pointer-events-none select-none"
          aria-hidden
        >
          M43STRO
        </h1>

        {/* Layer 2: Holographic gradient (in front) with magnetic letters */}
        <h1 className="display-title text-[clamp(3.5rem,15vw,13rem)] font-black relative">
          {HERO_LETTERS.map((letter, i) => (
            <MagneticLetter key={i} char={letter} index={i} />
          ))}
        </h1>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SOCIAL CARD — spotlight + animated border
   ═══════════════════════════════════════════════ */

function SocialCard({
  name,
  icon: Icon,
  href,
  label,
  index,
}: {
  name: string;
  icon: typeof TelegramIcon;
  href: string;
  label: string;
  index: number;
}) {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      className="social-card spotlight group flex items-center gap-4 px-6 py-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm cursor-pointer"
      initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        duration: 0.6,
        delay: 0.8 + index * 0.1,
        ease: EASE_OUT,
      }}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center text-[#71717a] transition-colors duration-200 group-hover:text-white group-hover:bg-white/[0.1]">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-[#e4e4e7] transition-colors duration-200 group-hover:text-white">
          {name}
        </span>
        <span className="text-xs text-[#52525b] font-mono truncate transition-colors duration-200 group-hover:text-[#71717a]">
          {label}
        </span>
      </div>
      <div className="ml-auto flex-shrink-0 text-[#3f3f46] transition-all duration-200 group-hover:text-[#71717a] group-hover:translate-x-0.5">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
      </div>
    </motion.a>
  );
}

/* ═══════════════════════════════════════════════
   AMBIENT BACKGROUND
   ═══════════════════════════════════════════════ */

function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      <div
        className="absolute -top-1/4 -left-1/4 w-[700px] h-[700px] rounded-full opacity-[0.08]"
        style={{
          background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
          animation: 'blob-drift-1 20s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.07]"
        style={{
          background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)',
          animation: 'blob-drift-2 25s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full opacity-[0.05] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
          animation: 'blob-drift-3 18s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.06]"
        style={{
          background: 'radial-gradient(circle, #ff0080 0%, transparent 70%)',
          animation: 'blob-drift-1 22s ease-in-out infinite reverse',
        }}
      />
    </div>
  );
}

function Particles() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 15}s`,
    duration: `${10 + Math.random() * 20}s`,
    size: `${1 + Math.random() * 2.5}px`,
  }));

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 rounded-full bg-white/30"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: 0,
            animation: `float-particle ${p.duration} ${p.delay} linear infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════ */

export const App = () => {
  return (
    <div className="grain relative min-h-screen bg-[#070709] text-[#f5f5f7] flex flex-col items-center justify-center overflow-hidden selection:bg-white/20 selection:text-white">
      <AmbientBackground />
      <Particles />

      <main className="relative z-10 flex flex-col items-center justify-center px-6 py-20 w-full max-w-3xl mx-auto gap-16 sm:gap-20">
        {/* ── Hero ── */}
        <section className="flex flex-col items-center gap-8">
          <HeroSection />

          <motion.div
            className="animate-line-grow h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2, ease: EASE_OUT }}
          />
        </section>

        {/* ── Quote ── */}
        <motion.blockquote
          className="text-center max-w-lg mx-auto"
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.7, ease: EASE_OUT }}
        >
          <p className="text-lg sm:text-xl font-light text-[#a1a1aa] leading-relaxed tracking-tight italic">
            «{QUOTE.text}»
          </p>
          <footer className="mt-4 text-sm text-[#52525b] font-medium">
            — {QUOTE.author}
          </footer>
        </motion.blockquote>

        {/* ── Social links ── */}
        <section className="w-full flex flex-col gap-3">
          {SOCIALS.map((social, i) => (
            <SocialCard key={social.name} index={i} {...social} />
          ))}
        </section>
      </main>

      {/* ── Footer ── */}
      <motion.footer
        className="relative z-10 w-full text-center text-xs text-[#3f3f46] pb-8 pt-4 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5, ease: EASE_OUT }}
      >
        M43STRO © {new Date().getFullYear()}
      </motion.footer>
    </div>
  );
};
