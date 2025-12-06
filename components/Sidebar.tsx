import React from 'react';
import { LayoutDashboard, MessageSquareCode, Truck, CreditCard, Settings, Hexagon, Workflow, Smartphone } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agent', label: 'App Builder', icon: Smartphone },
    { id: 'integrations', label: 'Workflow & CMS', icon: Workflow },
    { id: 'logistics', label: 'Logistics Map', icon: Truck },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 border-r border-slate-800 shadow-xl z-20">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/30">
           <Hexagon className="w-6 h-6 text-white" fill="currentColor" />
        </div>
        <span className="font-bold text-xl tracking-tight">6Lab</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'settings' 
              ? 'bg-indigo-600 text-white' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;