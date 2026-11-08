import React from 'react';

interface TabsHeaderProps {
  activeTab: 'HOME' | 'LOG';
  onTabChange: (tab: 'HOME' | 'LOG') => void;
  unreadLogsCount?: number;
}

export const TabsHeader: React.FC<TabsHeaderProps> = ({
  activeTab,
  onTabChange,
  unreadLogsCount = 0,
}) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs select-none">
      <div className="grid grid-cols-2 text-center">
        {/* HOME Tab (Selected by default) */}
        <button
          onClick={() => onTabChange('HOME')}
          className={`py-3 text-xs sm:text-sm font-bold tracking-wider relative transition-colors focus:outline-none cursor-pointer ${
            activeTab === 'HOME'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>HOME</span>
          {activeTab === 'HOME' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-t" />
          )}
        </button>

        {/* LOG Tab with small status indicator */}
        <button
          onClick={() => onTabChange('LOG')}
          className={`py-3 text-xs sm:text-sm font-bold tracking-wider relative transition-colors focus:outline-none flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'LOG'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>LOG</span>
          {/* Small status indicator */}
          <span 
            className={`w-2 h-2 rounded-full transition-colors ${
              unreadLogsCount > 0 
                ? 'bg-emerald-500 animate-pulse' 
                : 'bg-blue-500/50'
            }`} 
            aria-label="Log status indicator"
          />
          {activeTab === 'LOG' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-t" />
          )}
        </button>
      </div>
    </div>
  );
};
