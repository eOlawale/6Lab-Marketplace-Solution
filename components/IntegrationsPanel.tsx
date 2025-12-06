import React, { useState } from 'react';
import { CheckCircle2, Cloud, RefreshCw, Link, XCircle, ArrowUpRight, MessageSquare, Database, Users } from 'lucide-react';
import { IntegrationStatus } from '../types';

interface IntegrationsPanelProps {
  onAskAgent?: (query: string) => void;
}

const IntegrationsPanel: React.FC<IntegrationsPanelProps> = ({ onAskAgent }) => {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([
    { id: 'salesforce', name: 'Salesforce CRM', connected: true, lastSync: '10 mins ago', icon: Database, color: 'text-blue-500' },
    { id: 'slack', name: 'Slack Workspace', connected: true, lastSync: 'Real-time', icon: MessageSquare, color: 'text-purple-500' },
    { id: 'hubspot', name: 'HubSpot Marketing', connected: false, icon: Users, color: 'text-orange-500' },
  ]);

  const [syncing, setSyncing] = useState<string | null>(null);

  const toggleConnection = (id: string) => {
    setSyncing(id);
    setTimeout(() => {
      setIntegrations(prev => prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            connected: !item.connected,
            lastSync: !item.connected ? 'Just now' : undefined
          };
        }
        return item;
      }));
      setSyncing(null);
    }, 1500);
  };

  return (
    <div className="p-8 h-full bg-slate-50 dark:bg-slate-900 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Workflow Integrations
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Manage connections to your external business tools and CMS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {integrations.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 ${item.color}`}>
                <item.icon className="w-8 h-8" />
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${
                item.connected 
                  ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
                  : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600'
              }`}>
                {item.connected ? (
                  <><CheckCircle2 className="w-3 h-3" /> Active</>
                ) : (
                  <><XCircle className="w-3 h-3" /> Disconnected</>
                )}
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{item.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {item.connected 
                ? `Last synced: ${item.lastSync}` 
                : 'Connect to sync data automatically.'}
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => toggleConnection(item.id)}
                disabled={!!syncing}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2 ${
                  item.connected
                    ? 'border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
                }`}
              >
                {syncing === item.id ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> {item.connected ? 'Disconnecting...' : 'Connecting...'}</>
                ) : (
                  item.connected ? 'Disconnect' : 'Connect App'
                )}
              </button>
              {item.connected && (
                 <button 
                   onClick={() => onAskAgent?.(`Check the latest logs for the ${item.name} integration and summarize any sync errors.`)}
                   className="p-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                   title="Ask Agent about this integration"
                 >
                   <ArrowUpRight className="w-5 h-5" />
                 </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Integration Logs / Details Area */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
         <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white">Recent Sync Activity</h3>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">View All Logs</button>
         </div>
         <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                 <div className="flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 dark:text-green-400">
                       <Cloud className="w-4 h-4" />
                    </div>
                    <div>
                       <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                         {i === 0 ? 'Salesforce Opportunity Updated' : i === 1 ? 'New Lead from Webhook' : 'Slack Notification Sent'}
                       </p>
                       <p className="text-xs text-slate-500 dark:text-slate-400">
                         {i === 0 ? 'Triggered by Deal Close' : i === 1 ? 'Source: Contact Form' : 'Channel: #sales-alerts'}
                       </p>
                    </div>
                 </div>
                 <div className="text-right">
                    <span className="text-xs font-mono text-slate-400">{i * 15 + 2}m ago</span>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default IntegrationsPanel;