import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Activity, TrendingUp, Users, Briefcase, Zap, Target, Crosshair, BrainCircuit, Coffee, Play } from 'lucide-react';
import { AgentLog, StrategyBrief } from '../types';
import { generateCampaignStrategy, generateMorningBriefing } from '../services/geminiService';

interface DashboardProps {
  logs: AgentLog[];
}

const data = [
  { name: 'Mon', applications: 4, responses: 1, interviews: 0 },
  { name: 'Tue', applications: 3, responses: 2, interviews: 1 },
  { name: 'Wed', applications: 5, responses: 0, interviews: 0 },
  { name: 'Thu', applications: 8, responses: 3, interviews: 1 },
  { name: 'Fri', applications: 6, responses: 2, interviews: 2 },
  { name: 'Sat', applications: 2, responses: 1, interviews: 0 },
  { name: 'Sun', applications: 1, responses: 0, interviews: 0 },
];

const Dashboard: React.FC<DashboardProps> = ({ logs }) => {
  const [strategy, setStrategy] = useState<StrategyBrief | null>(null);
  const [morningBriefing, setMorningBriefing] = useState<string>('');
  const [loadingBriefing, setLoadingBriefing] = useState(true);

  useEffect(() => {
    // Autonomous Agent: Campaign Strategist running...
    generateCampaignStrategy({ applications: 29, interviews: 4, responseRate: "12%" })
      .then(setStrategy)
      .catch(console.error);
    
    // Generate Morning Briefing
    generateMorningBriefing("John", 12)
      .then((text) => {
        setMorningBriefing(text);
        setLoadingBriefing(false);
      })
      .catch((e) => {
        console.error(e);
        setLoadingBriefing(false);
      });
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      
      {/* Morning Briefing Card - NEW */}
      <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/30 p-6 rounded-xl relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-4">
           <div className="p-3 bg-indigo-500/20 rounded-full text-indigo-400">
             <Coffee size={24} />
           </div>
           <div className="flex-1">
             <h3 className="text-lg font-bold text-white mb-1">Morning Executive Briefing</h3>
             {loadingBriefing ? (
               <div className="h-4 bg-slate-800 rounded w-2/3 animate-pulse"></div>
             ) : (
               <p className="text-indigo-100/80 text-sm leading-relaxed max-w-3xl italic">
                 "{morningBriefing}"
               </p>
             )}
           </div>
           <button className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors">
              <Play size={12} fill="currentColor" /> Listen
           </button>
        </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm hover:border-brand-500 transition-colors group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Active Pipeline</p>
              <h3 className="text-2xl font-bold text-white mt-1">12 Roles</h3>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-500/20 transition-all">
              <Briefcase size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500">
            <span className="text-emerald-400 flex items-center mr-2">
              <TrendingUp size={12} className="mr-1" /> +3 new
            </span>
            high probability
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm hover:border-brand-500 transition-colors group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Recruiter Network</p>
              <h3 className="text-2xl font-bold text-white mt-1">45</h3>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:text-purple-300 group-hover:bg-purple-500/20 transition-all">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500">
            <span className="text-emerald-400 flex items-center mr-2">
              <Target size={12} className="mr-1" /> 12%
            </span>
            response rate
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm hover:border-brand-500 transition-colors group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Exp. Value</p>
              <h3 className="text-2xl font-bold text-white mt-1">$2.4M</h3>
            </div>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 group-hover:text-amber-300 group-hover:bg-amber-500/20 transition-all">
              <Activity size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500">
            Weighted pipeline value
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm hover:border-brand-500 transition-colors group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">AutoPilot</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">Online</h3>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:text-emerald-300 group-hover:bg-emerald-500/20 transition-all">
              <Zap size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500">
            Scanning 5 sources 24/7
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Implementation Velocity</h3>
            <div className="flex space-x-2 text-xs">
              <span className="px-2 py-1 bg-slate-800 rounded text-slate-400">Applications</span>
              <span className="px-2 py-1 bg-slate-800 rounded text-emerald-400">Interviews</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#F8FAFC' }}
                />
                <Area type="monotone" dataKey="applications" stroke="#6366F1" fillOpacity={1} fill="url(#colorApps)" />
                <Area type="monotone" dataKey="interviews" stroke="#10B981" fillOpacity={0} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Campaign Strategist Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <BrainCircuit size={18} className="mr-2 text-brand-400" />
            Campaign Strategist
          </h3>
          
          {strategy ? (
            <div className="flex-1 flex flex-col space-y-4">
              <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-lg">
                <p className="text-xs text-brand-400 font-semibold uppercase mb-1">Weekly Focus</p>
                <p className="text-sm text-slate-200 font-medium">{strategy.focus_of_the_week}</p>
              </div>
              
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase mb-2">Priority Actions</p>
                <ul className="space-y-2">
                  {strategy.top_priorities && strategy.top_priorities.length > 0 ? (
                    strategy.top_priorities.map((action, i) => (
                      <li key={i} className="flex items-start text-sm text-slate-300">
                        <span className="text-brand-500 mr-2 mt-0.5">•</span>
                        {action}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-slate-500 italic">No priorities generated.</li>
                  )}
                </ul>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">Strategy</p>
                  <p className="text-xs text-slate-300 mt-1">{strategy.channel_strategy}</p>
                </div>
                <div>
                   <p className="text-[10px] text-slate-500 uppercase">Success Prob.</p>
                   <p className="text-lg font-bold text-emerald-400">{strategy.success_probability}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm animate-pulse">
              Formulating strategy...
            </div>
          )}
        </div>
      </div>

      {/* Live Agent Activity Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Activity size={18} className="mr-2 text-brand-400" />
          Autonomous Agent Logs
        </h3>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 font-mono text-sm">
          {logs && logs.slice().reverse().map((log) => (
            <div key={log.id} className="flex items-center space-x-3 border-b border-slate-800/50 pb-2 last:border-0">
              <span className="text-[10px] text-slate-600 w-16">{log.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded w-32 text-center ${
                log.agent === 'Campaign Strategist' ? 'bg-purple-900/50 text-purple-400' :
                log.agent === 'Opportunity Miner' ? 'bg-blue-900/50 text-blue-400' :
                log.agent === 'Comms Orchestrator' ? 'bg-emerald-900/50 text-emerald-400' :
                log.agent === 'Due Diligence' ? 'bg-amber-900/50 text-amber-400' :
                'bg-slate-800 text-slate-400'
              }`}>
                {log.agent}
              </span>
              <span className="text-slate-400 truncate flex-1">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
