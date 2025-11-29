import { CVAnalysisResult, SkillGapAnalysisResult, CompanyDossier, StrategyBrief } from '../types';

export const CV_ANALYSIS_MOCK: CVAnalysisResult = {
  score: 85,
  summary: "A highly strategic profile with strong evidence of digital transformation leadership. The candidate effectively bridges technical execution with board-level strategy. Key strengths lie in cost optimization and AI integration.",
  strengths: [
    "Proven track record of scaling engineering teams (10 to 200+).",
    "Quantifiable success in cost reduction (40% via serverless).",
    "Deep expertise in FinTech compliance and cloud architecture."
  ],
  weaknesses: [
    "Could emphasize more on P&L responsibility magnitude.",
    "Lack of explicit mention of M&A integration experience."
  ],
  strategic_positioning: "Transformational Technology Leader capable of scaling Series B/C startups to enterprise stability.",
  quantified_achievements: [
    "Reduced infrastructure costs by 40%.",
    "Increased developer productivity by 25%.",
    "Managed $10M annual budget."
  ],
  sub_scores: {
    leadership: 88,
    leadership_rationale: "Demonstrated ability to lead large, distributed teams (150+) across multiple continents.",
    impact: 82,
    impact_rationale: "Strong ROI focus with 40% cost reduction, though revenue generation impact could be highlighted more.",
    communication: 85,
    communication_rationale: "Clear, metric-driven communication style suitable for C-Suite reporting."
  }
};

export const SKILL_GAP_MOCK: SkillGapAnalysisResult = {
  match_score: 72,
  missing_critical_skills: [
    "Experience with Blockchain/Web3 technologies",
    "German language proficiency (C1 required)"
  ],
  recommendations: [
    "Highlight any adjacent experience with distributed ledger technology.",
    "Explicitly state language proficiency levels in the header.",
    "Emphasize experience with DACH regulatory frameworks."
  ]
};

export const OPPORTUNITY_ANALYSIS_MOCK = {
  fit: "Strong technical fit, but cultural fit needs verification regarding DACH region norms.",
  gaps: ["German language fluency", "Blockchain specific stack experience"],
  strategy: "Leverage experience in high-frequency trading systems as a bridge to crypto-banking requirements.",
  match_score: 78,
  cultural_fit_score: 65,
  growth_potential: "High",
  urgency: "High"
};

export const OUTREACH_SEQUENCE_MOCK = {
  linkedin_message: "Hi Michael, noticed your focus on FinTech leadership in Zurich. I'm a CTO specializing in AI-driven cost reduction (40% savings at last role). Open to connecting?",
  initial_email_subject: "CTO Candidate: Driving 40% Infrastructure Savings",
  initial_email_body: "Dear Michael,\n\nI noticed Stanton Chase is active in the FinTech space in Zurich. I am currently exploring new opportunities...",
  follow_up_7d_body: "Hi Michael, just floating this to the top of your inbox...",
  follow_up_14d_body: "Hi Michael, assuming you're busy, but wanted to check one last time..."
};

export const CAMPAIGN_STRATEGY_MOCK: StrategyBrief = {
  focus_of_the_week: "Aggressive expansion into the Zurich FinTech ecosystem.",
  top_priorities: [
    "Apply to the VP Engineering role at FinTech Zurich",
    "Connect with 5 Partners at Stanton Chase",
    "Tailor CV for Blockchain-adjacent roles"
  ],
  channel_strategy: "60% Headhunters, 40% Direct Applications",
  success_probability: "Medium-High (68%)"
};

export const EMAIL_SIGNATURE_MOCK = {
  signatures: [
    {
      style_name: "Minimalist",
      html_content: "<div style='font-family: sans-serif; color: #333;'><p><strong>John Doe</strong><br>Chief Technology Officer</p><p><a href='#' style='color: #666;'>linkedin.com/in/johndoe</a></p></div>"
    },
    {
      style_name: "Corporate",
      html_content: "<div style='font-family: serif; color: #003366; border-left: 4px solid #003366; padding-left: 12px;'><p><strong>John Doe</strong> | CTO<br>FinTech Global</p></div>"
    }
  ]
};

export const COMPANY_DOSSIER_MOCK: CompanyDossier = {
  companyName: "Acme Corp (Simulated)",
  marketCap: "$4.2B",
  headquarters: "Zurich, Switzerland",
  executiveSummary: "Acme Corp is a leading provider of enterprise SaaS solutions in the DACH region. Recently acquired TechStart to boost AI capabilities.",
  keyChallenges: [
    "Integrating legacy systems from recent acquisitions.",
    "Stiff competition from US-based hyperscalers."
  ],
  strategicOpportunities: [
    "Expansion into Eastern European markets.",
    "Monetization of new AI features."
  ],
  cultureAnalysis: "Engineering-driven culture with a conservative approach to risk. High value placed on academic credentials.",
  interviewQuestions: {
    expected_from_ceo: ["How do you handle technical debt in a high-growth phase?", "Describe your experience with post-merger integration."],
    to_ask_ceo: ["What is the board's appetite for R&D investment this year?", "How do you envision the product portfolio evolving in 3 years?"]
  },
  sources: [
    { title: "Acme Corp Q3 Financials", uri: "https://example.com/financials" },
    { title: "TechCrunch: Acme acquires TechStart", uri: "https://example.com/news" }
  ]
};

export const MORNING_BRIEFING_MOCK = "Good morning, John. You have 12 active opportunities requiring attention. Market indicators in DACH suggest a surge in leadership hiring. Let's execute the strategy.";
