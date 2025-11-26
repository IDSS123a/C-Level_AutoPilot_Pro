import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * CV ANALYSIS AGENT
 * Uses Gemini 3 Pro for deep semantic understanding and gap analysis.
 */
export const analyzeCVContent = async (cvText: string) => {
  try {
    const model = "gemini-3-pro-preview";
    const response = await ai.models.generateContent({
      model,
      contents: `You are an expert C-Level Executive Career Coach. Perform a deep semantic analysis of the following CV.
      
      Your mission:
      1. Quantify achievements where numbers are missing but implied.
      2. Identify strategic gaps against typical Fortune 500 C-suite requirements.
      3. Craft a "Strategic Positioning" statement for DACH/SEE regions.
      
      CV TEXT:
      ${cvText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            strategic_positioning: { type: Type.STRING },
            quantified_achievements: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("CV Analysis Error:", error);
    throw error;
  }
};

/**
 * SKILL GAP ANALYSIS AGENT
 * Compares CV against specific JD.
 */
export const analyzeSkillGap = async (cvText: string, jobDescription: string) => {
  try {
    const model = "gemini-2.5-flash";
    const response = await ai.models.generateContent({
      model,
      contents: `You are an expert Technical Recruiter. Compare the following Candidate CV against the specific Job Description.
      
      CANDIDATE CV:
      ${cvText}
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      Identify:
      1. Match Score (0-100) based on critical requirements.
      2. Missing Critical Skills (Hard or Soft skills explicitly required but not found or weak in CV).
      3. Tailoring Recommendations (Specific bullet points to add or emphasize).
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            match_score: { type: Type.INTEGER },
            missing_critical_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Skill Gap Analysis Error:", error);
    throw error;
  }
};

/**
 * OPPORTUNITY MINING AGENT
 * Evaluates Role Match, Cultural Fit, and Growth Potential.
 */
export const analyzeOpportunity = async (jobDescription: string, cvContext: string) => {
  try {
    const model = "gemini-2.5-flash";
    const response = await ai.models.generateContent({
      model,
      contents: `Act as a Strategic Headhunter. Evaluate this opportunity for a C-level candidate.
      
      CANDIDATE: ${cvContext.substring(0, 500)}...
      JOB: ${jobDescription}
      
      Analyze:
      1. Role Match Score (0-100)
      2. Cultural Fit Score (0-100) - prioritizing DACH (Germany, Austria, Switzerland) or SEE (South East Europe) alignment.
      3. Growth Potential (High/Medium/Low)
      4. Urgency (High/Medium/Low) based on language.
      
      Provide strategy to secure interview.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fit: { type: Type.STRING },
            gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            strategy: { type: Type.STRING },
            match_score: { type: Type.INTEGER },
            cultural_fit_score: { type: Type.INTEGER },
            growth_potential: { type: Type.STRING },
            urgency: { type: Type.STRING }
          }
        }
      }
    });
    const json = JSON.parse(response.text || "{}");
    return {
      fit: json.fit || "Analysis unavailable",
      gaps: json.gaps || [],
      strategy: json.strategy || "Manual review recommended",
      match_score: json.match_score || 0,
      cultural_fit_score: json.cultural_fit_score || 0,
      growth_potential: json.growth_potential || "Unknown",
      urgency: json.urgency || "Low"
    };
  } catch (error) {
    console.error("Opportunity Analysis Error:", error);
    return {
      fit: "Analysis pending manual review.",
      gaps: [],
      strategy: "Review manually.",
      match_score: 0,
      cultural_fit_score: 0,
      growth_potential: "Unknown",
      urgency: "Low"
    };
  }
};

/**
 * COMMUNICATION ORCHESTRATOR
 * Generates full sequence: Initial Outreach -> Follow-up 1 (7 days) -> Follow-up 2 (14 days).
 */
export const generateOutreachSequence = async (recruiterName: string, role: string, company: string, cvHighlights: string) => {
  try {
    const model = "gemini-2.5-flash";
    const response = await ai.models.generateContent({
      model,
      contents: `Create a 3-stage executive outreach sequence for a high-value target.
      
      Target: ${recruiterName}, ${role} at ${company}.
      My Profile: ${cvHighlights}
      
      Requirements:
      1. LinkedIn Connection Note (max 300 chars).
      2. Initial Email (Concise, value-driven).
      3. Follow-up Email (7 days later, gentle nudge).
      4. Follow-up Email (14 days later, "closing the loop").
      
      Tone: Peer-to-peer, confident, respectful of time.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            linkedin_message: { type: Type.STRING },
            initial_email_subject: { type: Type.STRING },
            initial_email_body: { type: Type.STRING },
            follow_up_7d_body: { type: Type.STRING },
            follow_up_14d_body: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Outreach Generation Error:", error);
    throw error;
  }
};

/**
 * CAMPAIGN STRATEGIST
 * Uses Gemini 3 Pro to plan the week based on pipeline health.
 */
export const generateCampaignStrategy = async (metrics: any) => {
  try {
    const model = "gemini-3-pro-preview";
    const response = await ai.models.generateContent({
      model,
      contents: `You are the Campaign Strategist for an autonomous job search. 
      Based on these metrics: ${JSON.stringify(metrics)}, generate a weekly plan.
      
      Output JSON with:
      - focus_of_the_week (One impactful sentence)
      - top_priorities (Array of 3 specific actions)
      - channel_strategy (Where to focus effort: LinkedIn vs Headhunters vs Direct)
      - success_probability (Estimated % based on velocity)`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            focus_of_the_week: { type: Type.STRING },
            top_priorities: { type: Type.ARRAY, items: { type: Type.STRING } },
            channel_strategy: { type: Type.STRING },
            success_probability: { type: Type.STRING }
          }
        }
      }
    });
    
    const json = JSON.parse(response.text || "{}");
    return {
      focus_of_the_week: json.focus_of_the_week || "Analyzing campaign data...",
      top_priorities: json.top_priorities || [],
      channel_strategy: json.channel_strategy || "Pending...",
      success_probability: json.success_probability || "Calculating..."
    };
  } catch (error) {
    return {
      focus_of_the_week: "Maintain current velocity and expand recruiter network.",
      top_priorities: ["Scan new DACH listings", "Follow up with pending connections", "Refine value proposition"],
      channel_strategy: "Balanced approach",
      success_probability: "Calculating..."
    };
  }
};

/**
 * EMAIL SIGNATURE GENERATOR
 */
export const generateEmailSignature = async (userProfile: any) => {
  try {
    const model = "gemini-2.5-flash";
    const response = await ai.models.generateContent({
      model,
      contents: `Design 3 distinct professional email signatures (HTML format) for:
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

      Return JSON with an array of signatures. Ensure HTML uses inline styles for email compatibility.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            signatures: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  style_name: { type: Type.STRING },
                  html_content: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    const json = JSON.parse(response.text || "{}");
    return { signatures: json.signatures || [] };
  } catch (error) {
    console.error("Signature Generation Error:", error);
    return { signatures: [] };
  }
};

/**
 * DUE DILIGENCE AGENT
 * Generates deep company analysis using Google Search Grounding for real-time data.
 */
export const generateCompanyDossier = async (companyName: string, industry: string) => {
  try {
    // IMPORTANT: responseSchema and responseMimeType are NOT supported when using googleSearch tool.
    // We must parse the JSON manually from the text response.
    const model = "gemini-3-pro-preview";
    const response = await ai.models.generateContent({
      model,
      contents: `Perform a deep C-Level Due Diligence on the company: "${companyName}" (Industry: ${industry}).
      
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
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType: "application/json", // REMOVED: Incompatible with googleSearch
        // responseSchema: ... // REMOVED: Incompatible with googleSearch
      }
    });

    let jsonStr = response.text || "{}";
    
    // Clean up Markdown formatting if present
    jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const json = JSON.parse(jsonStr);

    // Extract grounding chunks (sources) from metadata
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({
        title: web.title,
        uri: web.uri
      }));

    return { 
      companyName: json.companyName || companyName,
      marketCap: json.marketCap || "Unknown",
      headquarters: json.headquarters || "Unknown",
      executiveSummary: json.executiveSummary || "No data available.",
      keyChallenges: json.keyChallenges || [],
      strategicOpportunities: json.strategicOpportunities || [],
      cultureAnalysis: json.cultureAnalysis || "No culture data found.",
      interviewQuestions: {
        expected_from_ceo: json.interviewQuestions?.expected_from_ceo || [],
        to_ask_ceo: json.interviewQuestions?.to_ask_ceo || []
      },
      sources 
    };

  } catch (error) {
    console.error("Due Diligence Error:", error);
    throw error;
  }
};

/**
 * MORNING BRIEFING GENERATOR
 */
export const generateMorningBriefing = async (profileName: string, activeOpportunities: number) => {
  try {
    const model = "gemini-2.5-flash";
    const response = await ai.models.generateContent({
      model,
      contents: `Generate a short, punchy 3-sentence "Morning Briefing" for a C-Level executive named ${profileName}. 
      Context: 
      - They have ${activeOpportunities} active job opportunities.
      - It is 8:00 AM.
      - Tone: Professional, motivating, concise.
      - Mention a random market update relevant to Tech/Finance in Europe.`,
      config: {
        responseMimeType: "text/plain",
      }
    });
    return response.text;
  } catch (error) {
    return `Good morning, ${profileName}. You have ${activeOpportunities} active opportunities requiring attention. Market indicators in DACH suggest a surge in leadership hiring. Let's execute the strategy.`;
  }
};