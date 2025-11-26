import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CVAnalyzer from './components/CVAnalyzer';
import OpportunityScanner from './components/OpportunityScanner';
import RecruiterAgent from './components/RecruiterAgent';
import Settings from './components/Settings';
import { View, AgentLog, UserProfile } from './types';

const DEFAULT_PROFILE: UserProfile = {
  name: 'John Doe',
  title: 'Chief Technology Officer',
  company: 'FinTech Global',
  email: 'john.doe@executive.com',
  phone: '+41 79 123 4567',
  location: 'Zurich, Switzerland',
  linkedin: 'linkedin.com/in/johndoe-cto',
  website: 'johndoe.tech',
  targetRole: 'CTO / VP Engineering / CIO',
  industries: 'FinTech, InsurTech, SaaS',
  salaryMin: '220,000',
  currency: 'CHF',
  bio: 'Visionary technology leader with 15+ years of experience in FinTech and Digital Transformation. Proven track record of scaling engineering teams from 10 to 200+.',
  valueProposition: 'I bridge the gap between complex technical strategy and business ROI, specializing in cost-reduction via AI implementation and legacy modernization.'
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  
  // Global User Profile State with Persistence
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const handleProfileUpdate = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem('user_profile', JSON.stringify(newProfile));
  };

  // Simulator for Autonomous Agents Background Work
  useEffect(() => {
    const activities = [
      { msg: "Mining Agent: Scanned 14 new listings in DACH region", type: 'Opportunity Miner' },
      { msg: "Comms Orchestrator: Sent 7-day follow-up to Michael Ross", type: 'Comms Orchestrator' },
      { msg: "CV Analyst: Optimized keyword density for 'Digital Transformation'", type: 'CV Analyst' },
      { msg: "Discovery Agent: Identified new Head of Search at Egon Zehnder", type: 'Recruiter Discovery' },
      { msg: "Strategist: Detected high demand for AI Ops roles in Zurich", type: 'Campaign Strategist' },
      { msg: "System: Syncing opportunities to Google Sheets Master DB", type: 'Opportunity Miner' },
      { msg: "Comms Orchestrator: Generated 3 new connection requests", type: 'Comms Orchestrator' },
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.6) { // Randomly add logs
        const activity = activities[Math.floor(Math.random() * activities.length)];
        const newLog: AgentLog = {
          id: Date.now().toString(),
          timestamp: new Date(),
          agent: activity.type as any,
          message: activity.msg,
          status: 'info'
        };
        setAgentLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard logs={agentLogs} />;
      case View.CV_ANALYSIS:
        return <CVAnalyzer />;
      case View.OPPORTUNITIES:
        return <OpportunityScanner />;
      case View.RECRUITERS:
        // Pass userProfile for signature generation
        return <RecruiterAgent userProfile={userProfile} />;
      case View.COMMUNICATION:
        return <RecruiterAgent userProfile={userProfile} />;
      case View.SETTINGS:
        // Pass profile and updater
        return <Settings currentProfile={userProfile} onSave={handleProfileUpdate} />;
      default:
        return <Dashboard logs={agentLogs} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-brand-500/30">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} userProfile={userProfile} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
           <span className="font-bold text-brand-500">AutoPilot Pro</span>
           <button className="text-slate-400">Menu</button>
        </div>

        <div className="flex-1 overflow-auto relative">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
           {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;