"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-canvas text-ink">Loading...</div>}>
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
    <main className="min-h-screen flex items-center justify-center p-6 bg-canvas text-ink">
      <div className="w-full max-w-md border border-hairline bg-canvas rounded-none p-8">
        
        <div className="mb-8">
          <h1 className="text-[16px] font-bold text-ink mb-2">
            [+] Authentication
          </h1>
          <p className="text-[14px] text-body">
            Identify yourself to the simulation.
          </p>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-hairline-strong mb-8">
          <button
            onClick={() => setActiveTab("register")}
            className={`px-4 py-2 text-[16px] font-medium transition-colors border-b-2 ${
              activeTab === "register" ? "text-ink border-ash" : "text-mute border-transparent hover:text-ink"
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setActiveTab("login")}
            className={`px-4 py-2 text-[16px] font-medium transition-colors border-b-2 ${
              activeTab === "login" ? "text-ink border-ash" : "text-mute border-transparent hover:text-ink"
            }`}
          >
            Sign In
          </button>
        </div>

        {activeTab === "register" ? (
          <div className="space-y-6">
            <div className="bg-surface-soft border border-hairline rounded-sm p-4 text-[14px] text-ink">
              New players must link their GitHub account to fetch live repositories.
            </div>
            
            <button
              onClick={handleGithubLogin}
              disabled={isGithubLoading}
              className="w-full bg-primary text-on-primary font-medium text-[16px] leading-[2] rounded-sm py-1 px-4 hover:bg-ink-deep transition-colors disabled:opacity-50"
            >
              {isGithubLoading ? "Connecting..." : "Continue with GitHub"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleCredentialsLogin} className="space-y-6">
            {error && (
              <div className="bg-surface-soft border border-danger rounded-sm p-3 text-[14px] text-danger">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-[14px] font-medium text-ink mb-1">Game ID</label>
                <input 
                  type="text"
                  placeholder="HACK-XXXX"
                  required
                  value={formData.hackerId}
                  onChange={e => setFormData({...formData, hackerId: e.target.value})}
                  className="w-full bg-surface-soft text-ink border border-hairline rounded-sm py-2 px-3 text-[16px] focus:bg-canvas focus:border-ink focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[14px] font-medium text-ink mb-1">Password</label>
                <input 
                  type="password"
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-surface-soft text-ink border border-hairline rounded-sm py-2 px-3 text-[16px] focus:bg-canvas focus:border-ink focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isCredentialsLoading}
              className="w-full bg-primary text-on-primary font-medium text-[16px] leading-[2] rounded-sm py-1 px-4 hover:bg-ink-deep transition-colors disabled:opacity-50"
            >
              {isCredentialsLoading ? "Authenticating..." : "Log Into Arena"}
            </button>
          </form>
        )}
        
        <p className="text-center text-mute text-[14px] mt-8 pt-4 border-t border-hairline">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
