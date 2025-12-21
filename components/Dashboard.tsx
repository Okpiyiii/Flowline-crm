import React from 'react';
import { GlassCard, Button } from './ui/GlassComponents';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { ArrowUpRight, DollarSign, Users, Briefcase, TrendingUp, Calendar, MoreHorizontal } from 'lucide-react';
import { Lead, PipelineStage } from '../types';

interface DashboardProps {
  leads: Lead[];
}

export const Dashboard: React.FC<DashboardProps> = ({ leads }) => {
  // Calculated metrics
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const openLeads = leads.filter(l => l.status !== PipelineStage.WON && l.status !== PipelineStage.LOST).length;
  const wonLeads = leads.filter(l => l.status === PipelineStage.WON).length;
  const conversionRate = Math.round((wonLeads / (leads.length || 1)) * 100);

  // Mock data for charts
  const activityData = [
    { name: 'Mon', leads: 4 },
    { name: 'Tue', leads: 3 },
    { name: 'Wed', leads: 7 },
    { name: 'Thu', leads: 2 },
    { name: 'Fri', leads: 5 },
    { name: 'Sat', leads: 1 },
    { name: 'Sun', leads: 2 },
  ];

  const valueByStageData = [
    { name: 'New', value: 15000 },
    { name: 'Contacted', value: 25000 },
    { name: 'Qualified', value: 18000 },
    { name: 'Proposal', value: 45000 },
    { name: 'Won', value: 32000 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
        <h1 className="text-xl font-medium text-zinc-900">Dashboard</h1>
        <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8 text-xs font-normal text-zinc-500">
                <Calendar size={12} className="mr-2" /> Last 7 Days
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs font-normal text-zinc-500">
                Export
            </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPIWidget 
          label="Pipeline Value" 
          value={`$${totalValue.toLocaleString()}`} 
          trend="12%" 
        />
        <KPIWidget 
          label="Active Leads" 
          value={openLeads.toString()} 
          trend="4" 
        />
        <KPIWidget 
          label="Conversion Rate" 
          value={`${conversionRate}%`} 
          trend="2.1%" 
        />
        <KPIWidget 
          label="Deals Won" 
          value={wonLeads.toString()} 
          trend="1" 
        />
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 h-80 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-medium text-zinc-900">Lead Acquisition</h3>
            <button className="text-zinc-400 hover:text-zinc-600"><MoreHorizontal size={16}/></button>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18181b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#a1a1aa'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#a1a1aa'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e4e4e7', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', fontSize: '12px' }}
                  itemStyle={{ color: '#18181b' }}
                  cursor={{stroke: '#e4e4e7', strokeWidth: 1}}
                />
                <Area type="monotone" dataKey="leads" stroke="#18181b" strokeWidth={1.5} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="h-80 flex flex-col">
           <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-medium text-zinc-900">Value by Stage</h3>
             <button className="text-zinc-400 hover:text-zinc-600"><MoreHorizontal size={16}/></button>
          </div>
          <div className="flex-1 w-full min-h-0">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valueByStageData} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#71717a'}} />
                <Tooltip 
                  cursor={{fill: '#f4f4f5'}}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e4e4e7', fontSize: '12px' }}
                />
                <Bar dataKey="value" fill="#27272a" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="flex flex-col justify-center">
            <h3 className="text-sm font-medium text-zinc-500 mb-1">Avg. Deal Size</h3>
            <p className="text-2xl font-medium text-zinc-900 tracking-tight">$12,450</p>
        </GlassCard>
         <GlassCard className="flex flex-col justify-center">
            <h3 className="text-sm font-medium text-zinc-500 mb-1">Win Rate</h3>
            <p className="text-2xl font-medium text-zinc-900 tracking-tight">32.4%</p>
        </GlassCard>
      </div>
    </div>
  );
};

const KPIWidget: React.FC<{ label: string, value: string, trend: string }> = ({ label, value, trend }) => (
  <GlassCard className="flex flex-col justify-between group hover:border-zinc-300 transition-colors">
    <div>
      <p className="text-zinc-500 text-xs font-medium uppercase tracking-wide mb-1">{label}</p>
      <div className="flex items-baseline space-x-2">
        <h2 className="text-2xl font-medium text-zinc-900 tracking-tight">{value}</h2>
        <span className="text-emerald-600 text-xs font-medium bg-emerald-50 px-1.5 py-0.5 rounded flex items-center">
            <TrendingUp size={10} className="mr-1" /> {trend}
        </span>
      </div>
    </div>
  </GlassCard>
);