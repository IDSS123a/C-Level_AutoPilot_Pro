import React, { useState } from 'react';
import { Search, Building2, BarChart3, AlertTriangle, Lightbulb, Users, HelpCircle, Loader2, Target, Globe, MessageSquare, Link, RotateCcw } from 'lucide-react';
import { generateCompanyDossier } from '../services/geminiService';
import { CompanyDossier } from '../types';

const DueDiligence: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dossier, setDossier] = useState<CompanyDossier | null>(null);

  const handleGenerate = async () => {
    if (!companyName) return;
    setIsGenerating(true);
    setError(null);
    setDossier(null);
    
    try {
      const result = await generateCompanyDossier(companyName, industry || "Technology");
      setDossier(result);
    } catch (err) {
      console.error(err);
      setError("Failed to generate dossier. The AI service may be temporarily unavailable or the company could not be analyzed.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <Building2 className="text-brand-400" size={28}/>
             Due Diligence Engine
          </h2>
          <p className="text-slate-400 text-sm mt-1">Generate deep-dive executive dossiers with real-time market data.</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
        <div className="flex gap-4 items-end">
            <div className="flex-1">
                <label className="block text-xs text-slate-400 font-medium mb-2">TARGET COMPANY</label>
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-slate-500" size={18} />
                    <input 
                        type="text"
                        placeholder="e.g. Acme Corp, FinTech Global..."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-brand-500 outline-none"
                    />
                </div>
            </div>
             <div className="w-1/3">
                <label className="block text-xs text-slate-400 font-medium mb-2">INDUSTRY / SECTOR</label>
                <input 
                    type="text"
                    placeholder="e.g. SaaS, Automotive..."
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-brand-500 outline-none"
                />
            </div>
            <button 
                onClick={handleGenerate}
                disabled={isGenerating || !companyName}
                className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-3 rounded-lg font-medium flex items-center transition-all shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isGenerating ? <Loader2 className="animate-spin mr-2"/> : <BarChart3 className="mr-2"/>}
                Generate Dossier
            </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="flex-1 overflow-y-auto min-h-0 rounded-xl">
        {isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
                <Loader2 size={48} className="animate-spin text-brand-500 mb-4" />
                <p className="font-medium text-white">Analyzing Market Data...</p>
                <p className="text-xs mt-2 text-slate-400">Searching web • Verifying sources • Predicting interview questions</p>
                <p className="text-[10px] text-slate-600 mt-4">This may take 15-30 seconds</p>
            </div>
        ) : error ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-red-900/10 rounded-xl border border-red-500/20">
                <AlertTriangle size={48} className="text-red-500 mb-4" />
                <p className="font-medium text-white mb-2">Analysis Failed</p>
                <p className="text-sm text-slate-400 max-w-md text-center mb-6">{error}</p>
                <button 
                  onClick={handleGenerate}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  <RotateCcw size={16} /> Try Again
                </button>
            </div>
        ) : dossier ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Executive Summary & Stats */}
                  <div className="md:col-span-2 space-y-6">
                      {/* Executive Summary Card */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                          <div className="flex justify-between items-start mb-4">
                              <div>
                                  <h3 className="text-xl font-bold text-white">{dossier.companyName}</h3>
                                  <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                                      <Globe size={12}/> {dossier.headquarters} • Market Cap: {dossier.marketCap || 'Private/Unknown'}
                                  </p>
                              </div>
                              <div className="bg-brand-900/30 text-brand-300 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                                  Executive Brief
                              </div>
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{dossier.executiveSummary}</p>
                      </div>

                      {/* Culture & Risks Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                              <h4 className="flex items-center text-amber-400 font-bold text-sm uppercase tracking-wide mb-4">
                                  <AlertTriangle size={16} className="mr-2"/> Key Challenges
                              </h4>
                              <ul className="space-y-3">
                                  {dossier.keyChallenges && dossier.keyChallenges.length > 0 ? (
                                    dossier.keyChallenges.map((c, i) => (
                                        <li key={i} className="text-sm text-slate-300 flex items-start">
                                            <span className="text-amber-500 mr-2 mt-0.5">•</span> {c}
                                        </li>
                                    ))
                                  ) : (
                                    <li className="text-sm text-slate-500 italic">No specific challenges found.</li>
                                  )}
                              </ul>
                          </div>
                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                              <h4 className="flex items-center text-emerald-400 font-bold text-sm uppercase tracking-wide mb-4">
                                  <Target size={16} className="mr-2"/> Strategic Opps
                              </h4>
                              <ul className="space-y-3">
                                  {dossier.strategicOpportunities && dossier.strategicOpportunities.length > 0 ? (
                                    dossier.strategicOpportunities.map((o, i) => (
                                        <li key={i} className="text-sm text-slate-300 flex items-start">
                                            <span className="text-emerald-500 mr-2 mt-0.5">•</span> {o}
                                        </li>
                                    ))
                                  ) : (
                                    <li className="text-sm text-slate-500 italic">No specific opportunities found.</li>
                                  )}
                              </ul>
                          </div>
                      </div>

                      {/* Culture Analysis */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                          <h4 className="flex items-center text-purple-400 font-bold text-sm uppercase tracking-wide mb-3">
                              <Users size={16} className="mr-2"/> Culture & Sentiment Analysis
                          </h4>
                          <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-purple-500/30 pl-4">
                              "{dossier.cultureAnalysis}"
                          </p>
                      </div>
                  </div>

                  {/* Right Column: Interview Prep */}
                  <div className="md:col-span-1 space-y-6">
                      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6 h-full flex flex-col">
                          <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                              <Lightbulb className="text-yellow-400" size={20}/> Interview Intel
                          </h3>
                          <p className="text-xs text-slate-500 mb-6">Predicted dialogue strategy</p>

                          <div className="mb-8">
                              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center">
                                  <HelpCircle size={12} className="mr-1.5"/> Expect These Questions
                              </h4>
                              <div className="space-y-3">
                                  {dossier.interviewQuestions?.expected_from_ceo?.length > 0 ? (
                                    dossier.interviewQuestions.expected_from_ceo.map((q, i) => (
                                      <div key={i} className="bg-red-900/10 border border-red-500/10 p-3 rounded-lg text-sm text-slate-300">
                                          "{q}"
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-xs text-slate-500 italic">No questions generated.</p>
                                  )}
                              </div>
                          </div>

                          <div>
                              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center">
                                  <MessageSquare size={12} className="mr-1.5"/> Ask These Questions
                              </h4>
                              <div className="space-y-3">
                                  {dossier.interviewQuestions?.to_ask_ceo?.length > 0 ? (
                                    dossier.interviewQuestions.to_ask_ceo.map((q, i) => (
                                      <div key={i} className="bg-blue-900/10 border border-blue-500/10 p-3 rounded-lg text-sm text-slate-300">
                                          "{q}"
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-xs text-slate-500 italic">No questions generated.</p>
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>
                </div>

                {/* Sources Section */}
                {dossier.sources && dossier.sources.length > 0 && (
                   <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
                     <h4 className="flex items-center text-slate-500 font-bold text-xs uppercase tracking-wide mb-3">
                        <Link size={14} className="mr-2"/> Verified Sources (Google Search Grounding)
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                       {dossier.sources.map((source, i) => (
                         <a 
                           key={i} 
                           href={source.uri} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="flex items-center p-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-brand-500/50 hover:bg-slate-800 transition-colors group"
                         >
                           <Globe size={14} className="text-slate-500 group-hover:text-brand-400 mr-2 flex-shrink-0" />
                           <span className="text-xs text-slate-300 truncate group-hover:text-brand-200">{source.title}</span>
                         </a>
                       ))}
                     </div>
                   </div>
                )}

            </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 bg-slate-900/20 rounded-xl border border-slate-800/50">
                <Building2 size={64} strokeWidth={1} className="opacity-50 mb-4"/>
                <p className="text-lg font-medium text-slate-400">No Dossier Generated</p>
                <p className="text-sm mt-2 max-w-sm text-center">Enter a target company above to generate a comprehensive executive analysis report.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default DueDiligence;