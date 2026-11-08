import React, { useState, useEffect, useRef } from 'react';
import { Copy, Trash2, Download, Search, Check, Terminal } from 'lucide-react';
import { VpnLogEntry } from '../types/vpn';

interface LogScreenProps {
  logs: VpnLogEntry[];
  onClearLogs: () => void;
}

export const LogScreen: React.FC<LogScreenProps> = ({ logs, onClearLogs }) => {
  const [copied, setCopied] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredLogs = logs.filter(
    l => l.message.toLowerCase().includes(filterText.toLowerCase()) ||
         l.timestamp.includes(filterText)
  );

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const handleCopy = () => {
    const raw = logs.map(l => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(raw).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const raw = logs.map(l => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message}`).join('\n');
    const blob = new Blob([raw], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `myv-vpn-log-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 w-full max-w-xl mx-auto p-3 sm:p-4 pb-20 flex flex-col gap-2 select-none h-full">
      {/* Log Header Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-2.5 shadow-xs border border-slate-200/90 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          <input
            type="text"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            placeholder="Filter logs..."
            className="w-full text-xs bg-transparent border-none focus:outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-2 py-1 text-[10px] font-semibold rounded transition-colors ${
              autoScroll
                ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}
            title="Toggle auto-scroll to bottom"
          >
            Auto-Scroll
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
            title="Copy all logs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
            title="Download log file"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onClearLogs}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
            title="Clear log"
          >
            <Trash2 className="w-4 h-4 hover:text-rose-500" />
          </button>
        </div>
      </div>

      {/* Terminal View */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-[380px] bg-slate-950 text-slate-200 rounded-xl p-3 font-mono text-[11px] leading-relaxed overflow-y-auto border border-slate-800 shadow-inner select-text"
      >
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2 py-12">
            <Terminal className="w-8 h-8 opacity-40" />
            <p className="text-xs">No log entries found</p>
            <p className="text-[10px]">Start the VPN tunnel to view real-time connection diagnostics</p>
          </div>
        ) : (
          filteredLogs.map(item => {
            let color = 'text-slate-300';
            if (item.level === 'success') color = 'text-emerald-400';
            else if (item.level === 'warn') color = 'text-amber-400';
            else if (item.level === 'error') color = 'text-rose-400 font-semibold';
            else if (item.message.includes('[Payload]') || item.message.includes('[TLS]')) color = 'text-cyan-400';

            return (
              <div key={item.id} className="py-0.5 break-all">
                <span className="text-slate-500 select-none mr-2">[{item.timestamp}]</span>
                <span className={color}>{item.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
