import React from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { GithubIcon } from './icons/GithubIcon';
import { SocialCard } from './SocialCard';

interface SocialGridProps {
  onCopySuccess: (text: string, title: string) => void;
}

export const SocialGrid: React.FC<SocialGridProps> = ({ onCopySuccess }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-6 sm:my-10">
      <div className="mb-4 flex items-center justify-between px-1">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#71717a]">
          Connect & Collab
        </h2>
        <span className="text-[11px] font-mono text-[#52525b]">
          3 channels
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Telegram Card */}
        <SocialCard
          platform="telegram"
          title="Telegram"
          handle="@MAESTROMKI"
          url="https://t.me/MAESTROMKI"
          icon={<Send className="w-5 h-5 text-[#38bdf8]" />}
          description="Прямой канал оперативной связи, архитектурных идей и коллабораций."
          badge="Direct"
          onCopySuccess={onCopySuccess}
        />

        {/* GitHub Card */}
        <SocialCard
          platform="github"
          title="GitHub"
          handle="m43stro-original"
          url="https://github.com/m43stro-original"
          icon={<GithubIcon className="w-5 h-5 text-[#f4f4f5]" />}
          description="Исходный код, архитектурные концепции и открытые эксперименты."
          badge="Open Source"
          onCopySuccess={onCopySuccess}
        />

        {/* Discord Card */}
        <SocialCard
          platform="discord"
          title="Discord"
          handle="_mki_"
          icon={<MessageSquare className="w-5 h-5 text-[#818cf8]" />}
          description="Инженерные дискуссии, голосовые сессии и закрытые сообщества."
          badge="Copy Tag"
          onCopySuccess={onCopySuccess}
        />
      </div>
    </div>
  );
};
