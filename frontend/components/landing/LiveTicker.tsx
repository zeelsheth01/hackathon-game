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
    <div className="w-full bg-canvas border-t border-hairline py-3 overflow-hidden flex items-center relative z-20">
      <div className="px-4 font-bold text-ink text-[14px] uppercase border-r border-hairline flex-shrink-0 z-10 h-full flex items-center bg-canvas">
        [+] Live
      </div>
      
      <div className="flex-1 overflow-hidden relative flex">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          className="flex whitespace-nowrap"
        >
          {/* Double the items to create a seamless infinite loop */}
          {[...tickerItems, ...tickerItems].map((run, i) => (
            <span key={i} className="mx-8 text-body text-[14px] inline-flex items-center">
              {run}
              <span className="mx-8 text-mute">|</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
