"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/frontend/store";
import { Loader2, RefreshCw, Trophy, Star, Lightbulb, PenTool, Rocket, MessageSquare } from "lucide-react";

export default function GameDashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const { 
    selectedProblem, 
    score, 
    updateScore,
    scoreEvaluation,
    setScoreEvaluation,
    linkedRepoName
  } = useGameStore();

  const [isScoring, setIsScoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated" && !selectedProblem) {
      // If they somehow got here without a problem, send them to setup
      router.push("/game");
    }
  }, [status, router, selectedProblem]);

  const handleSyncAndScore = async () => {
    try {
      setIsScoring(true);
      setError(null);
      
      const res = await fetch("/api/game/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: selectedProblem })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to score code");
      }

      const evaluation = await res.json();
      
      // Update store
      updateScore(evaluation.score);
      setScoreEvaluation({
        feedback: evaluation.feedback,
        modifiers: evaluation.score
      });

    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsScoring(false);
    }
  };

  if (status === "loading" || !selectedProblem) {
    return <div className="min-h-screen bg-canvas flex items-center justify-center"><Loader2 className="w-8 h-8 text-accent animate-spin" /></div>;
  }

  const totalScore = (score.innovation || 0) + (score.execution || 0) + (score.design || 0) + (score.pitch || 0) + (score.bonus || 0);

  return (
    <div className="min-h-screen bg-canvas text-ink py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-hairline pb-8">
          <div>
            <h1 className="text-[24px] font-bold text-ink mb-2">Hackathon Dashboard</h1>
            <p className="text-body text-[14px]">Push your code to GitHub, then sync here to let the AI judge your work.</p>
          </div>
          <div className="flex items-center gap-4 bg-surface-soft border border-hairline p-4 rounded-sm">
            <Trophy className="w-8 h-8 text-primary" />
            <div>
              <div className="text-[12px] font-bold text-mute uppercase tracking-wider">Total Score</div>
              <div className="text-[28px] font-black text-ink leading-none">{totalScore} <span className="text-[14px] text-mute font-normal">/ 500</span></div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Problem & Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-surface-soft border border-hairline rounded-sm p-6 shadow-sm">
              <h3 className="text-[12px] font-bold text-mute uppercase tracking-wider mb-4">Active Challenge</h3>
              <h4 className="text-[18px] font-bold text-ink mb-2">{selectedProblem.title}</h4>
              <p className="text-[14px] text-body mb-6">{selectedProblem.description}</p>
              
              {linkedRepoName && (
                <div className="mb-6 p-3 border border-hairline bg-canvas text-[12px]">
                  <span className="font-bold text-mute block mb-1">LINKED REPOSITORY:</span>
                  <span className="font-mono text-primary font-bold">{linkedRepoName}</span>
                </div>
              )}

              <button 
                onClick={handleSyncAndScore}
                disabled={isScoring}
                className="w-full bg-primary hover:bg-ink-deep disabled:opacity-50 text-on-primary font-bold py-3 text-[14px] rounded-sm transition-all flex items-center justify-center gap-2"
              >
                {isScoring ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Judging Code...</>
                ) : (
                  <><RefreshCw className="w-4 h-4" /> Sync & Score from GitHub</>
                )}
              </button>
              {error && <p className="text-danger text-[12px] mt-3 text-center">{error}</p>}
            </div>

            {scoreEvaluation && (
              <div className="bg-surface-soft border border-hairline rounded-sm p-6 shadow-sm">
                <h3 className="text-[12px] font-bold text-mute uppercase tracking-wider mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Judge&apos;s Feedback
                </h3>
                <p className="text-ink leading-[1.6] text-[14px] italic">&quot;{scoreEvaluation.feedback}&quot;</p>
              </div>
            )}
          </div>

          {/* Right Column: Score Breakdown */}
          <div className="lg:col-span-2">
            <h3 className="text-[18px] font-bold text-ink mb-6">Score Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-surface-soft border border-hairline p-6 rounded-sm hover:border-ink transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-canvas border border-hairline rounded-sm text-primary"><Lightbulb className="w-5 h-5" /></div>
                  <span className="text-[28px] font-black text-ink">{score.innovation || 0}</span>
                </div>
                <h4 className="font-bold text-ink text-[14px]">Innovation</h4>
                <p className="text-[12px] text-mute mt-1">Creativity and unique approach.</p>
              </div>

              <div className="bg-surface-soft border border-hairline p-6 rounded-sm hover:border-ink transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-canvas border border-hairline rounded-sm text-accent"><Rocket className="w-5 h-5" /></div>
                  <span className="text-[28px] font-black text-ink">{score.execution || 0}</span>
                </div>
                <h4 className="font-bold text-ink text-[14px]">Execution</h4>
                <p className="text-[12px] text-mute mt-1">Code quality and functionality.</p>
              </div>

              <div className="bg-surface-soft border border-hairline p-6 rounded-sm hover:border-ink transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-canvas border border-hairline rounded-sm text-primary"><PenTool className="w-5 h-5" /></div>
                  <span className="text-[28px] font-black text-ink">{score.design || 0}</span>
                </div>
                <h4 className="font-bold text-ink text-[14px]">Design</h4>
                <p className="text-[12px] text-mute mt-1">Architecture and UX/UI.</p>
              </div>

              <div className="bg-surface-soft border border-hairline p-6 rounded-sm hover:border-ink transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-canvas border border-hairline rounded-sm text-accent"><Star className="w-5 h-5" /></div>
                  <span className="text-[28px] font-black text-ink">{score.pitch || 0}</span>
                </div>
                <h4 className="font-bold text-ink text-[14px]">Story & Pitch</h4>
                <p className="text-[12px] text-mute mt-1">Documentation and storytelling.</p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

