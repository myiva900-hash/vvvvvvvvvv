import React from 'react';
import { KeyRound, ShieldAlert, Check, X } from 'lucide-react';
import { MyvLogo } from './MyvLogo';

interface VpnPermissionModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const VpnPermissionModal: React.FC<VpnPermissionModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150">
        
        {/* Android System VPN Permission Header */}
        <div className="flex items-center gap-3 mb-3.5">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Connection request
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              android.net.VpnService
            </p>
          </div>
        </div>

        {/* Official Android VpnService System Warning Text */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
          <p className="mb-2 font-medium">
            <strong>Mutiganda Yvan VPN</strong> wants to set up a VPN connection that allows it to monitor network traffic. Only accept if you trust the source.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <span>A key icon 🔑 appears at the top of your screen when VPN is active.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 text-xs font-bold">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors cursor-pointer"
          >
            OK
          </button>
        </div>

      </div>
    </div>
  );
};
