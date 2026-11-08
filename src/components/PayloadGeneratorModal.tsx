import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { generatePayload, PayloadGeneratorOptions } from '../services/payloadEngine';

interface PayloadGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPayload: (payload: string) => void;
}

export const PayloadGeneratorModal: React.FC<PayloadGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApplyPayload,
}) => {
  const [options, setOptions] = useState<PayloadGeneratorOptions>({
    method: 'CONNECT',
    url: '[host_port]',
    injectionPoint: 'normal',
    onlineHost: true,
    forwardHost: false,
    reverseProxy: true,
    keepAlive: true,
    userAgent: true,
    referer: false,
    dualConnect: false,
    split: 'none',
  });

  const [generated, setGenerated] = useState(() => generatePayload(options));
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    const p = generatePayload(options);
    setGenerated(p);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleApply = () => {
    onApplyPayload(generated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-orange-50/50 dark:bg-orange-950/20 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              Payload Generator
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          
          {/* Method & URL */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-4">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Request Method
              </label>
              <select
                value={options.method}
                onChange={e => {
                  const updated = { ...options, method: e.target.value as any };
                  setOptions(updated);
                  setGenerated(generatePayload(updated));
                }}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="CONNECT">CONNECT</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="HEAD">HEAD</option>
                <option value="PUT">PUT</option>
                <option value="OPTIONS">OPTIONS</option>
              </select>
            </div>

            <div className="col-span-8">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Injection URL / Host
              </label>
              <input
                type="text"
                value={options.url}
                onChange={e => {
                  const updated = { ...options, url: e.target.value };
                  setOptions(updated);
                  setGenerated(generatePayload(updated));
                }}
                placeholder="[host_port] or example.com"
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
              />
            </div>
          </div>

          {/* Injection Point */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Injection Point
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'front', 'back'] as const).map(pt => (
                <button
                  key={pt}
                  type="button"
                  onClick={() => {
                    const updated = { ...options, injectionPoint: pt };
                    setOptions(updated);
                    setGenerated(generatePayload(updated));
                  }}
                  className={`py-1.5 px-3 rounded-lg capitalize font-medium text-center border transition-colors ${
                    options.injectionPoint === pt
                      ? 'bg-orange-500 text-white border-orange-500 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pt} Inject
                </button>
              ))}
            </div>
          </div>

          {/* Header Checkboxes */}
          <div>
            <span className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Request Headers & Modifiers
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'onlineHost', label: 'Online Host' },
                { key: 'forwardHost', label: 'Forward Host' },
                { key: 'reverseProxy', label: 'Reverse Proxy' },
                { key: 'keepAlive', label: 'Keep-Alive' },
                { key: 'userAgent', label: 'User-Agent' },
                { key: 'referer', label: 'Referer' },
                { key: 'dualConnect', label: 'Dual Connect' },
              ].map(item => (
                <label
                  key={item.key}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(options[item.key as keyof PayloadGeneratorOptions])}
                    onChange={e => {
                      const updated = { ...options, [item.key]: e.target.checked };
                      setOptions(updated);
                      setGenerated(generatePayload(updated));
                    }}
                    className="accent-orange-500 rounded"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Generated Payload Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Generated Payload
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <textarea
              readOnly
              rows={4}
              value={generated}
              className="w-full p-2.5 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-lg border border-slate-800 focus:outline-none select-text leading-normal"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50/60 dark:bg-slate-900/60 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <span>Apply to Custom Setup</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
