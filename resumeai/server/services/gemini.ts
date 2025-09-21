import { GoogleGenAI } from "@google/genai";
import type { AnalysisResult } from "@shared/schema";

// Lazy initialization of the AI client
let ai: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!ai) {
    // Use the provided API key directly as a fallback
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "AIzaSyBkP9tMh0_5MyDRzU6nQjSPpLq7sNCxscw";
    
    console.log("DEBUG: Environment check in getAIClient:", {
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasGoogleKey: !!process.env.GOOGLE_AI_API_KEY,
      keyLength: apiKey.length,
      firstChars: apiKey.substring(0, 10)
    });
    
    if (!apiKey) {
      console.error("ERROR: No API key found in environment variables");
      console.log("Available env vars:", Object.keys(process.env).filter(key => key.includes('API') || key.includes('GEMINI')));
      throw new Error("API key is required for Gemini AI service");
    }
    
    console.log("Initializing Gemini AI with API key");
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export async function generateProfessionalSummary(resumeText: string): Promise<string> {
  const prompt = `Based on the following resume, write a concise 2-line professional summary that highlights the candidate's key strengths and experience:

Resume:
${resumeText}

Provide only the summary, no additional text.`;

  const client = getAIClient();
  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text || "Unable to generate summary";
}

export async function rateResume(resumeText: string): Promise<{ rating: number; explanation: string }> {
  const systemPrompt = `You are a professional resume expert. Rate the given resume on a scale of 1-10 and provide a brief explanation.
Consider factors like: clarity, relevant experience, quantifiable achievements, formatting, keyword optimization, and overall impact.
Respond with JSON in this format: {"rating": number, "explanation": "brief explanation"}`;

  try {
    const client = getAIClient();
  const response = await client.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            rating: { type: "number" },
            explanation: { type: "string" },
          },
          required: ["rating", "explanation"],
        },
      },
      contents: resumeText,
    });

    const result = JSON.parse(response.text || "{}");
    return {
      rating: Math.min(10, Math.max(1, result.rating || 5)),
      explanation: result.explanation || "Unable to provide rating explanation"
    };
  } catch (error) {
    console.error("Error rating resume:", error);
    return { rating: 5, explanation: "Unable to rate resume due to processing error" };
  }
}

export async function extractSkillsAndHighlights(resumeText: string): Promise<{ skills: string[]; highlights: string[] }> {
  const systemPrompt = `Extract key skills and career highlights from the resume.
Skills should be technical and professional competencies.
Highlights should be specific achievements with quantifiable results when possible.
Respond with JSON in this format: {"skills": ["skill1", "skill2"], "highlights": ["achievement1", "achievement2"]}`;

  try {
    const client = getAIClient();
  const response = await client.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            skills: {
              type: "array",
              items: { type: "string" }
            },
            highlights: {
              type: "array",
              items: { type: "string" }
            },
          },
          required: ["skills", "highlights"],
        },
      },
      contents: resumeText,
    });

    const result = JSON.parse(response.text || "{}");
    return {
      skills: result.skills || [],
      highlights: result.highlights || []
    };
  } catch (error) {
    console.error("Error extracting skills and highlights:", error);
    return { skills: [], highlights: [] };
  }
}

export async function generateJobMatchScore(resumeText: string, jobDescription: string): Promise<{ matchScore: number; missingKeywords: string[] }> {
  const systemPrompt = `Compare the resume against the job description and provide:
1. A match score from 0-100 based on skills, experience, and requirements alignment
2. A list of important keywords/skills from the job description that are missing from the resume
Respond with JSON in this format: {"matchScore": number, "missingKeywords": ["keyword1", "keyword2"]}`;

  try {
    const client = getAIClient();
  const response = await client.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            matchScore: { type: "number" },
            missingKeywords: {
              type: "array",
              items: { type: "string" }
            },
          },
          required: ["matchScore", "missingKeywords"],
        },
      },
      contents: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}`,
    });

    const result = JSON.parse(response.text || "{}");
    return {
      matchScore: Math.min(100, Math.max(0, result.matchScore || 0)),
      missingKeywords: result.missingKeywords || []
    };
  } catch (error) {
    console.error("Error generating job match score:", error);
    return { matchScore: 0, missingKeywords: [] };
  }
}

export async function generateImprovementSuggestions(resumeText: string, jobDescription?: string): Promise<string[]> {
  const prompt = `Analyze the resume${jobDescription ? ' and job description' : ''} and provide 3-5 specific, actionable improvement suggestions.
