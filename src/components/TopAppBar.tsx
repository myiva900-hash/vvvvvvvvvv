import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Settings, 
  MoreVertical, 
  FileCode, 
  Server, 
  Wrench, 
  Upload, 
  Download, 
  Trash2, 
  Info, 
  ArrowLeft, 
  Smartphone,
  Crown
} from 'lucide-react';
import { MyvLogo } from './MyvLogo';

interface TopAppBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenDrawer: () => void;
  onOpenSettings: () => void;
  onOpenAndroidCode: () => void;
  onOpenInstallApp?: () => void;
  onOpenVip?: () => void;
  onOpenPayloadGen: () => void;
  onOpenExport: () => void;
  onOpenImport: () => void;
  onOpenServerApps: () => void;
  onOpenAbout: () => void;
  onClearLogs: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title = 'Mutiganda Yvan VPN',
  showBack = false,
  onBack,
  onOpenDrawer,
  onOpenSettings,
  onOpenAndroidCode,
  onOpenInstallApp,
  onOpenVip,
  onOpenPayloadGen,
  onOpenExport,
  onOpenImport,
  onOpenServerApps,
  onOpenAbout,
  onClearLogs,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close overflow menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-30 w-full bg-gradient-to-r from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] text-white shadow-md select-none transition-colors border-b border-blue-900/60">
      <div className="flex items-center justify-between h-14 px-2.5 sm:px-4 gap-2">
        
        {/* Left Section: Hamburger & Circular VPN Logo & App Name */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          {showBack ? (
            <button
              onClick={onBack}
              className="p-2 -ml-1 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          ) : (
            <button
              onClick={onOpenDrawer}
              className="p-2 -ml-1 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          )}

          {/* Circular VPN Logo */}
          {!showBack && (
            <div className="shrink-0 p-0.5 rounded-full bg-white/15 border border-white/25 shadow-xs">
              <MyvLogo size={28} circular />
            </div>
          )}

          {/* App Name: Neatly displayed without truncation */}
          <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white whitespace-nowrap truncate font-sans">
            {title}
          </h1>
        </div>

        {/* Right Section: VIP Button with Crown, Settings & Overflow */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          
          {/* VIP Button on the right with a crown icon */}
          {onOpenVip && (
            <button
              onClick={onOpenVip}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer border border-amber-200"
              aria-label="VIP Premium"
              title="VIP Premium"
            >
              <Crown className="w-3.5 h-3.5 fill-current text-slate-950" />
              <span className="tracking-wide">VIP</span>
            </button>
          )}

          {/* Optional Install PWA Shortcut */}
          {onOpenInstallApp && (
            <button
              onClick={onOpenInstallApp}
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors focus:outline-none text-white hidden xs:flex items-center justify-center"
              aria-label="Install App"
              title="Shyira App muri Telefoni"
            >
              <Smartphone className="w-4 h-4 text-white" />
            </button>
          )}

          {/* Settings Gear */}
          {!showBack && (
            <button
              onClick={onOpenSettings}
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white text-white"
              aria-label="Open Settings"
              title="Settings"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          )}

          {/* Overflow Menu Anchor */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white text-white"
              aria-label="More options"
              aria-expanded={menuOpen}
            >
              <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>

            {/* Android-style Material Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-100">
                {onOpenVip && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenVip();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 text-left transition-colors"
                  >
                    <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <span className="block font-black">KWISHYURA VIP PREMIUM 👑</span>
                      <span className="text-[10px] text-slate-500 font-normal">2000 FRW / 1 Week</span>
                    </div>
                  </button>
                )}

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenAndroidCode();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/40 text-left transition-colors text-blue-700 dark:text-blue-300"
                >
                  <FileCode className="w-4 h-4 shrink-0 text-blue-600" />
                  <div>
                    <span className="block font-bold">Code z'Iyi App / Source Code</span>
                    <span className="text-[10px] text-slate-500 font-normal">Android Studio & React Web (.ZIP)</span>
                  </div>
                </button>

                {onOpenInstallApp && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenInstallApp();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                  >
                    <Smartphone className="w-4 h-4 text-slate-500" />
                    <span>Shyira App Muri Telefoni (Install)</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenPayloadGen();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <Wrench className="w-4 h-4 text-slate-500" />
                  <span>Payload Generator</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenServerApps();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <Server className="w-4 h-4 text-slate-500" />
                  <span>Server Apps & Ping</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenExport();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Export Config (.myv)</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenImport();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Import Config (.myv)</span>
                </button>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onClearLogs();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-600 dark:text-slate-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-slate-400" />
                  <span>Clear Logs</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenAbout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <Info className="w-4 h-4 text-slate-500" />
                  <span>About & Privacy</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
