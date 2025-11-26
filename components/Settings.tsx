import React, { useState, useEffect } from 'react';
import { 
  Save, User, Shield, Zap, Bell, Globe, 
  Linkedin, Mail, Calendar, ToggleLeft, ToggleRight, 
  Check, Sliders, AlertTriangle, Upload, FileText, Briefcase, DollarSign, MapPin, Link as LinkIcon
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsProps {
  currentProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentProfile, onSave }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'agents' | 'integrations'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>(currentProfile);

  // Sync internal state if props change (e.g. initial load)
  useEffect(() => {
    setProfile(currentProfile);
  }, [currentProfile]);

  const [rules, setRules] = useState({
    autoApply: false,
    minMatchScore: 85,
    dailyOutreachLimit: 25,
    workingHoursStart: '08:00',
    workingHoursEnd: '19:00',
    humanApprovalRequired: true,
    regions: {
      dach: true,
      see: true,
      uk: false,
      us: false
    }
  });

  const handleSaveClick = () => {
    setIsSaving(true);
    onSave(profile);
    // Simulate API delay
    setTimeout(() => {
      setIsSaving(false);
    }, 800);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-xl sticky top-0 z-10 backdrop-blur-md bg-slate-900/80">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sliders className="text-brand-400" size={24} />
            System Configuration
          </h2>
          <p className="text-slate-400 text-sm mt-1">Manage autonomous rules, executive branding, and integrations</p>
        </div>
        <button 
          onClick={handleSaveClick}
          disabled={isSaving}
          className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center shadow-lg shadow-brand-500/20 transition-all"
        >
          {isSaving ? <span className="animate-spin mr-2">⏳</span> : <Save size={18} className="mr-2" />}
          {isSaving ? 'Saving Changes...' : 'Save Configuration'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'profile' ? 'bg-slate-800 text-white border border-slate-700 shadow-sm' : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <User size={18} />
            <span className="font-medium text-sm">Executive Profile</span>
          </button>
          <button 
            onClick={() => setActiveTab('agents')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'agents' ? 'bg-slate-800 text-white border border-slate-700 shadow-sm' : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <Zap size={18} />
            <span className="font-medium text-sm">Autonomous Rules</span>
          </button>
          <button 
            onClick={() => setActiveTab('integrations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'integrations' ? 'bg-slate-800 text-white border border-slate-700 shadow-sm' : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <Globe size={18} />
            <span className="font-medium text-sm">Integrations</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-8 min-h-[600px]">
          
          {/* PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              {/* Section 1: Core Identity */}
              <div>
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Core Identity</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs text-slate-400 font-medium mb-1.5">Full Name</label>
                      <input 
                        type="text" 
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-brand-500 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 font-medium mb-1.5">Current Title</label>
                      <input 
                        type="text" 
                        value={profile.title}
                        onChange={(e) => setProfile({...profile, title: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-brand-500 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 font-medium mb-1.5">Current Company</label>
                      <input 
                        type="text" 
                        value={profile.company}
                        onChange={(e) => setProfile({...profile, company: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-brand-500 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 font-medium mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 text-slate-600" size={16} />
                        <input 
                          type="email" 
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-3 text-sm text-white focus:border-brand-500 outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 font-medium mb-1.5">Phone</label>
                      <input 
                        type="text" 
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-brand-500 outline-none transition-colors"
                      />
                    </div>
                 </div>
              </div>

              {/* Section 2: Online Presence */}
              <div>
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Digital Presence</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-xs text-slate-400 font-medium mb-1.5">LinkedIn URL</label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-3 text-[#0077b5]" size={16} />
                        <input 
                          type="text" 
                          value={profile.linkedin}
                          onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-3 text-sm text-white focus:border-brand-500 outline-none transition-colors"
                        />
                      </div>
                   </div>
                   <div>
                      <label className="block text-xs text-slate-400 font-medium mb-1.5">Portfolio / Website</label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-3 text-slate-600" size={16} />
                        <input 
                          type="text" 
                          value={profile.website}
                          onChange={(e) => setProfile({...profile, website: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-3 text-sm text-white focus:border-brand-500 outline-none transition-colors"
                        />
                      </div>
                   </div>
                 </div>
              </div>

              {/* Section 3: Target Parameters */}
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Opportunity Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-xs text-slate-400 font-medium mb-1.5">Target Job Titles</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-3 text-slate-600" size={16} />
                        <input 
                          type="text" 
                          value={profile.targetRole}
                          onChange={(e) => setProfile({...profile, targetRole: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-3 text-sm text-white focus:border-brand-500 outline-none transition-colors"
                        />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 font-medium mb-1.5">Base Location / Hubs</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-slate-600" size={16} />
                        <input 
                          type="text" 
                          value={profile.location}
                          onChange={(e) => setProfile({...profile, location: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-3 text-sm text-white focus:border-brand-500 outline-none transition-colors"
                        />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-xs text-slate-400 font-medium mb-1.5">Target Industries</label>
                      <input 
                        type="text" 
                        value={profile.industries}
                        onChange={(e) => setProfile({...profile, industries: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-brand-500 outline-none transition-colors"
                        placeholder="e.g. FinTech, SaaS, Manufacturing"
                      />
                   </div>
                   <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs text-slate-400 font-medium mb-1.5">Min. Base Salary</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3 text-emerald-500" size={16} />
                            <input 
                              type="text" 
                              value={profile.salaryMin}
                              onChange={(e) => setProfile({...profile, salaryMin: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-3 text-sm text-white focus:border-brand-500 outline-none transition-colors"
                            />
                        </div>
                      </div>
                      <div className="w-24">
                        <label className="block text-xs text-slate-400 font-medium mb-1.5">Currency</label>
                        <select 
                           value={profile.currency}
                           onChange={(e) => setProfile({...profile, currency: e.target.value})}
                           className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-brand-500 outline-none"
                        >
                           <option value="EUR">EUR</option>
                           <option value="CHF">CHF</option>
                           <option value="USD">USD</option>
                           <option value="GBP">GBP</option>
                        </select>
                      </div>
                   </div>
                </div>
              </div>

              {/* Section 4: Narrative & Docs */}
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Strategic Narrative</h3>
                <div className="space-y-4">
                   <div>
                    <label className="block text-xs text-slate-400 font-medium mb-1.5">Executive Value Proposition (USP)</label>
                    <textarea 
                      rows={2}
                      value={profile.valueProposition}
                      onChange={(e) => setProfile({...profile, valueProposition: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-brand-500 outline-none resize-none transition-colors"
                      placeholder="One sentence that defines your unique value..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 font-medium mb-1.5">Professional Bio (Context for AI)</label>
                    <textarea 
                      rows={4}
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-brand-500 outline-none resize-none transition-colors"
                    />
                  </div>
                  
                  {/* CV Upload Placeholder */}
                  <div className="pt-2">
                     <label className="block text-xs text-slate-400 font-medium mb-2">Master Resume / CV Source</label>
                     <div className="border-2 border-dashed border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:border-brand-500 hover:text-brand-400 hover:bg-slate-900/50 transition-all cursor-pointer">
                        <FileText size={32} className="mb-2" />
                        <p className="text-sm font-medium">Click to upload Master CV (PDF)</p>
                        <p className="text-xs opacity-70 mt-1">AI uses this document as the source of truth for all applications</p>
                     </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* AGENT RULES */}
          {activeTab === 'agents' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              {/* Thresholds */}
              <div>
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2 mb-4">Decision Thresholds</h3>
                <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-slate-300 font-medium">Minimum Match Score for Action</label>
                      <span className="text-sm font-bold text-brand-400">{rules.minMatchScore}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="100" 
                      value={rules.minMatchScore}
                      onChange={(e) => setRules({...rules, minMatchScore: parseInt(e.target.value)})}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                    />
                    <p className="text-xs text-slate-500 mt-2">Agents will ignore opportunities below this score.</p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-slate-300 font-medium">Daily Outreach Limit</label>
                      <span className="text-sm font-bold text-emerald-400">{rules.dailyOutreachLimit} msgs</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="100" 
                      value={rules.dailyOutreachLimit}
                      onChange={(e) => setRules({...rules, dailyOutreachLimit: parseInt(e.target.value)})}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <p className="text-xs text-slate-500 mt-2">Safety limit to prevent platform flagging.</p>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div>
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2 mb-4">Automation Controls</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">Auto-Apply</p>
                      <p className="text-xs text-slate-500">Submit applications autonomously</p>
                    </div>
                    <button 
                      onClick={() => setRules({...rules, autoApply: !rules.autoApply})}
                      className={`text-2xl transition-colors ${rules.autoApply ? 'text-brand-400' : 'text-slate-600'}`}
                    >
                      {rules.autoApply ? <ToggleRight size={32}/> : <ToggleLeft size={32}/>}
                    </button>
                  </div>
                  
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">Human Approval</p>
                      <p className="text-xs text-slate-500">Require review before sending</p>
                    </div>
                    <button 
                      onClick={() => setRules({...rules, humanApprovalRequired: !rules.humanApprovalRequired})}
                      className={`text-2xl transition-colors ${rules.humanApprovalRequired ? 'text-brand-400' : 'text-slate-600'}`}
                    >
                      {rules.humanApprovalRequired ? <ToggleRight size={32}/> : <ToggleLeft size={32}/>}
                    </button>
                  </div>
                </div>
              </div>

              {/* Target Regions */}
              <div>
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2 mb-4">Discovery Regions</h3>
                <div className="flex gap-3">
                  {Object.entries(rules.regions).map(([region, enabled]) => (
                    <button
                      key={region}
                      onClick={() => setRules({...rules, regions: {...rules.regions, [region]: !enabled}})}
                      className={`px-4 py-2 rounded-lg text-sm font-bold uppercase transition-all border ${
                        enabled 
                          ? 'bg-brand-500/10 text-brand-400 border-brand-500/50' 
                          : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Connected Accounts</h3>

              <div className="space-y-4">
                {/* LinkedIn */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#0077b5] rounded-lg flex items-center justify-center text-white">
                      <Linkedin size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">LinkedIn Sales Navigator</p>
                      <p className="text-xs text-emerald-400 flex items-center gap-1"><Check size={10} /> Active • Syncing every 4h</p>
                    </div>
                  </div>
                  <button className="text-xs text-slate-400 border border-slate-700 px-3 py-1.5 rounded hover:text-white">Configure</button>
                </div>

                {/* Google Workspace */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-red-500">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Google Workspace</p>
                      <p className="text-xs text-emerald-400 flex items-center gap-1"><Check size={10} /> Mail & Calendar Sync Active</p>
                    </div>
                  </div>
                  <button className="text-xs text-slate-400 border border-slate-700 px-3 py-1.5 rounded hover:text-white">Configure</button>
                </div>

                {/* Sheets */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">
                      <Globe size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Master DB (Google Sheets)</p>
                      <p className="text-xs text-emerald-400 flex items-center gap-1"><Check size={10} /> Bidirectional Sync Active</p>
                    </div>
                  </div>
                  <button className="text-xs text-slate-400 border border-slate-700 px-3 py-1.5 rounded hover:text-white">View Sheet</button>
                </div>
              </div>

              <div className="bg-amber-900/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3 mt-8">
                <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-bold text-amber-500">API Usage Warning</p>
                  <p className="text-xs text-amber-400/80 mt-1">
                    Your Gemini API quota is at 65% for the month. Consider upgrading or adjusting polling frequency in "Autonomous Rules".
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;