import React from 'react';
import { LayoutDashboard, FileText, Briefcase, Users, MessageSquare, Settings, LogOut } from 'lucide-react';
import { View, UserProfile } from '../types';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  userProfile: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, userProfile }) => {
  const navItems = [
    { id: View.DASHBOARD, icon: LayoutDashboard, label: 'Command Center' },
    { id: View.CV_ANALYSIS, icon: FileText, label: 'CV Architect' },
    { id: View.OPPORTUNITIES, icon: Briefcase, label: 'Opportunity Mining' },
    { id: View.RECRUITERS, icon: Users, label: 'Recruiter Agent' },
    { id: View.COMMUNICATION, icon: MessageSquare, label: 'Comms Hub' },
  ];

  return (
    <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen sticky top-0 hidden md:flex">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-brand-500">
            <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/20">
                AP
            </div>
            <span className="font-bold text-white tracking-tight">AutoPilot Pro</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              currentView === item.id 
                ? 'bg-brand-600/10 text-brand-400 border border-brand-600/20' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <item.icon size={20} className={currentView === item.id ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'} />
            <span className="font-medium text-sm">{item.label}</span>
            {currentView === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400 shadow-[0_0_8px_#818CF8]"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => onNavigate(View.SETTINGS)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
             currentView === View.SETTINGS 
                ? 'bg-slate-900 text-brand-400' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
          }`}
        >
          <Settings size={20} />
          <span className="font-medium text-sm">Settings</span>
        </button>
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold">
            {userProfile.name.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{userProfile.name}</p>
            <p className="text-xs text-slate-500 truncate">{userProfile.title}</p>
          </div>
          <LogOut size={16} className="text-slate-500 hover:text-white cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;