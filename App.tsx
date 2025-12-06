import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import PaymentPanel from './components/PaymentPanel';
import LogisticsMap from './components/LogisticsMap';
import IntegrationsPanel from './components/IntegrationsPanel';
import SettingsPanel from './components/SettingsPanel';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('agent');
  const [initialQuery, setInitialQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check system preference on load
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleAskAgent = (query: string) => {
    setInitialQuery(query);
    setActiveTab('agent');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'agent':
        return <ChatInterface initialQuery={initialQuery} onClearInitialQuery={() => setInitialQuery('')} />;
      case 'payments':
        return <PaymentPanel onAskAgent={handleAskAgent} />;
      case 'logistics':
        return <LogisticsMap onAskAgent={handleAskAgent} />;
      case 'integrations':
        return <IntegrationsPanel onAskAgent={handleAskAgent} />;
      case 'settings':
        return <SettingsPanel theme={theme} toggleTheme={toggleTheme} />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64 h-full relative">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;