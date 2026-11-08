import React, { useState } from 'react';
import { 
  MapPin, 
  ChevronDown, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Rocket, 
  Sliders, 
  Check, 
  Play, 
  Square, 
  Activity, 
  ShieldCheck, 
  Globe2, 
  Wifi, 
  Cpu,
  Sparkles,
  FileCode,
  Lock,
  Smartphone,
  Download,
  Crown,
  Zap,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import { ConnectionMode, ConnectionStatus, CustomSetupConfig, VpnServer } from '../types/vpn';
import { VpnStats, vpnSimulator } from '../services/vpnSimulator';
import { SERVERS, AVAILABLE_PORTS } from '../data/servers';

interface HomeScreenProps {
  status: ConnectionStatus;
  stats: VpnStats;
  selectedServer: VpnServer;
  onSelectServer: (server: VpnServer) => void;
  selectedPort: number;
  onSelectPort: (port: number) => void;
  connectionMode: ConnectionMode;
  onSelectConnectionMode: (mode: ConnectionMode) => void;
  customSetupEnabled: boolean;
  onToggleCustomSetup: (enabled: boolean) => void;
  customSetup: CustomSetupConfig;
  onUpdateCustomSetup: (updates: Partial<CustomSetupConfig>) => void;
  onStartVpn: () => void;
  onStopVpn: () => void;
  onOpenPayloadGen: () => void;
  onOpenAndroidCode: () => void;
  onOpenImportConfig: () => void;
  onOpenInstallApp?: () => void;
  onOpenVipPayment: () => void;
}

const CONNECTION_MODES: {
  id: ConnectionMode;
  title: string;
  subtitle: string;
  badge: string;
}[] = [
  {
    id: 'direct',
    title: 'Direct Connection',
    subtitle: 'Rwanda & Global Internet',
    badge: 'DIRECT'
  },
  {
    id: 'custom_payload',
    title: 'Custom Payload',
    subtitle: 'TCP / HTTP Injection Mode',
    badge: 'PAYLOAD'
  },
  {
    id: 'custom_host',
    title: 'Custom Host Header',
    subtitle: 'HTTP Header Spoofing',
    badge: 'HOST'
  },
  {
    id: 'custom_sni',
    title: 'Custom SNI',
    subtitle: 'SSL / TLS Server Name Indication',
    badge: 'TLS/SNI'
  },
  {
    id: 'dnstt',
    title: 'DNSTT Tunnel',
    subtitle: 'DNS Tunneling over UDP 53',
    badge: 'DNSTT'
  },
  {
    id: 'imported_config',
    title: 'Imported Config',
    subtitle: 'Encrypted .myv Configuration Profile',
    badge: 'MYV CONFIG'
  }
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  status,
  stats,
  selectedServer,
  onSelectServer,
  selectedPort,
  onSelectPort,
  connectionMode,
  onSelectConnectionMode,
  customSetupEnabled,
  onToggleCustomSetup,
  customSetup,
  onUpdateCustomSetup,
  onStartVpn,
  onStopVpn,
  onOpenPayloadGen,
  onOpenAndroidCode,
  onOpenImportConfig,
  onOpenInstallApp,
  onOpenVipPayment,
}) => {
  const [showServerMenu, setShowServerMenu] = useState(false);
  const [showPortMenu, setShowPortMenu] = useState(false);
  const [showModeMenu, setShowModeMenu] = useState(false);

  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting' || status === 'authenticating';
  const isBusy = isConnecting || status === 'disconnecting';

  // Format elapsed connection duration HH:MM:SS
  const formatDuration = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentModeInfo = CONNECTION_MODES.find(m => m.id === connectionMode) || CONNECTION_MODES[0];

  // Dynamic traffic counters: start baseline at requested default 1.2 MB / 3.7 MB and add live stream bytes
  const baseUploadBytes = 1.2 * 1024 * 1024;
  const baseDownloadBytes = 3.7 * 1024 * 1024;
  const currentUploadDisplay = vpnSimulator.formatBytes(baseUploadBytes + stats.uploadBytes);
  const currentDownloadDisplay = vpnSimulator.formatBytes(baseDownloadBytes + stats.downloadBytes);

  return (
    <div className="flex-1 w-full max-w-xl mx-auto p-3 sm:p-4 pb-20 flex flex-col gap-3.5 select-none">
      
      {/* 4. MAIN VPN CARD (Large rounded white card with subtle shadow) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-md border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 relative overflow-hidden transition-all">
        
        {/* Card Header: MYV VIP PRO & Badges */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-sm shadow-md">
              MYV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">
                  MYV VIP PRO
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-extrabold text-[10px] tracking-wide border border-blue-200 dark:border-blue-800">
                  V3.0 UPGRADE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Mutiganda Yvan VPN · High-Speed Tunnel
              </p>
            </div>
          </div>

          {/* Country / VIP Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] sm:text-[11px] font-black shadow-xs shrink-0">
            <span>🇷🇼</span>
            <span>RWANDA VIP</span>
          </div>
        </div>

        {/* 5. SERVER SECTION & 6. PORT SECTION */}
        <div className="grid grid-cols-12 gap-3 pt-3.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          
          {/* 5. SERVER SECTION */}
          <div className="col-span-8 sm:col-span-8 relative">
            <span className="block text-[10px] sm:text-[11px] font-extrabold tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 uppercase">
              SELECT SERVER
            </span>

            <button
              onClick={() => {
                setShowServerMenu(!showServerMenu);
                setShowPortMenu(false);
                setShowModeMenu(false);
              }}
              disabled={isConnected || isBusy}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-colors text-left disabled:opacity-60 cursor-pointer h-[54px]"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-1">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center shrink-0 text-base shadow-xs">
                  {selectedServer.flag || '🇷🇼'}
                </div>
                <div className="truncate">
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 truncate flex items-center gap-1.5">
                    <span>{selectedServer.name}</span>
                    <span className="text-[10px] font-mono px-1 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold shrink-0">
                      {selectedServer.ping}ms
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {selectedServer.country}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {/* Server Dropdown Popover */}
            {showServerMenu && (
              <div className="absolute top-full left-0 w-72 sm:w-80 mt-1 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-1.5 z-40 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>Available VPN Gateways</span>
                  <span>Latency</span>
                </div>
                {SERVERS.map(srv => (
                  <button
                    key={srv.id}
                    onClick={() => {
                      onSelectServer(srv);
                      setShowServerMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left hover:bg-blue-50 dark:hover:bg-slate-800/80 transition-colors ${
                      selectedServer.id === srv.id ? 'bg-blue-50/80 dark:bg-blue-950/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{srv.flag}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {srv.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {srv.country}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {srv.ping}ms
                      </span>
                      {selectedServer.id === srv.id && (
                        <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 6. PORT SECTION */}
          <div className="col-span-4 sm:col-span-4 relative">
            <span className="block text-[10px] sm:text-[11px] font-extrabold tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 uppercase">
              SELECT PORT
            </span>

            <button
              onClick={() => {
                setShowPortMenu(!showPortMenu);
                setShowServerMenu(false);
                setShowModeMenu(false);
              }}
              disabled={isConnected || isBusy}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-colors text-left disabled:opacity-60 cursor-pointer h-[54px]"
            >
              <div className="truncate">
                <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                  P {selectedPort}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Port
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {/* Port Dropdown Menu */}
            {showPortMenu && (
              <div className="absolute top-full right-0 w-48 mt-1 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-1.5 z-40 max-h-60 overflow-y-auto">
                <div className="px-3.5 py-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  Select Port
                </div>
                {AVAILABLE_PORTS.map(p => (
                  <button
                    key={p.value}
                    onClick={() => {
                      onSelectPort(p.value);
                      setShowPortMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-blue-50 dark:hover:bg-slate-800/80 transition-colors ${
                      selectedPort === p.value ? 'bg-blue-50/80 dark:bg-blue-950/30' : ''
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {p.label}
                      </div>
                      <div className="text-[9px] text-slate-500">
                        {p.desc}
                      </div>
                    </div>
                    {selectedPort === p.value && (
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 7. TRAFFIC SECTION */}
        <div className="my-3.5 flex justify-center">
          <div className="inline-flex items-center gap-4 sm:gap-6 px-5 py-2 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100 shadow-inner">
            {/* Upload: 1.2 MB */}
            <div className="flex items-center gap-1.5">
              <ArrowUpCircle className="w-4 h-4 text-blue-600 fill-blue-600/20 shrink-0" />
              <span className="font-bold">Upload:</span>
              <span className="text-blue-700 dark:text-blue-400">{currentUploadDisplay}</span>
            </div>

            <span className="text-slate-300 dark:text-slate-600">|</span>

            {/* Download: 3.7 MB */}
            <div className="flex items-center gap-1.5">
              <ArrowDownCircle className="w-4 h-4 text-indigo-600 fill-indigo-600/20 shrink-0" />
              <span className="font-bold">Download:</span>
              <span className="text-indigo-700 dark:text-indigo-400">{currentDownloadDisplay}</span>
            </div>
          </div>
        </div>

        {/* 8. CONNECTION MODE & CUSTOM SETUP */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              CONNECTION MODE
            </span>

            {/* Custom Setup Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase">
                CUSTOM SETUP
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={customSetupEnabled}
                onClick={() => onToggleCustomSetup(!customSetupEnabled)}
                disabled={isConnected || isBusy}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  customSetupEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                } disabled:opacity-50`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    customSetupEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Connection Mode Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowModeMenu(!showModeMenu);
                setShowServerMenu(false);
                setShowPortMenu(false);
              }}
              disabled={isConnected || isBusy}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-colors text-left disabled:opacity-60 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                    {currentModeInfo.title}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {currentModeInfo.subtitle}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {/* Mode selection popover */}
            {showModeMenu && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-1.5 z-40">
                {CONNECTION_MODES.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      onSelectConnectionMode(mode.id);
                      setShowModeMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-blue-50 dark:hover:bg-slate-800/80 transition-colors ${
                      connectionMode === mode.id ? 'bg-blue-50/80 dark:bg-blue-950/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-600">
                        <Rocket className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {mode.title}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {mode.subtitle}
                        </div>
                      </div>
                    </div>
                    {connectionMode === mode.id && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CUSTOM SETUP EXPANDED DRAWER */}
        {customSetupEnabled && (
          <div className="mt-3 p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                Custom {currentModeInfo.title} Parameters
              </span>
              {connectionMode === 'custom_payload' && (
                <button
                  onClick={onOpenPayloadGen}
                  className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  Payload Generator
                </button>
              )}
            </div>

            {/* Custom Mode Specific Inputs */}
            {connectionMode === 'custom_payload' && (
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    HTTP/TCP Payload Template:
                  </label>
                  <textarea
                    rows={3}
                    value={customSetup.payload}
                    onChange={e => onUpdateCustomSetup({ payload: e.target.value })}
                    placeholder="CONNECT [host_port] [protocol][crlf]Host: example.com[crlf][crlf]"
                    className="w-full p-2 text-[11px] font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {connectionMode === 'custom_host' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Custom Host Header:
                </label>
                <input
                  type="text"
                  value={customSetup.hostHeader}
                  onChange={e => onUpdateCustomSetup({ hostHeader: e.target.value })}
                  placeholder="rwandair.com"
                  className="w-full p-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>
            )}

            {connectionMode === 'custom_sni' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Server Name Indication (SNI):
                </label>
                <input
                  type="text"
                  value={customSetup.sni}
                  onChange={e => onUpdateCustomSetup({ sni: e.target.value })}
                  placeholder="edge.cloudflare.com"
                  className="w-full p-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>
            )}

            {connectionMode === 'dnstt' && (
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    DNSTT Nameserver / Domain:
                  </label>
                  <input
                    type="text"
                    value={customSetup.dnsttDomain}
                    onChange={e => onUpdateCustomSetup({ dnsttDomain: e.target.value })}
                    placeholder="t.myv-dns.org"
                    className="w-full p-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {connectionMode === 'imported_config' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                    {customSetup.importedConfigName || 'No profile loaded'}
                  </span>
                  <button
                    onClick={onOpenImportConfig}
                    className="px-2.5 py-1 text-[10px] font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Import .MYV File
                  </button>
                </div>
              </div>
            )}

            {connectionMode === 'direct' && (
              <p className="text-[10px] text-slate-500">
                Direct mode routes all traffic natively through the selected VPN gateway port without payload injection.
              </p>
            )}
          </div>
        )}

        {/* 9. START BUTTON */}
        <div className="mt-4">
          <button
            onClick={isConnected ? onStopVpn : onStartVpn}
            disabled={isBusy}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base tracking-widest uppercase text-white shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer android-ripple ${
              isConnected
                ? 'bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 shadow-rose-600/30'
                : isBusy
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 opacity-90 cursor-wait'
                : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-blue-600/30'
            }`}
          >
            {isBusy ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{status === 'connecting' ? 'CONNECTING...' : 'AUTHENTICATING...'}</span>
              </>
            ) : isConnected ? (
              <>
                <Square className="w-4 h-4 fill-white" />
                <span>STOP VPN</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>▶ START VPN</span>
              </>
            )}
          </button>
        </div>

        {/* STATUS FOOTER / TELEMETRY BANNER */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isConnected
                  ? 'bg-emerald-500 animate-pulse'
                  : isBusy
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-slate-400'
              }`}
            />
            <span className="font-extrabold text-[11px] text-slate-800 dark:text-slate-200 uppercase">
              {status === 'connected' ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-black">
                  <span>CONNECTED</span>
                  <span className="font-mono text-slate-500 font-normal">
                    · {selectedServer.name} ({formatDuration(stats.connectedSeconds)})
                  </span>
                </span>
              ) : isBusy ? (
                <span className="text-amber-600 dark:text-amber-400">
                  {status}...
                </span>
              ) : (
                'DISCONNECTED'
              )}
            </span>
          </div>

          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            {isConnected ? `IP: ${stats.assignedIp}` : 'Ready to tunnel'}
          </div>
        </div>

      </div>

      {/* 10. VIP PREMIUM CARD */}
      <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-slate-900 dark:via-amber-950/20 dark:to-slate-900 rounded-3xl p-4 sm:p-5 border-2 border-amber-300 dark:border-amber-700/60 shadow-md relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md border border-amber-300">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-950 dark:text-amber-300 leading-tight flex items-center gap-1.5">
                <span>KWISHYURA VIP PREMIUM 👑</span>
              </h3>
              <p className="text-[11px] font-extrabold text-amber-700 dark:text-amber-400 mt-0.5">
                ⚡ 2000 FRW / 1 WEEK
              </p>
            </div>
          </div>

          <button
            onClick={onOpenVipPayment}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer border border-amber-200 shrink-0"
          >
            ISHYURA
          </button>
        </div>

        {/* Payment Credentials Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 bg-white/80 dark:bg-slate-950/80 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 text-xs font-mono">
          <div className="p-1.5 flex items-center justify-between sm:justify-start gap-1.5">
            <span className="text-[10px] text-slate-500 font-sans font-bold">MTN:</span>
            <span className="font-extrabold text-slate-900 dark:text-slate-100">0780949484</span>
          </div>
          <div className="p-1.5 flex items-center justify-between sm:justify-start gap-1.5 border-t sm:border-t-0 sm:border-l border-amber-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 font-sans font-bold">CODE:</span>
            <span className="font-extrabold text-amber-600 dark:text-amber-400">2238763</span>
          </div>
          <div className="p-1.5 flex items-center justify-between sm:justify-start gap-1.5 border-t sm:border-t-0 sm:border-l border-amber-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 font-sans font-bold">IZINA:</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200 text-[11px]">(Yvan Mutiganda)</span>
          </div>
        </div>
      </div>

      {/* QUICK UTILITY ACTIONS CARD */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={onOpenAndroidCode}
          className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-blue-500/50 transition-all flex items-center gap-2.5 text-left group shadow-xs cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Code z'Iyi App
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              Android & Web (.ZIP)
            </div>
          </div>
        </button>

        <button
          onClick={onOpenPayloadGen}
          className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-blue-500/50 transition-all flex items-center gap-2.5 text-left group shadow-xs cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Payload Tool
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              Generator & headers
            </div>
          </div>
        </button>
      </div>

      {/* SECURITY & PRIVACY NOTICE CARD */}
      <div className="px-3.5 py-2.5 bg-slate-100/80 dark:bg-slate-900/40 rounded-xl text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>
          Mutiganda Yvan VPN uses official Android VpnService encryption (tun0). Zero logs collected.
        </span>
      </div>

    </div>
  );
};
