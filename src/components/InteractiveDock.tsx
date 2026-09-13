import React, { useState } from 'react';
import { Send, MessageSquare, Sparkles, Volume2, VolumeX, Shuffle } from 'lucide-react';
import { GithubIcon } from './icons/GithubIcon';
import confetti from 'canvas-confetti';
import { playClickSound, playHoverSound, playSuccessSound } from '../audio/soundEffects';

interface InteractiveDockProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onNextQuote: () => void;
  onCopyDiscord: () => void;
}

export const InteractiveDock: React.FC<InteractiveDockProps> = ({
  soundEnabled,
  onToggleSound,
  onNextQuote,
  onCopyDiscord,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const triggerSparkles = () => {
    playSuccessSound();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.9 },
      colors: ['#ffffff', '#a1a1aa', '#60a5fa', '#f59e0b'],
      disableForReducedMotion: true,
    });
  };

  const dockItems = [
    {
      id: 'telegram',
      icon: <Send className="w-4 h-4 text-[#38bdf8]" />,
      label: 'Telegram: @MAESTROMKI',
      onClick: () => {
        playClickSound();
        window.open('https://t.me/MAESTROMKI', '_blank');
      },
    },
    {
      id: 'github',
      icon: <GithubIcon className="w-4 h-4 text-[#f4f4f5]" />,
      label: 'GitHub: m43stro-original',
      onClick: () => {
        playClickSound();
        window.open('https://github.com/m43stro-original', '_blank');
      },
    },
    {
      id: 'discord',
      icon: <MessageSquare className="w-4 h-4 text-[#818cf8]" />,
      label: 'Скопировать Discord: _mki_',
      onClick: () => {
        onCopyDiscord();
      },
    },
    {
      id: 'quote',
      icon: <Shuffle className="w-4 h-4 text-[#fbbf24]" />,
      label: 'Новая мудрость',
      onClick: () => {
        onNextQuote();
      },
    },
    {
      id: 'sparkles',
      icon: <Sparkles className="w-4 h-4 text-[#e879f9]" />,
      label: 'Частицы вдохновения',
      onClick: triggerSparkles,
    },
    {
      id: 'sound',
      icon: soundEnabled ? (
        <Volume2 className="w-4 h-4 text-emerald-400" />
      ) : (
        <VolumeX className="w-4 h-4 text-[#71717a]" />
      ),
      label: soundEnabled ? 'Звук: Вкл' : 'Звук: Выкл',
      onClick: () => {
        playClickSound();
        onToggleSound();
      },
    },
  ];

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 px-3">
      <nav 
        className="glass-panel px-3 py-2 rounded-2xl flex items-center gap-1.5 sm:gap-2 shadow-2xl border border-white/10"
        aria-label="Quick Actions Dock"
      >
        {dockItems.map((item) => (
          <div key={item.id} className="relative">
            {/* Tooltip */}
            {activeTooltip === item.id && (
              <div
                className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg glass-panel-subtle text-[11px] font-mono text-white whitespace-nowrap pointer-events-none z-50 border border-white/10 shadow-lg"
                style={{
                  animation: 'fadeIn 120ms cubic-bezier(0.23, 1, 0.32, 1) forwards',
                }}
              >
                {item.label}
              </div>
            )}

            <button
              onClick={item.onClick}
              onMouseEnter={() => {
                setActiveTooltip(item.id);
                playHoverSound();
              }}
              onMouseLeave={() => setActiveTooltip(null)}
              className="pressable w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.12] border border-white/5 hover:border-white/15 flex items-center justify-center transition-all duration-150 focus:outline-none"
              aria-label={item.label}
            >
              {item.icon}
            </button>
          </div>
        ))}
      </nav>
    </div>
  );
};
