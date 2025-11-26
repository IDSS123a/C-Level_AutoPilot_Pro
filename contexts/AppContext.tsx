import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, AgentLog, View, AppSettings } from '../types';

interface AppContextType {
  userProfile: UserProfile;
  updateUserProfile: (profile: UserProfile) => void;
  appSettings: AppSettings;
  updateAppSettings: (settings: AppSettings) => void;
  agentLogs: AgentLog[];
  addAgentLog: (log: Omit<AgentLog, 'id' | 'timestamp'>) => void;
  currentView: View;
  setCurrentView: (view: View) => void;
}

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

const DEFAULT_SETTINGS: AppSettings = {
  autoApply: false,
  minMatchScore: 85,
  dailyOutreachLimit: 25,
  workingHoursStart: '08:00',
  workingHoursEnd: '19:00',
  humanApprovalRequired: true,
  ghostMode: true,
  salaryBenchmarking: true,
  regions: {
    dach: true,
    see: true,
    uk: false,
    us: false
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- View State ---
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

  // --- Profile State with Persistence ---
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const updateUserProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem('user_profile', JSON.stringify(newProfile));
    
    // Auto-log profile updates
    addAgentLog({
      agent: 'Campaign Strategist',
      message: 'Executive profile and targeting parameters updated',
      status: 'info'
    });
  };

  // --- Settings State with Persistence ---
  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('app_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const updateAppSettings = (newSettings: AppSettings) => {
    setAppSettings(newSettings);
    localStorage.setItem('app_settings', JSON.stringify(newSettings));

    // Log if critical modes are toggled
    if (newSettings.ghostMode !== appSettings.ghostMode) {
       addAgentLog({
          agent: 'Campaign Strategist',
          message: `Stealth protocol (Ghost Mode) ${newSettings.ghostMode ? 'ACTIVATED' : 'DEACTIVATED'}`,
          status: newSettings.ghostMode ? 'warning' : 'info'
       });
    }
  };

  // --- Agent Logs State ---
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);

  const addAgentLog = (logData: Omit<AgentLog, 'id' | 'timestamp'>) => {
    const newLog: AgentLog = {
      id: Date.now().toString() + Math.random().toString(),
      timestamp: new Date(),
      ...logData
    };
    setAgentLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50
  };

  // --- Autonomous Simulator (Moved from App.tsx) ---
  useEffect(() => {
    const activities = [
      { msg: "Mining Agent: Scanned 14 new listings in DACH region", type: 'Opportunity Miner' },
      { msg: "Comms Orchestrator: Sent 7-day follow-up to Michael Ross", type: 'Comms Orchestrator' },
      { msg: "CV Analyst: Optimized keyword density for 'Digital Transformation'", type: 'CV Analyst' },
      { msg: "Discovery Agent: Identified new Head of Search at Egon Zehnder", type: 'Recruiter Discovery' },
      { msg: "Strategist: Detected high demand for AI Ops roles in Zurich", type: 'Campaign Strategist' },
      { msg: "System: Syncing opportunities to Google Sheets Master DB", type: 'Opportunity Miner' },
      { msg: "Due Diligence: Generating report for 'FinTech Zurich'", type: 'Due Diligence' },
      { msg: "Comms Orchestrator: Generated 3 new connection requests", type: 'Comms Orchestrator' },
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.65) { // Slightly reduced frequency
        const activity = activities[Math.floor(Math.random() * activities.length)];
        addAgentLog({
          agent: activity.type as any,
          message: activity.msg,
          status: 'info'
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{ 
      userProfile, 
      updateUserProfile,
      appSettings,
      updateAppSettings, 
      agentLogs, 
      addAgentLog,
      currentView,
      setCurrentView
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};