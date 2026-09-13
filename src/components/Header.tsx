import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Clock } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playClickSound } from '../audio/soundEffects';

interface HeaderProps {
  onSoundToggle?: (enabled: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSoundToggle }) => {
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    setSoundOn(isSoundEnabled());

    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
    if (nextState) {
      playClickSound();
    }
    onSoundToggle?.(nextState);
  };

  return (
    <header className="sticky top-4 sm:top-6 z-40 w-full px-4 sm:px-8 max-w-5xl mx-auto flex items-center justify-between">
      {/* Status indicator */}
      <div className="glass-panel-subtle px-3.5 py-1.5 rounded-full flex items-center gap-2.5 text-xs text-[#a1a1aa] font-medium tracking-wide">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[#e4e4e7] hidden sm:inline">Open for visionary craft</span>
        <span className="text-[#e4e4e7] sm:hidden">Online</span>
      </div>

      {/* Center time widget */}
      <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#71717a] glass-panel-subtle px-3 py-1.5 rounded-full border border-white/5">
        <Clock className="w-3.5 h-3.5 text-[#a1a1aa]" />
        <span className="text-[#d4d4d8] font-medium">{timeStr}</span>
      </div>

      {/* Right controls: Sound toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleToggleSound}
          className="pressable glass-panel-subtle px-3 py-1.5 rounded-full flex items-center gap-2 text-xs text-[#d4d4d8] hover:text-white hover:border-white/20 transition-colors focus:outline-none"
          title={soundOn ? 'Отключить тактильный звук' : 'Включить тактильный звук'}
          aria-label="Toggle sound feedback"
        >
          {soundOn ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-[11px] font-medium tracking-wider uppercase text-[#a1a1aa]">Sound</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#71717a]" />
              <span className="text-[11px] font-medium tracking-wider uppercase text-[#71717a]">Muted</span>
            </>
          )}
        </button>

        <div className="glass-panel-subtle px-2.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs text-[#a1a1aa]">
          <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
          <span className="text-[11px] font-mono tracking-wide text-[#e4e4e7]">v2.4</span>
        </div>
      </div>
    </header>
  );
};
