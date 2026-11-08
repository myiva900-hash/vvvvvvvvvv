import React from 'react';
import { 
  Code2, 
  Fingerprint, 
  Upload, 
  Download, 
  Settings, 
  LayoutGrid, 
  Send, 
  Info, 
  FileCode2, 
  X,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { MyvLogo } from './MyvLogo';

interface SideMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: 
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
  ) => void;
}

export const SideMenuDrawer: React.FC<SideMenuDrawerProps> = ({
  isOpen,
  onClose,
  onSelectOption,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Drawer content matching screenshot */}
      <div className="absolute inset-y-0 left-0 max-w-[280px] w-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
        
        <div>
          {/* Top Blue Gradient Header */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-5 pt-7 relative shadow-sm border-b border-blue-800">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/15 transition-colors cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-white/15 border border-white/20">
                <MyvLogo size={40} circular />
              </div>
              <div>
                <h2 className="text-base font-black tracking-tight leading-tight text-white font-sans">
                  Mutiganda Yvan VPN
                </h2>
                <p className="text-[11px] font-semibold text-blue-100 mt-0.5 flex items-center gap-1.5">
                  <span>v3.0 VIP</span>
                  <span>·</span>
                  <span className="text-amber-300 font-bold">PRO UPGRADE</span>
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Items List */}
          <nav className="py-2 divide-y divide-slate-100 dark:divide-slate-800/80">
            <div className="py-1">
              {/* Install App */}
              <button
                onClick={() => {
                  onClose();
                  onSelectOption('install_app');
                }}
                className="w-full flex items-center gap-4 px-5 py-3 text-left text-xs sm:text-sm font-bold text-orange-600 dark:text-orange-400 bg-orange-50/70 dark:bg-orange-950/30 hover:bg-orange-100/60 dark:hover:bg-orange-900/40 transition-colors"
              >
                <Smartphone className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <div>
                  <span className="block font-bold">Shyira App Muri Telefoni</span>
                  <span className="text-[10px] text-orange-500/80 font-normal">Install App (PWA & APK)</span>
                </div>
              </button>

              {/* Payload Generator */}
              <button
                onClick={() => {
                  onClose();
                  onSelectOption('payload_gen');
                }}
                className="w-full flex items-center gap-4 px-5 py-3 text-left text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Code2 className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <span>Payload Generator</span>
              </button>

              {/* Identification */}
              <button
                onClick={() => {
                  onClose();
                  onSelectOption('identification');
                }}
                className="w-full flex items-center gap-4 px-5 py-3 text-left text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Fingerprint className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <span>Identification</span>
              </button>
            </div>

            <div className="py-1">
              {/* Export Config */}
              <button
                onClick={() => {
                  onClose();
                  onSelectOption('export_config');
                }}
                className="w-full flex items-center gap-4 px-5 py-3 text-left text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Upload className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <span>Export Config</span>
              </button>

              {/* Import Config */}
              <button
                onClick={() => {
                  onClose();
                  onSelectOption('import_config');
                }}
                className="w-full flex items-center gap-4 px-5 py-3 text-left text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Download className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <span>Import Config</span>
              </button>
            </div>

            <div className="py-1">
              {/* Settings */}
              <button
                onClick={() => {
                  onClose();
                  onSelectOption('settings');
                }}
                className="w-full flex items-center gap-4 px-5 py-3 text-left text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <span>Settings</span>
              </button>

              {/* Server Apps */}
              <button
                onClick={() => {
                  onClose();
                  onSelectOption('server_apps');
                }}
                className="w-full flex items-center gap-4 px-5 py-3 text-left text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
              >
                <LayoutGrid className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <span>Server Apps</span>
              </button>

              {/* Source Code Explorer & ZIP Export */}
              <button
                onClick={() => {
                  onClose();
                  onSelectOption('android_code');
                }}
                className="w-full flex items-center gap-4 px-5 py-3 text-left text-xs sm:text-sm font-semibold text-orange-600 dark:text-orange-400 bg-orange-50/80 dark:bg-orange-950/30 hover:bg-orange-100/60 dark:hover:bg-orange-900/40 transition-colors"
              >
                <FileCode2 className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" />
                <div>
                  <span className="block font-bold">Code z'Iyi App / Source Code</span>
                  <span className="text-[10px] text-orange-500/80 font-normal">Android Studio & Web (.ZIP)</span>
                </div>
              </button>
            </div>

            <div className="py-1">
              {/* Telegram Channel */}
              <button
                onClick={() => {
                  onClose();
                  onSelectOption('telegram');
                }}
                className="w-full flex items-center gap-4 px-5 py-3 text-left text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Send className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <span>Telegram Channel</span>
              </button>

              {/* About */}
              <button
                onClick={() => {
                  onClose();
                  onSelectOption('about');
                }}
                className="w-full flex items-center gap-4 px-5 py-3 text-left text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Info className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <span>About</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Footer brand credit matching the bottom of the drawer screenshot */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MyvLogo size={18} />
            <span className="font-semibold text-slate-800 dark:text-slate-300">Mutiganda Yvan VPN</span>
          </div>
          <span>© 2026</span>
        </div>
      </div>
    </div>
  );
};
