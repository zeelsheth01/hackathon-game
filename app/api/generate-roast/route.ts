import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        feedback: "API Key not found. Falling back to default response: Your architecture is interesting, but you forgot to set up your environment variables. 0/10.",
        modifiers: { innovation: 1.0, execution: 0.5, design: 1.0, pitch: 0.5 }
      });
    }

    const state = await req.json();

    const prompt = `
You are roleplaying as an elite, slightly cynical senior software engineer judging a hackathon submission.

The user's project details:
- Hacker Name: ${state.profile?.name} (@${state.profile?.handle})
- Profession: ${state.profile?.profession}
- Selected Tech Stack: ${Object.values(state.tech).map((t: any) => t.name).join(', ')}
- Assigned Problem: "${state.problem?.title}"
- Problem Description: "${state.problem?.description}"

Write a brutal or glowing review (1-2 paragraphs) evaluating how likely they are to succeed in building this solution with their chosen tech stack. 
Critique their tech stack choices given their assigned problem. Are they over-engineering? Using the wrong tool for the job? Or is it a perfect fit?
Also provide a score for their loadout (between 0 and 100) for each category.

Return ONLY a valid JSON object in the following format:
{
  "feedback": "Your paragraph of text here...",
  "modifiers": {
    "innovation": number,
    "execution": number,
    "design": number,
    "pitch": number
  }
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No text returned from Gemini");
    }

    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);

  } catch (error) {
    console.error("Error generating roast:", error);
    return NextResponse.json({
      feedback: "The AI Judge threw a 500 Internal Server Error and walked out of the room. Good job breaking it.",
      modifiers: { innovation: 1.0, execution: 0.1, design: 1.0, pitch: 1.0 }
    });
  }
}
