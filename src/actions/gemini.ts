"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateSummaryAction(context: string, currentSummary?: string) {
    if (!process.env.GEMINI_API_KEY) {
        return { error: "Gemini API key is not configured. Please add it to your .env.local file." };
    }

    const prompt = `Write a compelling professional resume summary for a resume.
Context about the user: ${context}
${currentSummary ? `The user also provided these notes/draft for their summary, please refine and enhance them: "${currentSummary}"` : ''}
Ensure the summary is 3-5 sentences, impactful, and written from a strong first-person perspective using pronouns like 'I' and 'my' (e.g., 'I am an experienced software engineer...' or 'I am currently pursuing...'). Do not include any title formatting or extra markdown, just the plain text summary.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return { content: response.text };
    } catch (error) {
        console.error("Gemini Error:", error);
        return { error: "Failed to generate summary. Please try again." };
    }
}

export async function generateExperienceAction(role: string, company: string, currentDescription: string) {
    if (!process.env.GEMINI_API_KEY) {
        return { error: "Gemini API key is not configured. Please add it to your .env.local file." };
    }

    const prompt = `Write professional resume bullet points for a ${role} at ${company}.
${currentDescription ? `Here are some rough notes to incorporate: ${currentDescription}` : 'Make up 3-4 realistic and impactful bullet points.'}
Format the output as a clean bulleted list using the '-' character. Make it action-oriented using strong verbs. Use a first-person perspective (you can start with verbs like 'Developed', 'Managed', and use 'I' or 'my' if natural). Do not include introductory text, just the bullet points.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return { content: response.text };
    } catch (error) {
        console.error("Gemini Error:", error);
        return { error: "Failed to generate experience bullet points. Please try again." };
    }
}

export async function generateProjectAction(name: string, technologies: string, currentDescription: string) {
    if (!process.env.GEMINI_API_KEY) {
        return { error: "Gemini API key is not configured. Please add it to your .env.local file." };
    }

    const prompt = `Write professional resume bullet points for a project named "${name}".
${technologies ? `Technologies used: ${technologies}` : ''}
${currentDescription ? `Here are some rough notes to incorporate: ${currentDescription}` : 'Make up 2-3 realistic and impactful bullet points.'}
Format the output as a clean bulleted list using the '-' character. Make it action-oriented using strong verbs. Use a first-person perspective (you can start with verbs like 'Built', 'Implemented', and use 'I' or 'my' if natural). Focus on what was built, how it was built, and the impact. Do not include introductory text, just the bullet points.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return { content: response.text };
    } catch (error) {
        console.error("Gemini Error:", error);
        return { error: "Failed to generate project bullet points. Please try again." };
    }
}
