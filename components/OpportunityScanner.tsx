import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Building, ArrowRight, Sparkles, Loader2, Globe, BarChart2, Check } from 'lucide-react';
import { Opportunity } from '../types';
import { analyzeOpportunity } from '../services/geminiService';

const INITIAL_JOBS: Opportunity[] = [
  {
    id: '1',
    title: 'Group Chief Operating Officer',
    company: 'Balkan Pharma Group',
    location: 'Sarajevo / Hybrid',
    salary_range: '€140k - €180k + Equity',
    match_score: 0,
    status: 'New',
    source: 'Executive Search',
    posted_date: '4h ago',
    description: 'Leading pharmaceutical group in SEE region seeking Group COO to oversee operations across 4 countries. Must have experience in supply chain optimization and EU regulatory compliance.'
  },
  {
    id: '2',
    title: 'VP Engineering / CTO',
    company: 'FinTech Zurich',
    location: 'Zurich, Switzerland',
    salary_range: 'CHF 220k - CHF 280k',
    match_score: 0,
    status: 'New',
    source: 'LinkedIn Jobs',
    posted_date: '12h ago',
    description: 'Scaling a Series B crypto-banking platform. Requires deep expertise in blockchain security, high-frequency trading systems, and leading distributed teams across DACH.'
  },
  {
    id: '3',
    title: 'Managing Director',
    company: 'AutoMotive Components DE',
    location: 'Stuttgart, Germany',
    salary_range: '€200k+',
    match_score: 0,
    status: 'New',
    source: 'Handelsblatt',
    posted_date: '1d ago',
    description: 'P&L responsibility for the e-mobility division. Driving transformation from traditional combustion to EV components. Strong leadership and restructuring experience required.'
  }
];

const OpportunityScanner: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_JOBS);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const handleAnalyzeJob = async (job: Opportunity) => {
    setAnalyzingId(job.id);
    
    // Context injected from (simulated) user profile
    const mockContext = "Senior Executive with 15 years in Tech & Ops. Experience leading 200+ people. Strong DACH/SEE market knowledge. Native German & English.";
    
    const analysis = await analyzeOpportunity(job.description, mockContext);
    
    setOpportunities(prev => prev.map(o => {
      if (o.id === job.id) {
        return {
          ...o,
          match_score: analysis.match_score || 75,
          cultural_fit_score: analysis.cultural_fit_score || 80,
          growth_potential: analysis.growth_potential || "High",
          urgency: analysis.urgency as any || "Medium",
          ai_analysis: {
            fit: analysis.fit,
            gaps: analysis.gaps || [],
            strategy: analysis.strategy
          },
          status: 'Analyzing'
        };
      }
      return o;
    }));
    
    setAnalyzingId(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Opportunity Mining Agent</h2>
          <p className="text-slate-400 text-sm mt-1">Scanning DACH/SEE executive portals & hidden market</p>
        </div>
        <div className="flex items-center space-x-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
                <input 
                    type="text" 
                    placeholder="Filter by region or role..." 
                    className="bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-brand-500 w-64 placeholder:text-slate-600"
                />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-y-auto pb-6">
        {opportunities.map((job) => (
          <div key={job.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all group relative overflow-hidden">
            
            {/* Status Badge if analyzed */}
            {job.match_score > 0 && (
               <div className="absolute top-0 right-0 p-4">
                  <div className="flex flex-col gap-2 items-end">
                    <div className="flex items-center gap-2">
                        <span className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Role Match</span>
                        <div className={`text-lg font-bold ${job.match_score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {job.match_score}%
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Culture Fit</span>
                        <div className={`text-sm font-bold ${job.cultural_fit_score! >= 80 ? 'text-blue-400' : 'text-slate-400'}`}>
                            {job.cultural_fit_score}%
                        </div>
                    </div>
                  </div>
               </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start gap-6 pr-24">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-brand-400 transition-colors">{job.title}</h3>
                  <span className="bg-slate-800 text-slate-400 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border border-slate-700">{job.source}</span>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center"><Building size={14} className="mr-1.5 text-slate-500"/> {job.company}</span>
                  <span className="flex items-center"><MapPin size={14} className="mr-1.5 text-slate-500"/> {job.location}</span>
                  <span className="flex items-center text-slate-300 font-medium"><DollarSign size={14} className="mr-1 text-emerald-500"/> {job.salary_range}</span>
                  <span className="text-slate-600">• {job.posted_date}</span>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-4 max-w-3xl">{job.description}</p>

                {/* AI Analysis Expanded View */}
                {job.ai_analysis && (
                  <div className="mt-4 bg-slate-950/80 rounded-lg border border-slate-800/50 animate-in fade-in duration-300 overflow-hidden">
                    <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800/50 flex justify-between items-center">
                        <span className="text-xs font-bold text-brand-400 flex items-center">
                             <Sparkles size={12} className="mr-1"/> AI STRATEGIC INSIGHTS
                        </span>
                        <div className="flex gap-3 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                             <span>Growth: <span className="text-white">{job.growth_potential}</span></span>
                             <span>Urgency: <span className="text-white">{job.urgency}</span></span>
                        </div>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Fit Analysis</p>
                            <p className="text-sm text-slate-300">{job.ai_analysis.fit}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Application Strategy</p>
                            <p className="text-sm text-slate-300">{job.ai_analysis.strategy}</p>
                        </div>
                    </div>
                    {job.ai_analysis.gaps && job.ai_analysis.gaps.length > 0 && (
                        <div className="bg-amber-900/10 px-4 py-2 border-t border-amber-500/10">
                            <p className="text-xs text-amber-400/80"><span className="font-bold">Gap Mitigation:</span> {job.ai_analysis.gaps.join(", ")}</p>
                        </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
                <button 
                    onClick={() => handleAnalyzeJob(job)}
                    disabled={analyzingId === job.id || (job.match_score > 0)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors ${
                        job.match_score > 0 
                        ? 'bg-slate-800/50 text-slate-500 cursor-default'
                        : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                    }`}
                >
                    {analyzingId === job.id ? (
                        <Loader2 className="animate-spin mr-2" size={16} />
                    ) : job.match_score > 0 ? (
                        <Check size={16} className="mr-2" />
                    ) : (
                        <Sparkles size={16} className="mr-2" />
                    )}
                    {analyzingId === job.id ? 'Running Deep Analysis...' : job.match_score > 0 ? 'Analysis Complete' : 'Evaluate Opportunity'}
                </button>
                
                {job.match_score > 0 && (
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 transition-colors flex items-center">
                        Draft Targeted Cover Letter <ArrowRight size={16} className="ml-2" />
                    </button>
                )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default OpportunityScanner;
