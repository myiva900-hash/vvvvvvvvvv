import React, { useState, useEffect } from 'react';
import { 
  ConnectionMode, 
  ConnectionStatus, 
  CustomSetupConfig, 
  AppSettings, 
  VpnLogEntry, 
  VpnServer, 
  ExportableConfig 
} from './types/vpn';
import { SERVERS } from './data/servers';
import { vpnSimulator, VpnStats } from './services/vpnSimulator';
import { DEFAULT_PAYLOAD } from './services/payloadEngine';
import { getOrCreateDeviceId } from './services/configManager';

// UI Components
import { TopAppBar } from './components/TopAppBar';
import { TabsHeader } from './components/TabsHeader';
import { TickerNotice } from './components/TickerNotice';
import { HomeScreen } from './components/HomeScreen';
import { LogScreen } from './components/LogScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { SideMenuDrawer } from './components/SideMenuDrawer';

// Modals
import { PayloadGeneratorModal } from './components/PayloadGeneratorModal';
import { IdentificationModal } from './components/IdentificationModal';
import { ExportConfigModal } from './components/ExportConfigModal';
import { ImportConfigModal } from './components/ImportConfigModal';
import { ServerAppsModal } from './components/ServerAppsModal';
import { TelegramModal } from './components/TelegramModal';
import { AboutModal } from './components/AboutModal';
import { AndroidCodeModal } from './components/AndroidCodeModal';
import { InstallAppModal } from './components/InstallAppModal';
import { MyvLogo } from './components/MyvLogo';
import { 
  FileCode2, 
  ShieldCheck, 
  Download, 
  Activity, 
  Cpu, 
  Wifi, 
  Smartphone, 
  Sliders, 
  Monitor,
  ExternalLink
} from 'lucide-react';
import { ANDROID_PROJECT_FILES } from './data/androidProjectSource';
import { WEB_PROJECT_FILES } from './data/webProjectSource';

