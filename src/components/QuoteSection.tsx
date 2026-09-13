import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Quote as QuoteIcon } from 'lucide-react';
import { playClickSound, playHoverSound } from '../audio/soundEffects';

interface QuoteItem {
  text: string;
  source: string;
}

const QUOTES: QuoteItem[] = [
  {
    text: 'Истинное мастерство говорит тихо: оно преображает реальность точностью, смыслом и невидимой грацией.',
    source: 'Философия формы и замысла',
  },
  {
    text: 'Мы создаем код не для машин, а чтобы придать форму и геометрию человеческой мысли.',
    source: 'Архитектура невидимого',
  },
  {
    text: 'В мире бесконечного шума выигрывает тот, чьи невидимые детали поют в унисон.',
    source: 'Принцип гармонии',
  },
  {
    text: 'Простота — это не примитивность. Это вершина мастерства, где удалено всё, кроме сути.',
    source: 'Чистота инженерии',
  },
  {
    text: 'То, что создано с осознанным намерением, никогда не затеряется во времени.',
    source: 'Закон созидания',
  },
];

interface QuoteSectionProps {
  externalTrigger?: number;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ externalTrigger }) => {
  const [index, setIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  // Sync with external trigger if incremented
  React.useEffect(() => {
    if (externalTrigger !== undefined && externalTrigger > 0) {
      nextQuote();
    }
  }, [externalTrigger]);

  const nextQuote = () => {
    playClickSound();
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500);
    setIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const current = QUOTES[index];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 my-6 sm:my-10">
      <div className="glass-panel relative rounded-2xl p-6 sm:p-8 overflow-hidden transition-all duration-300 hover:border-white/20 group">
        {/* Subtle ambient interior spotlight */}
        <div 
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/[0.03] blur-2xl pointer-events-none"
        />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#71717a] uppercase tracking-wider">
            <QuoteIcon className="w-3.5 h-3.5 text-[#9ca3af]" />
            <span>Мысль {index + 1} / {QUOTES.length}</span>
          </div>

          {/* Tactile cycle quote button */}
          <button
            onClick={nextQuote}
            onMouseEnter={() => playHoverSound()}
            className="pressable flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-[#a1a1aa] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 transition-all focus:outline-none"
            title="Следующая цитата"
            aria-label="Next quote"
          >
            <RefreshCw
              className={`w-3 h-3 text-[#9ca3af] transition-transform duration-500 ease-out ${
                isRotating ? 'rotate-180' : ''
              }`}
            />
            <span className="hidden sm:inline">Сменить</span>
          </button>
        </div>

        {/* Animated quote text using Emil Kowalski blur-crossfade principle */}
        <div className="min-h-[90px] sm:min-h-[80px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                filter: 'blur(4px)',
                transform: 'translateY(8px) scale(0.98)',
              }}
              animate={{
                opacity: 1,
                filter: 'blur(0px)',
                transform: 'translateY(0px) scale(1)',
              }}
              exit={{
                opacity: 0,
                filter: 'blur(4px)',
                transform: 'translateY(-8px) scale(0.98)',
              }}
              transition={{
                duration: 0.28,
                ease: [0.23, 1, 0.32, 1], // Emil Kowalski custom ease-out
              }}
              className="space-y-3"
            >
              <p className="text-base sm:text-lg md:text-xl font-normal text-[#ececf1] leading-relaxed tracking-tight text-center sm:text-left">
                «{current.text}»
              </p>
              <p className="text-xs font-mono text-[#71717a] tracking-wide text-center sm:text-left">
                — {current.source}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
