import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, Check, Volume2, Smartphone, Palette, Shield, Network } from 'lucide-react';
import { AppSettings } from '../types/vpn';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onBack,
}) => {
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [dnsModalOpen, setDnsModalOpen] = useState(false);

  return (
    <div className="flex-1 w-full max-w-xl mx-auto bg-white dark:bg-slate-900 min-h-screen select-none pb-24">
      {/* Top Bar for Settings */}
      <div className="sticky top-0 z-30 bg-[#f97316] text-white flex items-center justify-between h-14 px-3 sm:px-4 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-1 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors focus:outline-none"
            aria-label="Back to main screen"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-lg font-bold tracking-tight text-white">Settings</h1>
        </div>
        <button
          onClick={() => {}}
          className="p-2 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors"
          aria-label="Settings options"
        >
          <MoreVertical className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {/* SECTION: Notification */}
        <div className="p-4 space-y-4">
          <h2 className="text-xs font-bold text-orange-600 dark:text-orange-400 tracking-wide">
            Notification
          </h2>

          {/* Sound Toggle */}
          <div 
            onClick={() => onUpdateSettings({ sound: !settings.sound })}
            className="flex items-start justify-between cursor-pointer py-1"
          >
            <div className="pr-4">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Sound
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Notify with a sound while connecting or disconnecting.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.sound}
              onClick={(e) => {
                e.stopPropagation();
                onUpdateSettings({ sound: !settings.sound });
              }}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.sound ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  settings.sound ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Vibrate Toggle */}
          <div 
            onClick={() => onUpdateSettings({ vibrate: !settings.vibrate })}
            className="flex items-start justify-between cursor-pointer py-1"
          >
            <div className="pr-4">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Vibrate
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Notify with a vibration while connecting or disconnecting.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.vibrate}
              onClick={(e) => {
                e.stopPropagation();
                onUpdateSettings({ vibrate: !settings.vibrate });
              }}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.vibrate ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  settings.vibrate ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* SECTION: Appearance */}
        <div className="p-4 space-y-4">
          <h2 className="text-xs font-bold text-orange-600 dark:text-orange-400 tracking-wide">
            Appearance
          </h2>

          {/* Choose Theme */}
          <div
            onClick={() => setThemeModalOpen(true)}
            className="cursor-pointer py-1 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded -mx-2 px-2 transition-colors"
          >
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Choose Theme
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-0.5">
              {settings.theme}
            </div>
          </div>
        </div>

        {/* SECTION: Connection */}
        <div className="p-4 space-y-4">
          <h2 className="text-xs font-bold text-orange-600 dark:text-orange-400 tracking-wide">
            Connection
          </h2>

          {/* Connection Retry */}
          <div 
            onClick={() => onUpdateSettings({ connectionRetry: !settings.connectionRetry })}
            className="flex items-start justify-between cursor-pointer py-1"
          >
            <div className="pr-4">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Connection Retry
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Try to reconnect after connection is lost. By default, service is stopped after 10 consecutive unsuccessful attempts.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.connectionRetry}
              onClick={(e) => {
                e.stopPropagation();
                onUpdateSettings({ connectionRetry: !settings.connectionRetry });
              }}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.connectionRetry ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  settings.connectionRetry ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Forward DNS */}
          <div 
            onClick={() => onUpdateSettings({ forwardDns: !settings.forwardDns })}
            className="flex items-start justify-between cursor-pointer py-1"
          >
            <div className="pr-4">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Forward DNS
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Forward DNS queries to remote server if enabled.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.forwardDns}
              onClick={(e) => {
                e.stopPropagation();
                onUpdateSettings({ forwardDns: !settings.forwardDns });
              }}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.forwardDns ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  settings.forwardDns ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Custom DNS */}
          <div 
            onClick={() => onUpdateSettings({ customDns: !settings.customDns })}
            className="flex items-start justify-between cursor-pointer py-1"
          >
            <div className="pr-4">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Custom DNS
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Use custom DNS servers to resolve DNS queries.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.customDns}
              onClick={(e) => {
                e.stopPropagation();
                onUpdateSettings({ customDns: !settings.customDns });
              }}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.customDns ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  settings.customDns ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Primary DNS input (visible if Custom DNS is enabled or configurable) */}
          <div className={`space-y-3 pt-2 ${!settings.customDns ? 'opacity-50 pointer-events-none' : ''}`}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary DNS
              </label>
              <input
                type="text"
                value={settings.primaryDns}
                onChange={e => onUpdateSettings({ primaryDns: e.target.value })}
                placeholder="1.1.1.1 (Cloudflare)"
                className="w-full p-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Secondary DNS
              </label>
              <input
                type="text"
                value={settings.secondaryDns}
                onChange={e => onUpdateSettings({ secondaryDns: e.target.value })}
                placeholder="8.8.8.8 (Google)"
                className="w-full p-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Auto Reconnect */}
          <div 
            onClick={() => onUpdateSettings({ autoReconnect: !settings.autoReconnect })}
            className="flex items-start justify-between cursor-pointer py-1 pt-2"
          >
            <div className="pr-4">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Auto Reconnect
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Automatically attempt re-establishing tunnel when connectivity changes.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.autoReconnect}
              onClick={(e) => {
                e.stopPropagation();
                onUpdateSettings({ autoReconnect: !settings.autoReconnect });
              }}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.autoReconnect ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  settings.autoReconnect ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Connection Timeout */}
          <div className="pt-2">
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">
              Connection Timeout (Seconds)
            </label>
            <select
              value={settings.connectionTimeout}
              onChange={e => onUpdateSettings({ connectionTimeout: Number(e.target.value) })}
              className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-orange-500 focus:outline-none text-slate-800 dark:text-slate-200"
            >
              <option value={10}>10 Seconds (Fast Fail)</option>
              <option value={15}>15 Seconds (Standard)</option>
              <option value={30}>30 Seconds (Recommended)</option>
              <option value={60}>60 Seconds (High Latency)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Theme Picker Modal */}
      {themeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-xs w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">
              Choose Theme
            </h3>
            <div className="space-y-2">
              {(['light', 'dark', 'system'] as const).map(themeOption => (
                <button
                  key={themeOption}
                  onClick={() => {
                    onUpdateSettings({ theme: themeOption });
                    setThemeModalOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs font-semibold capitalize transition-colors ${
                    settings.theme === themeOption
                      ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{themeOption}</span>
                  {settings.theme === themeOption && <Check className="w-4 h-4 text-orange-500" />}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setThemeModalOpen(false)}
                className="text-xs font-bold text-orange-600 dark:text-orange-400 px-3 py-1.5"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
