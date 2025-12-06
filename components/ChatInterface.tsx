import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MapPin, Search, Code, AlertCircle, Loader2, Globe, ExternalLink, Workflow, Smartphone } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AgentPersona, Message } from '../types';
import { sendMessageToAgent } from '../services/geminiService';

interface ChatInterfaceProps {
  initialQuery?: string;
  onClearInitialQuery?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialQuery, onClearInitialQuery }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm your **Mobile App Architect**. I can build deployable Apps (React Native/Expo), find **Stock Images** via Google Search, and help with **CMS Integrations**. Select a persona to start.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [persona, setPersona] = useState<AgentPersona>(AgentPersona.DEVELOPER);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery) {
      setInput(initialQuery);
      // Auto-switch personas based on query keywords
      const q = initialQuery.toLowerCase();
      if (q.includes('logistics') || q.includes('route')) setPersona(AgentPersona.LOGISTICS);
      else if (q.includes('integration') || q.includes('salesforce') || q.includes('crm')) setPersona(AgentPersona.CONTENT_MANAGER);
      
      if (onClearInitialQuery) {
        onClearInitialQuery();
      }
    }
  }, [initialQuery, onClearInitialQuery]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Pass only the last few messages to keep context window manageable for demo
    const history = messages.slice(-10);
    const response = await sendMessageToAgent(history, userMsg.text, persona);

    setMessages(prev => [...prev, response]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const PersonaIcon = () => {
    switch (persona) {
      case AgentPersona.LOGISTICS: return <MapPin className="w-4 h-4" />;
      case AgentPersona.MARKET_RESEARCH: return <Search className="w-4 h-4" />;
      case AgentPersona.DEVELOPER: return <Smartphone className="w-4 h-4" />;
      case AgentPersona.CONTENT_MANAGER: return <Workflow className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shadow-sm z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Bot className="text-indigo-600 dark:text-indigo-400" /> AI Coding Agent
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Gemini 2.5 Flash & 3.0 Pro</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600 dark:text-slate-300 font-medium hidden sm:inline">Active Persona:</span>
          <div className="relative">
            <select 
              value={persona}
              onChange={(e) => setPersona(e.target.value as AgentPersona)}
              className="appearance-none bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-2 pl-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value={AgentPersona.DEVELOPER}>App Builder (Mobile)</option>
              <option value={AgentPersona.CONTENT_MANAGER}>Content Architect (CMS)</option>
              <option value={AgentPersona.LOGISTICS}>Logistics Manager (Maps)</option>
              <option value={AgentPersona.MARKET_RESEARCH}>Market Researcher (Search)</option>
              <option value={AgentPersona.SALES_ANALYST}>Sales Analyst (Data)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
               <PersonaIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 dark:bg-slate-950/50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none'
              } ${msg.isError ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}`}
            >
              <div className="flex items-center gap-2 mb-2 opacity-70 border-b border-black/10 dark:border-white/10 pb-1">
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                <span className="text-xs uppercase font-bold tracking-wider">{msg.role === 'user' ? 'You' : 'App Builder'}</span>
                <span className="text-xs ml-auto">{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              
              <div className="prose prose-sm max-w-none dark:prose-invert">
                 <ReactMarkdown 
                    components={{
                      code({node, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '')
                        return match ? (
                          <div className="bg-slate-900 rounded-md my-2 overflow-hidden border border-slate-700">
                             <div className="bg-slate-800 px-3 py-1 text-xs text-slate-400 flex justify-between items-center">
                               <span>{match[1]}</span>
                             </div>
                             <code className={`${className} block p-3 text-slate-100 overflow-x-auto`} {...props}>
                              {children}
                            </code>
                          </div>
                        ) : (
                          <code className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                            {children}
                          </code>
                        )
                      },
                      a({node, href, children, ...props}) {
                         const isPreviewLink = href?.includes('preview.6lab.app');
                         if (isPreviewLink) {
                           return (
                             <a 
                               href={href} 
                               target="_blank" 
                               rel="noreferrer" 
                               className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline mt-4 group"
                               {...props}
                             >
                               {children}
                               <ExternalLink className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                             </a>
                           );
                         }
                         return (
                           <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noreferrer" {...props}>
                             {children}
                           </a>
                         );
                      }
                    }}
                 >
                   {msg.text}
                 </ReactMarkdown>
              </div>

              {/* Grounding Chips */}
              {msg.groundingMetadata && (
                <div className="mt-4 space-y-2">
                   {/* Search Sources */}
                   {msg.groundingMetadata.searchChunks && msg.groundingMetadata.searchChunks.length > 0 && (
                     <div className="flex flex-wrap gap-2">
                        {msg.groundingMetadata.searchChunks.map((chunk, i) => (
                          <a key={i} href={chunk.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 transition-colors">
                            <Globe className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">{chunk.title || 'Source'}</span>
                          </a>
                        ))}
                     </div>
                   )}
                   {/* Map Sources */}
                   {msg.groundingMetadata.mapChunks && msg.groundingMetadata.mapChunks.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {msg.groundingMetadata.mapChunks.map((chunk, i) => (
                          <a key={i} href={chunk.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-800 transition-colors">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">{chunk.title || 'Location'}</span>
                          </a>
                        ))}
                      </div>
                   )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2 text-slate-500 dark:text-slate-400">
               <Loader2 className="w-5 h-5 animate-spin text-indigo-600 dark:text-indigo-400" />
               <span className="text-sm">Thinking...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask the ${persona.replace('_', ' ').toLowerCase()} to build an app...`}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-[60px] shadow-sm placeholder-slate-400 dark:placeholder-slate-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-2">
          AI can make mistakes. Verify critical code and logistics data.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;