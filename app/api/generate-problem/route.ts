import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { profile, tech, pace } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        id: `prob_${Date.now()}`,
        title: "Build a Todo App",
        description: "It's a classic. Build a todo app with what you have.",
        category: "Productivity",
        difficulty: "beginner",
        constraints: ["Must work offline", "No external CSS libraries"],
        bonusObjectives: ["Add dark mode", "Add drag and drop"]
      });
    }

    const prompt = `
Generate a hackathon problem statement tailored specifically for a developer with this profile:
- Name: ${profile?.name || "Anonymous"}
- Profession: ${profile?.profession || "Hacker"}
- Identity: ${profile?.handle || "Unknown"}
- Title: ${profile?.title || ""}

And this selected Tech Stack:
${Array.isArray(tech) ? tech.join(', ') : 'Unknown'}

Game Pace: ${pace || "MEDIUM"}
(High = intense 24hr sprint, Medium = weekend project, Low = chill evening session)

The problem should be highly creative, unique, slightly chaotic (hackathon style), and achievable but challenging given their stack and pace.
CRITICAL: Never repeat standard problem statements like "Todo App", "Blog", or "E-commerce". Generate a wildly different theme every single time.
Use this random entropy to ensure completely unique output: ${Math.random().toString(36).substring(7)} - ${Date.now()}.

Return a JSON object with the following structure (match the Problem interface exactly):
{
  "id": "a unique string id",
  "title": "Catchy Problem Title",
  "description": "2-3 sentences describing the core problem and why it needs solving.",
  "category": "e.g., AI, Web3, FinTech, DevTools, Social Good",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "constraints": ["Constraint 1", "Constraint 2"],
  "bonusObjectives": ["Bonus 1", "Bonus 2"]
}
Return ONLY the JSON.
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
    console.error("Error generating problem:", error);
    return NextResponse.json({
      id: `prob_err_${Date.now()}`,
      title: "Fix the Broken Mainframe",
      description: "The AI API just crashed. Your job is to build a replacement using your tech stack.",
      category: "DevOps",
      difficulty: "advanced",
      constraints: ["No sleep allowed", "Must be written in 5 minutes"],
      bonusObjectives: ["Save the company"]
    });
  }
}
