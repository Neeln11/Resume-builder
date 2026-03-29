"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateSummaryAction(context: string, currentSummary?: string) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API key is not configured. Please add it to your .env.local file.");
    }

    const prompt = `Write a compelling professional resume summary for a resume.
Context about the user: ${context}
${currentSummary ? `The user also provided these notes/draft for their summary, please refine and enhance them: "${currentSummary}"` : ''}
Ensure the summary is 3-5 sentences, impactful, and written in the third person without pronouns (e.g., 'Experienced software engineer...' instead of 'I am an experienced...'). Do not include any title formatting or extra markdown, just the plain text summary.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini Error:", error);
        throw new Error("Failed to generate summary. Please try again.");
    }
}

export async function generateExperienceAction(role: string, company: string, currentDescription: string) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API key is not configured. Please add it to your .env.local file.");
    }

    const prompt = `Write professional resume bullet points for a ${role} at ${company}.
${currentDescription ? `Here are some rough notes to incorporate: ${currentDescription}` : 'Make up 3-4 realistic and impactful bullet points.'}
Format the output as a clean bulleted list using the '-' character. Make it action-oriented using strong verbs, and keep it in the third person. Do not include introductory text, just the bullet points.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini Error:", error);
        throw new Error("Failed to generate experience bullet points. Please try again.");
    }
}

export async function generateProjectAction(name: string, technologies: string, currentDescription: string) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API key is not configured. Please add it to your .env.local file.");
    }

    const prompt = `Write professional resume bullet points for a project named "${name}".
${technologies ? `Technologies used: ${technologies}` : ''}
${currentDescription ? `Here are some rough notes to incorporate: ${currentDescription}` : 'Make up 2-3 realistic and impactful bullet points.'}
Format the output as a clean bulleted list using the '-' character. Make it action-oriented using strong verbs, and keep it in the third person. Focus on what was built, how it was built, and the impact. Do not include introductory text, just the bullet points.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini Error:", error);
        throw new Error("Failed to generate project bullet points. Please try again.");
    }
}
