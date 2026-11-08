import React from 'react';
import { Crown, Sparkles, Copy, Check } from 'lucide-react';

interface InformationBarProps {
  onOpenVip: () => void;
}

export const InformationBar: React.FC<InformationBarProps> = ({ onOpenVip }) => {
  return (
    <div className="w-full bg-[#0a1936] text-white px-3 sm:px-4 py-2 border-b border-blue-950 shadow-inner select-none transition-colors">
      <div className="flex items-center justify-between gap-2 overflow-x-auto text-[11px] sm:text-xs">
        
        {/* Left Information Items */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 font-medium">
          {/* RW Badge */}
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-200 font-bold border border-blue-700/60 font-mono text-[10px]">
            <span>🇷🇼</span>
            <span>RW</span>
          </span>

          {/* MTN Number */}
          <span className="text-slate-300 font-mono">
            80949484
          </span>

          <span className="text-blue-500/60">·</span>

          {/* MoMo Code */}
          <span className="text-amber-300 font-bold font-mono tracking-wide">
            CODE 2238763
          </span>

          <span className="text-blue-500/60 hidden xs:inline">·</span>

          {/* Account Name */}
          <span className="text-blue-200 text-[10px] sm:text-[11px] font-semibold whitespace-nowrap hidden xs:inline">
            (YVAN MUTIGANDA)
          </span>
        </div>

        {/* Right VIP / Price Button */}
        <button
          onClick={onOpenVip}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-[11px] sm:text-xs shadow-md transition-all active:scale-95 cursor-pointer shrink-0 border border-amber-300"
          title="Kwishyura VIP - 2000 FRW"
        >
          <span className="text-xs">👑</span>
          <span className="tracking-tight">2000 FRW</span>
        </button>

      </div>
    </div>
  );
};
