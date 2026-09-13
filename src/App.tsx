import { useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
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

/* ─── Ease curves ─── */

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

/* ─── Floating particles (CSS-driven, JS-spawned) ─── */

function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 15}s`,
    duration: `${12 + Math.random() * 18}s`,
    size: `${1 + Math.random() * 2}px`,
    opacity: 0.15 + Math.random() * 0.25,
  }));

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 rounded-full bg-white"
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

/* ─── Ambient background blobs ─── */

function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Blob 1 — purple */}
      <div
        className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{
          background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
          animation: 'blob-drift-1 25s ease-in-out infinite',
        }}
      />
      {/* Blob 2 — blue */}
      <div
        className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.05]"
        style={{
          background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)',
          animation: 'blob-drift-2 30s ease-in-out infinite',
        }}
      />
      {/* Blob 3 — cyan */}
      <div
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full opacity-[0.04] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
          animation: 'blob-drift-3 20s ease-in-out infinite',
        }}
      />
    </div>
  );
}

/* ─── Hero glow behind text ─── */

function HeroGlow() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
      <div
        className="w-[600px] h-[200px] rounded-full opacity-[0.08]"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%)',
          animation: 'glow-pulse 6s ease-in-out infinite',
          filter: 'blur(60px)',
        }}
      />
    </div>
  );
}

/* ─── Social card with spotlight ─── */

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
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  }, []);

  return (
    <motion.a
      ref={cardRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      className="social-card spotlight group flex items-center gap-4 px-6 py-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm cursor-pointer"
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        duration: 0.5,
        delay: 0.6 + index * 0.08,
        ease: EASE_OUT,
      }}
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.06] flex items-center justify-center text-[#a1a1aa] transition-colors duration-200 group-hover:text-white group-hover:bg-white/[0.1]">
        <Icon className="w-5 h-5" />
      </div>

      {/* Text */}
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-[#e4e4e7] transition-colors duration-200 group-hover:text-white">
          {name}
        </span>
        <span className="text-xs text-[#52525b] font-mono truncate transition-colors duration-200 group-hover:text-[#71717a]">
          {label}
        </span>
      </div>

      {/* Arrow */}
      <div className="ml-auto flex-shrink-0 text-[#3f3f46] transition-all duration-200 group-hover:text-[#71717a] group-hover:translate-x-0.5">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
      </div>
    </motion.a>
  );
}

/* ─── Hero section with 3D mouse tracking ─── */

function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 50, damping: 30 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-3, 3]);

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
    <div ref={containerRef} className="relative" style={{ perspective: '1000px' }}>
      <HeroGlow />

      <motion.h1
        className="display-title titanium-text text-[15vw] sm:text-[12vw] md:text-[10vw] lg:text-[8vw] font-black select-none"
        style={{ rotateX, rotateY }}
        initial="hidden"
        animate="visible"
      >
        {HERO_LETTERS.map((letter, i) => (
          <motion.span
            key={i}
            className="inline-block"
            variants={{
              hidden: {
                opacity: 0,
                y: 40,
                filter: 'blur(12px)',
                clipPath: 'inset(0 100% 0 0)',
              },
              visible: {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                clipPath: 'inset(0 0 0 0)',
              },
            }}
            transition={{
              duration: 0.8,
              delay: i * 0.07,
              ease: EASE_OUT,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.h1>
    </div>
  );
}

/* ─── Main App ─── */

export const App = () => {
  return (
    <div className="grain relative min-h-screen bg-[#070709] text-[#f5f5f7] flex flex-col items-center justify-center overflow-hidden selection:bg-white/20 selection:text-white">
      <AmbientBackground />
      <Particles />

      <main className="relative z-10 flex flex-col items-center justify-center px-6 py-20 w-full max-w-3xl mx-auto gap-16 sm:gap-20">
        {/* ── Hero ── */}
        <section className="flex flex-col items-center gap-8">
          <HeroSection />

          {/* Decorative line */}
          <motion.div
            className="animate-line-grow h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: EASE_OUT }}
          />
        </section>

        {/* ── Quote ── */}
        <motion.blockquote
          className="text-center max-w-lg mx-auto"
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE_OUT }}
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
        transition={{ duration: 0.5, delay: 1.2, ease: EASE_OUT }}
      >
        M43STRO © {new Date().getFullYear()}
      </motion.footer>
    </div>
  );
};
