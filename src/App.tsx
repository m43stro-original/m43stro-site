import React, { useState, useEffect, useCallback } from 'react';
import { AmbientBackdrop } from './components/AmbientBackdrop';
import { Header } from './components/Header';
import { HeroTitle } from './components/HeroTitle';
import { QuoteSection } from './components/QuoteSection';
import { SocialGrid } from './components/SocialGrid';
import { InteractiveDock } from './components/InteractiveDock';
import { SonnerToast, ToastMessage } from './components/SonnerToast';
import { isSoundEnabled, setSoundEnabled, playSuccessSound } from './audio/soundEffects';

export const App: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [soundEnabled, setSoundState] = useState(true);
  const [quoteTrigger, setQuoteTrigger] = useState(0);

  useEffect(() => {
    setSoundState(isSoundEnabled());
  }, []);

  const addToast = useCallback((text: string, title: string) => {
    const newToast: ToastMessage = {
      id: `${Date.now()}-${Math.random()}`,
      title,
      text,
    };
    setToasts((prev) => [...prev.slice(-2), newToast]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleCopyDiscord = useCallback(() => {
    navigator.clipboard.writeText('_mki_');
    playSuccessSound();
    addToast('_mki_', 'Discord тег');
  }, [addToast]);

  const handleNextQuote = useCallback(() => {
    setQuoteTrigger((prev) => prev + 1);
  }, []);

  const handleToggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundState(next);
    setSoundEnabled(next);
  }, [soundEnabled]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === ' ' || e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        handleNextQuote();
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'c' || e.key === 'C') {
        handleCopyDiscord();
      } else if (e.key === 'm' || e.key === 'M') {
        handleToggleSound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextQuote, handleCopyDiscord, handleToggleSound]);

  return (
    <div className="relative min-h-screen bg-[#070709] text-[#f5f5f7] flex flex-col justify-between selection:bg-white/20 selection:text-white pb-28 pt-4">
      {/* 60fps Dynamic Ambient Canvas & Glows */}
      <AmbientBackdrop />

      {/* Top Header */}
      <Header onSoundToggle={(enabled) => setSoundState(enabled)} />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        {/* Massive Hero M43STRO */}
        <HeroTitle />

        {/* The Wise Quote */}
        <QuoteSection externalTrigger={quoteTrigger} />

        {/* The 3 Social Cards: Telegram, GitHub, Discord */}
        <SocialGrid onCopySuccess={addToast} />
      </main>

      {/* Minimalist Footer */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto px-4 mt-12 text-center text-xs text-[#52525b] font-mono flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/[0.04] pt-6">
        <div>
          <span className="text-[#a1a1aa] font-medium">M43STRO</span> © {new Date().getFullYear()} — Все права защищены.
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[#71717a]">
          <span>Dark Titanium</span>
          <span>•</span>
          <span>Apple Motion Guidelines</span>
          <span>•</span>
          <span>Emil Kowalski Craft</span>
        </div>
      </footer>

      {/* macOS-style Interactive Floating Dock */}
      <InteractiveDock
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onNextQuote={handleNextQuote}
        onCopyDiscord={handleCopyDiscord}
      />

      {/* Sonner Toast Container */}
      <SonnerToast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
