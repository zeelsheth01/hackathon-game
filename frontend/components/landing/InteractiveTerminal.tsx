"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface TerminalLine {
  id: number;
  text: React.ReactNode;
  isCommand?: boolean;
}

export function InteractiveTerminal() {
  return (
    <div className="w-full bg-surface-dark text-on-dark rounded-none py-16 px-8 flex flex-col items-center justify-between min-h-[400px]">
      
      {/* ASCII Wordmark */}
      <div className="flex-1 flex items-center justify-center">
        <pre className="font-mono text-on-dark leading-tight tracking-widest text-[10px] sm:text-[14px] md:text-[20px] font-bold text-center select-none">
          {`
██   ██  █████   ██████ ██   ██  █████  ████████ ██   ██  ██████  ███    ██ 
██   ██ ██   ██ ██      ██  ██  ██   ██    ██    ██   ██ ██    ██ ████   ██ 
███████ ███████ ██      █████   ███████    ██    ███████ ██    ██ ██ ██  ██ 
██   ██ ██   ██ ██      ██  ██  ██   ██    ██    ██   ██ ██    ██ ██  ██ ██ 
██   ██ ██   ██  ██████ ██   ██ ██   ██    ██    ██   ██  ██████  ██   ████ 
          `}
        </pre>
      </div>

      <div className="w-full max-w-2xl mt-12 flex flex-col gap-6">
        {/* TUI Prompt Row */}
        <div className="bg-surface-dark-elevated text-on-dark rounded-sm px-3 py-2 text-[16px] flex items-center gap-3">
          <span className="text-mute opacity-50">│</span>
          <span>Build</span>
          <span className="bg-surface-dark px-2 py-0.5 rounded-sm text-accent opacity-80">Next.js</span>
          <span>Hackathon Game</span>
        </div>

        {/* Keybindings */}
        <div className="flex items-center gap-6 text-[14px] text-ash justify-center mt-4">
          <div className="flex items-center gap-2">
            <span className="font-bold">tab</span> switch role
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">ctrl-p</span> commands
          </div>
        </div>
      </div>
      
    </div>
  );
}
