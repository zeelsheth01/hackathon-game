"use server";

import { prisma } from "@/backend/db";

export async function getRecentRuns() {
  try {
    const leaderboards = await prisma.leaderboard.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            hackerId: true,
          },
        },
      },
    });

    if (leaderboards.length === 0) {
      return [];
    }

    return leaderboards.map((entry: any) => {
      const name = entry.user?.hackerId || entry.user?.name || "Anonymous_Hacker";
      return `${name} completed a run with score: ${entry.score}/400`;
    });
  } catch (error) {
    console.error("Failed to fetch recent runs:", error);
    return [];
  }
}