export default function App() {
  // Navigation & View state
  const [currentView, setCurrentView] = useState<'main' | 'settings'>('main');
  const [activeTab, setActiveTab] = useState<'HOME' | 'LOG'>('HOME');

  // VPN Tunnel State
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [stats, setStats] = useState<VpnStats>({
    uploadBytes: 0,
    downloadBytes: 0,
    uploadSpeed: 0,
    downloadSpeed: 0,
    connectedSeconds: 0,
    assignedIp: '10.8.0.2',
  });
  const [logs, setLogs] = useState<VpnLogEntry[]>([]);
  const [selectedServer, setSelectedServer] = useState<VpnServer>(SERVERS[0]);
  const [selectedPort, setSelectedPort] = useState<number>(80);
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('direct');
  const [customSetupEnabled, setCustomSetupEnabled] = useState<boolean>(false);

  // Custom Setup Parameters
  const [customSetup, setCustomSetup] = useState<CustomSetupConfig>({
    payload: DEFAULT_PAYLOAD,
    hostHeader: 'cloudflare.com',
    sni: 'edge.cloudflare.com',
    proxyHost: '104.21.58.120',
    proxyPort: '8080',
    dnsttDomain: 't.myv-dns.org',
    dnsttPublicKey: '3b6c28f090b4d4554be7df75bf1efbe00e572886f4a7c062abff4820a4be3568',
    dnsResolver: '1.1.1.1',
    importedConfigName: undefined,
  });

  // Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('myv_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      sound: true,
      vibrate: true,
      theme: 'light',
      connectionRetry: true,
      forwardDns: false,
      customDns: false,
      primaryDns: '1.1.1.1',
      secondaryDns: '8.8.8.8',
      autoReconnect: false,
      connectionTimeout: 30,
    };
  });

  // Modals
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [payloadGenOpen, setPayloadGenOpen] = useState(false);
  const [identificationOpen, setIdentificationOpen] = useState(false);
  const [exportConfigOpen, setExportConfigOpen] = useState(false);
  const [importConfigOpen, setImportConfigOpen] = useState(false);
  const [serverAppsOpen, setServerAppsOpen] = useState(false);
  const [telegramOpen, setTelegramOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [androidCodeOpen, setAndroidCodeOpen] = useState(false);
  const [installAppOpen, setInstallAppOpen] = useState(false);

  // Desktop view switch: 'phone_view' vs 'desktop_expanded'
  const [desktopLayout, setDesktopLayout] = useState<'phone' | 'expanded'>('expanded');

  // Sync theme
  useEffect(() => {
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('myv_settings', JSON.stringify(settings));
  }, [settings]);

  // Subscribe to VPN Simulator status and logs
  useEffect(() => {
    const unsubStatus = vpnSimulator.subscribeStatus((newStatus, newStats) => {
      setStatus(newStatus);
      setStats(newStats);
    });

    const unsubLogs = vpnSimulator.subscribeLogs(entry => {
      setLogs(prev => [...prev, entry]);
    });

    // Seed initial log
    vpnSimulator['emitLog'](
      'info',
      'Mutiganda Yvan VPN client ready. Tap START to initiate connection.'
    );

    return () => {
      unsubStatus();
      unsubLogs();
    };
  }, []);

  // Handlers
  const handleStartVpn = () => {
    vpnSimulator.startConnection(selectedServer, selectedPort, connectionMode, customSetup, {
      sound: settings.sound,
      vibrate: settings.vibrate,
      primaryDns: settings.primaryDns,
      forwardDns: settings.forwardDns,
    });
  };

  const handleStopVpn = () => {
    vpnSimulator.stopConnection({
      sound: settings.sound,
      vibrate: settings.vibrate,
    });
  };

  const handleConfigImported = (config: ExportableConfig) => {
    setConnectionMode(config.connectionMode);
    setCustomSetup(config.customSetup);
    setCustomSetupEnabled(true);

    const matchingServer = SERVERS.find(s => s.host === config.serverHost);
    if (matchingServer) {
      setSelectedServer(matchingServer);
    }
    if (config.serverPort) {
      setSelectedPort(config.serverPort);
    }

    setCustomSetup(prev => ({
      ...prev,
      importedConfigName: config.configName,
    }));

    vpnSimulator['emitLog'](
      'success',
      `Imported configuration profile [${config.configName}] successfully applied.`
    );
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleDrawerOption = (
    option:
      | 'install_app'
      | 'payload_gen'
      | 'identification'
      | 'export_config'
      | 'import_config'
      | 'settings'
      | 'server_apps'
      | 'telegram'
      | 'android_code'
      | 'about'
  ) => {
    switch (option) {
      case 'install_app':
        setInstallAppOpen(true);
        break;
      case 'payload_gen':
        setPayloadGenOpen(true);
        break;
      case 'identification':
        setIdentificationOpen(true);
        break;
      case 'export_config':
        setExportConfigOpen(true);
        break;
      case 'import_config':
        setImportConfigOpen(true);
        break;
      case 'settings':
        setCurrentView('settings');
        break;
      case 'server_apps':
        setServerAppsOpen(true);
        break;
      case 'telegram':
        setTelegramOpen(true);
        break;
      case 'android_code':
        setAndroidCodeOpen(true);
        break;
      case 'about':
        setAboutOpen(true);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* DESKTOP TOP HERO & CONTROL STRIP (Visible on large screens) */}
      <nav className="hidden lg:flex items-center justify-between px-6 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs z-20">
        <div className="flex items-center gap-3">
          <MyvLogo size={32} />
          <div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Mutiganda Yvan VPN</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 font-semibold">
                Android VpnService
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              High-Performance Mobile VPN Tunneling Client
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Layout switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setDesktopLayout('expanded')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                desktopLayout === 'expanded'
                  ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Full Studio View</span>
            </button>
            <button
              onClick={() => setDesktopLayout('phone')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                desktopLayout === 'phone'
                  ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone Simulation</span>
            </button>
          </div>

          <button
            onClick={() => setInstallAppOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 dark:bg-orange-950/60 dark:hover:bg-orange-900/60 text-orange-700 dark:text-orange-400 font-extrabold text-xs transition-colors cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            <span>Shyira App Muri Telefoni (Install)</span>
          </button>

          <button
            onClick={() => setAndroidCodeOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Code z'Iyi App / Source Code ({ANDROID_PROJECT_FILES.length + WEB_PROJECT_FILES.length} Files)</span>
          </button>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex justify-center items-start p-0 lg:p-6 w-full max-w-7xl mx-auto">
        <div className="w-full flex flex-col lg:flex-row gap-6 items-start justify-center">
          
          {/* PHONE CONTAINER: The authentic Android mobile app */}
          <div className={`w-full ${desktopLayout === 'phone' ? 'max-w-md mx-auto' : 'max-w-md lg:w-[410px] shrink-0'} bg-white dark:bg-slate-900 shadow-2xl rounded-none lg:rounded-3xl border-0 lg:border-8 border-slate-300 dark:border-slate-800 overflow-hidden flex flex-col min-h-screen lg:min-h-[740px] relative transition-all`}>
            
            {/* Simulated Android Status Bar */}
            <div className="bg-[#f97316] text-white/90 px-4 pt-1.5 pb-0.5 text-[10px] font-mono flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5 font-semibold">
                <span>8:54 PM</span>
                <span className="text-[9px]">💬</span>
              </div>
              <div className="flex items-center gap-2">
                <span>4G</span>
                <span>📶 84%</span>
                <span>🔋</span>
              </div>
            </div>

            {/* Top App Bar */}
            {currentView === 'settings' ? (
              <SettingsScreen
                settings={settings}
                onUpdateSettings={updates => setSettings(prev => ({ ...prev, ...updates }))}
                onBack={() => setCurrentView('main')}
              />
            ) : (
              <>
                <TopAppBar
                  onOpenDrawer={() => setDrawerOpen(true)}
                  onOpenSettings={() => setCurrentView('settings')}
                  onOpenAndroidCode={() => setAndroidCodeOpen(true)}
                  onOpenInstallApp={() => setInstallAppOpen(true)}
                  onOpenPayloadGen={() => setPayloadGenOpen(true)}
                  onOpenExport={() => setExportConfigOpen(true)}
                  onOpenImport={() => setImportConfigOpen(true)}
                  onOpenServerApps={() => setServerAppsOpen(true)}
                  onOpenAbout={() => setAboutOpen(true)}
                  onClearLogs={handleClearLogs}
                />

                <TabsHeader
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  unreadLogsCount={logs.length}
                />

                <TickerNotice onTelegramClick={() => setTelegramOpen(true)} />

                {/* Tab Views */}
                <div className="flex-1 flex flex-col bg-slate-50/60 dark:bg-slate-950/60 overflow-y-auto">
                  {activeTab === 'HOME' ? (
                    <HomeScreen
                      status={status}
                      stats={stats}
                      selectedServer={selectedServer}
                      onSelectServer={setSelectedServer}
                      selectedPort={selectedPort}
                      onSelectPort={setSelectedPort}
                      connectionMode={connectionMode}
                      onSelectConnectionMode={setConnectionMode}
                      customSetupEnabled={customSetupEnabled}
                      onToggleCustomSetup={setCustomSetupEnabled}
                      customSetup={customSetup}
                      onUpdateCustomSetup={updates => setCustomSetup(prev => ({ ...prev, ...updates }))}
                      onStartVpn={handleStartVpn}
                      onStopVpn={handleStopVpn}
                      onOpenPayloadGen={() => setPayloadGenOpen(true)}
                      onOpenAndroidCode={() => setAndroidCodeOpen(true)}
                      onOpenImportConfig={() => setImportConfigOpen(true)}
                      onOpenInstallApp={() => setInstallAppOpen(true)}
                    />
                  ) : (
                    <LogScreen logs={logs} onClearLogs={handleClearLogs} />
                  )}
                </div>
              </>
            )}
          </div>

          {/* DESKTOP SIDE PANEL (Only shown on Desktop in 'expanded' mode) */}
          {desktopLayout === 'expanded' && (
            <div className="hidden lg:flex flex-1 flex-col gap-4 max-w-xl">
              
              {/* Studio Overview Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        Mutiganda Yvan VPN Architecture
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Modular Android VpnService & Encryption Engine
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    MVVM Clean Arch
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      VpnService Socket
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Protected (fd: tun0)
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Config Encryption
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      AES-256-GCM + HWID
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Device HWID
                    </span>
                    <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate block">
                      {getOrCreateDeviceId().slice(0, 16)}...
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Active Gateway
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                      {selectedServer.name} (P {selectedPort})
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setServerAppsOpen(true)}
                    className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1.5"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Run Server Ping Benchmark</span>
                  </button>
                  <button
                    onClick={() => setPayloadGenOpen(true)}
                    className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 flex items-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Open Payload Builder</span>
                  </button>
                </div>
              </div>

              {/* Complete Source Code Quick Inspector */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex-1 flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-orange-500" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                        Code zose z'Iyi App / Complete Source Code
                      </h3>
                      <span className="text-[10px] text-slate-500">
                        {ANDROID_PROJECT_FILES.length} Android Files · {WEB_PROJECT_FILES.length} React Web Files
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setAndroidCodeOpen(true)}
                    className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
                  >
                    <span>Fungura Code Zose</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                  Izi code zose zibumbiye hamwe umushinga wose wa <strong>Android Studio (Kotlin VpnService)</strong> n'uwa <strong>React TypeScript Web App</strong>, hamwe n'amabwiriza arambuye yo gukora APK cyangwa gutangiza seriveri yawe ya VPN.
                </p>

                {/* Snippet preview */}
                <div className="flex-1 bg-slate-950 text-slate-300 p-3.5 rounded-xl font-mono text-[11px] leading-relaxed border border-slate-800 overflow-hidden relative group">
                  <div className="text-orange-400 font-semibold mb-1 flex items-center justify-between">
                    <span>// Android Studio & React Web Projects</span>
                    <span className="text-[10px] text-slate-400 font-normal">Ready to build</span>
                  </div>
                  <pre className="text-emerald-400 text-[10px] overflow-x-auto leading-relaxed">
{`├── android-project/
│   ├── AndroidManifest.xml (BIND_VPN_SERVICE, tun0)
│   ├── MyvVpnService.kt (Virtual TUN & Notification)
│   ├── VpnTunnelManager.kt (Socket & TLS/SNI Protection)
│   └── build.gradle.kts (Android 14/15 SDK 35)
└── web-project/
    ├── App.tsx, HomeScreen.tsx, LogScreen.tsx
    ├── vpnSimulator.ts & payloadEngine.ts
    └── package.json & vite.config.ts`}
                  </pre>
                  <button
                    onClick={() => setAndroidCodeOpen(true)}
                    className="mt-3 w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Fungura / Download Code Zose (.ZIP)</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* SIDE DRAWER */}
      <SideMenuDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSelectOption={handleDrawerOption}
      />

      {/* MODALS */}
      <PayloadGeneratorModal
        isOpen={payloadGenOpen}
        onClose={() => setPayloadGenOpen(false)}
        onApplyPayload={p => {
          setCustomSetup(prev => ({ ...prev, payload: p }));
          setCustomSetupEnabled(true);
          setConnectionMode('custom_payload');
          vpnSimulator['emitLog']('info', 'Custom payload updated and applied to setup.');
        }}
      />

      <IdentificationModal
        isOpen={identificationOpen}
        onClose={() => setIdentificationOpen(false)}
      />

      <ExportConfigModal
        isOpen={exportConfigOpen}
        onClose={() => setExportConfigOpen(false)}
        server={selectedServer}
        port={selectedPort}
        connectionMode={connectionMode}
        customSetup={customSetup}
      />

      <ImportConfigModal
        isOpen={importConfigOpen}
        onClose={() => setImportConfigOpen(false)}
        onConfigImported={handleConfigImported}
      />

      <ServerAppsModal
        isOpen={serverAppsOpen}
        onClose={() => setServerAppsOpen(false)}
      />

      <TelegramModal
        isOpen={telegramOpen}
        onClose={() => setTelegramOpen(false)}
      />

      <AboutModal
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
        onOpenAndroidCode={() => setAndroidCodeOpen(true)}
      />

      <AndroidCodeModal
        isOpen={androidCodeOpen}
        onClose={() => setAndroidCodeOpen(false)}
      />

      <InstallAppModal
        isOpen={installAppOpen}
        onClose={() => setInstallAppOpen(false)}
        onOpenSourceCode={() => {
          setInstallAppOpen(false);
          setAndroidCodeOpen(true);
        }}
      />
    </div>
  );
}
