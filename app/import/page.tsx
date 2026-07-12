"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Search, Lock, Globe, Loader2, ArrowRight } from "lucide-react";

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
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen w-full overflow-hidden bg-slate-950 text-slate-200 flex flex-col items-center justify-center py-12 px-6 relative">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
        
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[120px] mix-blend-screen animate-pulse duration-1000"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[150px] mix-blend-screen"></div>
        <div className="absolute top-[30%] left-[60%] w-[300px] h-[300px] rounded-full bg-purple-500/10 blur-[100px] mix-blend-screen"></div>
      </div>

      <div className="max-w-4xl w-full mx-auto space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 border border-slate-700 shadow-[0_0_30px_rgba(59,130,246,0.3)] mb-4">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            Import Project
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Select the repository containing your hackathon project to enable AI tracking and real-time scoring.
          </p>
        </header>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Search Header */}
          <div className="p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search repositories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all shadow-inner text-lg"
                />
              </div>
            </div>
          </div>

          {/* Repo List */}
          <div className="divide-y divide-slate-800/50 max-h-[500px] overflow-y-auto custom-scrollbar relative">
            {isLoading ? (
              <div className="p-20 text-center text-slate-500 space-y-4 flex flex-col items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                  <Loader2 className="w-10 h-10 animate-spin text-blue-500 relative" />
                </div>
                <p className="text-lg font-medium animate-pulse">Syncing repositories...</p>
              </div>
            ) : filteredRepos.length === 0 ? (
              <div className="p-20 text-center text-slate-500">
                <div className="inline-block p-4 rounded-full bg-slate-800 mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-lg">No repositories found matching "{search}".</p>
              </div>
            ) : (
              filteredRepos.map((repo) => (
                <div 
                  key={repo.id} 
                  className="flex items-center justify-between p-6 hover:bg-slate-800/30 transition-all group"
                >
                  <div className="flex items-center gap-5">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl group-hover:border-slate-600 transition-colors shadow-inner">
                      <svg className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-lg text-slate-200 group-hover:text-blue-400 transition-colors">{repo.name}</span>
                        {repo.private ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border border-slate-700 text-slate-400 bg-slate-950">
                            <Lock className="w-3 h-3" /> Private
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border border-emerald-900/50 text-emerald-500 bg-emerald-950/30">
                            <Globe className="w-3 h-3" /> Public
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="font-medium">{repo.fullName}</span>
                        {repo.language && (
                          <span className="flex items-center gap-1.5 font-medium">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                            {repo.language}
                          </span>
                        )}
                        <span>Updated {new Date(repo.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleImport(repo)}
                    disabled={linkingRepoId === repo.id}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50 flex items-center gap-2 border border-slate-700 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:scale-105"
                  >
                    {linkingRepoId === repo.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Import
                        <ArrowRight className="w-4 h-4" />
                      </>
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
