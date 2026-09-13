import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  text: string;
}

interface SonnerToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const SonnerToast: React.FC<SonnerToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div 
      className="fixed bottom-6 inset-x-0 z-50 flex flex-col items-center pointer-events-none gap-2 px-4"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 2800);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      initial={{
        opacity: 0,
        transform: 'translateY(16px) scale(0.95)',
      }}
      animate={{
        opacity: 1,
        transform: 'translateY(0px) scale(1)',
      }}
      exit={{
        opacity: 0,
        transform: 'translateY(10px) scale(0.96)',
      }}
      transition={{
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1], // Apple-style spring ease
      }}
      className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel shadow-2xl border border-white/15 max-w-sm w-full backdrop-blur-3xl"
    >
      <div className="w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-white tracking-tight truncate">
          {toast.title} скопирован
        </div>
        <div className="text-[11px] font-mono text-[#a1a1aa] truncate">
          {toast.text}
        </div>
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="w-6 h-6 rounded-lg text-[#71717a] hover:text-white flex items-center justify-center transition-colors"
        aria-label="Закрыть уведомление"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};
