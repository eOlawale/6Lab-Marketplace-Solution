import React, { useState, useEffect, useRef } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, Clock, RefreshCw, Landmark, Globe, Bitcoin, Terminal, Bot, Zap, ShieldCheck, ToggleRight, ToggleLeft } from 'lucide-react';
import { Transaction } from '../types';

interface PaymentPanelProps {
  onAskAgent?: (query: string) => void;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx_12345678', customer: 'Alice Smith', amount: 120.50, status: 'Completed', date: '2023-10-25 14:30' },
  { id: 'tx_87654321', customer: 'Bob Jones', amount: 45.00, status: 'Pending', date: '2023-10-25 14:35' },
  { id: 'tx_23456789', customer: 'Charlie Brown', amount: 89.99, status: 'Failed', date: '2023-10-25 14:40' },
  { id: 'tx_98765432', customer: 'Diana Prince', amount: 250.00, status: 'Completed', date: '2023-10-25 15:00' },
];

const PaymentPanel: React.FC<PaymentPanelProps> = ({ onAskAgent }) => {
  const [isSandbox, setIsSandbox] = useState(false);
  const [processingType, setProcessingType] = useState<string | null>(null);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [logs, setLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const simulatePayment = (type: 'bank' | 'global' | 'crypto') => {
    setProcessingType(type);
    
    // Simulate API sequence based on type
    const sequence = type === 'crypto' 
      ? [
          `Connecting to Ethereum Mainnet (Infura Provider)...`,
          `Resolving ENS for wallet: 0x71C...9A2`,
          `Estimating Gas: 21000 Gwei`,
          `Sending Transaction Hash: 0x8a...2b1`,
          `Waiting for block confirmation (1/12)...`,
          `Success: Payment verified on-chain.`
        ]
      : type === 'bank'
      ? [
          `Initiating ACH Transfer Request (ISO 20022)...`,
          `Validating Routing Number: *****6789`,
          `Checking AML/KYC Database...`,
          `Risk Score: 0.02 (Low)`,
          `Status: Pending Settlement (T+1)`
        ]
      : [
          `POST /v1/charges (Stripe API)`,
          `Authorization: Bearer sk_test_...`,
          `Processing 3D Secure Verification...`,
          `Webhook Received: charge.succeeded`,
          `Response: 200 OK`
        ];

    let step = 0;
    addLog(`--- START ${type.toUpperCase()} TEST ---`);
    
    const interval = setInterval(() => {
      if (step >= sequence.length) {
        clearInterval(interval);
        setProcessingType(null);
        // Add transaction
        const newTx: Transaction = {
          id: `${type}_${Math.floor(Math.random() * 10000)}`,
          customer: isSandbox ? 'Test User (Sandbox)' : 'Live Customer',
          amount: Math.floor(Math.random() * 500) + 50,
          status: type === 'bank' ? 'Pending' : 'Completed',
          date: new Date().toLocaleString()
        };
        setTransactions(prev => [newTx, ...prev]);
        addLog(`--- END TRANSACTION ---`);
      } else {
        addLog(sequence[step]);
        step++;
      }
    }, 800);
  };

  return (
    <div className={`p-8 h-full overflow-y-auto transition-colors duration-500 ${isSandbox ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Payment Gateway Integration
            {isSandbox && <span className="text-xs bg-amber-500 text-black px-2 py-0.5 rounded font-bold uppercase tracking-wider">Sandbox Mode</span>}
          </h1>
          <p className={isSandbox ? "text-slate-400" : "text-slate-500"}>
            Unified API for Banks, Cards & Blockchain
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSandbox(!isSandbox)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isSandbox 
                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/50 hover:bg-amber-500/20' 
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {isSandbox ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            {isSandbox ? 'Sandbox Active' : 'Production View'}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Method 1: Local Banks */}
        <div className={`p-6 rounded-xl border shadow-sm transition-all ${
          isSandbox ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-full ${isSandbox ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
              <Landmark className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-xs font-mono text-green-500">
              <Zap className="w-3 h-3" /> API Ready
            </div>
          </div>
          <h3 className="text-lg font-bold mb-1">Local Banks</h3>
          <p className={`text-sm mb-4 ${isSandbox ? 'text-slate-400' : 'text-slate-500'}`}>ACH, SEPA, & Open Banking</p>
          <div className="flex gap-2">
             <button 
                onClick={() => simulatePayment('bank')}
                disabled={!!processingType}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
             >
               Test ACH
             </button>
             <button 
               onClick={() => onAskAgent?.("How do I implement ISO 20022 messaging for bank transfers in Node.js?")}
               className={`p-2 rounded-lg border hover:bg-opacity-50 ${isSandbox ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-50'}`}
             >
               <Bot className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Method 2: Global Payment */}
        <div className={`p-6 rounded-xl border shadow-sm transition-all ${
          isSandbox ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-full ${isSandbox ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
              <Globe className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-xs font-mono text-green-500">
              <ShieldCheck className="w-3 h-3" /> PCI DSS
            </div>
          </div>
          <h3 className="text-lg font-bold mb-1">Global Gateway</h3>
          <p className={`text-sm mb-4 ${isSandbox ? 'text-slate-400' : 'text-slate-500'}`}>Stripe, PayPal, Adyen</p>
          <div className="flex gap-2">
             <button 
                onClick={() => simulatePayment('global')}
                disabled={!!processingType}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
             >
               Test Card
             </button>
             <button 
               onClick={() => onAskAgent?.("Generate a React component for a Stripe Elements checkout form.")}
               className={`p-2 rounded-lg border hover:bg-opacity-50 ${isSandbox ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-50'}`}
             >
               <Bot className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Method 3: Crypto */}
        <div className={`p-6 rounded-xl border shadow-sm transition-all ${
          isSandbox ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-full ${isSandbox ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
              <Bitcoin className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-xs font-mono text-amber-500">
               Syncing...
            </div>
          </div>
          <h3 className="text-lg font-bold mb-1">Digital Wallet</h3>
          <p className={`text-sm mb-4 ${isSandbox ? 'text-slate-400' : 'text-slate-500'}`}>Ethereum, USDC, Lightning</p>
          <div className="flex gap-2">
             <button 
                onClick={() => simulatePayment('crypto')}
                disabled={!!processingType}
                className="flex-1 bg-amber-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50"
             >
               Test Web3
             </button>
             <button 
               onClick={() => onAskAgent?.("Write a Solidity smart contract for an escrow payment system.")}
               className={`p-2 rounded-lg border hover:bg-opacity-50 ${isSandbox ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-50'}`}
             >
               <Bot className="w-5 h-5" />
             </button>
          </div>
        </div>

      </div>

      {/* Sandbox Terminal & Transactions Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
        
        {/* API Console */}
        <div className={`rounded-xl border flex flex-col overflow-hidden ${isSandbox ? 'bg-black border-slate-700' : 'bg-slate-900 border-slate-800'}`}>
          <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700">
             <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
               <Terminal className="w-4 h-4" />
               <span>Live API Console</span>
             </div>
             {processingType && <RefreshCw className="w-3 h-3 text-green-500 animate-spin" />}
          </div>
          <div ref={logContainerRef} className="flex-1 p-4 font-mono text-xs text-green-400 overflow-y-auto space-y-1">
            {logs.length === 0 && <span className="text-slate-600 opacity-50">Waiting for API events... Toggle Sandbox or Test a method.</span>}
            {logs.map((log, i) => (
              <div key={i} className="break-all">{log}</div>
            ))}
          </div>
        </div>

        {/* Transaction Table */}
        <div className={`rounded-xl border overflow-hidden flex flex-col ${isSandbox ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className={`px-6 py-4 border-b ${isSandbox ? 'border-slate-700' : 'border-slate-200'}`}>
            <h3 className="font-bold">Recent Transactions</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className={`${isSandbox ? 'bg-slate-900/50 text-slate-400' : 'bg-slate-50 text-slate-900'} font-semibold`}>
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isSandbox ? 'divide-slate-700' : 'divide-slate-200'}`}>
                {transactions.map((tx) => (
                  <tr key={tx.id} className={`transition-colors ${isSandbox ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                    <td className="px-6 py-3 font-mono text-xs opacity-70">{tx.id}</td>
                    <td className="px-6 py-3 font-medium">${tx.amount.toFixed(2)}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${tx.status === 'Completed' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 
                          tx.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
                          'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentPanel;