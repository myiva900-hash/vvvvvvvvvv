import React, { useState } from 'react';
import { X, Server, Activity, RefreshCw, Globe, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SERVERS } from '../data/servers';

interface ServerAppsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServerAppsModal: React.FC<ServerAppsModalProps> = ({ isOpen, onClose }) => {
  const [testing, setTesting] = useState(false);
  const [serverPings, setServerPings] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    SERVERS.forEach(s => { initial[s.id] = s.ping; });
    return initial;
  });

  if (!isOpen) return null;

  const handleTestPings = async () => {
    setTesting(true);
    // Simulate real network prober
    for (const s of SERVERS) {
      await new Promise(r => setTimeout(r, 120));
      const jitter = Math.floor(Math.random() * 12) - 5;
      const newPing = Math.max(18, s.ping + jitter);
      setServerPings(prev => ({ ...prev, [s.id]: newPing }));
    }
    setTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-orange-50/50 dark:bg-orange-950/20 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-orange-500" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              Server Apps & Network Prober
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
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
              Active Server Gateway Nodes
            </span>
            <button
              onClick={handleTestPings}
              disabled={testing}
              className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing Latency...' : 'Refresh Ping'}</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden">
            {SERVERS.map(srv => {
              const ping = serverPings[srv.id] || srv.ping;
              let pingColor = 'text-emerald-500';
              if (ping > 60) pingColor = 'text-amber-500';
              if (ping > 100) pingColor = 'text-rose-500';

              return (
                <div
                  key={srv.id}
                  className="p-3 bg-white dark:bg-slate-900 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg shrink-0">{srv.flag}</span>
                    <div className="truncate">
                      <div className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate">
                        {srv.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {srv.host} · Load {srv.load}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className={`font-mono text-xs font-bold ${pingColor}`}>
                      {ping} ms
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DNS Prober */}
          <div className="pt-2">
            <span className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-2">
              DNS Resolver Performance
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <div className="font-bold text-xs text-slate-800 dark:text-slate-100">Cloudflare</div>
                <div className="font-mono text-[10px] text-slate-500">1.1.1.1</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-xs mt-1">14 ms</div>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <div className="font-bold text-xs text-slate-800 dark:text-slate-100">Google</div>
                <div className="font-mono text-[10px] text-slate-500">8.8.8.8</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-xs mt-1">19 ms</div>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <div className="font-bold text-xs text-slate-800 dark:text-slate-100">Quad9</div>
                <div className="font-mono text-[10px] text-slate-500">9.9.9.9</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-xs mt-1">22 ms</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/60 dark:bg-slate-900/60 rounded-b-2xl">
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
