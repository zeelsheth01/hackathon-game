"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Press_Start_2P } from 'next/font/google';

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
});

interface TerminalLine {
  id: number;
  text: React.ReactNode;
  isCommand?: boolean;
}

export function InteractiveTerminal() {
  return (
    <div className="w-full bg-[#13322b] text-ink rounded-xl border border-surface-subtle shadow-2xl flex flex-col min-h-[400px] overflow-hidden relative">
      
      {/* Terminal Window Header */}
      <div className="w-full bg-[#0d221d] text-mute flex items-center px-4 py-3 border-b border-[#1c473d]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400/80 hover:bg-red-400 cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400/80 hover:bg-yellow-400 cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-green-400/80 hover:bg-green-400 cursor-pointer"></div>
        </div>
        <div className="mx-auto font-mono text-[12px] opacity-70 tracking-wider text-white">
          bash — hackathon-game
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 py-12 px-8 flex flex-col items-center justify-between">
        
        {/* Pixel Font Wordmark */}
        <motion.div 
          className="flex-1 flex items-center justify-center cursor-crosshair w-full"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.h1 
            className={`${pixelFont.className} text-[#db7a60] text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-center select-none uppercase`}
            style={{ 
              textShadow: "2px 2px 0px #0a1b17, 4px 4px 0px #db7a60, 6px 6px 0px #0a1b17",
              lineHeight: '1.2'
            }}
            animate={{ opacity: [0.95, 1, 0.95] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            HACKATHON
            <br />
            GAME
          </motion.h1>
        </motion.div>

        <div className="w-full max-w-2xl mt-12 flex flex-col gap-6">
          {/* TUI Prompt Row */}
          <motion.div 
            className="bg-canvas border border-surface-subtle text-ink rounded-md px-4 py-3 text-[16px] flex flex-wrap items-center gap-3 cursor-text shadow-sm group"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <span className="text-accent font-bold">~</span>
            <span className="text-mute opacity-50">❯</span>
            <span className="font-mono">npm run dev</span>
            <span className="bg-surface px-2 py-0.5 rounded-sm text-accent opacity-80 group-hover:opacity-100 transition-opacity text-sm ml-auto">
              Ready in 631ms
            </span>
            <motion.span 
              className="w-2.5 h-5 bg-accent inline-block"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }}
            />
          </motion.div>

          {/* Keybindings */}
          <div className="flex items-center gap-6 text-[14px] text-ash justify-center mt-2">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 cursor-pointer bg-surface px-3 py-1 rounded-full border border-surface-subtle">
              <span className="font-bold text-ink">tab</span> switch role
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 cursor-pointer bg-surface px-3 py-1 rounded-full border border-surface-subtle">
              <span className="font-bold text-ink">ctrl-p</span> commands
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
