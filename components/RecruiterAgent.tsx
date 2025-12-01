import React, { useState, useEffect, useRef } from 'react';
import { User, Linkedin, Mail, MessageSquare, Loader2, Copy, Check, Clock, Send, PenTool, X, Sparkles, FileSignature } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Recruiter } from '../types';
import { generateOutreachSequence, generateEmailSignature } from '../services/geminiService';

const MOCK_RECRUITERS: Recruiter[] = [
  {
    id: 'r1',
    name: 'Sarah Jenkins',
    role: 'Senior Partner',
    company: 'Amrop Adria',
    focus_area: ['Banking', 'C-Suite'],
    connection_status: 'Not Connected',
    email_pattern: 's.jenkins@amrop.adria.com',
    relationship_score: 10,
    outreach_stage: 'None'
  },
  {
    id: 'r2',
    name: 'Dr. Michael Ross',
    role: 'Managing Partner',
    company: 'Stanton Chase DACH',
    focus_area: ['Technology', 'Engineering'],
    connection_status: 'Connected',
    last_contact: '2 days ago',
    relationship_score: 65,
    outreach_stage: 'FollowUp_1'
  },
  {
    id: 'r3',
    name: 'Elena Weber',
    role: 'Head of Executive Search',
    company: 'FutureFin Global',
    focus_area: ['FinTech', 'Remote'],
    connection_status: 'Connected',
    relationship_score: 40,
    outreach_stage: 'Initial'
  }
];

