"use client";

import Link from "next/link";
import { InteractiveTerminal } from "@/frontend/components/landing/InteractiveTerminal";

export function HeroSection() {
  return (
    <section className="flex flex-col pt-24 pb-24 border-b border-hairline">
      <div className="w-full max-w-[1100px] mx-auto px-4 md:px-8">
        
        <div className="mb-8">
          <h1 className="text-[38px] font-bold leading-[1.5] text-ink max-w-2xl mb-6">
            The open source AI coding agent simulation
          </h1>
          <p className="text-[16px] text-body leading-[1.5] max-w-2xl mb-8">
            A high-stakes, decision-driven technical simulation. Architect your stack, manage scope creep, impress the AI judges, and survive the 14-stage development lifecycle.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/auth/signin">
              <button className="bg-primary text-on-primary font-bold text-[16px] leading-[2] rounded-sm px-[24px] py-[4px] h-[40px] hover:bg-ink-deep hover:shadow-lg transition-all flex items-center gap-2 group">
                <span className="text-accent opacity-70 font-mono group-hover:opacity-100 transition-opacity">{'>'}</span> Start Hacking <span className="font-mono animate-pulse inline-block w-2 h-4 bg-on-primary ml-1 opacity-80"></span>
              </button>
            </Link>
          </div>
        </div>

        <InteractiveTerminal />

      </div>
    </section>
  );
}

