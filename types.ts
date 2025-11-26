export enum View {
  DASHBOARD = 'DASHBOARD',
  CV_ANALYSIS = 'CV_ANALYSIS',
  OPPORTUNITIES = 'OPPORTUNITIES',
  RECRUITERS = 'RECRUITERS',
  COMMUNICATION = 'COMMUNICATION',
  SETTINGS = 'SETTINGS'
}

export interface UserProfile {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  targetRole: string;
  industries: string;
  salaryMin: string;
  currency: string;
  bio: string;
  valueProposition: string;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_range: string;
  match_score: number; // 0-100
  cultural_fit_score?: number; // 0-100 (DACH/SEE alignment)
  growth_potential?: string; // High/Medium/Low
  urgency?: 'High' | 'Medium' | 'Low';
  status: 'New' | 'Analyzing' | 'Applied' | 'Interviewing' | 'Rejected';
  source: string;
  posted_date: string;
  description: string;
  ai_analysis?: {
    fit: string;
    gaps: string[];
    strategy: string;
  };
}

export interface Recruiter {
  id: string;
  name: string;
  role: string;
  company: string;
  focus_area: string[];
  connection_status: 'Not Connected' | 'Pending' | 'Connected' | 'Replied';
  last_contact?: string;
  email_pattern?: string;
  relationship_score?: number; // 0-100
  outreach_stage?: 'None' | 'Initial' | 'FollowUp_1' | 'FollowUp_2' | 'Meeting';
  ai_notes?: string;
  assigned_signature?: string;
}

export interface AgentLog {
  id: string;
  timestamp: Date;
  agent: 'CV Analyst' | 'Recruiter Discovery' | 'Opportunity Miner' | 'Comms Orchestrator' | 'Campaign Strategist';
  message: string;
  status: 'info' | 'success' | 'warning';
}

export interface CVAnalysisResult {
  summary: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  strategic_positioning: string;
  quantified_achievements?: string[];
}

export interface SkillGapAnalysisResult {
  match_score: number;
  missing_critical_skills: string[];
  recommendations: string[];
}

export interface StrategyBrief {
  focus_of_the_week: string;
  top_priorities: string[];
  channel_strategy: string;
  success_probability: string;
}

export interface ChartDataPoint {
  name: string;
  applications: number;
  responses: number;
  interviews: number;
}