const RecruiterAgent: React.FC = () => {
  const { userProfile } = useApp();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Persist Recruiters with Safe Parse
  const [recruiters, setRecruiters] = useState<Recruiter[]>(() => {
    try {
      const saved = localStorage.getItem('recruiters_data');
      return saved ? JSON.parse(saved) : MOCK_RECRUITERS;
    } catch (e) {
      console.warn("Failed to load recruiters from storage, using mock.", e);
      return MOCK_RECRUITERS;
    }
  });

  // Persist Global Signature with Safe Parse
  const [globalSignature, setGlobalSignature] = useState<string | null>(() => {
    try {
      return localStorage.getItem('global_signature');
    } catch (e) {
      return null;
    }
  });

  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSequence, setGeneratedSequence] = useState<{
    linkedin?: string, 
    initial_email?: {subject: string, body: string},
    follow_up_7d?: string,
    follow_up_14d?: string
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'initial' | 'followup1' | 'followup2'>('initial');

  // Signature State
  const [showSigModal, setShowSigModal] = useState(false);
  const [targetRecruiterId, setTargetRecruiterId] = useState<string | null>(null);
  
  // Initialize signature profile from Global User Profile
  const [sigProfile, setSigProfile] = useState({
    name: userProfile.name,
    role: userProfile.title,
    company: userProfile.company,
    phone: userProfile.phone,
    email: userProfile.email,
    website: userProfile.website,
    disclaimer: "Confidentiality Notice: This e-mail message, including any attachments, is for the sole use of the intended recipient(s)."
  });

  // Save changes to localStorage safely
  useEffect(() => {
    try {
      localStorage.setItem('recruiters_data', JSON.stringify(recruiters));
    } catch (e) {
      console.warn("Failed to save recruiters to storage", e);
    }
  }, [recruiters]);

  useEffect(() => {
    if (globalSignature) {
      try {
        localStorage.setItem('global_signature', globalSignature);
      } catch (e) {
        console.warn("Failed to save signature", e);
      }
    }
  }, [globalSignature]);
  
  // Update local signature state when global profile changes
  useEffect(() => {
    setSigProfile(prev => ({
        ...prev,
        name: userProfile.name,
        role: userProfile.title,
        company: userProfile.company,
        phone: userProfile.phone,
        email: userProfile.email,
        website: userProfile.website
    }));
  }, [userProfile]);

  const [generatedSignatures, setGeneratedSignatures] = useState<any[]>([]);
  const [modalSelectedSignature, setModalSelectedSignature] = useState<string | null>(null);
  const [isGeneratingSig, setIsGeneratingSig] = useState(false);

  const handleGenerateSequence = async (recruiter: Recruiter) => {
    if (!recruiter) return;
    setSelectedRecruiter(recruiter);
    setGeneratedSequence(null);
    setIsGenerating(true);
    try {
      const content = await generateOutreachSequence(
        recruiter.name, 
        recruiter.role, 
        recruiter.company, 
        `${userProfile.title}, specialized in ${userProfile.industries}, looking for ${userProfile.targetRole}.`
      );
      if (isMounted.current) {
        setGeneratedSequence({
            linkedin: content.linkedin_message,
            initial_email: {
                subject: content.initial_email_subject,
                body: content.initial_email_body
            },
            follow_up_7d: content.follow_up_7d_body,
            follow_up_14d: content.follow_up_14d_body
        });
        setActiveTab('initial');
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (isMounted.current) {
        setIsGenerating(false);
      }
    }
  };

  const handleGenerateSignatures = async () => {
    setIsGeneratingSig(true);
    try {
      const result = await generateEmailSignature(sigProfile);
      if (isMounted.current && result.signatures) {
        setGeneratedSignatures(result.signatures);
        setModalSelectedSignature(result.signatures[0]?.html_content);
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (isMounted.current) {
        setIsGeneratingSig(false);
      }
    }
  };

  const openSignatureModal = (recruiterId?: string) => {
    if (recruiterId) {
      setTargetRecruiterId(recruiterId);
    } else {
      setTargetRecruiterId(null);
    }
    setShowSigModal(true);
  };

  const handleSaveSignature = () => {
    if (!modalSelectedSignature) return;

    if (targetRecruiterId) {
      // Assign to specific recruiter
      setRecruiters(prev => prev.map(r => 
        r.id === targetRecruiterId 
          ? { ...r, assigned_signature: modalSelectedSignature } 
          : r
      ));
      
      // If the currently selected recruiter in the main view is the target, update state safely
      if (selectedRecruiter && selectedRecruiter.id === targetRecruiterId) {
        setSelectedRecruiter(prev => prev ? { ...prev, assigned_signature: modalSelectedSignature } : null);
      }
    } else {
      // Set as global default
      setGlobalSignature(modalSelectedSignature);
    }
    setShowSigModal(false);
  };

  const getActiveSignature = () => {
    return selectedRecruiter?.assigned_signature || globalSignature;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col space-y-4">
      
      {/* Agent Header */}
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
             <MessageSquare className="text-brand-400" size={20}/>
             Communication Hub
          </h2>
          <p className="text-xs text-slate-400">Manage outreach campaigns and assets</p>
        </div>
        <button 
          onClick={() => openSignatureModal()}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-700"
        >
          <PenTool size={14} /> Configure Global Signature
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Recruiter Discovery List */}
        <div className="lg:col-span-1 flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <h2 className="font-bold text-white">Recruiter Discovery</h2>
            <div className="flex items-center text-xs text-emerald-400 mt-1">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Mining LinkedIn & specialized directories
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {recruiters.map(recruiter => (
              <div 
                key={recruiter.id}
                onClick={() => setSelectedRecruiter(recruiter)}
                className={`p-4 rounded-lg cursor-pointer transition-all border ${
                  selectedRecruiter?.id === recruiter.id 
                    ? 'bg-brand-900/20 border-brand-500/50' 
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 font-bold border border-slate-700">
                      {recruiter.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white flex items-center gap-2 group">
                        {recruiter.name}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openSignatureModal(recruiter.id);
                          }}
                          className={`p-1 rounded transition-colors ${recruiter.assigned_signature ? 'text-brand-400 bg-brand-400/10' : 'text-slate-600 hover:text-brand-400 hover:bg-slate-800'}`}
                          title={recruiter.assigned_signature ? "Edit Assigned Signature" : "Assign Signature"}
                        >
                          <FileSignature size={12} />
                        </button>
                      </h3>
                      <p className="text-xs text-slate-400">{recruiter.company}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          recruiter.relationship_score! > 50 ? 'bg-emerald-900/30 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                          {recruiter.relationship_score}% Rel.
                      </span>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex gap-1 flex-wrap">
                      {recruiter.focus_area.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded border border-slate-700">{tag}</span>
                      ))}
                  </div>
                  <span className="text-[10px] text-slate-500 flex items-center">
                      Stage: <span className="text-white ml-1">{recruiter.outreach_stage}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Communication Orchestrator */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-full">
          {selectedRecruiter ? (
            <>
              <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedRecruiter.name}</h2>
                  <div className="flex items-center gap-4 text-slate-400 text-sm">
                    <span className="flex items-center"><User size={14} className="mr-1"/> {selectedRecruiter.role}</span>
                    <span className="flex items-center"><Linkedin size={14} className="mr-1"/> {selectedRecruiter.company}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleGenerateSequence(selectedRecruiter)}
                  disabled={isGenerating}
                  className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-lg shadow-brand-500/20"
                >
                  {isGenerating ? <Loader2 className="animate-spin mr-2" size={16} /> : <MessageSquare className="mr-2" size={16} />}
                  Generate Full Sequence
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                    <Loader2 size={48} className="animate-spin text-brand-500" />
                    <div className="text-center">
                        <p className="font-medium text-slate-300">Orchestrating Outreach Campaign...</p>
                        <p className="text-xs mt-1 text-slate-500">Analyzing profile • Matching value prop • Drafting 3-stage sequence</p>
                    </div>
                  </div>
                ) : generatedSequence ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* Sequence Tabs */}
                    <div className="flex space-x-2 mb-6 bg-slate-950 p-1 rounded-lg border border-slate-800 w-fit">
                      <button 
                          onClick={() => setActiveTab('initial')}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                              activeTab === 'initial' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                          }`}
                      >
                          1. Initial Outreach
                      </button>
                      <button 
                          onClick={() => setActiveTab('followup1')}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center ${
                              activeTab === 'followup1' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                          }`}
                      >
                          2. Follow-up <Clock size={10} className="ml-1 opacity-50"/> +7d
                      </button>
                      <button 
                          onClick={() => setActiveTab('followup2')}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center ${
                              activeTab === 'followup2' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                          }`}
                      >
                          3. Closing Loop <Clock size={10} className="ml-1 opacity-50"/> +14d
                      </button>
                    </div>

                    {/* Content Area */}
                    {activeTab === 'initial' && (
                      <div className="space-y-6">
                          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                              <div className="flex justify-between mb-2 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                                  <span>LinkedIn Note</span>
                                  <span>{generatedSequence.linkedin?.length || 0}/300</span>
                              </div>
                              <div className="text-slate-300 text-sm leading-relaxed font-mono bg-slate-900/50 p-3 rounded border border-slate-800/50">
                                  {generatedSequence.linkedin}
                              </div>
                          </div>
                          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                              <div className="flex justify-between mb-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                                  <span>Email</span>
                                  <span>Subject: {generatedSequence.initial_email?.subject}</span>
                              </div>
                              <div className="text-slate-300 text-sm leading-relaxed font-mono bg-slate-900/50 p-3 rounded border border-slate-800/50 whitespace-pre-wrap">
                                  {generatedSequence.initial_email?.body}
                              </div>
                              {/* Signature Preview */}
                              {getActiveSignature() && (
                                <div className="mt-4 pt-4 border-t border-slate-800 opacity-90 animate-in fade-in duration-500">
                                   <div className="text-[10px] text-slate-500 mb-1 uppercase font-semibold flex items-center gap-2">
                                      {selectedRecruiter?.assigned_signature ? (
                                          <><FileSignature size={10} className="text-brand-400"/> Dedicated Signature Applied</>
                                      ) : (
                                          <>Global Signature Applied</>
                                      )}
                                   </div>
                                   <div className="bg-white p-3 rounded text-black" dangerouslySetInnerHTML={{__html: getActiveSignature()!}} />
                                </div>
                              )}
                          </div>
                      </div>
                    )}

                    {activeTab === 'followup1' && (
                      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                          <div className="flex justify-between mb-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                              <span>Day 7 Follow-Up</span>
                          </div>
                          <div className="text-slate-300 text-sm leading-relaxed font-mono bg-slate-900/50 p-3 rounded border border-slate-800/50 whitespace-pre-wrap">
                              {generatedSequence.follow_up_7d}
                          </div>
                      </div>
                    )}

                    {activeTab === 'followup2' && (
                      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                          <div className="flex justify-between mb-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                              <span>Day 14 Follow-Up</span>
                          </div>
                          <div className="text-slate-300 text-sm leading-relaxed font-mono bg-slate-900/50 p-3 rounded border border-slate-800/50 whitespace-pre-wrap">
                              {generatedSequence.follow_up_14d}
                          </div>
                      </div>
                    )}
                    
                    <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-4">
                        <button className="text-sm text-slate-400 hover:text-white px-4 py-2">Edit Templates</button>
                        <button className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center shadow-lg shadow-brand-500/20">
                            <Send size={16} className="mr-2" /> Approve & Queue Sequence
                        </button>
                    </div>

                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                      <MessageSquare size={64} strokeWidth={1} />
                      <p className="mt-4 font-medium">Select a recruiter to orchestrate outreach</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600">
              <User size={64} strokeWidth={1} className="mb-4 opacity-50" />
              <p>Select a target to begin communication strategy</p>
            </div>
          )}
        </div>
      </div>

      {/* Signature Modal */}
      {showSigModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col shadow-2xl">
             <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <PenTool size={18} className="text-brand-400"/>
                  {targetRecruiterId ? `Assign Signature for ${recruiters.find(r => r.id === targetRecruiterId)?.name}` : "Global Signature Designer"}
                </h3>
                <button onClick={() => setShowSigModal(false)} className="text-slate-500 hover:text-white">
                  <X size={20} />
                </button>
             </div>
             
             <div className="flex-1 flex overflow-hidden">
                {/* Form Side */}
                <div className="w-1/3 border-r border-slate-800 p-6 overflow-y-auto bg-slate-950/50">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-4">Contact Information</h4>
                  <div className="space-y-3">
                     <div>
                        <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                        <input 
                          className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:border-brand-500 outline-none"
                          value={sigProfile.name}
                          onChange={(e) => setSigProfile({...sigProfile, name: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="block text-xs text-slate-400 mb-1">Job Title</label>
                        <input 
                          className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:border-brand-500 outline-none"
                          value={sigProfile.role}
                          onChange={(e) => setSigProfile({...sigProfile, role: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="block text-xs text-slate-400 mb-1">Company</label>
                        <input 
                          className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:border-brand-500 outline-none"
                          value={sigProfile.company}
                          onChange={(e) => setSigProfile({...sigProfile, company: e.target.value})}
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Phone</label>
                            <input 
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:border-brand-500 outline-none"
                            value={sigProfile.phone}
                            onChange={(e) => setSigProfile({...sigProfile, phone: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Email</label>
                            <input 
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:border-brand-500 outline-none"
                            value={sigProfile.email}
                            onChange={(e) => setSigProfile({...sigProfile, email: e.target.value})}
                            />
                        </div>
                     </div>
                     <div>
                        <label className="block text-xs text-slate-400 mb-1">Website</label>
                        <input 
                          className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:border-brand-500 outline-none"
                          value={sigProfile.website}
                          onChange={(e) => setSigProfile({...sigProfile, website: e.target.value})}
                          placeholder="www.example.com"
                        />
                     </div>
                     <div>
                        <label className="block text-xs text-slate-400 mb-1">Legal Disclaimer</label>
                        <textarea 
                          className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-300 focus:border-brand-500 outline-none h-20 resize-none leading-relaxed"
                          value={sigProfile.disclaimer}
                          onChange={(e) => setSigProfile({...sigProfile, disclaimer: e.target.value})}
                        />
                     </div>
                  </div>
                  <button 
                    onClick={handleGenerateSignatures}
                    disabled={isGeneratingSig}
                    className="w-full mt-6 bg-brand-600 hover:bg-brand-500 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center transition-colors shadow-lg"
                  >
                    {isGeneratingSig ? <Loader2 className="animate-spin mr-2" size={16}/> : <Sparkles className="mr-2" size={16}/>}
                    Generate Designs
                  </button>
                </div>

                {/* Preview Side */}
                <div className="w-2/3 p-8 bg-slate-900 overflow-y-auto">
                   {generatedSignatures.length > 0 ? (
                     <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h4 className="text-xs font-semibold text-slate-500 uppercase">Select a Design</h4>
                            <span className="text-xs text-slate-500">{generatedSignatures.length} Variations</span>
                        </div>
                        <div className="grid gap-6">
                          {generatedSignatures.map((sig, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => setModalSelectedSignature(sig.html_content)}
                              className={`border rounded-xl p-6 cursor-pointer transition-all group ${
                                modalSelectedSignature === sig.html_content 
                                ? 'border-brand-500 bg-brand-500/5 ring-1 ring-brand-500' 
                                : 'border-slate-700 bg-white hover:border-slate-500'
                              }`}
                            >
                               <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                                  <span className={`text-xs font-bold uppercase tracking-wider ${modalSelectedSignature === sig.html_content ? 'text-brand-600' : 'text-slate-400'}`}>
                                    {sig.style_name}
                                  </span>
                                  {modalSelectedSignature === sig.html_content && <div className="bg-brand-500 text-white rounded-full p-1"><Check size={12}/></div>}
                               </div>
                               {/* Render HTML Safely */}
                               <div className="bg-white text-black signature-preview" dangerouslySetInnerHTML={{__html: sig.html_content}} />
                            </div>
                          ))}
                        </div>
                     </div>
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center relative">
                           <PenTool size={32} className="opacity-50"/>
                           <Sparkles size={16} className="absolute top-4 right-4 text-brand-500 animate-pulse"/>
                        </div>
                        <div className="text-center max-w-xs">
                            <p className="font-medium text-slate-300">Create Your Brand</p>
                            <p className="text-sm mt-1">Enter your professional details on the left and let AI generate high-conversion email signatures.</p>
                        </div>
                     </div>
                   )}
                </div>
             </div>

             {/* Modal Footer */}
             <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center">
                <div className="text-xs text-slate-500">
                   {modalSelectedSignature 
                    ? (targetRecruiterId ? "Ready to assign to recruiter." : "Ready to set as default.") 
                    : "No signature selected."}
                </div>
                <div className="flex gap-3">
                   <button 
                      onClick={() => setShowSigModal(false)}
                      className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors"
                   >
                      Cancel
                   </button>
                   <button 
                      onClick={handleSaveSignature}
                      disabled={!modalSelectedSignature}
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium shadow-lg shadow-emerald-500/20 transition-all"
                   >
                      {targetRecruiterId ? "Assign to Recruiter" : "Save Global Default"}
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterAgent;