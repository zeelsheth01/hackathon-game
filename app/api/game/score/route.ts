import { getServerSession } from "next-auth/next";
import { authOptions } from "@/backend/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/backend/db";
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const accessToken = (session as any).accessToken;

    // We allow missing accessToken for local testing to provide mock data

    const body = await request.json();
    const { problem } = body;

    // Find the active game session to get the repo name
    const activeSession = await prisma.gameSession.findFirst({
      where: { userId: userId, status: "IN_PROGRESS" },
      orderBy: { createdAt: "desc" },
    });

    if (!activeSession || !activeSession.githubRepoName) {
      return NextResponse.json({ error: "No active game session or linked repository found." }, { status: 400 });
    }

    const repoName = activeSession.githubRepoName;

    // Fetch the recent commits to evaluate the work done
    let commitsRes = { ok: false, status: 401, json: async () => [] };
    if (accessToken) {
      commitsRes = await fetch(`https://api.github.com/repos/${repoName}/commits?per_page=3`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }) as any;
    }

    let commits: any[] = [];
    if (!commitsRes.ok) {
      // Mock commits since we don't have a real token locally
      commits = [
        { sha: "mock_sha_123", commit: { message: "Initial commit with great design" } }
      ];
    } else {
      commits = await commitsRes.json();
    }
    let codeContext = `Repository: ${repoName}\n\n`;

    // Fetch the diff for the latest commit to give the AI context of what was written
    if (commits.length > 0) {
      const latestCommitSha = commits[0].sha;
      let diffRes = { ok: false, text: async () => "" };
      if (accessToken) {
        diffRes = await fetch(`https://api.github.com/repos/${repoName}/commits/${latestCommitSha}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3.diff", // Request diff format
          },
        }) as any;
      }
      if (diffRes.ok) {
        const diffText = await diffRes.text();
        const truncatedDiff = diffText.slice(0, 15000); 
        codeContext += `Latest Commit Diff:\n\`\`\`diff\n${truncatedDiff}\n\`\`\`\n`;
      } else {
        // Mock diff if local test
        codeContext += `Latest Commit Diff:\n\`\`\`diff\n+ function solveHackathon() { return "AI Powered!" }\n\`\`\`\n`;
      }
    }

    // Now send to Gemini for scoring
    if (!process.env.GEMINI_API_KEY) {
      // Mock score if no API key
      return NextResponse.json({
        score: { innovation: 85, execution: 90, design: 80, pitch: 75, bonus: 10 },
        feedback: "This is a mock evaluation since Gemini API key is missing. Great job on the hackathon!",
        totalScore: 340
      });
    }

    const prompt = `
You are an expert Hackathon AI judge evaluating a developer's codebase modifications.
They were given this Problem Statement:
${JSON.stringify(problem, null, 2)}

Here is the diff of their latest code changes from GitHub:
${codeContext}

Evaluate their code based on how well they solved the problem statement. 
CRITICAL: Pay close attention to how well they adapted their overall idea and changed the existing codebase wherever needed to fully complete the project goals within the hackathon timeframe.
Be creative, fun, and strict but fair.
Return ONLY a JSON object exactly matching this structure:
{
  "score": {
    "innovation": (0-100 score),
    "execution": (0-100 score),
    "design": (0-100 score),
    "pitch": (0-100 score, how well the code tells a story),
    "bonus": (0-100 bonus points for hitting bonus objectives)
  },
  "feedback": "A 2-3 sentence engaging feedback message directly addressing the hacker."
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
    if (!text) throw new Error("No text returned from Gemini");

    const evaluation = JSON.parse(text);
    
    // Calculate total score
    const totalScore = 
      evaluation.score.innovation + 
      evaluation.score.execution + 
      evaluation.score.design + 
      evaluation.score.pitch + 
      evaluation.score.bonus;
      
    evaluation.totalScore = totalScore;

    // Update the game session with the score
    await prisma.gameSession.update({
      where: { id: activeSession.id },
      data: { currentScore: totalScore }
    });

    return NextResponse.json(evaluation);

  } catch (error: any) {
    console.error("Error scoring code:", error);
    return NextResponse.json({ error: "Internal server error during scoring." }, { status: 500 });
  }
}

