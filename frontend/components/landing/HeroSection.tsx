"use client";

import { motion } from "framer-motion";
import { ArrowRight, Terminal, Code2, Cpu } from "lucide-react";
import Link from "next/link";
import { AnimatedText } from "@/frontend/components/ui/AnimatedText";

import { InteractiveTerminal } from "@/frontend/components/landing/InteractiveTerminal";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-10 px-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center">
        <div className="absolute w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[100px] opacity-50 mix-blend-multiply animate-pulse duration-[3000ms]" />
        <div className="absolute w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] opacity-50 mix-blend-multiply translate-x-1/2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium text-sm shadow-[0_0_15px_rgba(59,130,246,0.2)] backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          System Online. Ready for execution.
        </motion.div>

        <AnimatedText
          text="The Ultimate Hackathon Simulation"
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-lg"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed font-medium"
        >
          A high-stakes, decision-driven technical simulation. Architect your stack, manage scope creep, impress the AI judges, and survive the 14-stage development lifecycle.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link href="/auth/signin" className="group">
            <div className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
              <Terminal className="w-5 h-5" />
              Enter Simulation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          <a href="#architecture" className="group">
            <div className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900/50 text-white border border-slate-800 rounded-2xl font-bold text-lg hover:border-slate-700 hover:bg-slate-800 backdrop-blur-sm transition-all shadow-sm">
              <Code2 className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              View Architecture
            </div>
          </a>
        </motion.div>

        {/* Floating Interactive Terminal */}
        <div className="mt-20 relative w-full h-[300px] hidden md:block">
          <InteractiveTerminal />
        </div>
      </div>
    </section>
  );
}

