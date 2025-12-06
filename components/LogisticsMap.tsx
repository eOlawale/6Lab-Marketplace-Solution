import React, { useState, useEffect, useRef } from 'react';
import { Map as MapIcon, Navigation, Truck, Plane, Ship, MapPin, Bot, X, Layers, Satellite, Radio } from 'lucide-react';

interface LogisticsMapProps {
  onAskAgent?: (query: string) => void;
}

interface Vehicle {
  id: string;
  type: 'truck' | 'plane' | 'ship';
  x: number;
  y: number;
  dx: number;
  dy: number;
  label: string;
  status: string;
  cargo: string;
}

const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'TRK-882', type: 'truck', x: 20, y: 30, dx: 0.2, dy: 0.1, label: 'Route 66 Express', status: 'On Schedule', cargo: 'Electronics' },
  { id: 'AIR-101', type: 'plane', x: 80, y: 20, dx: -0.3, dy: 0.2, label: 'Global Air Freight', status: 'In Flight', cargo: 'Medical Supplies' },
  { id: 'SHP-004', type: 'ship', x: 70, y: 80, dx: -0.05, dy: -0.05, label: 'Pacific Voyager', status: 'Docking Soon', cargo: 'Raw Materials' },
  { id: 'TRK-220', type: 'truck', x: 40, y: 60, dx: 0.1, dy: -0.2, label: 'Urban Last-Mile', status: 'Delayed', cargo: 'Consumer Goods' },
];

