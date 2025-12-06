import React from 'react';
import { Moon, Sun, Monitor, Type, Palette, Bell, Shield, User } from 'lucide-react';

interface SettingsPanelProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ theme, toggleTheme }) => {
  return (
    <div className="p-8 h-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-y-auto">
       <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Settings & Preferences
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Customize your 6Lab experience and agent behavior.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        
        {/* Appearance Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
           <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
             <Palette className="w-5 h-5 text-indigo-500" /> Appearance
           </h3>
           
           <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-slate-600 rounded-md shadow-sm">
                       {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </div>
                    <div>
                       <p className="font-medium">Interface Theme</p>
                       <p className="text-xs text-slate-500 dark:text-slate-400">Toggle between light and dark mode</p>
                    </div>
                 </div>
                 <button 
                   onClick={toggleTheme}
                   className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                 >
                    <span className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
                 </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-slate-600 rounded-md shadow-sm">
                       <Type className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="font-medium">Code Font Size</p>
                       <p className="text-xs text-slate-500 dark:text-slate-400">Adjust readability for code blocks</p>
                    </div>
                 </div>
                 <select className="bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 text-sm rounded-lg p-1.5 focus:ring-indigo-500 focus:border-indigo-500">
                    <option>Small (12px)</option>
                    <option>Medium (14px)</option>
                    <option>Large (16px)</option>
                 </select>
              </div>
           </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
           <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
             <Bell className="w-5 h-5 text-indigo-500" /> Notifications
           </h3>
           <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                 <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" defaultChecked />
                 <span className="text-sm">Email alerts for failed integration syncs</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                 <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" defaultChecked />
                 <span className="text-sm">Push notifications for agent task completion</span>
              </label>
           </div>
        </div>

        {/* Account */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm opacity-70">
           <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
             <Shield className="w-5 h-5 text-indigo-500" /> API & Security
           </h3>
           <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              API Keys are managed via environment variables. Contact your administrator to rotate keys.
           </p>
        </div>

      </div>
    </div>
  );
};

export default SettingsPanel;