import React from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CVAnalyzer from './components/CVAnalyzer';
import OpportunityScanner from './components/OpportunityScanner';
import RecruiterAgent from './components/RecruiterAgent';
import Settings from './components/Settings';
import DueDiligence from './components/DueDiligence';
import { View } from './types';
import { AppProvider, useApp } from './contexts/AppContext';

// Inner component to consume the context
const AppContent: React.FC = () => {
  const { currentView, setCurrentView, agentLogs } = useApp();

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard logs={agentLogs} />;
      case View.CV_ANALYSIS:
        return <CVAnalyzer />;
      case View.OPPORTUNITIES:
        return <OpportunityScanner />;
      case View.RECRUITERS:
        return <RecruiterAgent />;
      case View.COMMUNICATION:
        return <RecruiterAgent />;
      case View.DUE_DILIGENCE:
        return <DueDiligence />;
      case View.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard logs={agentLogs} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-brand-500/30">
      <Sidebar />
      
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

// Root Component wrapping everything in Provider
const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;