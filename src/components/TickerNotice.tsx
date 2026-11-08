import React from 'react';
import { Send } from 'lucide-react';

interface TickerNoticeProps {
  onTelegramClick: () => void;
}

export const TickerNotice: React.FC<TickerNoticeProps> = ({ onTelegramClick }) => {
  return (
    <div 
      onClick={onTelegramClick}
      className="w-full bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800/80 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-colors overflow-hidden select-none"
    >
      <Send className="w-3.5 h-3.5 text-orange-500 shrink-0" />
      <div className="truncate text-[11px] sm:text-xs">
        <span className="font-medium text-slate-900 dark:text-slate-100">Mutiganda Yvan VPN:</span>{' '}
        <span>High-speed secure tunnel active · Click to join official Telegram</span>
      </div>
    </div>
  );
};
