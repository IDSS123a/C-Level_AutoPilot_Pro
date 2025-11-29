import React, { useState } from 'react';
import { FileText, BrainCircuit, Scale, Loader2 } from 'lucide-react';
import { analyzeCVContent, analyzeSkillGap } from '../services/geminiService';
import { CVAnalysisResult, SkillGapAnalysisResult } from '../types';
import CVResults from './cv/CVResults';

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
      <CVResults 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        result={result} 
        gapResult={gapResult} 
      />
    </div>
  );
};

export default CVAnalyzer;