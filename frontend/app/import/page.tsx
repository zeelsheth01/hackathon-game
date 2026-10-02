"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useGameStore } from "@/frontend/store";

export default function ImportRepoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const setLinkedRepoName = useGameStore(state => state.setLinkedRepoName);
  
  const [repoUrl, setRepoUrl] = useState("");
  const [error, setError] = useState("");
  const [isLinking, setIsLinking] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!repoUrl.trim()) {
      setError("Please enter a valid GitHub repository URL.");
      return;
    }

    let parsedRepoName = "";
    try {
      const urlObj = new URL(repoUrl.trim());
      if (urlObj.hostname !== "github.com") {
        throw new Error("Only github.com URLs are supported.");
      }
      const parts = urlObj.pathname.split("/").filter(Boolean);
      if (parts.length < 2) {
        throw new Error("URL must include the owner and repository name.");
      }
      parsedRepoName = `${parts[0]}/${parts[1]}`;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid URL format.");
      return;
    }

    try {
      setIsLinking(true);
      const res = await fetch("/api/game/link-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl: repoUrl.trim(),
          repoName: parsedRepoName,
          userId: (session?.user as { id?: string })?.id,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Backend error:", errText);
        throw new Error(errText || "Failed to link repo");
      }
      
      // Save linked repo name and navigate to dashboard
      setLinkedRepoName(parsedRepoName);
      router.push("/game/dashboard");
    } catch (error: unknown) {
      console.error(error);
      setError(`Error linking repository: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLinking(false);
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen bg-canvas text-ink flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-canvas text-ink flex flex-col items-center justify-center py-12 px-6">
      <div className="max-w-xl w-full mx-auto space-y-8">
        
        <header className="text-left space-y-2">
          <h1 className="text-[24px] font-bold text-ink">
            [+] Import Project
          </h1>
          <p className="text-[14px] text-body">
            Paste the public GitHub repository URL of your hackathon project to enable AI tracking and real-time scoring.
          </p>
        </header>

        <div className="bg-canvas border border-hairline p-8">
          <form onSubmit={handleImport} className="space-y-6">
            {error && (
              <div className="bg-surface-soft border border-danger rounded-sm p-3 text-[14px] text-danger">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-[14px] font-bold text-ink uppercase tracking-wider">
                GitHub Repository URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/username/project-name"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full bg-surface-soft border border-hairline py-3 px-4 text-ink focus:outline-none focus:border-ink transition-colors text-[16px] rounded-none"
                required
              />
              <p className="text-[12px] text-mute">
                Ensure your repository is public, or our AI judges won&apos;t be able to access your code.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLinking}
              className="w-full py-3 bg-primary text-on-primary font-bold text-[16px] leading-[2] rounded-none hover:bg-ink-deep transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLinking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Linking...
                </>
              ) : (
                "Link Repository"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
