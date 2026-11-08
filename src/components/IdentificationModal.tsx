import React, { useState } from 'react';
import { X, Fingerprint, Copy, Check, Smartphone, Key, ShieldCheck } from 'lucide-react';
import { getOrCreateDeviceId } from '../services/configManager';

interface IdentificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IdentificationModal: React.FC<IdentificationModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const deviceHwid = getOrCreateDeviceId();
  const appVersion = 'Mutiganda Yvan VPN v2.4.0 (Build 108)';
  const osFingerprint = 'Android 14 (API 34) · Linux 6.1.75-android14-11';
  const protocolId = 'MYV-V2-CHACHA20-POLY1305';

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(keyName);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Fingerprint className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Device Identification
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
        <div className="space-y-3.5 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Hardware ID (HWID)
              </span>
              <button
                onClick={() => handleCopy(deviceHwid, 'hwid')}
                className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
              >
                {copiedKey === 'hwid' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copiedKey === 'hwid' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg font-mono text-[11px] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 break-all select-all">
              {deviceHwid}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Used when locking exported configuration profiles to this specific device.
            </p>
          </div>

          <div>
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              App Version
            </span>
            <div className="p-2 bg-slate-50 dark:bg-slate-800/80 rounded-lg text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
              {appVersion}
            </div>
          </div>

          <div>
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              System Fingerprint
            </span>
            <div className="p-2 bg-slate-50 dark:bg-slate-800/80 rounded-lg text-slate-700 dark:text-slate-300 font-mono text-[10px] border border-slate-200/80 dark:border-slate-700/80">
              {osFingerprint}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
