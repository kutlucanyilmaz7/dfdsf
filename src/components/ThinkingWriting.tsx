import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export function ThinkingAnimation() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 p-4 bg-zinc-100 rounded-2xl border border-zinc-200 w-fit">
      <div className="flex gap-1">
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1, times: [0, 0.5, 1] }}
          className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
        />
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1, times: [0, 0.5, 1], delay: 0.2 }}
          className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
        />
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1, times: [0, 0.5, 1], delay: 0.4 }}
          className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
        />
      </div>
      <span className="text-zinc-500 text-sm font-medium animate-sweep inline-block">{t('thinking')}...</span>
    </div>
  );
}

export function WritingAnimation() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 p-4 bg-zinc-100 rounded-2xl border border-zinc-200 relative w-fit overflow-hidden">
      <motion.div
        animate={{ width: ['0%', '100%', '0%'] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="h-0.5 bg-primary absolute bottom-0 left-0"
      />
      <span className="text-zinc-500 text-sm font-medium animate-sweep inline-block">{t('writing')}...</span>
    </div>
  );
}
