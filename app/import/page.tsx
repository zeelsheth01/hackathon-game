"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Repo = {
  id: number;
  name: string;
  fullName: string;
  url: string;
  private: boolean;
  updatedAt: string;
  language: string | null;
};

export default function ImportRepoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [repos, setRepos] = useState<Repo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repo[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [linkingRepoId, setLinkingRepoId] = useState<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchRepos();
    }
  }, [status, router]);

  const fetchRepos = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/github/repos");
      if (!res.ok) throw new Error("Failed to fetch repos");
      const data = await res.json();
      setRepos(data.repos || []);
      setFilteredRepos(data.repos || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredRepos(repos);
    } else {
      setFilteredRepos(
        repos.filter((repo) =>
          repo.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, repos]);

  const handleImport = async (repo: Repo) => {
    try {
      setLinkingRepoId(repo.id);
      const res = await fetch("/api/game/link-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl: repo.url,
          repoName: repo.fullName,
        }),
      });

      if (!res.ok) throw new Error("Failed to link repo");
      
      // Navigate to the dashboard or score page after linking
      router.push("/game/dashboard");
    } catch (error) {
      console.error(error);
      alert("Error linking repository. Please try again.");
    } finally {
      setLinkingRepoId(null);
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen bg-canvas text-ink flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-canvas text-ink flex flex-col items-center justify-center py-12 px-6">
      
      <div className="max-w-3xl w-full mx-auto space-y-8">
        
        <header className="text-left space-y-2">
          <h1 className="text-[24px] font-bold text-ink">
            [+] Import Project
          </h1>
          <p className="text-[14px] text-body">
            Select the repository containing your hackathon project to enable AI tracking and real-time scoring.
          </p>
        </header>

        <div className="bg-canvas border border-hairline">
          {/* Search Header */}
          <div className="p-4 border-b border-hairline bg-surface-soft sticky top-0 z-20">
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-hairline bg-canvas text-mute text-[14px]">Search:</span>
              <input
                type="text"
                placeholder="Repository name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-canvas border border-hairline py-2 px-3 text-ink focus:outline-none transition-colors text-[14px]"
              />
            </div>
          </div>

          {/* Repo List */}
          <div className="divide-y divide-hairline max-h-[500px] overflow-y-auto">
            {isLoading ? (
              <div className="p-12 text-center text-mute space-y-4 flex flex-col items-center">
                <Loader2 className="w-8 h-8 animate-spin text-ink" />
                <p className="text-[14px]">Syncing repositories...</p>
              </div>
            ) : filteredRepos.length === 0 ? (
              <div className="p-12 text-center text-mute">
                <p className="text-[14px]">No repositories found matching "{search}".</p>
              </div>
            ) : (
              filteredRepos.map((repo) => (
                <div 
                  key={repo.id} 
                  className="flex items-center justify-between p-4 hover:bg-surface-soft transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-[16px] text-ink">{repo.name}</span>
                        {repo.private ? (
                          <span className="text-[10px] font-bold tracking-wider uppercase border border-hairline text-mute px-1">
                            [Private]
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold tracking-wider uppercase border border-hairline text-accent px-1">
                            [Public]
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-[12px] text-mute">
                        <span className="font-medium">{repo.fullName}</span>
                        {repo.language && (
                          <span className="font-medium">
                            Lang: {repo.language}
                          </span>
                        )}
                        <span>Updated: {new Date(repo.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleImport(repo)}
                    disabled={linkingRepoId === repo.id}
                    className="px-4 py-2 border border-hairline bg-canvas hover:bg-ink-deep hover:text-on-primary text-ink font-bold text-[14px] transition-colors disabled:opacity-50"
                  >
                    {linkingRepoId === repo.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "[Import]"
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
