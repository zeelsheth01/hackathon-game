import { getServerSession } from "next-auth/next";
import { authOptions } from "@/backend/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const accessToken = (session as any).accessToken;

    const body = await request.json();

    const response = await fetch("http://localhost:5000/api/game/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
        "x-access-token": accessToken || "",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error: any) {
    console.error("Error proxying score code:", error);
    return NextResponse.json({ error: "Internal server error during scoring." }, { status: 500 });
  }
}

