import React from 'react';
import { X, ShieldCheck, Heart, Info, Code, Lock } from 'lucide-react';
import { MyvLogo } from './MyvLogo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAndroidCode: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onOpenAndroidCode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-orange-50/50 dark:bg-orange-950/20 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <MyvLogo size={24} />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              About Mutiganda Yvan VPN
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          
          <div className="text-center py-2">
            <MyvLogo size={56} className="mx-auto mb-2" />
            <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Mutiganda Yvan VPN
            </h4>
            <p className="text-[11px] font-semibold text-orange-600 dark:text-orange-400">
              Version 2.4.0 (Build 108)
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Engineered by <span className="font-semibold text-slate-800 dark:text-slate-200">Mutiganda Yvan</span>
            </p>
          </div>

          {/* Privacy & Architecture Notice */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Official Android VpnService Architecture</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Mutiganda Yvan VPN establishes a virtual TUN network interface using Android's official <code className="text-orange-600 dark:text-orange-400 font-mono">android.net.VpnService</code> API. All traffic is securely encapsulated and encrypted.
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-xs">
              <Lock className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Privacy & Zero-Logs Policy</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              We do not track, log, store, or sell user browsing activity, IP destinations, or DNS lookups. Configuration profiles use AES-256-GCM encryption with device HWID binding to protect private keys.
            </p>
          </div>

          {/* Compliance notice */}
          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
            Notice: Designed strictly for legitimate privacy, security testing, and encrypted data routing. Adheres to Google Play Developer Program policies and Android networking standards.
          </p>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/60 rounded-b-2xl">
          <button
            onClick={() => {
              onClose();
              onOpenAndroidCode();
            }}
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1.5"
          >
            <Code className="w-3.5 h-3.5" />
            <span>View Android Studio Code</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
