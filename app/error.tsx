"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Terminal } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Production Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-red-500/10 p-4 rounded-full mb-6">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>
      <h1 className="text-3xl font-extrabold text-white mb-4">Critical System Failure</h1>
      <p className="text-slate-400 max-w-md mb-8">
        The simulation encountered an unexpected runtime error. We've logged this event for the sysadmins.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors"
        >
          Reboot System
        </button>
        <Link href="/" className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
          <Terminal className="w-5 h-5" />
          Return to Hub
        </Link>
      </div>
    </div>
  );
}
