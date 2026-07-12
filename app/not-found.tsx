import Link from "next/link";
import { Terminal, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-blue-500/10 p-4 rounded-full mb-6">
        <SearchX className="w-12 h-12 text-blue-500" />
      </div>
      <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tighter">404</h1>
      <h2 className="text-xl font-bold text-slate-300 mb-2">Endpoint Not Found</h2>
      <p className="text-slate-500 max-w-md mb-8">
        The requested resource does not exist in this environment. Please check your API routes or navigation paths.
      </p>
      
      <Link href="/" className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
        <Terminal className="w-5 h-5" />
        Return to Safety
      </Link>
    </div>
  );
}
