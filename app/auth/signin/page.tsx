"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { Loader2, Gamepad2, Mail, Lock, User, KeyRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950"><Loader2 className="w-12 h-12 text-blue-500 animate-spin" /></div>}>
      <SignInContent />
    </Suspense>
  );
}

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") === "login" ? "login" : "register";
  const [activeTab, setActiveTab] = useState<"register" | "login">(defaultTab);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    hackerId: "",
    password: ""
  });

  const handleGithubLogin = async () => {
    setIsGithubLoading(true);
    await signIn("github", { callbackUrl: "/auth/complete-registration" });
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsCredentialsLoading(true);
    
    try {
      const result = await signIn("credentials", {
        hackerId: formData.hackerId,
        password: formData.password,
        redirect: false
      });

      if (result?.error) {
        setError(result.error);
        setIsCredentialsLoading(false);
      } else {
        router.push("/game");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setIsCredentialsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen animate-pulse duration-1000"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] mix-blend-screen"></div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md border border-slate-800 relative z-10 animate-in fade-in zoom-in-95 duration-700">
        
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-20 h-20 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center mb-4 shadow-inner group">
            <Gamepad2 className="w-10 h-10 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">
            Hackathon Arena
          </h1>
          <p className="text-slate-400 text-center text-sm">
            Enter the arena and track your repositories in real-time.
          </p>
        </div>

        {/* Custom Tabs */}
        <div className="flex bg-slate-950 rounded-xl p-1 mb-8 border border-slate-800 relative">
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-slate-800 rounded-lg transition-transform duration-300 ease-out shadow-sm border border-slate-700/50 ${
              activeTab === "login" ? "translate-x-full" : "translate-x-0"
            }`} 
          />
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-3 text-sm font-bold relative z-10 transition-colors ${
              activeTab === "register" ? "text-white" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 text-sm font-bold relative z-10 transition-colors ${
              activeTab === "login" ? "text-white" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Sign In
          </button>
        </div>

        {activeTab === "register" ? (
          <div className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-300">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
              <p className="text-blue-300 text-sm font-medium">
                New players must link their GitHub account to fetch live repositories.
              </p>
            </div>
            
            <button
              onClick={handleGithubLogin}
              disabled={isGithubLoading}
              className="w-full bg-white text-slate-900 font-extrabold py-4 rounded-xl hover:bg-slate-200 hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isGithubLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              )}
              Continue with GitHub
            </button>
          </div>
        ) : (
          <form onSubmit={handleCredentialsLogin} className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center mb-4">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text"
                  placeholder="Game ID (HACK-XXXX)"
                  required
                  value={formData.hackerId}
                  onChange={e => setFormData({...formData, hackerId: e.target.value})}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="relative group">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isCredentialsLoading}
              className="w-full bg-blue-600 text-white font-extrabold py-4 rounded-xl hover:bg-blue-500 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 mt-6"
            >
              {isCredentialsLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
              Log Into Arena
            </button>
          </form>
        )}
        
        <p className="text-center text-slate-500 text-sm mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
