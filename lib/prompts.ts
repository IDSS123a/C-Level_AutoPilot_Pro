export const PROMPTS = {
  CV_ANALYSIS: (cvText: string) => `You are an expert C-Level Executive Career Coach. Perform a deep semantic analysis of the following CV.
      
      Your mission:
      1. Quantify achievements where numbers are missing but implied.
      2. Identify strategic gaps against typical Fortune 500 C-suite requirements.
      3. Craft a "Strategic Positioning" statement for DACH/SEE regions.
      4. Evaluate and score (0-100) the candidate on:
         - Leadership Capability
         - Strategic Impact
         - Communication Style
         IMPORTANT: For each score, provide a brief 1-sentence "rationale" explaining why this score was given.
      
      CV TEXT:
      ${cvText}`,

  SKILL_GAP: (cvText: string, jobDescription: string) => `You are an expert Technical Recruiter. Compare the following Candidate CV against the specific Job Description.
      
      CANDIDATE CV:
      ${cvText}
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      Identify:
      1. Match Score (0-100) based on critical requirements.
      2. Missing Critical Skills (Hard or Soft skills explicitly required but not found or weak in CV).
      3. Tailoring Recommendations (Specific bullet points to add or emphasize).`,

  OPPORTUNITY_ANALYSIS: (jobDescription: string, cvContext: string) => `Act as a Strategic Headhunter. Evaluate this opportunity for a C-level candidate.
      
      CANDIDATE: ${cvContext.substring(0, 500)}...
      JOB: ${jobDescription}
      
      Analyze:
      1. Role Match Score (0-100)
      2. Cultural Fit Score (0-100) - prioritizing DACH (Germany, Austria, Switzerland) or SEE (South East Europe) alignment.
      3. Growth Potential (High/Medium/Low)
      4. Urgency (High/Medium/Low) based on language.
      
      Provide strategy to secure interview.`,

  OUTREACH_SEQUENCE: (recruiterName: string, role: string, company: string, cvHighlights: string) => `Create a 3-stage executive outreach sequence for a high-value target.
      
      Target: ${recruiterName}, ${role} at ${company}.
      My Profile: ${cvHighlights}
      
      Requirements:
      1. LinkedIn Connection Note (max 300 chars).
      2. Initial Email (Concise, value-driven).
      3. Follow-up Email (7 days later, gentle nudge).
      4. Follow-up Email (14 days later, "closing the loop").
      
      Tone: Peer-to-peer, confident, respectful of time.`,

  CAMPAIGN_STRATEGY: (metrics: any) => `You are the Campaign Strategist for an autonomous job search. 
      Based on these metrics: ${JSON.stringify(metrics)}, generate a weekly plan.
      
      Output JSON with:
      - focus_of_the_week (One impactful sentence)
      - top_priorities (Array of 3 specific actions)
      - channel_strategy (Where to focus effort: LinkedIn vs Headhunters vs Direct)
      - success_probability (Estimated % based on velocity)`,

  EMAIL_SIGNATURE: (userProfile: any) => `Design 3 distinct professional email signatures (HTML format) for:
      Name: ${userProfile.name}
      Title: ${userProfile.role}
      Company: ${userProfile.company}
      Phone: ${userProfile.phone}
      Email: ${userProfile.email}
      Website: ${userProfile.website}
      Disclaimer: ${userProfile.disclaimer}

      Styles:
      1. Minimalist (Clean, text-focused, use system fonts)
      2. Corporate (Professional, with blue accents, organized table layout)
      3. Executive Brand (Bold name, subtle background or border)

      Return JSON with an array of signatures. Ensure HTML uses inline styles for email compatibility.`,

  COMPANY_DOSSIER: (companyName: string, industry: string) => `Perform a deep C-Level Due Diligence on the company: "${companyName}" (Industry: ${industry}).
      
      You MUST use the Google Search tool to find the most recent real-world data (financials, news, active status).
      If the company is closed, inactive, or bankrupt, explicitly state that in the executive summary.
      
      Return a VALID JSON object (and nothing else) matching this structure:
      {
        "companyName": "string",
        "marketCap": "string",
        "headquarters": "string",
        "executiveSummary": "string",
        "keyChallenges": ["string", "string"],
        "strategicOpportunities": ["string", "string"],
        "cultureAnalysis": "string",
        "interviewQuestions": {
          "expected_from_ceo": ["string"],
          "to_ask_ceo": ["string"]
        }
      }`,

  MORNING_BRIEFING: (profileName: string, activeOpportunities: number) => `Generate a short, punchy 3-sentence "Morning Briefing" for a C-Level executive named ${profileName}. 
      Context: 
      - They have ${activeOpportunities} active job opportunities.
      - It is 8:00 AM.
      - Tone: Professional, motivating, concise.
      - Mention a random market update relevant to Tech/Finance in Europe.`
};
