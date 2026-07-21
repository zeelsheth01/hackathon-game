"use server";

import axios from "axios";

export async function getRecentRuns() {
  try {
    const res = await axios.get("http://localhost:5000/api/leaderboard/recent");
    const leaderboards = res.data;

    if (leaderboards.length === 0) {
      return [];
    }

    return leaderboards.map((entry: any) => {
      const name = entry.userId?.hackerId || entry.userId?.name || "Anonymous_Hacker";
      return `${name} completed a run with score: ${entry.score}/400`;
    });
  } catch (error) {
    console.error("Failed to fetch recent runs:", error);
    return [];
  }
}