Focus on concrete steps the candidate can take to enhance their resume.

Resume:
${resumeText}

${jobDescription ? `Job Description:\n${jobDescription}\n` : ''}

Provide suggestions as a simple array of strings, one suggestion per line.`;

  try {
    const client = getAIClient();
  const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text || "";
    return text.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[-•*]\s*/, '').trim())
      .filter(suggestion => suggestion.length > 0)
      .slice(0, 5);
  } catch (error) {
    console.error("Error generating improvement suggestions:", error);
    return ["Unable to generate improvement suggestions"];
  }
}

export async function generateCoverLetter(resumeText: string, jobDescription: string): Promise<string> {
  const prompt = `Write a professional, tailored cover letter based on the resume and job description.
The cover letter should be personalized, highlight relevant experience, and demonstrate enthusiasm for the role.
Keep it concise but impactful (3-4 paragraphs).

Resume:
${resumeText}

Job Description:
${jobDescription}

Write a complete cover letter starting with "Dear Hiring Manager," and ending with "Sincerely,".`;

  const client = getAIClient();
  const response = await client.models.generateContent({
    model: "gemini-2.5-pro",
    contents: prompt,
  });

  return response.text || "Unable to generate cover letter";
}

export async function generateInterviewQuestions(resumeText: string, jobDescription?: string): Promise<string[]> {
  const prompt = `Based on the resume${jobDescription ? ' and job description' : ''}, generate 5-7 relevant interview questions that the candidate should prepare for.
Include a mix of technical, behavioral, and role-specific questions.

Resume:
${resumeText}

${jobDescription ? `Job Description:\n${jobDescription}\n` : ''}

Provide questions as a simple list, one per line.`;

  try {
    const client = getAIClient();
  const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text || "";
    return text.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[-•*\d.]\s*/, '').trim())
      .filter(question => question.length > 0 && question.includes('?'))
      .slice(0, 7);
  } catch (error) {
    console.error("Error generating interview questions:", error);
    return ["Unable to generate interview questions"];
  }
}

export async function generateLinkedInSummary(resumeText: string): Promise<string> {
  const prompt = `Create an engaging LinkedIn profile summary based on the resume.
The summary should be professional yet personable, highlight key achievements, and include relevant emojis.
Keep it concise but compelling (3-4 short paragraphs with line breaks).

Resume:
${resumeText}

Write a LinkedIn summary that starts with a strong opening line about the person's role/expertise.`;

  const client = getAIClient();
  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text || "Unable to generate LinkedIn summary";
}

export async function analyzeResumeComplete(resumeText: string, jobDescription?: string): Promise<AnalysisResult> {
  try {
    // Run all analyses in parallel for better performance
    const [
      summary,
      rating,
      skillsAndHighlights,
      suggestions,
      interviewQuestions,
      linkedinSummary,
      jobMatch,
      coverLetter
    ] = await Promise.all([
      generateProfessionalSummary(resumeText),
      rateResume(resumeText),
      extractSkillsAndHighlights(resumeText),
      generateImprovementSuggestions(resumeText, jobDescription),
      generateInterviewQuestions(resumeText, jobDescription),
      generateLinkedInSummary(resumeText),
      jobDescription ? generateJobMatchScore(resumeText, jobDescription) : Promise.resolve(null),
      jobDescription ? generateCoverLetter(resumeText, jobDescription) : Promise.resolve(null)
    ]);

    return {
      summary,
      rating: rating.rating,
      ratingExplanation: rating.explanation,
      skills: skillsAndHighlights.skills,
      highlights: skillsAndHighlights.highlights,
      matchScore: jobMatch?.matchScore,
      missingKeywords: jobMatch?.missingKeywords,
      suggestions,
      coverLetter: coverLetter || undefined,
      interviewQuestions,
      linkedinSummary
    };
  } catch (error) {
    console.error("Error in complete resume analysis:", error);
    throw new Error("Failed to analyze resume. Please check your input and try again.");
  }
}
