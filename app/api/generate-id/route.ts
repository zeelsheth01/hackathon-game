import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        id: `hacker_${Date.now()}`,
        handle: "AnonHacker",
        title: "The Unconfigured",
        avatarBg: "bg-slate-500"
      });
    }

    const prompt = `
Generate a fun, unique "hacker profile" for a participant joining a fast-paced coding hackathon.
The profile should be a single JSON object with the following fields:
- handle: A cool or funny hacker username (e.g., "ByteMe", "NullPointer", "CyberNinja42")
- title: A funny or impressive title (e.g., "10x Boilerplate Copier", "CSS Centering Expert")
- avatarBg: A valid Tailwind CSS background color class (e.g., "bg-blue-500", "bg-purple-600", "bg-red-500", "bg-emerald-400", "bg-amber-500")

Return ONLY the valid JSON object.
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
    parsed.id = `hacker_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    return NextResponse.json(parsed);

  } catch (error) {
    console.error("Error generating hacker ID:", error);
    return NextResponse.json({
      id: `hacker_${Date.now()}`,
      handle: "ErrorByte",
      title: "API Limit Reacher",
      avatarBg: "bg-red-600"
    });
  }
}
