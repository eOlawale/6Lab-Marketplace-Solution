import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';

const data = [
  { name: 'Jan', sales: 4000, visits: 2400 },
  { name: 'Feb', sales: 3000, visits: 1398 },
  { name: 'Mar', sales: 2000, visits: 9800 },
  { name: 'Apr', sales: 2780, visits: 3908 },
  { name: 'May', sales: 1890, visits: 4800 },
  { name: 'Jun', sales: 2390, visits: 3800 },
  { name: 'Jul', sales: 3490, visits: 4300 },
];

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${trend === 'up' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="mt-4 flex items-center">
      {trend === 'up' ? (
        <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
      ) : (
        <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
      )}
      <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </span>
      <span className="text-sm text-slate-400 dark:text-slate-500 ml-1">vs last month</span>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 bg-slate-50 dark:bg-slate-900 h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">E-commerce Ecosystem</h1>
        <p className="text-slate-500 dark:text-slate-400">Real-time overview of your platform performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value="$45,231.89" change="+20.1%" icon={DollarSign} trend="up" />
        <StatCard title="Active Users" value="2,345" change="+15.2%" icon={Users} trend="up" />
        <StatCard title="New Orders" value="456" change="-5.4%" icon={ShoppingCart} trend="down" />
        <StatCard title="Conversion Rate" value="3.2%" change="+2.4%" icon={Activity} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Revenue Analytics</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} prefix="$" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff'}}
                  itemStyle={{color: '#fff'}}
                />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Traffic vs Orders</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                   cursor={{fill: '#f1f5f9', opacity: 0.1}} 
                   contentStyle={{backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff'}}
                   itemStyle={{color: '#fff'}}
                />
                <Legend />
                <Bar dataKey="visits" name="Visits" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sales" name="Orders (x10)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;