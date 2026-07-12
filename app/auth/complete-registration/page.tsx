"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, KeyRound, CheckCircle2, Copy, Check } from "lucide-react";

export default function CompleteRegistrationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const hackerId = session?.user ? (session.user as any).hackerId || "HACK-XXXX" : "HACK-XXXX";

  const handleCopy = () => {
    navigator.clipboard.writeText(hackerId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          // Redirect to signin page to let them log in
          router.push("/auth/signin?tab=login");
        }, 2000);
      } else {
        setError(data.error || "Failed to set password");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen animate-pulse duration-1000"></div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md border border-slate-800 relative z-10 animate-in fade-in zoom-in-95 duration-700">
        
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-20 h-20 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center mb-4 shadow-inner">
            <KeyRound className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">
            Complete Registration
          </h1>
          <p className="text-slate-400 text-center text-sm">
            Set a password for your account to enable future login via Game ID.
          </p>
        </div>

        {success ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center animate-in zoom-in duration-300">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-green-400 font-bold text-lg mb-2">Password Saved!</h3>
            <p className="text-green-300/80 text-sm">Redirecting you to log in...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Your Game ID</p>
                <p className="text-white font-mono text-xl tracking-widest">{hackerId}</p>
                <p className="text-slate-500 text-xs mt-2">Copy this! You will need it to sign in later.</p>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700 flex-shrink-0"
                title="Copy Game ID"
              >
                {isCopied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-blue-400" />}
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Set a Password</label>
              <input 
                type="password"
                placeholder="Minimum 6 characters"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-extrabold py-4 rounded-xl hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Save Password"
              )}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
