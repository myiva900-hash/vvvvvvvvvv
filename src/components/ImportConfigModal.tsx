import React, { useState } from 'react';
import { X, Download, Lock, CheckCircle, AlertCircle, FileText, Key, ArrowRight } from 'lucide-react';
import { ExportableConfig } from '../types/vpn';
import { parseAndValidateConfig, getOrCreateDeviceId } from '../services/configManager';

interface ImportConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigImported: (config: ExportableConfig) => void;
}

export const ImportConfigModal: React.FC<ImportConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigImported,
}) => {
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [password, setPassword] = useState('');
  const [needPassword, setNeedPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successConfig, setSuccessConfig] = useState<ExportableConfig | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg(null);
    setSuccessConfig(null);
    setNeedPassword(false);

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      setFileContent(text);
      attemptParse(text, '');
    };
    reader.readAsText(file);
  };

  const attemptParse = (rawText: string, pass: string) => {
    setErrorMsg(null);
    const userHwid = getOrCreateDeviceId();
    const result = parseAndValidateConfig(rawText, pass, userHwid);

    if (result.success && result.config) {
      setSuccessConfig(result.config);
      setNeedPassword(false);
    } else {
      if (result.error === 'PASSWORD_REQUIRED') {
        setNeedPassword(true);
        setErrorMsg('This configuration profile is encrypted with a password. Please enter it below.');
      } else {
        setErrorMsg(result.error || 'Failed to import configuration.');
      }
    }
  };

  const handleApply = () => {
    if (successConfig) {
      onConfigImported(successConfig);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-orange-50/50 dark:bg-orange-950/20 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-orange-500" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              Import Config (.myv)
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
          
          {/* File Picker */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Configuration File (.myv)
            </label>
            <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50/30 dark:hover:bg-orange-950/20 transition-all text-center">
              <FileText className="w-8 h-8 text-orange-500 mb-2" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {fileName ? fileName : 'Click to browse .myv file'}
              </span>
              <span className="text-[10px] text-slate-400 mt-1">
                Supports Mutiganda Yvan VPN encrypted profile files
              </span>
              <input
                type="file"
                accept=".myv,.json,.hat,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Password Prompt if required */}
          {needPassword && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/40 space-y-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-xs">
                <Key className="w-4 h-4" />
                <span>Password Protected Configuration</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter decryption password"
                  className="flex-1 p-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={() => attemptParse(fileContent, password)}
                  className="px-3 py-2 bg-orange-500 text-white font-bold rounded-lg text-xs hover:bg-orange-600 transition-colors"
                >
                  Unlock
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-900/40 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Validation Box */}
          {successConfig && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-900/40 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Valid Configuration Profile!</span>
              </div>
              <div className="pl-6 text-[11px] space-y-0.5 text-slate-700 dark:text-slate-300">
                <div><span className="font-semibold">Name:</span> {successConfig.configName}</div>
                <div><span className="font-semibold">Mode:</span> {successConfig.connectionMode.toUpperCase()}</div>
                <div><span className="font-semibold">Target Server:</span> {successConfig.serverHost}:{successConfig.serverPort}</div>
                {successConfig.note && (
                  <div><span className="font-semibold">Note:</span> {successConfig.note}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50/60 dark:bg-slate-900/60 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!successConfig}
            className="px-5 py-2 text-xs font-bold bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Load Configuration</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
