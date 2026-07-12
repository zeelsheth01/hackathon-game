"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/frontend/store";
import { Loader2, RefreshCw, Trophy, Star, Lightbulb, PenTool, Rocket, MessageSquare } from "lucide-react";

export default function GameDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { 
    selectedProblem, 
    score, 
    updateScore,
    scoreEvaluation,
    setScoreEvaluation
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

    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsScoring(false);
    }
  };

  if (status === "loading" || !selectedProblem) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;
  }

  const totalScore = (score.innovation || 0) + (score.execution || 0) + (score.design || 0) + (score.pitch || 0) + (score.bonus || 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Hackathon Dashboard</h1>
            <p className="text-slate-400">Push your code to GitHub, then sync here to let the AI judge your work.</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Score</div>
              <div className="text-3xl font-black text-white leading-none">{totalScore} <span className="text-lg text-slate-500 font-normal">/ 500</span></div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Problem & Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Active Challenge</h3>
              <h4 className="text-xl font-bold text-white mb-2">{selectedProblem.title}</h4>
              <p className="text-sm text-slate-400 mb-6">{selectedProblem.description}</p>
              
              <button 
                onClick={handleSyncAndScore}
                disabled={isScoring}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:text-blue-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
              >
                {isScoring ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Judging Code...</>
                ) : (
                  <><RefreshCw className="w-5 h-5" /> Sync & Score from GitHub</>
                )}
              </button>
              {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
            </div>

            {scoreEvaluation && (
              <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Judge's Feedback
                </h3>
                <p className="text-indigo-100 leading-relaxed text-sm italic">"{scoreEvaluation.feedback}"</p>
              </div>
            )}
          </div>

          {/* Right Column: Score Breakdown */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-6">Score Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400"><Lightbulb className="w-6 h-6" /></div>
                  <span className="text-3xl font-black text-white">{score.innovation || 0}</span>
                </div>
                <h4 className="font-bold text-slate-200">Innovation</h4>
                <p className="text-xs text-slate-500 mt-1">Creativity and unique approach.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400"><Rocket className="w-6 h-6" /></div>
                  <span className="text-3xl font-black text-white">{score.execution || 0}</span>
                </div>
                <h4 className="font-bold text-slate-200">Execution</h4>
                <p className="text-xs text-slate-500 mt-1">Code quality and functionality.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400"><PenTool className="w-6 h-6" /></div>
                  <span className="text-3xl font-black text-white">{score.design || 0}</span>
                </div>
                <h4 className="font-bold text-slate-200">Design</h4>
                <p className="text-xs text-slate-500 mt-1">Architecture and UX/UI.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400"><Star className="w-6 h-6" /></div>
                  <span className="text-3xl font-black text-white">{score.pitch || 0}</span>
                </div>
                <h4 className="font-bold text-slate-200">Story & Pitch</h4>
                <p className="text-xs text-slate-500 mt-1">Documentation and storytelling.</p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

