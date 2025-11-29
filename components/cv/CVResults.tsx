import React from 'react';
import { BrainCircuit, Scale, CheckCircle, AlertTriangle, Trophy, Target, Plus, BarChart2 } from 'lucide-react';
import { CVAnalysisResult, SkillGapAnalysisResult } from '../../types';

interface CVResultsProps {
  activeTab: 'general' | 'gap';
  setActiveTab: (tab: 'general' | 'gap') => void;
  result: CVAnalysisResult | null;
  gapResult: SkillGapAnalysisResult | null;
}

const CVResults: React.FC<CVResultsProps> = ({ activeTab, setActiveTab, result, gapResult }) => {
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-brand-500';
    return 'bg-amber-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Focus';
  };

  return (
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
                      <div className="flex-1">
                          <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Executive Readiness Score</h3>
                          <div className="text-5xl font-bold text-white mt-2">{result.score}<span className="text-lg text-slate-500 font-normal">/100</span></div>
                      </div>
                      <div className="text-right flex-1">
                          <h4 className="text-xs uppercase tracking-wider text-brand-400 font-semibold mb-1">Strategic Positioning</h4>
                          <p className="text-slate-300 text-sm italic leading-tight">"{result.strategic_positioning}"</p>
                      </div>
                    </div>

                    {/* Competency Sub-Scores */}
                    {result.sub_scores && (
                      <div className="mb-6 bg-slate-950/50 p-5 rounded-xl border border-slate-800/50 shadow-inner">
                        <h4 className="flex items-center text-slate-400 font-medium mb-4 text-xs uppercase tracking-wide">
                          <BarChart2 size={14} className="mr-2" /> Competency Breakdown
                        </h4>
                        <div className="space-y-4">
                          {/* Leadership */}
                          <div>
                            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                              <span>Leadership Capability</span>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 text-[10px] uppercase">{getScoreLabel(result.sub_scores.leadership)}</span>
                                <span className="font-bold text-white">{result.sub_scores.leadership}%</span>
                              </div>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${getScoreColor(result.sub_scores.leadership)}`} 
                                style={{ width: `${result.sub_scores.leadership}%` }}
                              ></div>
                            </div>
                            {result.sub_scores.leadership_rationale && (
                              <p className="text-[10px] text-slate-500 mt-1 leading-tight italic">{result.sub_scores.leadership_rationale}</p>
                            )}
                          </div>
                          
                          {/* Impact */}
                          <div>
                            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                              <span>Strategic Impact</span>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 text-[10px] uppercase">{getScoreLabel(result.sub_scores.impact)}</span>
                                <span className="font-bold text-white">{result.sub_scores.impact}%</span>
                              </div>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${getScoreColor(result.sub_scores.impact)}`} 
                                style={{ width: `${result.sub_scores.impact}%` }}
                              ></div>
                            </div>
                            {result.sub_scores.impact_rationale && (
                              <p className="text-[10px] text-slate-500 mt-1 leading-tight italic">{result.sub_scores.impact_rationale}</p>
                            )}
                          </div>
                          
                          {/* Communication */}
                          <div>
                            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                              <span>Communication Style</span>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 text-[10px] uppercase">{getScoreLabel(result.sub_scores.communication)}</span>
                                <span className="font-bold text-white">{result.sub_scores.communication}%</span>
                              </div>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${getScoreColor(result.sub_scores.communication)}`} 
                                style={{ width: `${result.sub_scores.communication}%` }}
                              ></div>
                            </div>
                            {result.sub_scores.communication_rationale && (
                              <p className="text-[10px] text-slate-500 mt-1 leading-tight italic">{result.sub_scores.communication_rationale}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

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
  );
};

export default CVResults;