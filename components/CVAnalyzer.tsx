import React, { useState } from 'react';
import { FileText, BrainCircuit, AlertTriangle, CheckCircle, Loader2, Trophy, Target, Scale, Plus } from 'lucide-react';
import { analyzeCVContent, analyzeSkillGap } from '../services/geminiService';
import { CVAnalysisResult, SkillGapAnalysisResult } from '../types';

const CVAnalyzer: React.FC = () => {
  const [cvText, setCvText] = useState<string>('');
  const [jobDesc, setJobDesc] = useState<string>('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzingGap, setIsAnalyzingGap] = useState(false);
  
  const [result, setResult] = useState<CVAnalysisResult | null>(null);
  const [gapResult, setGapResult] = useState<SkillGapAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'gap'>('general');

  const handleAnalyze = async () => {
    if (!cvText.trim()) return;
    setIsAnalyzing(true);
    setActiveTab('general');
    try {
      const data = await analyzeCVContent(cvText);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGapAnalyze = async () => {
    if (!cvText.trim() || !jobDesc.trim()) return;
    setIsAnalyzingGap(true);
    setActiveTab('gap');
    try {
      const data = await analyzeSkillGap(cvText, jobDesc);
      setGapResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzingGap(false);
    }
  };

  const fillMockCV = () => {
    setCvText(`JOHN DOE
Chief Technology Officer | AI Strategist

EXECUTIVE SUMMARY
Visionary CTO with 15+ years driving digital transformation in FinTech. Proven track record of scaling engineering teams from 10 to 200+. Expert in cloud migration (AWS/Azure) and AI integration.

EXPERIENCE
CTO - FinTech Global (2019 - Present)
- Led a team of 150 engineers across 3 continents.
- Reduced infrastructure costs by 40% via serverless architecture.
- Implemented generative AI tools increasing dev productivity by 25%.

VP Engineering - TechStart Inc (2015 - 2019)
- Scaled platform to 5M daily users.
- Managed $10M annual budget.`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-4rem)]">
      {/* Input Section */}
      <div className="flex flex-col space-y-4 h-full">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <FileText className="mr-2 text-brand-400" />
              CV Analysis Agent
            </h2>
            <button 
              onClick={fillMockCV}
              className="text-xs text-slate-500 hover:text-brand-400 transition-colors"
            >
              Load Demo Data
            </button>
          </div>
          
          <div className="flex-1 flex flex-col gap-4 min-h-0">
              <div className="flex-1 flex flex-col min-h-0">
                  <label className="text-xs text-slate-400 font-medium mb-2">YOUR CV CONTENT</label>
                  <textarea 
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 resize-none font-mono text-xs leading-relaxed placeholder:text-slate-700"
                    placeholder="Paste your CV text here..."
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                  />
              </div>

              <div className="h-40 flex flex-col flex-shrink-0">
                  <label className="text-xs text-emerald-400 font-medium mb-2 flex items-center justify-between">
                      <span>TARGET JOB DESCRIPTION (For Gap Analysis)</span>
                      <span className="text-slate-600 text-[10px]">OPTIONAL</span>
                  </label>
                  <textarea 
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 focus:ring-1 focus:ring-brand-500 focus:border-emerald-500/50 resize-none font-mono text-xs leading-relaxed placeholder:text-slate-700"
                    placeholder="Paste the target job description here to compare fit..."
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                  />
              </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !cvText}
              className={`flex-1 py-2.5 rounded-lg font-medium flex items-center justify-center transition-all ${
                isAnalyzing || !cvText
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20'
              }`}
            >
              {isAnalyzing ? <Loader2 className="animate-spin mr-2" size={16}/> : <BrainCircuit className="mr-2" size={16}/>}
              {isAnalyzing ? 'Analyzing...' : 'Analyze Profile'}
            </button>
            <button
              onClick={handleGapAnalyze}
              disabled={isAnalyzingGap || !cvText || !jobDesc}
              className={`flex-1 py-2.5 rounded-lg font-medium flex items-center justify-center transition-all ${
                isAnalyzingGap || !cvText || !jobDesc
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              }`}
            >
              {isAnalyzingGap ? <Loader2 className="animate-spin mr-2" size={16}/> : <Scale className="mr-2" size={16}/>}
              {isAnalyzingGap ? 'Comparing...' : 'Check Role Fit'}
            </button>
          </div>
        </div>
      </div>

      {/* Output Section */}
      <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden h-full">
         
         {/* Tabs */}
         <div className="flex border-b border-slate-800">
             <button 
                onClick={() => setActiveTab('general')}
                className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'general' ? 'border-brand-500 text-white bg-brand-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
             >
                 General Profile
             </button>
             <button 
                onClick={() => setActiveTab('gap')}
                disabled={!gapResult}
                className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'gap' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 disabled:opacity-50 hover:text-slate-300'
                }`}
             >
                 Role Fit Analysis
             </button>
         </div>

         {/* Content */}
         <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'general' ? (
                result ? (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Score Header */}
                        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-6">
                        <div>
                            <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Executive Readiness Score</h3>
                            <div className="text-5xl font-bold text-white mt-2">{result.score}<span className="text-lg text-slate-500 font-normal">/100</span></div>
                        </div>
                        <div className="text-right">
                            <h4 className="text-xs uppercase tracking-wider text-brand-400 font-semibold mb-1">Strategic Positioning</h4>
                            <p className="text-slate-300 text-sm italic max-w-xs leading-tight">"{result.strategic_positioning}"</p>
                        </div>
                        </div>

                        {/* Analysis Grid */}
                        <div className="space-y-6">
                        <div>
                            <h4 className="flex items-center text-emerald-400 font-medium mb-3 text-sm uppercase tracking-wide">
                            <CheckCircle size={16} className="mr-2" /> Competitive Strengths
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                            {result.strengths.map((s, i) => (
                                <div key={i} className="bg-emerald-900/10 border border-emerald-500/10 px-3 py-2 rounded text-sm text-slate-300">
                                {s}
                                </div>
                            ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="flex items-center text-amber-400 font-medium mb-3 text-sm uppercase tracking-wide">
                            <AlertTriangle size={16} className="mr-2" /> Market Gaps
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                            {result.weaknesses.map((w, i) => (
                                <div key={i} className="bg-amber-900/10 border border-amber-500/10 px-3 py-2 rounded text-sm text-slate-300">
                                {w}
                                </div>
                            ))}
                            </div>
                        </div>

                        {result.quantified_achievements && result.quantified_achievements.length > 0 && (
                            <div>
                                <h4 className="flex items-center text-brand-400 font-medium mb-3 text-sm uppercase tracking-wide">
                                    <Trophy size={16} className="mr-2" /> Achievement Impact
                                </h4>
                                <ul className="space-y-2">
                                    {result.quantified_achievements.map((q, i) => (
                                        <li key={i} className="flex items-start text-sm text-slate-400">
                                            <Target size={14} className="mr-2 mt-0.5 text-brand-500 flex-shrink-0"/>
                                            {q}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-800">
                        <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase">Executive Summary</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{result.summary}</p>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 dashed-border">
                        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                        <BrainCircuit size={32} className="opacity-50" />
                        </div>
                        <p className="text-lg font-medium">No Analysis Yet</p>
                        <p className="text-sm mt-2 max-w-xs text-center">Paste CV text to inspect executive readiness.</p>
                    </div>
                )
            ) : (
                gapResult ? (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold border-4 ${
                                gapResult.match_score >= 80 ? 'border-emerald-500 text-emerald-400' : 
                                gapResult.match_score >= 60 ? 'border-amber-500 text-amber-400' : 'border-red-500 text-red-400'
                            }`}>
                                {gapResult.match_score}%
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Role Alignment Score</h3>
                                <p className="text-sm text-slate-400">Match against specific job requirements</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                             <div>
                                <h4 className="flex items-center text-red-400 font-medium mb-3 text-sm uppercase tracking-wide">
                                    <AlertTriangle size={16} className="mr-2" /> Missing Critical Skills
                                </h4>
                                {gapResult.missing_critical_skills.length > 0 ? (
                                    <ul className="space-y-2">
                                        {gapResult.missing_critical_skills.map((skill, i) => (
                                            <li key={i} className="flex items-center text-sm text-slate-300 bg-red-900/10 px-3 py-2 rounded border border-red-500/10">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></div>
                                                {skill}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-slate-500 italic">No critical skills missing found.</p>
                                )}
                             </div>

                             <div>
                                <h4 className="flex items-center text-blue-400 font-medium mb-3 text-sm uppercase tracking-wide">
                                    <Plus size={16} className="mr-2" /> Tailoring Recommendations
                                </h4>
                                <div className="space-y-3">
                                    {gapResult.recommendations.map((rec, i) => (
                                        <div key={i} className="bg-blue-900/10 border border-blue-500/10 p-3 rounded-lg">
                                            <p className="text-sm text-slate-300 leading-relaxed">{rec}</p>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 dashed-border">
                        <Scale size={48} className="opacity-50 mb-4" />
                        <p className="font-medium">Gap Analysis Required</p>
                        <p className="text-sm mt-2 max-w-xs text-center">Paste both a CV and a Job Description on the left to run this analysis.</p>
                    </div>
                )
            )}
         </div>
      </div>
    </div>
  );
};

export default CVAnalyzer;