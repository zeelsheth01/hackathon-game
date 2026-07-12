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
  const router = useRouter();
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: 1, text: "Windows PowerShell" },
    { id: 2, text: "Copyright (C) Microsoft Corporation. All rights reserved." },
    { id: 3, text: " " },
    { id: 4, text: "Type 'help' to see available commands." },
  ]);
  const [input, setInput] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setLines((prev) => [...prev, { id: Date.now(), text: `> ${trimmed}`, isCommand: true }]);

    setTimeout(() => {
      let response: React.ReactNode = "";
      switch (trimmed.toLowerCase()) {
        case "help":
          response = (
            <div className="text-slate-400">
              Available commands:
              <br />
              <span className="text-blue-400">start</span> - Initiate the hackathon simulation
              <br />
              <span className="text-blue-400">stack</span> - View system architecture
              <br />
              <span className="text-blue-400">whoami</span> - Identify current user profile
              <br />
              <span className="text-blue-400">clear</span> - Clear terminal output
            </div>
          );
          break;
        case "start":
          response = <span className="text-green-400">Initializing simulation bypass... Routing to Auth sequence...</span>;
          setTimeout(() => router.push("/auth/signin"), 1000);
          break;
        case "stack":
          response = (
            <div className="text-emerald-400">
              [✓] Next.js 15 App Router
              <br />
              [✓] Zustand Global State
              <br />
              [✓] Prisma & PostgreSQL
              <br />
              [✓] Generative AI Judges
            </div>
          );
          break;
        case "whoami":
          response = "guest_hacker_992 (unauthenticated)";
          break;
        case "clear":
          setLines([]);
          return;
        case "sudo":
          response = "nice try.";
          break;
        default:
          response = <span className="text-red-400">Command not found: {trimmed}</span>;
      }

      setLines((prev) => [...prev, { id: Date.now() + 1, text: response }]);
    }, 150);
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.9, duration: 0.8 }}
      className="absolute left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0c0c0c] rounded-t-lg border-t border-x border-slate-700 shadow-[0_-10px_50px_rgba(0,0,0,0.5)] p-0 overflow-hidden flex flex-col font-mono text-sm"
      onClick={focusInput}
    >
      {/* Windows Style Title Bar */}
      <div className="flex justify-between items-center shrink-0 bg-black px-4 py-2 select-none">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zm0 9h7v7h-7v-7zM4 13h7v7H4v-7z" />
          </svg>
          <span className="text-xs text-slate-300 font-sans tracking-wide">Windows PowerShell</span>
        </div>
        <div className="flex gap-4 text-slate-400">
          <span className="hover:text-white cursor-pointer text-lg leading-none mt-[-4px]">−</span>
          <span className="hover:text-white cursor-pointer text-sm leading-none mt-[1px] border border-slate-400 px-[1px]">□</span>
          <span className="hover:text-red-500 hover:bg-red-500/10 cursor-pointer text-sm leading-none mt-[1px] px-1 rounded">✕</span>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto scrollbar-hide text-left flex flex-col gap-1 pb-4 p-6"
        ref={terminalRef}
      >
        {lines.map((line) => (
          <div key={line.id} className={line.isCommand ? "text-slate-300" : "text-slate-400"}>
            {line.text}
          </div>
        ))}

        <div className="flex items-center text-slate-300 mt-2">
          <span className="text-blue-400 mr-2">PS C:\Users\hacker&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCommand(input);
                setInput("");
              }
            }}
            className="flex-1 bg-transparent border-none outline-none text-slate-200 caret-white"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </motion.div>
  );
}
