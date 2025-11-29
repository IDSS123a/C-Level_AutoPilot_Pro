import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { AppProvider } from './contexts/AppContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingScreen from './components/common/LoadingScreen';
import { useLogStore } from './store/useLogStore';

// Lazy Load View Components for Route-Based Code Splitting
const Dashboard = lazy(() => import('./components/Dashboard'));
const CVAnalyzer = lazy(() => import('./components/CVAnalyzer'));
const OpportunityScanner = lazy(() => import('./components/OpportunityScanner'));
const RecruiterAgent = lazy(() => import('./components/RecruiterAgent'));
const Settings = lazy(() => import('./components/Settings'));
const DueDiligence = lazy(() => import('./components/DueDiligence'));

const AutonomousAgentSimulator: React.FC = () => {
  const { addAgentLog } = useLogStore();

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
      if (Math.random() > 0.65) { 
        const activity = activities[Math.floor(Math.random() * activities.length)];
        addAgentLog({
          agent: activity.type as any,
          message: activity.msg,
          status: 'info'
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [addAgentLog]);

  return null;
};

const AppContent: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-brand-500/30">
      <Sidebar />
      <AutonomousAgentSimulator />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
           <span className="font-bold text-brand-500">AutoPilot Pro</span>
           <button className="text-slate-400">Menu</button>
        </div>

        <div className="flex-1 overflow-auto relative">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
           
           {/* Global Error Boundary for resilience */}
           <ErrorBoundary>
             {/* Suspense for Lazy Loading */}
             <Suspense fallback={<LoadingScreen />}>
               <Routes>
                 <Route path="/" element={<Dashboard />} />
                 <Route path="/cv-analysis" element={<CVAnalyzer />} />
                 <Route path="/opportunities" element={<OpportunityScanner />} />
                 <Route path="/recruiters" element={<RecruiterAgent />} />
                 <Route path="/communication" element={<RecruiterAgent />} />
                 <Route path="/due-diligence" element={<DueDiligence />} />
                 <Route path="/settings" element={<Settings />} />
                 <Route path="*" element={<Navigate to="/" replace />} />
               </Routes>
             </Suspense>
           </ErrorBoundary>
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