import { getServerSession } from "next-auth/next";
import { authOptions } from "@/backend/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !(session as any).accessToken) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in with GitHub." },
        { status: 401 }
      );
    }

    const accessToken = (session as any).accessToken;

    const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("GitHub API Error:", errorData);
      return NextResponse.json(
        { error: "Failed to fetch repositories from GitHub." },
        { status: response.status }
      );
    }

    const repos = await response.json();

    // Map to a simplified structure for the UI
    const formattedRepos = repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      url: repo.html_url,
      private: repo.private,
      updatedAt: repo.updated_at,
      language: repo.language
    }));

    return NextResponse.json({ repos: formattedRepos });
  } catch (error: any) {
    console.error("Error fetching repos:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

