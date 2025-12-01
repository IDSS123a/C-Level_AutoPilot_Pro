import React, { useEffect, useState, useRef } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Activity, TrendingUp, Users, Briefcase, Zap, Target, BrainCircuit, Coffee, Play } from 'lucide-react';
import { StrategyBrief } from '../types';
import { useLogStore } from '../store/useLogStore';
import { generateCampaignStrategy, generateMorningBriefing } from '../services/geminiService';
import GlassCard from './common/GlassCard';
import Typewriter from './common/Typewriter';
import Skeleton from './common/Skeleton';

const data = [
  { name: 'Mon', applications: 4, responses: 1, interviews: 0 },
  { name: 'Tue', applications: 3, responses: 2, interviews: 1 },
  { name: 'Wed', applications: 5, responses: 0, interviews: 0 },
  { name: 'Thu', applications: 8, responses: 3, interviews: 1 },
  { name: 'Fri', applications: 6, responses: 2, interviews: 2 },
  { name: 'Sat', applications: 2, responses: 1, interviews: 0 },
  { name: 'Sun', applications: 1, responses: 0, interviews: 0 },
];

const Dashboard: React.FC = () => {
  const { agentLogs } = useLogStore();
  const [strategy, setStrategy] = useState<StrategyBrief | null>(null);
  const [morningBriefing, setMorningBriefing] = useState<string>('');
  const [loadingBriefing, setLoadingBriefing] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Autonomous Agent: Campaign Strategist running...
    generateCampaignStrategy({ applications: 29, interviews: 4, responseRate: "12%" })
      .then(res => {
        if (isMounted.current) setStrategy(res);
      })
      .catch(console.error);
    
    // Generate Morning Briefing
    generateMorningBriefing("John", 12)
      .then((text) => {
        if (isMounted.current) {
          setMorningBriefing(typeof text === 'string' ? text : "Morning briefing unavailable.");
          setLoadingBriefing(false);
        }
      })
      .catch((e) => {
        if (isMounted.current) {
          console.error(e);
          setLoadingBriefing(false);
        }
      });
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      
      {/* Morning Briefing Card */}
      <GlassCard gradient="highlight" className="border-indigo-500/20">
        <div className="p-6 relative z-10 flex items-start gap-5">
           <div className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
             <Coffee size={24} strokeWidth={1.5} />
           </div>
           <div className="flex-1 pt-1">
             <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Morning Executive Briefing</h3>
             {loadingBriefing ? (
               <div className="space-y-2 max-w-2xl">
                 <Skeleton variant="text" width="100%" className="bg-indigo-900/20" />
                 <Skeleton variant="text" width="85%" className="bg-indigo-900/20" />
                 <Skeleton variant="text" width="60%" className="bg-indigo-900/20" />
               </div>
             ) : (
               <div className="text-indigo-100/90 text-sm leading-relaxed max-w-3xl font-medium">
                 <span className="text-indigo-400 font-bold mr-2">AI AGENT:</span>
                 <Typewriter text={morningBriefing || "Briefing data currently unavailable."} speed={20} />
               </div>
             )}
           </div>
           <button className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-indigo-100 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all hover:scale-105">
              <Play size={12} fill="currentColor" /> Listen
           </button>
        </div>
      </GlassCard>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Pipeline', value: '12 Roles', icon: Briefcase, color: 'blue', subtext: '+3 new', subColor: 'emerald' },
          { label: 'Recruiter Network', value: '45', icon: Users, color: 'purple', subtext: '12%', subLabel: 'response rate' },
          { label: 'Exp. Value', value: '$2.4M', icon: Activity, color: 'amber', subtext: 'Weighted value', subLabel: '' },
          { label: 'AutoPilot', value: 'Online', icon: Zap, color: 'emerald', subtext: 'Scanning 24/7', subLabel: '' }
        ].map((stat, i) => (
          <GlassCard key={i} hoverEffect className="p-4 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white mt-1 tracking-tight">{stat.value}</h3>
              </div>
              <div className={`p-2.5 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400 group-hover:bg-${stat.color}-500/20 group-hover:text-${stat.color}-300 transition-all border border-${stat.color}-500/10`}>
                <stat.icon size={20} strokeWidth={1.5} />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-slate-500">
              {stat.subtext && (
                <span className={`text-${stat.subColor || 'slate'}-400 flex items-center mr-2 font-medium`}>
                  {stat.subColor === 'emerald' && <TrendingUp size={12} className="mr-1" />}
                  {stat.subColor === 'purple' && <Target size={12} className="mr-1" />}
                  {stat.subtext}
                </span>
              )}
              {stat.subLabel}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <GlassCard className="lg:col-span-2 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white tracking-tight">Implementation Velocity</h3>
            <div className="flex space-x-2 text-xs">
              <span className="px-3 py-1 bg-slate-800/80 border border-slate-700 rounded-full text-slate-400">Applications</span>
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]">Interviews</span>
            </div>
          </div>
          <div className="h-64 w-full flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.1)', color: '#F8FAFC', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="applications" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
                <Area type="monotone" dataKey="interviews" stroke="#10B981" fillOpacity={0} strokeWidth={2} dot={{ r: 4, fill: '#0F172A', stroke: '#10B981', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Campaign Strategist Panel */}
        <GlassCard className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-white flex items-center tracking-tight">
              <BrainCircuit size={18} className="mr-2 text-brand-400" />
              Campaign Strategist
            </h3>
            <div className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </div>
          </div>
          
          {strategy ? (
            <div className="flex-1 flex flex-col space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="p-4 bg-brand-500/5 border border-brand-500/20 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Target size={64} className="text-brand-500" />
                </div>
                <p className="text-[10px] text-brand-400 font-bold uppercase tracking-wider mb-1.5">Weekly Strategic Focus</p>
                <p className="text-sm text-white font-medium leading-relaxed relative z-10">{strategy.focus_of_the_week}</p>
              </div>
              
              <div className="flex-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-3">Priority Actions</p>
                <ul className="space-y-3">
                  {strategy.top_priorities && strategy.top_priorities.length > 0 ? (
                    strategy.top_priorities.map((action, i) => (
                      <li key={i} className="flex items-start text-xs text-slate-300 group">
                        <div className="mt-0.5 mr-2.5 h-1.5 w-1.5 rounded-full bg-slate-700 group-hover:bg-brand-500 transition-colors"></div>
                        {action}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-slate-500 italic">No priorities generated.</li>
                  )}
                </ul>
              </div>

              <div className="mt-auto pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Strategy</p>
                  <p className="text-xs text-slate-300 mt-1">{strategy.channel_strategy}</p>
                </div>
                <div>
                   <p className="text-[10px] text-slate-500 uppercase font-bold">Success Prob.</p>
                   <p className="text-lg font-bold text-emerald-400">{strategy.success_probability}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <Skeleton variant="rect" width="100%" height={80} className="bg-slate-800/30" />
              <div className="w-full space-y-2">
                 <Skeleton variant="text" width="90%" className="bg-slate-800/30" />
                 <Skeleton variant="text" width="75%" className="bg-slate-800/30" />
                 <Skeleton variant="text" width="80%" className="bg-slate-800/30" />
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Live Agent Activity Log */}
      <GlassCard className="p-0">
        <div className="p-6 border-b border-white/5">
            <h3 className="text-lg font-semibold text-white flex items-center">
            <Activity size={18} className="mr-2 text-brand-400" />
            Autonomous Agent Logs
            </h3>
        </div>
        <div className="max-h-60 overflow-y-auto">
          {agentLogs && agentLogs.slice().map((log, i) => (
            <div key={log.id} className={`flex items-center space-x-4 px-6 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors text-xs font-mono ${i === 0 ? 'bg-brand-500/5' : ''}`}>
              <span className="text-slate-500 w-16 flex-shrink-0">{log.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
              <span className={`font-bold px-2 py-0.5 rounded w-32 flex-shrink-0 text-center ${
                log.agent === 'Campaign Strategist' ? 'bg-purple-900/30 text-purple-400 border border-purple-500/20' :
                log.agent === 'Opportunity Miner' ? 'bg-blue-900/30 text-blue-400 border border-blue-500/20' :
                log.agent === 'Comms Orchestrator' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/20' :
                log.agent === 'Due Diligence' ? 'bg-amber-900/30 text-amber-400 border border-amber-500/20' :
                'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {log.agent}
              </span>
              <span className="text-slate-300 truncate flex-1">{log.message}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default Dashboard;