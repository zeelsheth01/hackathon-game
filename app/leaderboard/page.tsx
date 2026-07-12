import { prisma } from "@/backend/db";
import Link from "next/link";

export const revalidate = 0; // Disable cache so it's always fresh

export default async function LeaderboardPage() {
  const scores = await prisma.leaderboard.findMany({
    take: 50,
    orderBy: { score: 'desc' },
    include: {
      user: { select: { name: true } }
    }
  });

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto flex flex-col">
      <header className="flex justify-between items-center py-6 mb-8 border-b border-slate-200">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Global Leaderboard</h1>
        <Link 
          href="/"
          className="bg-slate-200 text-slate-800 px-6 py-3 rounded-lg font-bold hover:bg-slate-300 transition-colors"
        >
          BACK TO HOME
        </Link>
      </header>
      
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-xl flex-1">
        {scores.length === 0 ? (
          <div className="text-center text-slate-500 py-20 italic">
            No scores posted yet. Be the first to conquer the hackathon!
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 px-4">
              <div className="w-16">Rank</div>
              <div className="flex-1">Hacker</div>
              <div className="w-32 text-right">Score</div>
            </div>
            
            {scores.map((entry: any, i: number) => (
              <div 
                key={entry.id} 
                className={`flex items-center p-4 rounded-xl transition-all hover:bg-slate-50 border border-transparent hover:border-slate-100
                  ${i === 0 ? 'bg-yellow-50/50 border-yellow-200/50 shadow-sm' : ''}
                  ${i === 1 ? 'bg-slate-50 border-slate-200 shadow-sm' : ''}
                  ${i === 2 ? 'bg-orange-50/30 border-orange-200/50 shadow-sm' : ''}
                `}
              >
                <div className={`w-16 font-black text-2xl
                  ${i === 0 ? 'text-yellow-500' : ''}
                  ${i === 1 ? 'text-slate-400' : ''}
                  ${i === 2 ? 'text-orange-500' : ''}
                  ${i > 2 ? 'text-slate-300 text-xl' : ''}
                `}>
                  #{i + 1}
                </div>
                
                <div className="flex-1 font-bold text-lg text-slate-700">
                  {entry.user.name || "Anonymous Hacker"}
                </div>
                
                <div className="w-32 text-right font-black text-2xl text-slate-800 font-mono">
                  {entry.score}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

