import React, { useState } from 'react';
import { X, Send, Copy, Check, ExternalLink } from 'lucide-react';

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramModal: React.FC<TelegramModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const channelLink = 'https://t.me/MutigandaYvanVPN';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(channelLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150 text-center">
        
        <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-500 mx-auto flex items-center justify-center mb-3">
          <Send className="w-7 h-7 -translate-x-0.5 translate-y-0.5 fill-orange-500/20" />
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Telegram Community
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
          Join the official Mutiganda Yvan VPN channel for high-speed configuration updates, server announcements, and community support.
        </p>

        <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-mono text-orange-600 dark:text-orange-400 mb-4 select-all flex items-center justify-between border border-slate-200 dark:border-slate-700">
          <span className="truncate">@MutigandaYvanVPN</span>
          <button
            onClick={handleCopy}
            className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            title="Copy Telegram Link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onClose}
            className="py-2.5 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Close
          </button>
          <a
            href={channelLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="py-2.5 px-4 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Join Now</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
