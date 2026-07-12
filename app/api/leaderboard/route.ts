import { NextResponse } from 'next/server';
import { prisma } from '@/backend/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/backend/auth';

export async function GET() {
  try {
    const scores = await prisma.leaderboard.findMany({
      take: 50,
      orderBy: { score: 'desc' },
      include: {
        user: { select: { name: true } }
      }
    });
    
    return NextResponse.json(scores);
  } catch (error) {
    console.error("Leaderboard GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized. You must be signed in to post a score." }, { status: 401 });
    }

    const body = await req.json();
    
    if (typeof body.score !== 'number') {
      return NextResponse.json({ error: "Invalid score" }, { status: 400 });
    }

    const userId = (session.user as any).id;

    // Check if user already has a score, update if higher, or just insert new
    // We'll just insert a new one so players can have multiple runs on the board.
    const entry = await prisma.leaderboard.create({
      data: {
        score: body.score,
        userId: userId
      }
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Leaderboard POST Error:", error);
    return NextResponse.json({ error: "Failed to save score" }, { status: 500 });
  }
}

