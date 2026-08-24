"use client";

const steps = [
  {
    step: "01",
    title: "Authenticate",
    description: "Create your hacker identity by registering an account.",
  },
  {
    step: "02",
    title: "Survive the Dev Cycle",
    description: "Navigate through 14 intense stages of a hackathon. Make critical technical decisions, manage scope creep, and choose your tech stack wisely.",
  },
  {
    step: "03",
    title: "Face the AI Judges",
    description: "Submit your final project architecture to a panel of ruthless AI judges powered by Gemini. They will roast or praise your choices.",
  },
  {
    step: "04",
    title: "Climb the Leaderboard",
    description: "Earn points based on the viability, creativity, and stability of your project to secure your spot on the global leaderboard.",
  },
];

export function GuidanceSection() {
  return (
    <section id="guidance" className="py-24 px-4 md:px-8 border-b border-hairline bg-surface">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="text-[16px] font-bold text-ink mb-10">
          [+] How to Play
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.step} className="flex flex-col">
              <div className="font-mono text-4xl text-accent opacity-30 mb-4 font-bold">
                {step.step}
              </div>
              <h3 className="font-bold text-ink text-lg mb-2">
                {step.title}
              </h3>
              <p className="text-body leading-[1.6]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
