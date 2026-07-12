"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/frontend/store";
import { GamePhase, Pace } from "@/shared/types";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, Code2, Zap, Coffee, CheckCircle2, X, Plus, Info, User, Edit3, RefreshCw, Dices, Layers, Server, Database } from "lucide-react";

const MatrixText = ({ text }: { text: string }) => {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    let iter = 0;
    const interval = setInterval(() => {
      setDisplay(text.split("").map((char, index) => {
        if (index < iter) return char;
        return String.fromCharCode(33 + Math.floor(Math.random() * 94));
      }).join(""));
      if (iter >= text.length) clearInterval(interval);
      iter += 1/2;
    }, 30);
    return () => clearInterval(interval);
  }, [text]);
  return <span className="font-mono">{display}</span>;
};

export default function GameSetupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { 
    phase, setPhase, 
    playerProfile, setPlayerProfile,
    selectedTech, addSelectedTech, removeSelectedTech,
    pace, setPace,
    selectedProblem, setSelectedProblem
  } = useGameStore();

  const [isLoading, setIsLoading] = useState(false);
  const [handle, setHandle] = useState(playerProfile?.handle || (session?.user as any)?.hackerId || session?.user?.name || "");
  const [title, setTitle] = useState(playerProfile?.title || "");
  const [avatarBg, setAvatarBg] = useState(playerProfile?.avatarBg || "Jasper");
  const [github, setGithub] = useState(playerProfile?.github || "");
  const [discord, setDiscord] = useState(playerProfile?.discord || "");
  const [techInput, setTechInput] = useState("");
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);

  const avatarOptions = [
    "Jasper", "Felix", "Aneka", "Sam", "Oliver", "Max", "Leo", "Ruby"
  ];

  const TECH_CATEGORIES = [
    { name: "Frontend", icon: <Layers className="w-3.5 h-3.5" />, tech: ["Next.js", "React", "Vue", "TailwindCSS"] },
    { name: "Backend", icon: <Server className="w-3.5 h-3.5" />, tech: ["Node.js", "Python", "Rust", "Go"] },
    { name: "Database", icon: <Database className="w-3.5 h-3.5" />, tech: ["PostgreSQL", "MongoDB", "Redis", "Supabase"] }
  ];

  const handleRandomTech = () => {
    const allTech = TECH_CATEGORIES.flatMap(c => c.tech).concat(["GraphQL", "Docker", "Svelte", "TRPC"]);
    const randomTech: string[] = [];
    while (randomTech.length < 4) {
      const random = allTech[Math.floor(Math.random() * allTech.length)];
      if (!randomTech.includes(random)) randomTech.push(random);
    }
    randomTech.forEach(t => {
      if (!selectedTech.includes(t)) addSelectedTech(t);
    });
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated" && phase === GamePhase.REGISTRATION) {
      setPhase(GamePhase.PROFILE_FORM);
      if (!handle) {
        setHandle((session?.user as any)?.hackerId || session?.user?.name || "");
      }
    }
  }, [status, phase, router, session, setPhase, handle]);

  if (status === "loading" || phase === GamePhase.REGISTRATION) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle) return;
    setPlayerProfile({ id: (session?.user as any)?.id || 'guest', handle, title, avatarBg, github, discord });
    setPhase(GamePhase.TECH_STACK);
  };

  const handleAddTech = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = techInput.trim();
    if (trimmed && !selectedTech.includes(trimmed)) {
      addSelectedTech(trimmed);
      setTechInput("");
    }
  };

  const generateProblem = async (selectedPace: Pace) => {
    try {
      setIsLoading(true);
      setPace(selectedPace);
      setPhase(GamePhase.PROBLEM_REVEAL);
      
      const res = await fetch("/api/generate-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: playerProfile,
          tech: selectedTech,
          pace: selectedPace
        })
      });

      if (!res.ok) throw new Error("Failed to generate problem");
      const problem = await res.json();
      setSelectedProblem(problem);
    } catch (err) {
      console.error(err);
      alert("Error generating problem. Please try again.");
      setPhase(GamePhase.PACE_SELECTION);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-950 text-slate-200 flex flex-col items-center justify-center py-4 px-6 relative">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
        
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen animate-pulse duration-1000"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[150px] mix-blend-screen"></div>
        <div className="absolute top-[30%] left-[60%] w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[100px] mix-blend-screen"></div>
      </div>

      <div className="max-w-3xl w-full mx-auto flex flex-col justify-center h-full max-h-[750px] space-y-4 relative z-10">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-4">
          {["Profile", "Stack", "Pace", "Challenge", "Rules"].map((step, idx) => {
            const stepPhase = [GamePhase.PROFILE_FORM, GamePhase.TECH_STACK, GamePhase.PACE_SELECTION, GamePhase.PROBLEM_REVEAL, GamePhase.GUIDANCE][idx];
            const isActive = phase === stepPhase;
            const isPast = Object.values(GamePhase).indexOf(phase) > Object.values(GamePhase).indexOf(stepPhase);
            return (
              <div key={step} className={`flex items-center gap-1.5 md:gap-2 ${isActive ? 'text-blue-500' : isPast ? 'text-green-500' : 'text-slate-600'}`}>
                <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 text-xs md:text-sm ${isActive ? 'border-blue-500 bg-blue-500/20' : isPast ? 'border-green-500 bg-green-500/20' : 'border-slate-600'}`}>
                  {isPast ? <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> : idx + 1}
                </div>
                <span className="font-medium hidden sm:block text-xs md:text-sm">{step}</span>
                {idx < 4 && <div className="w-4 md:w-8 h-px bg-slate-800 hidden sm:block" />}
              </div>
            );
          })}
        </div>

        {/* Phase 1: Profile Form */}
        <AnimatePresence mode="wait">
          {phase === GamePhase.PROFILE_FORM && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-[0_0_40px_rgba(59,130,246,0.1)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              <h2 className="text-2xl font-bold text-white mb-1">Player Identity</h2>
              <p className="text-slate-400 mb-4 text-sm">Confirm your details before entering the arena.</p>

              {/* User Info & Avatar Display */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-950 border border-slate-800 rounded-xl p-3 shadow-inner gap-4 mb-4 relative z-30">
                <div className="flex items-center gap-4">
                  {/* Avatar Picker */}
                  <div className="relative group">
                    <div 
                      className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-500/50 bg-slate-800 relative z-10 shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer" 
                      onClick={() => setShowAvatarOptions(!showAvatarOptions)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${avatarBg}`} alt="Avatar" className="w-full h-full object-cover p-1" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAvatarOptions(!showAvatarOptions)}
                      className="absolute -bottom-1 -right-1 z-20 bg-blue-600 hover:bg-blue-500 text-white p-1 rounded-full shadow-lg border border-slate-900 transition-transform hover:scale-110"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Logged in as</div>
                    <div className="font-bold text-white text-sm">{session?.user?.name || session?.user?.email || "Hacker"}</div>
                  </div>
                </div>
                <div className="sm:text-right bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 w-full sm:w-auto shadow-sm">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Gamer ID</div>
                  <div className="font-mono font-bold text-blue-400 tracking-wider text-sm">{(session?.user as any)?.hackerId || "Unknown"}</div>
                </div>

                <AnimatePresence>
                  {showAvatarOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute top-[80px] left-0 z-40 bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-2xl"
                    >
                      <div className="grid grid-cols-4 gap-2">
                        {avatarOptions.map((bg, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setAvatarBg(bg);
                              setShowAvatarOptions(false);
                            }}
                            className={`w-12 h-12 rounded-xl transition-all duration-300 overflow-hidden bg-slate-950 flex items-center justify-center
                              ${avatarBg === bg ? 'ring-2 ring-blue-500 scale-105 shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'border border-slate-800 opacity-70 hover:opacity-100 hover:scale-105'}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${bg}`} alt="bot" className="w-3/4 h-3/4" />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-300 mb-1.5">
                      Game Handle
                      <div className="group relative">
                        <Info className="w-3.5 h-3.5 text-slate-500 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-xs text-slate-200 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          This is your unique hacker ID used on the leaderboard.
                        </div>
                      </div>
                    </label>
                    <input 
                      type="text" value={handle} onChange={(e) => setHandle(e.target.value)} required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Role / Specialization</label>
                    <div className="relative">
                      <select 
                        value={title} onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-slate-700 appearance-none"
                      >
                        <option value="">Select a role...</option>
                        <option value="Frontend Wizard">Frontend Wizard</option>
                        <option value="Backend Architect">Backend Architect</option>
                        <option value="Fullstack Ninja">Fullstack Ninja</option>
                        <option value="UI/UX Visionary">UI/UX Visionary</option>
                        <option value="Data Sorcerer">Data Sorcerer</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">GitHub Handle</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-bold text-sm">@</div>
                      <input 
                        type="text" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="octocat"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-slate-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Discord Tag</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-bold text-sm">#</div>
                      <input 
                        type="text" value={discord} onChange={(e) => setDiscord(e.target.value)} placeholder="hacker#1234"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-slate-700"
                      />
                    </div>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all text-sm mt-4"
                >
                  Continue to Stack Selection <ArrowRight className="w-4 h-4" />
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 2: Tech Stack */}
        {phase === GamePhase.TECH_STACK && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-bold text-white mb-2">Build Your Stack</h2>
            <p className="text-slate-400 mb-8">Type the technologies you'll use (e.g. Next.js, Rust, Tailwind) and hit Enter.</p>
            
            <form onSubmit={handleAddTech} className="mb-4 relative">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="e.g. Supabase"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-4 pr-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-500 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </form>

            <div className="mb-6 space-y-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Popular Categories</span>
                <button 
                  type="button"
                  onClick={handleRandomTech}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wider flex items-center gap-1"
                >
                  <Dices className="w-3 h-3" /> Randomize
                </button>
              </div>
              <div className="flex flex-col gap-3 max-h-[150px] overflow-y-auto pr-2">
                {TECH_CATEGORIES.map(cat => (
                  <div key={cat.name} className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {cat.icon} {cat.name}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cat.tech.map(tech => (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => {
                            if (!selectedTech.includes(tech)) addSelectedTech(tech);
                          }}
                          disabled={selectedTech.includes(tech)}
                          className="px-3 py-1 text-xs font-medium rounded-full border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8 min-h-[60px] p-4 rounded-lg bg-slate-950/50 border border-slate-800/50">
              {selectedTech.length === 0 ? (
                <span className="text-slate-500 text-sm">No tech added yet.</span>
              ) : (
                selectedTech.map((tech) => (
                  <div key={tech} className="flex items-center gap-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-full text-sm font-medium">
                    {tech}
                    <button onClick={() => removeSelectedTech(tech)} className="hover:text-white transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between items-center border-t border-slate-800 pt-6">
              <button onClick={() => setPhase(GamePhase.PROFILE_FORM)} className="px-6 py-3 text-slate-400 hover:text-white transition-colors">Back</button>
              <button 
                onClick={() => setPhase(GamePhase.PACE_SELECTION)} 
                disabled={selectedTech.length === 0}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg flex items-center gap-2"
              >
                Confirm Stack <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Phase 3: Pace Selection */}
        {phase === GamePhase.PACE_SELECTION && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-bold text-white mb-2">Select Your Pace</h2>
            <p className="text-slate-400 mb-8">How intense do you want this hackathon to be?</p>
            <div className="grid gap-6 sm:grid-cols-3 mb-8">
              {[
                { type: 'HIGH' as Pace, icon: <Zap className="w-8 h-8 mb-2 text-rose-500" />, title: "Sprint", desc: "Intense 24-hour fueled sprint.", borderClass: "hover:border-rose-500", shadowClass: "hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]", textClass: "group-hover:text-rose-400" },
                { type: 'MEDIUM' as Pace, icon: <Code2 className="w-8 h-8 mb-2 text-amber-500" />, title: "Balanced", desc: "A solid weekend project pace.", borderClass: "hover:border-amber-500", shadowClass: "hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]", textClass: "group-hover:text-amber-400" },
                { type: 'LOW' as Pace, icon: <Coffee className="w-8 h-8 mb-2 text-emerald-500" />, title: "Chill", desc: "Relaxed evening session.", borderClass: "hover:border-emerald-500", shadowClass: "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]", textClass: "group-hover:text-emerald-400" }
              ].map(p => (
                <button
                  key={p.type}
                  onClick={() => generateProblem(p.type)}
                  className={`bg-slate-900 border border-slate-800 p-6 rounded-xl transition-all text-left group ${p.borderClass} ${p.shadowClass}`}
                >
                  <div className={`text-slate-500 transition-colors ${p.textClass}`}>{p.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-sm text-slate-400">{p.desc}</p>
                </button>
              ))}
            </div>
            <button onClick={() => setPhase(GamePhase.TECH_STACK)} className="px-6 py-3 text-slate-400 hover:text-white transition-colors">Back</button>
          </div>
        )}

        {/* Phase 4: Problem Reveal */}
        {phase === GamePhase.PROBLEM_REVEAL && (
          <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col h-full max-h-[650px] justify-center">
            {isLoading || !selectedProblem ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                  <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative" />
                </div>
                <h2 className="text-2xl font-bold text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]">
                  <MatrixText text="GENERATING A DIRECTIVE..." />
                </h2>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-full">
                {/* Fixed Header */}
                <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 p-6 border-b border-slate-800 shrink-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-500/30">
                      {selectedProblem.category}
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-[10px] font-bold uppercase tracking-wider border border-purple-500/30">
                      {selectedProblem.difficulty}
                    </span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-white mb-2">{selectedProblem.title}</h1>
                  <p className="text-sm text-slate-300 leading-relaxed">{selectedProblem.description}</p>
                </div>
                
                {/* Scrollable Body */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                  <div>
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Constraints</h3>
                    <ul className="space-y-2 text-sm">
                      {selectedProblem.constraints.map((c, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-300">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Bonus Objectives</h3>
                    <ul className="space-y-2 text-sm">
                      {selectedProblem.bonusObjectives.map((b, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-300">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" /> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Fixed Footer */}
                <div className="p-4 border-t border-slate-800 shrink-0 bg-slate-900">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => pace && generateProblem(pace)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold py-3 rounded-xl text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" /> Reroll
                    </button>
                    <button 
                      onClick={() => setPhase(GamePhase.GUIDANCE)}
                      className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      Accept Challenge <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Phase 5: GUIDANCE */}
        {phase === GamePhase.GUIDANCE && (
          <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col h-full max-h-[650px] justify-center w-full max-w-2xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl p-8 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
              
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 border border-slate-700 mb-6 mx-auto shadow-inner">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-extrabold text-white text-center mb-6">One Last Thing...</h2>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8 text-slate-300 space-y-4 text-center leading-relaxed">
                <p>
                  To successfully submit your hack and get <strong>scored</strong>, you <strong>MUST</strong> push your project to a public <strong>GitHub repository</strong>.
                </p>
                <p className="text-sm text-slate-400">
                  Our AI judges will automatically pull your repository, analyze your code for innovation and execution, and evaluate your final product against the problem constraints.
                </p>
                <div className="pt-4 mt-4 border-t border-blue-500/10">
                  <p className="text-rose-400 font-bold text-sm">
                    * Failure to provide a valid public GitHub URL during submission will result in an automatic score of 0.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setPhase(GamePhase.PROBLEM_REVEAL)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                >
                  Back
                </button>
                <button 
                  onClick={() => router.push('/import')}
                  className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-lg shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  I Understand, Let's Hack! <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

