"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
      <div className="min-h-screen flex items-center justify-center bg-canvas text-ink text-[16px]">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-canvas text-ink">
      <div className="w-full max-w-md border border-hairline bg-canvas rounded-none p-8">
        
        <div className="mb-8">
          <h1 className="text-[16px] font-bold text-ink mb-2">
            [+] Complete Registration
          </h1>
          <p className="text-[14px] text-body">
            Set a password for your account to enable future login via Game ID.
          </p>
        </div>

        {success ? (
          <div className="bg-surface-soft border border-success rounded-sm p-6 text-center">
            <h3 className="text-success font-bold text-[16px] mb-2">[✓] Password Saved</h3>
            <p className="text-ink text-[14px]">Redirecting you to log in...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-surface-soft rounded-sm p-4 border border-hairline flex items-center justify-between">
              <div>
                <p className="text-mute text-[14px] font-bold uppercase tracking-wider mb-1">Your Game ID</p>
                <p className="text-ink font-mono text-[16px] font-bold">{hackerId}</p>
                <p className="text-mute text-[14px] mt-2">Copy this! You will need it to sign in later.</p>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 border border-hairline bg-canvas hover:bg-surface-soft rounded-sm transition-colors text-[14px] text-ink"
                title="Copy Game ID"
              >
                {isCopied ? "[Copied]" : "[Copy]"}
              </button>
            </div>

            {error && (
              <div className="bg-surface-soft border border-danger rounded-sm p-3 text-center">
                <p className="text-danger text-[14px]">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[14px] font-medium text-ink mb-1">Set a Password</label>
              <input 
                type="password"
                placeholder="Minimum 6 characters"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-surface-soft text-ink border border-hairline rounded-sm py-2 px-3 text-[16px] focus:bg-canvas focus:border-ink focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-on-primary font-medium text-[16px] leading-[2] rounded-sm py-1 px-4 hover:bg-ink-deep transition-colors disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
