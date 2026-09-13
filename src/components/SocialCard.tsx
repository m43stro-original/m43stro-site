import React, { useRef, useState } from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { playClickSound, playHoverSound, playSuccessSound } from '../audio/soundEffects';

export interface SocialCardProps {
  platform: 'telegram' | 'github' | 'discord';
  title: string;
  handle: string;
  url?: string;
  icon: React.ReactNode;
  description: string;
  badge?: string;
  onCopySuccess?: (text: string, title: string) => void;
}

export const SocialCard: React.FC<SocialCardProps> = ({
  platform,
  title,
  handle,
  url,
  icon,
  description,
  badge,
  onCopySuccess,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const textToCopy = platform === 'discord' ? handle : handle.startsWith('@') ? handle : handle;
    navigator.clipboard.writeText(textToCopy);

    playSuccessSound();
    setCopied(true);
    onCopySuccess?.(textToCopy, title);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleClick = () => {
    playClickSound();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (platform === 'discord') {
      handleCopy({ stopPropagation: () => {}, preventDefault: () => {} } as React.MouseEvent);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true);
        playHoverSound();
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className="pressable relative group rounded-2xl glass-panel p-5 sm:p-6 cursor-pointer flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-white/20 focus:outline-none"
    >
      {/* Specular cursor spotlight following mouse coordinates */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isHovered
            ? `radial-gradient(360px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.08), transparent 80%)`
            : 'none',
        }}
      />

      {/* Top row: Icon, Badge, Actions */}
      <div className="flex items-start justify-between relative z-10">
        <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#e4e4e7] group-hover:text-white group-hover:bg-white/[0.08] transition-colors duration-200">
          {icon}
        </div>

        <div className="flex items-center gap-1.5">
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/[0.04] text-[#a1a1aa] border border-white/5">
              {badge}
            </span>
          )}

          {/* Action button: Copy or External link */}
          <button
            onClick={handleCopy}
            className="pressable w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 flex items-center justify-center text-[#a1a1aa] hover:text-white transition-colors"
            title={`Скопировать ${title}`}
            aria-label={`Скопировать ${title}`}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          {url && (
            <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-[#71717a] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mt-8 relative z-10">
        <div className="text-xs font-mono uppercase tracking-wider text-[#71717a] group-hover:text-[#a1a1aa] transition-colors">
          {title}
        </div>
        <div className="text-lg sm:text-xl font-semibold text-white mt-1 tracking-tight flex items-center gap-2">
          <span>{handle}</span>
        </div>
        <p className="text-xs text-[#8e8e99] mt-2 font-normal leading-relaxed">
          {description}
        </p>
      </div>

      {/* Bottom subtle status bar */}
      <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-[#71717a] relative z-10">
        <span>{platform === 'discord' ? 'Кликните для копирования' : 'Перейти по ссылке'}</span>
        <span className="group-hover:text-[#d4d4d8] transition-colors">→</span>
      </div>
    </div>
  );
};
