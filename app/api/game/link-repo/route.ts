import { getServerSession } from "next-auth/next";
import { authOptions } from "@/backend/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/backend/db";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { repoUrl, repoName } = body;

    if (!repoUrl || !repoName) {
      return NextResponse.json(
        { error: "Missing repo information" },
        { status: 400 }
      );
    }

    // Find the most recent active game session
    const activeSession = await prisma.gameSession.findFirst({
      where: {
        userId: userId,
        status: "IN_PROGRESS",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!activeSession) {
      // Create a dummy session if one doesn't exist for the sake of the hackathon flow
      // Normally they would have already created one during Stack & Pace selection
      const newSession = await prisma.gameSession.create({
        data: {
          userId: userId,
          stack: "Unknown",
          pace: "MEDIUM",
          githubRepoUrl: repoUrl,
          githubRepoName: repoName,
        }
      });
      return NextResponse.json({ success: true, session: newSession });
    }

    // Update existing session
    const updatedSession = await prisma.gameSession.update({
      where: { id: activeSession.id },
      data: {
        githubRepoUrl: repoUrl,
        githubRepoName: repoName,
      },
    });

    return NextResponse.json({ success: true, session: updatedSession });
  } catch (error: any) {
    console.error("Error linking repo:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

