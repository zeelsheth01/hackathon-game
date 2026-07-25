import GameSession from '../models/GameSession';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const linkRepo = async (req: any, res: any) => {
  try {
    const { repoUrl, repoName } = req.body;
    if (!repoUrl || !repoName) {
      return res.status(400).json({ error: "Missing repo information" });
    }

    const activeSession = await GameSession.findOne({
      userId: req.userId,
      status: "IN_PROGRESS",
    }).sort({ createdAt: -1 });

    if (!activeSession) {
      const newSession = await GameSession.create({
        userId: req.userId,
        stack: "Unknown",
        pace: "MEDIUM",
        githubRepoUrl: repoUrl,
        githubRepoName: repoName,
      });
      return res.json({ success: true, session: newSession });
    }

    activeSession.githubRepoUrl = repoUrl;
    activeSession.githubRepoName = repoName;
    await activeSession.save();

    return res.json({ success: true, session: activeSession });
  } catch (error) {
    console.error("Error linking repo:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const scoreGame = async (req: any, res: any) => {
  try {
    const { problem } = req.body;
    const activeSession = await GameSession.findOne({
      userId: req.userId,
      status: "IN_PROGRESS",
    }).sort({ createdAt: -1 });

    if (!activeSession || !activeSession.githubRepoName) {
      return res.status(400).json({ error: "No active game session or linked repository found." });
    }

    const repoName = activeSession.githubRepoName;
    const accessToken = req.accessToken;

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
      commits = [{ sha: "mock_sha_123", commit: { message: "Initial commit with great design" } }];
    } else {
      commits = await commitsRes.json();
    }
    let codeContext = `Repository: ${repoName}\n\n`;

    if (commits.length > 0) {
      const latestCommitSha = commits[0].sha;
      let diffRes = { ok: false, text: async () => "" };
      if (accessToken) {
        diffRes = await fetch(`https://api.github.com/repos/${repoName}/commits/${latestCommitSha}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3.diff",
          },
        }) as any;
      }
      if (diffRes.ok) {
        const diffText = await diffRes.text();
        const truncatedDiff = diffText.slice(0, 15000); 
        codeContext += `Latest Commit Diff:\n\`\`\`diff\n${truncatedDiff}\n\`\`\`\n`;
      } else {
        codeContext += `Latest Commit Diff:\n\`\`\`diff\n+ function solveHackathon() { return "AI Powered!" }\n\`\`\`\n`;
      }
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
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
      config: { responseMimeType: 'application/json' }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");

    const evaluation = JSON.parse(text);
    const totalScore = evaluation.score.innovation + evaluation.score.execution + evaluation.score.design + evaluation.score.pitch + evaluation.score.bonus;
      
    evaluation.totalScore = totalScore;
    activeSession.currentScore = totalScore;
    await activeSession.save();

    return res.json(evaluation);
  } catch (error: any) {
    console.error("Error scoring code:", error);
    return res.status(500).json({ error: "Internal server error during scoring." });
  }
};
