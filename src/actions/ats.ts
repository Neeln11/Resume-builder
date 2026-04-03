"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeResumeATS(resumeDataJson: string, targetRole: string = "") {
    if (!process.env.GEMINI_API_KEY) {
        return { error: "Gemini API key is not configured. Please add it to your .env.local file." };
    }

    const prompt = `You are an expert ATS (Applicant Tracking System) software and professional resume recruiter.
Analyze the following resume data in JSON format.
${targetRole ? `The candidate is specifically targeting this role/job description: "${targetRole}". Score and tailor your suggestions for this role.` : "Score and tailor your suggestions based on general professional best practices."}

You MUST return your response as a valid JSON object matching the exact structure below, and NOTHING ELSE. Do not use markdown backticks around the JSON.
{
  "overallScore": number (0-100),
  "generalFeedback": "A short 2-3 sentence overview of the resume's strengths and core weaknesses.",
  "suggestions": [
    {
      "section": "summary" | "experience" | "projects" | "skills" | "education",
      "index": number (the array index this suggestion applies to. Use 0 for summary or personalDetails),
      "issue": "String explaining what the mistake or weakness is.",
      "improvedText": "String containing the EXACT optimized replacement text that the user can immediately use to replace their old text.",
      "fieldToUpdate": "The specific field name within that section. e.g. 'description', 'summary', 'role', 'technologies', 'name'"
    }
  ]
}

Provide 3 to 6 high-quality suggestions that have the largest impact on the ATS score. Ensure improvedText is fully written and highly professional.

RESUME DATA:
${resumeDataJson}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const text = response.text || "";
        
        let jsonResult;
        try {
            jsonResult = JSON.parse(text);
        } catch (parseError) {
            console.error("Failed to parse Gemini JSON:", text);
            return { error: "Failed to parse AI response. Please try again." };
        }

        return { data: jsonResult };
    } catch (error) {
        console.error("Gemini ATS Error:", error);
        return { error: "Failed to run ATS scoring. Please try again." };
    }
}
