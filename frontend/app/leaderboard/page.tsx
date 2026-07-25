import Link from "next/link";
import axios from "axios";

export const revalidate = 0; // Disable cache so it's always fresh

export default async function LeaderboardPage() {
  let scores: any[] = [];
  try {
    const res = await axios.get("http://localhost:5000/api/leaderboard/top");
    scores = res.data;
  } catch (err) {
    console.error("Failed to fetch leaderboard", err);
  }

  return (
    <main className="min-h-screen bg-canvas text-ink p-6 md:p-12">
      <div className="max-w-[800px] mx-auto border border-hairline bg-canvas">
        <header className="flex justify-between items-center p-6 border-b border-hairline bg-surface-soft">
          <h1 className="text-[16px] font-bold text-ink tracking-tight">[+] Global Leaderboard</h1>
          <Link 
            href="/"
            className="border border-hairline bg-canvas px-4 py-2 text-[14px] font-medium hover:bg-surface-soft transition-colors"
          >
            [Back]
          </Link>
        </header>
        
        <div className="p-0">
          {scores.length === 0 ? (
            <div className="text-center text-mute py-20 text-[14px]">
              No scores posted yet. Be the first to conquer the hackathon!
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex text-[12px] font-bold text-mute uppercase tracking-wider p-4 border-b border-hairline bg-surface-soft">
                <div className="w-16">Rank</div>
                <div className="flex-1">Hacker</div>
                <div className="w-32 text-right">Score</div>
              </div>
              
              {scores.map((entry: any, i: number) => (
                <div 
                  key={entry.id} 
                  className={`flex items-center p-4 transition-all border-b border-hairline last:border-b-0
                    ${i === 0 ? 'bg-surface-soft text-ink font-bold' : 'hover:bg-surface-soft'}
                  `}
                >
                  <div className={`w-16 text-[16px] font-mono
                    ${i === 0 ? 'text-accent' : 'text-mute'}
                  `}>
                    [{i + 1}]
                  </div>
                  
                  <div className="flex-1 text-[16px] text-ink">
                    {entry.userId?.name || entry.userId?.hackerId || "Anonymous Hacker"}
                  </div>
                  
                  <div className="w-32 text-right font-bold text-[16px] text-ink font-mono">
                    {entry.score}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

