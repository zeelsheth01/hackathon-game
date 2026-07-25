import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/backend/config/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).accessToken) {
      return NextResponse.json({ error: "Unauthorized or missing GitHub token" }, { status: 401 });
    }

    const accessToken = (session as any).accessToken;

    const res = await fetch("https://api.github.com/user/repos?visibility=all&sort=updated&per_page=100", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("GitHub API Error:", errorData);
      return NextResponse.json({ error: "Failed to fetch from GitHub API" }, { status: res.status });
    }

    const data = await res.json();

    const repos = data.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      url: repo.html_url,
      private: repo.private,
      updatedAt: repo.updated_at,
      language: repo.language,
    }));

    return NextResponse.json({ repos });
  } catch (error) {
    console.error("Error in /api/github/repos:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
