import { GoogleGenAI, Type } from "@google/genai";
import { PROMPTS } from '../lib/prompts';
import * as MOCK from '../lib/mockData';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Robust JSON extraction helper.
 * Handles:
 * 1. Markdown code blocks (```json ... ```)
 * 2. Conversational filler text ("Here is your JSON: ...")
 * 3. Raw JSON
 */
const cleanAndParseJSON = (text: string | undefined): any => {
  if (!text) return {};
  
  try {
    // Attempt 1: Clean parse
    return JSON.parse(text);
  } catch (e) {
    // Attempt 2: Remove Markdown wrappers
    let clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
      return JSON.parse(clean);
    } catch (e2) {
      // Attempt 3: Extract the first JSON object {} or array []
      const firstOpenBrace = clean.indexOf('{');
      const lastCloseBrace = clean.lastIndexOf('}');
      
      if (firstOpenBrace !== -1 && lastCloseBrace !== -1) {
        try {
          return JSON.parse(clean.substring(firstOpenBrace, lastCloseBrace + 1));
        } catch (e3) {
           // Continue to array check
        }
      }

      const firstOpenBracket = clean.indexOf('[');
      const lastCloseBracket = clean.lastIndexOf(']');
      if (firstOpenBracket !== -1 && lastCloseBracket !== -1) {
        try {
          return JSON.parse(clean.substring(firstOpenBracket, lastCloseBracket + 1));
        } catch (e4) {
          // Failure
        }
      }
      
      console.warn("Failed to extract JSON from response:", text.substring(0, 100) + "...");
      throw new Error("JSON Parsing Failed");
    }
  }
};

/**
 * CV ANALYSIS AGENT
 * Uses Gemini 3 Pro for deep semantic understanding and gap analysis.
 */
export const analyzeCVContent = async (cvText: string) => {
  try {
    const model = "gemini-3-pro-preview";
    const response = await ai.models.generateContent({
      model,
      contents: PROMPTS.CV_ANALYSIS(cvText),
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
            quantified_achievements: { type: Type.ARRAY, items: { type: Type.STRING } },
            sub_scores: {
              type: Type.OBJECT,
              properties: {
                leadership: { type: Type.INTEGER },
                leadership_rationale: { type: Type.STRING },
                impact: { type: Type.INTEGER },
                impact_rationale: { type: Type.STRING },
                communication: { type: Type.INTEGER },
                communication_rationale: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    const json = cleanAndParseJSON(response.text);
    return {
      score: json.score || 0,
      summary: json.summary || "No summary available.",
      strengths: json.strengths || [],
      weaknesses: json.weaknesses || [],
      strategic_positioning: json.strategic_positioning || "Positioning analysis pending.",
      quantified_achievements: json.quantified_achievements || [],
      sub_scores: json.sub_scores || { 
        leadership: 0, leadership_rationale: "Analysis pending",
        impact: 0, impact_rationale: "Analysis pending",
        communication: 0, communication_rationale: "Analysis pending"
      }
    };
  } catch (error) {
    console.warn("CV Analysis API failed, falling back to mock data.", error);
    return MOCK.CV_ANALYSIS_MOCK;
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
      contents: PROMPTS.SKILL_GAP(cvText, jobDescription),
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
    const json = cleanAndParseJSON(response.text);
    return {
      match_score: json.match_score || 0,
      missing_critical_skills: json.missing_critical_skills || [],
      recommendations: json.recommendations || []
    };
  } catch (error) {
    console.warn("Skill Gap API failed, falling back to mock data.", error);
    return MOCK.SKILL_GAP_MOCK;
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
      contents: PROMPTS.OPPORTUNITY_ANALYSIS(jobDescription, cvContext),
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
    const json = cleanAndParseJSON(response.text);
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
    console.warn("Opportunity Analysis API failed, falling back to mock data.", error);
    return MOCK.OPPORTUNITY_ANALYSIS_MOCK;
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
      contents: PROMPTS.OUTREACH_SEQUENCE(recruiterName, role, company, cvHighlights),
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
    return cleanAndParseJSON(response.text);
  } catch (error) {
    console.warn("Outreach Generation API failed, falling back to mock data.", error);
    return MOCK.OUTREACH_SEQUENCE_MOCK;
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
      contents: PROMPTS.CAMPAIGN_STRATEGY(metrics),
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
    
    const json = cleanAndParseJSON(response.text);
    return {
      focus_of_the_week: json.focus_of_the_week || "Analyzing campaign data...",
      top_priorities: json.top_priorities || [],
      channel_strategy: json.channel_strategy || "Pending...",
      success_probability: json.success_probability || "Calculating..."
    };
  } catch (error) {
    console.warn("Strategy API failed, falling back to mock data.", error);
    return MOCK.CAMPAIGN_STRATEGY_MOCK;
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
      contents: PROMPTS.EMAIL_SIGNATURE(userProfile),
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
    const json = cleanAndParseJSON(response.text);
    return { signatures: json.signatures || [] };
  } catch (error) {
    console.warn("Signature Generation API failed, falling back to mock data.", error);
    return MOCK.EMAIL_SIGNATURE_MOCK;
  }
};

/**
 * DUE DILIGENCE AGENT
 * Generates deep company analysis using Google Search Grounding for real-time data.
 * Supports Cancellation via AbortSignal.
 */
export const generateCompanyDossier = async (companyName: string, industry: string, signal?: AbortSignal) => {
  try {
    const model = "gemini-3-pro-preview";
    
    // Check abort before starting request
    if (signal?.aborted) throw new Error("Request aborted");

    const response = await ai.models.generateContent({
      model,
      contents: PROMPTS.COMPANY_DOSSIER(companyName, industry),
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    // Check abort after request finishes but before processing
    if (signal?.aborted) throw new Error("Request aborted");

    const json = cleanAndParseJSON(response.text);

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

  } catch (error: any) {
    if (error.message === "Request aborted") {
      console.log("Due Diligence generation cancelled.");
      return null; // Silent return on abort
    }
    console.warn("Due Diligence API failed, falling back to mock data.", error);
    return MOCK.COMPANY_DOSSIER_MOCK;
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
      contents: PROMPTS.MORNING_BRIEFING(profileName, activeOpportunities),
      config: {
        responseMimeType: "text/plain",
      }
    });
    return response.text;
  } catch (error) {
    console.warn("Morning Briefing API failed, falling back to mock data.", error);
    return MOCK.MORNING_BRIEFING_MOCK;
  }
};