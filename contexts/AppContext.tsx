import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, AppSettings } from '../types';
import { useLogStore } from '../store/useLogStore';

interface AppContextType {
  userProfile: UserProfile;
  updateUserProfile: (profile: UserProfile) => void;
  appSettings: AppSettings;
  updateAppSettings: (settings: AppSettings) => void;
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

// Utility to safely parse JSON from localStorage
const safeParse = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.warn(`Failed to parse ${key} from localStorage, using fallback.`, error);
    return fallback;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { addAgentLog } = useLogStore();

  // --- Profile State with Persistence ---
  const [userProfile, setUserProfile] = useState<UserProfile>(() => 
    safeParse('user_profile', DEFAULT_PROFILE)
  );

  const updateUserProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    try {
      localStorage.setItem('user_profile', JSON.stringify(newProfile));
    } catch (e) {
      console.warn("Failed to save profile to localStorage", e);
    }
    
    // Auto-log profile updates
    addAgentLog({
      agent: 'Campaign Strategist',
      message: 'Executive profile and targeting parameters updated',
      status: 'info'
    });
  };

  // --- Settings State with Persistence ---
  const [appSettings, setAppSettings] = useState<AppSettings>(() => 
    safeParse('app_settings', DEFAULT_SETTINGS)
  );

  const updateAppSettings = (newSettings: AppSettings) => {
    setAppSettings(newSettings);
    try {
      localStorage.setItem('app_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.warn("Failed to save settings to localStorage", e);
    }

    // Log if critical modes are toggled
    if (newSettings.ghostMode !== appSettings.ghostMode) {
       addAgentLog({
          agent: 'Campaign Strategist',
          message: `Stealth protocol (Ghost Mode) ${newSettings.ghostMode ? 'ACTIVATED' : 'DEACTIVATED'}`,
          status: newSettings.ghostMode ? 'warning' : 'info'
       });
    }
  };

  return (
    <AppContext.Provider value={{ 
      userProfile, 
      updateUserProfile,
      appSettings,
      updateAppSettings
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