const LogisticsMap: React.FC<LogisticsMapProps> = ({ onAskAgent }) => {
  const [viewMode, setViewMode] = useState<'vector' | 'terrain'>('terrain');
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [selectedAsset, setSelectedAsset] = useState<Vehicle | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulation Loop for Live Tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        let newX = v.x + v.dx;
        let newY = v.y + v.dy;
        let newDx = v.dx;
        let newDy = v.dy;

        // Bounce off walls
        if (newX <= 5 || newX >= 95) newDx *= -1;
        if (newY <= 5 || newY >= 95) newDy *= -1;

        return { ...v, x: newX, y: newY, dx: newDx, dy: newDy };
      }));
    }, 50); // 20fps update

    return () => clearInterval(interval);
  }, []);

  const handleAssetClick = (e: React.MouseEvent, vehicle: Vehicle) => {
    e.stopPropagation();
    setSelectedAsset(vehicle);
  };

  const handleMapClick = () => {
    setSelectedAsset(null);
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'plane': return <Plane className="w-5 h-5" />;
      case 'ship': return <Ship className="w-5 h-5" />;
      default: return <Truck className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-8 h-full bg-slate-50 overflow-y-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <h1 className="text-2xl font-bold text-slate-900">Logistics & Tracking</h1>
             <span className="flex items-center gap-1 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                <Radio className="w-3 h-3" /> LIVE
             </span>
           </div>
           <p className="text-slate-500">Real-time asset visibility and terrain analysis for 6Lab Global Supply Chain.</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
            <button 
              onClick={() => setViewMode('vector')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'vector' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Layers className="w-4 h-4" /> Map
            </button>
            <button 
              onClick={() => setViewMode('terrain')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'terrain' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Satellite className="w-4 h-4" /> Terrain
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Map Area */}
        <div 
          onClick={handleMapClick}
          ref={containerRef}
          className="lg:col-span-2 rounded-2xl h-[600px] relative overflow-hidden border border-slate-300 shadow-lg group cursor-crosshair transition-all"
        >
           {/* Dynamic Background */}
           <div className={`absolute inset-0 transition-all duration-700 ${
             viewMode === 'terrain' 
               ? "bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-blue-50/50" 
               : "bg-slate-100"
           }`}>
             {/* Terrain Overlay Simulation */}
             {viewMode === 'terrain' && (
               <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-gradient-to-br from-green-900 via-amber-700 to-blue-900"></div>
             )}
             
             {/* Vector Grid Overlay */}
             {viewMode === 'vector' && (
               <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
             )}
           </div>
           
           {/* Moving Vehicles */}
           {vehicles.map((v) => (
             <div 
               key={v.id}
               onClick={(e) => handleAssetClick(e, v)}
               className={`absolute p-2 rounded-full cursor-pointer transition-transform hover:scale-125 shadow-lg border-2 z-20 
                 ${v.type === 'plane' ? 'bg-sky-500 border-white text-white' : 
                   v.type === 'ship' ? 'bg-blue-600 border-white text-white' : 
                   'bg-indigo-600 border-white text-white'}`}
               style={{ 
                 left: `${v.x}%`, 
                 top: `${v.y}%`,
                 transform: `translate(-50%, -50%) rotate(${Math.atan2(v.dy, v.dx) * (180/Math.PI)}deg)`
               }}
             >
               {getIcon(v.type)}
               {/* Pulse Effect for active vehicles */}
               <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white"></div>
             </div>
           ))}

           {/* Selected Asset Popup Card */}
           {selectedAsset && (
             <div 
                style={{ left: `${selectedAsset.x}%`, top: `${selectedAsset.y}%` }} 
                className="absolute z-30 transform -translate-x-1/2 translate-y-6"
             >
                <div className="bg-white/95 backdrop-blur rounded-xl shadow-2xl border border-slate-200 w-72 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top">
                  <div className="bg-slate-900 p-3 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                       {getIcon(selectedAsset.type)}
                       <span className="font-bold text-sm tracking-wide">{selectedAsset.id}</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedAsset(null); }} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Current Cargo</p>
                      <p className="text-sm font-medium text-slate-900">{selectedAsset.cargo}</p>
                    </div>
                    <div className="flex justify-between items-center">
                       <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold">Status</p>
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                            selectedAsset.status === 'Delayed' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {selectedAsset.status}
                          </span>
                       </div>
                       <div className="text-right">
                          <p className="text-xs text-slate-500 uppercase font-semibold">Speed</p>
                          <p className="text-sm font-mono text-slate-900">
                             {selectedAsset.type === 'plane' ? '540 kts' : selectedAsset.type === 'ship' ? '22 kts' : '65 mph'}
                          </p>
                       </div>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onAskAgent?.(`Analyze the current route for ${selectedAsset.id} (${selectedAsset.label}) carrying ${selectedAsset.cargo}. Are there any weather alerts or traffic delays in the region?`);
                      }}
                      className="w-full mt-2 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      <Bot className="w-4 h-4" />
                      Optimize Route via Agent
                    </button>
                  </div>
                </div>
             </div>
           )}

           {/* Map Controls Overlay */}
           <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <button className="bg-white p-2 rounded-lg shadow-md border border-slate-200 hover:bg-slate-50" title="Zoom In">
                 <div className="w-4 h-4 border-2 border-slate-600 rounded-sm flex items-center justify-center font-bold text-slate-600 text-xs">+</div>
              </button>
              <button className="bg-white p-2 rounded-lg shadow-md border border-slate-200 hover:bg-slate-50" title="Zoom Out">
                 <div className="w-4 h-4 border-2 border-slate-600 rounded-sm flex items-center justify-center font-bold text-slate-600 text-xs">-</div>
              </button>
           </div>
        </div>

        {/* Sidebar for Logistics Info */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" /> Fleet Overview
              </h3>
              <div className="space-y-4">
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Active Assets</span>
                        <span className="font-bold text-slate-900">{vehicles.length} Units</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{width: '100%'}}></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">On-Time Performance</span>
                        <span className="font-bold text-slate-900">92%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{width: '92%'}}></div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1">
               <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                   <h3 className="font-bold text-slate-900 text-sm">Live Manifest</h3>
                   <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                     <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                     Updating
                   </span>
               </div>
               <div className="divide-y divide-slate-100 overflow-y-auto max-h-[300px]">
                   {vehicles.map(v => (
                       <div 
                         key={v.id} 
                         onClick={() => setSelectedAsset(v)}
                         className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${selectedAsset?.id === v.id ? 'bg-indigo-50/50' : ''}`}
                       >
                           <div className="flex items-start justify-between mb-1">
                               <div className="flex items-center gap-2">
                                 {getIcon(v.type)}
                                 <span className="font-mono text-xs font-bold text-slate-700">{v.id}</span>
                               </div>
                               <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                                   v.status === 'Delayed' ? 'bg-red-50 text-red-600 border-red-100' :
                                   'bg-green-50 text-green-600 border-green-100'
                               }`}>{v.status}</span>
                           </div>
                           <p className="text-sm font-medium text-slate-900 mt-1">{v.label}</p>
                           <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                               <Navigation className="w-3 h-3" /> 
                               Lat: {v.y.toFixed(2)}, Lon: {v.x.toFixed(2)}
                           </p>
                       </div>
                   ))}
               </div>
               <button className="w-full py-3 text-sm text-center text-indigo-600 font-medium hover:bg-indigo-50 transition-colors border-t border-slate-100">
                   Generate Full Report
               </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsMap;