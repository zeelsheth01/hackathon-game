"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/frontend/store";
import { GamePhase, Pace } from "@/shared/types";
import { Loader2 } from "lucide-react";

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
    { name: "Frontend", tech: ["Next.js", "React", "Vue", "TailwindCSS"] },
    { name: "Backend", tech: ["Node.js", "Python", "Rust", "Go"] },
    { name: "Database", tech: ["PostgreSQL", "MongoDB", "Redis", "Supabase"] }
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
    return <div className="min-h-screen bg-canvas text-ink flex items-center justify-center">Loading...</div>;
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

  const steps = ["Profile", "Stack", "Pace", "Challenge", "Rules"];
  const currentStepIdx = [GamePhase.PROFILE_FORM, GamePhase.TECH_STACK, GamePhase.PACE_SELECTION, GamePhase.PROBLEM_REVEAL, GamePhase.GUIDANCE].indexOf(phase);

  return (
    <div className="h-screen w-full overflow-hidden bg-canvas text-ink flex flex-col items-center justify-center py-4 px-6 relative">
      <div className="max-w-2xl w-full mx-auto flex flex-col justify-center h-full max-h-[750px] space-y-4">
        
        {/* Step Indicator */}
        <div className="flex items-center text-[12px] font-mono text-mute mb-8 border-b border-hairline pb-2">
          {steps.map((step, idx) => {
            const isActive = idx === currentStepIdx;
            const isPast = idx < currentStepIdx;
            return (
              <div key={step} className={`flex items-center mr-4 ${isActive ? 'text-ink font-bold' : isPast ? 'text-body' : 'text-mute'}`}>
                <span>{isActive ? `[*] ${step}` : isPast ? `[+] ${step}` : `[ ] ${step}`}</span>
                {idx < steps.length - 1 && <span className="ml-4 text-hairline-strong">/</span>}
              </div>
            );
          })}
        </div>

        {/* Phase 1: Profile Form */}
        {phase === GamePhase.PROFILE_FORM && (
          <div className="bg-canvas border border-hairline p-8">
            <h2 className="text-[16px] font-bold text-ink mb-2">[+] Player Identity</h2>
            <p className="text-[14px] text-body mb-8">Confirm your details before entering the arena.</p>

            {/* User Info & Avatar Display */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-surface-soft border border-hairline p-4 mb-6 relative">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div 
                    className="w-12 h-12 border border-hairline bg-canvas cursor-pointer overflow-hidden flex items-center justify-center" 
                    onClick={() => setShowAvatarOptions(!showAvatarOptions)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${avatarBg}`} alt="Avatar" className="w-full h-full object-cover p-1" />
                  </div>
                </div>

                <div>
                  <div className="text-[12px] font-bold text-mute uppercase tracking-wider mb-0.5">Logged in as</div>
                  <div className="font-bold text-ink text-[14px]">{session?.user?.name || session?.user?.email || "Hacker"}</div>
                </div>
              </div>
              <div className="sm:text-right w-full sm:w-auto mt-4 sm:mt-0">
                <div className="text-[12px] font-bold text-mute uppercase tracking-wider mb-0.5">Gamer ID</div>
                <div className="font-mono font-bold text-ink text-[14px]">{(session?.user as any)?.hackerId || "Unknown"}</div>
              </div>

              {showAvatarOptions && (
                <div className="absolute top-[80px] left-0 z-40 bg-canvas p-3 border border-hairline shadow-sm">
                  <div className="grid grid-cols-4 gap-2">
                    {avatarOptions.map((bg, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAvatarBg(bg);
                          setShowAvatarOptions(false);
                        }}
                        className={`w-10 h-10 transition-all duration-300 overflow-hidden bg-surface-soft flex items-center justify-center border ${avatarBg === bg ? 'border-ink' : 'border-transparent hover:border-hairline-strong'}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${bg}`} alt="bot" className="w-3/4 h-3/4" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[14px] font-medium text-ink mb-1">Game Handle</label>
                  <input 
                    type="text" value={handle} onChange={(e) => setHandle(e.target.value)} required
                    className="w-full bg-surface-soft text-ink border border-hairline rounded-sm py-2 px-3 text-[16px] focus:bg-canvas focus:border-ink focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-ink mb-1">Role / Specialization</label>
                  <select 
                    value={title} onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-surface-soft text-ink border border-hairline rounded-sm py-2 px-3 text-[16px] focus:bg-canvas focus:border-ink focus:outline-none transition-colors"
                  >
                    <option value="">Select a role...</option>
                    <option value="Frontend Wizard">Frontend Wizard</option>
                    <option value="Backend Architect">Backend Architect</option>
                    <option value="Fullstack Ninja">Fullstack Ninja</option>
                    <option value="UI/UX Visionary">UI/UX Visionary</option>
                    <option value="Data Sorcerer">Data Sorcerer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-ink mb-1">GitHub Handle</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 border-hairline bg-surface-soft text-mute text-[14px]">@</span>
                    <input 
                      type="text" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="octocat"
                      className="flex-1 bg-surface-soft text-ink border border-hairline rounded-r-sm py-2 px-3 text-[16px] focus:bg-canvas focus:border-ink focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-ink mb-1">Discord Tag</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 border-hairline bg-surface-soft text-mute text-[14px]">#</span>
                    <input 
                      type="text" value={discord} onChange={(e) => setDiscord(e.target.value)} placeholder="hacker#1234"
                      className="flex-1 bg-surface-soft text-ink border border-hairline rounded-r-sm py-2 px-3 text-[16px] focus:bg-canvas focus:border-ink focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <button 
                  type="submit" 
                  className="w-full bg-primary text-on-primary font-medium text-[16px] leading-[2] rounded-sm py-2 px-4 hover:bg-ink-deep transition-colors"
                >
                  Continue to Stack Selection
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Phase 2: Tech Stack */}
        {phase === GamePhase.TECH_STACK && (
          <div className="bg-canvas border border-hairline p-8">
            <h2 className="text-[16px] font-bold text-ink mb-2">[+] Build Your Stack</h2>
            <p className="text-[14px] text-body mb-8">Type the technologies you'll use (e.g. Next.js, Rust, Tailwind) and hit Enter.</p>
            
            <form onSubmit={handleAddTech} className="mb-6 flex gap-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="e.g. Supabase"
                className="flex-1 bg-surface-soft text-ink border border-hairline rounded-sm py-2 px-3 text-[16px] focus:bg-canvas focus:border-ink focus:outline-none transition-colors"
              />
              <button 
                type="submit" 
                className="bg-surface-soft border border-hairline text-ink font-medium px-4 hover:bg-canvas transition-colors"
              >
                Add
              </button>
            </form>

            <div className="mb-6 space-y-6">
              <div className="flex justify-between items-center mb-1 border-b border-hairline pb-2">
                <span className="text-[12px] font-bold text-mute uppercase tracking-wider">Popular Categories</span>
                <button 
                  type="button"
                  onClick={handleRandomTech}
                  className="text-[12px] font-bold text-accent hover:text-ink transition-colors uppercase tracking-wider"
                >
                  [Randomize]
                </button>
              </div>
              <div className="flex flex-col gap-4 max-h-[200px] overflow-y-auto">
                {TECH_CATEGORIES.map(cat => (
                  <div key={cat.name} className="flex flex-col gap-2">
                    <div className="text-[12px] text-mute font-bold uppercase tracking-widest">
                      {cat.name}
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
                          className="px-3 py-1 text-[12px] border border-hairline bg-surface-soft text-ink hover:bg-canvas disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8 min-h-[60px] p-4 bg-surface-soft border border-hairline">
              {selectedTech.length === 0 ? (
                <span className="text-mute text-[14px]">No tech added yet.</span>
              ) : (
                selectedTech.map((tech) => (
                  <div key={tech} className="flex items-center gap-2 bg-canvas text-ink border border-hairline px-2 py-1 text-[12px]">
                    {tech}
                    <button onClick={() => removeSelectedTech(tech)} className="text-mute hover:text-danger transition-colors">
                      [x]
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between items-center border-t border-hairline pt-6">
              <button onClick={() => setPhase(GamePhase.PROFILE_FORM)} className="px-4 py-2 border border-hairline bg-surface-soft text-ink hover:bg-canvas transition-colors">
                Back
              </button>
              <button 
                onClick={() => setPhase(GamePhase.PACE_SELECTION)} 
                disabled={selectedTech.length === 0}
                className="bg-primary text-on-primary font-medium text-[16px] leading-[2] rounded-sm py-1 px-6 hover:bg-ink-deep transition-colors disabled:opacity-50"
              >
                Confirm Stack
              </button>
            </div>
          </div>
        )}

        {/* Phase 3: Pace Selection */}
        {phase === GamePhase.PACE_SELECTION && (
          <div className="bg-canvas border border-hairline p-8">
            <h2 className="text-[16px] font-bold text-ink mb-2">[+] Select Your Pace</h2>
            <p className="text-[14px] text-body mb-8">How intense do you want this hackathon to be?</p>
            <div className="grid gap-4 sm:grid-cols-3 mb-8">
              {[
                { type: 'HIGH' as Pace, title: "Sprint", desc: "Intense 24-hour fueled sprint." },
                { type: 'MEDIUM' as Pace, title: "Balanced", desc: "A solid weekend project pace." },
                { type: 'LOW' as Pace, title: "Chill", desc: "Relaxed evening session." }
              ].map(p => (
                <button
                  key={p.type}
                  onClick={() => generateProblem(p.type)}
                  className="bg-surface-soft border border-hairline p-4 text-left hover:bg-canvas transition-colors"
                >
                  <h3 className="text-[16px] font-bold text-ink mb-2">{p.title}</h3>
                  <p className="text-[12px] text-mute">{p.desc}</p>
                </button>
              ))}
            </div>
            <button onClick={() => setPhase(GamePhase.TECH_STACK)} className="px-4 py-2 border border-hairline bg-surface-soft text-ink hover:bg-canvas transition-colors">
              Back
            </button>
          </div>
        )}

        {/* Phase 4: Problem Reveal */}
        {phase === GamePhase.PROBLEM_REVEAL && (
          <div className="flex flex-col h-full max-h-[650px] justify-center">
            {isLoading || !selectedProblem ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-6">
                <Loader2 className="w-12 h-12 text-ink animate-spin" />
                <h2 className="text-[16px] font-bold text-ink">
                  <MatrixText text="GENERATING A DIRECTIVE..." />
                </h2>
              </div>
            ) : (
              <div className="bg-canvas border border-hairline flex flex-col max-h-full">
                {/* Fixed Header */}
                <div className="bg-surface-soft p-6 border-b border-hairline shrink-0">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-0.5 border border-hairline text-ink text-[10px] font-bold uppercase tracking-wider">
                      {selectedProblem.category}
                    </span>
                    <span className="px-2 py-0.5 border border-hairline text-ink text-[10px] font-bold uppercase tracking-wider">
                      {selectedProblem.difficulty}
                    </span>
                  </div>
                  <h1 className="text-[20px] font-bold text-ink mb-2">{selectedProblem.title}</h1>
                  <p className="text-[14px] text-body leading-relaxed">{selectedProblem.description}</p>
                </div>
                
                {/* Scrollable Body */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-canvas">
                  <div>
                    <h3 className="text-[12px] font-bold text-mute uppercase tracking-wider mb-3">Constraints</h3>
                    <ul className="space-y-2 text-[14px]">
                      {selectedProblem.constraints.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-ink">
                          <span className="text-mute">[-]</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[12px] font-bold text-mute uppercase tracking-wider mb-3">Bonus Objectives</h3>
                    <ul className="space-y-2 text-[14px]">
                      {selectedProblem.bonusObjectives.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-ink">
                          <span className="text-accent">[+]</span> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Fixed Footer */}
                <div className="p-4 border-t border-hairline shrink-0 bg-surface-soft">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => pace && generateProblem(pace)}
                      className="flex-1 bg-canvas border border-hairline text-ink font-bold py-2 text-[14px] hover:bg-surface-soft transition-colors"
                    >
                      [Reroll]
                    </button>
                    <button 
                      onClick={() => setPhase(GamePhase.GUIDANCE)}
                      className="flex-[2] bg-primary text-on-primary font-bold py-2 text-[14px] hover:bg-ink-deep transition-colors"
                    >
                      Accept Challenge
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Phase 5: GUIDANCE */}
        {phase === GamePhase.GUIDANCE && (
          <div className="bg-canvas border border-hairline p-8">
            <h2 className="text-[20px] font-bold text-ink text-center mb-6">One Last Thing...</h2>
            
            <div className="bg-surface-soft border border-hairline p-6 mb-8 text-ink space-y-4 text-center leading-relaxed text-[14px]">
              <p>
                To successfully submit your hack and get <strong>scored</strong>, you <strong>MUST</strong> push your project to a public <strong>GitHub repository</strong>.
              </p>
              <p className="text-body">
                Our AI judges will automatically pull your repository, analyze your code for innovation and execution, and evaluate your final product against the problem constraints.
              </p>
              <div className="pt-4 mt-4 border-t border-hairline">
                <p className="text-danger font-bold text-[12px]">
                  * Failure to provide a valid public GitHub URL during submission will result in an automatic score of 0.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setPhase(GamePhase.PROBLEM_REVEAL)}
                className="flex-1 bg-canvas border border-hairline text-ink font-bold py-2 text-[14px] hover:bg-surface-soft transition-colors"
              >
                Back
              </button>
              <button 
                onClick={() => router.push('/import')}
                className="flex-[2] bg-primary text-on-primary font-bold py-2 text-[14px] hover:bg-ink-deep transition-colors"
              >
                I Understand, Let's Hack!
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

