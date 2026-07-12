"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function LiveTicker({ initialRuns }: { initialRuns: string[] }) {
  const [tickerItems, setTickerItems] = useState(
    initialRuns.length > 0 ? initialRuns : ["No recent runs. Be the first hacker to top the leaderboard!"]
  );

  // In a real app, this would use SSE or WebSocket to push new runs to the front of the array
  useEffect(() => {
    if (tickerItems.length <= 1) return; // don't cycle if only 1 item
    
    const interval = setInterval(() => {
      setTickerItems((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, 5000); // cycle through for fun, though Framer motion handles the marquee

    return () => clearInterval(interval);
  }, [tickerItems.length]);

  return (
    <div className="w-full bg-blue-600/10 border-t border-blue-500/20 py-2 overflow-hidden flex items-center relative z-20 backdrop-blur-md">
      <div className="px-4 font-bold text-blue-400 text-xs tracking-wider uppercase border-r border-blue-500/30 flex-shrink-0 z-10 bg-slate-950/50 h-full flex items-center">
        Live Feed
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse ml-2" />
      </div>
      
      <div className="flex-1 overflow-hidden relative flex">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          className="flex whitespace-nowrap"
        >
          {/* Double the items to create a seamless infinite loop */}
          {[...tickerItems, ...tickerItems].map((run, i) => (
            <span key={i} className="mx-8 text-slate-300 font-mono text-sm inline-flex items-center">
              {run}
              <span className="mx-8 text-slate-700">|</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
