"use client";

const features = [
  {
    title: "Next.js 15 App Router",
    description: "Built on the bleeding edge with React 19, Server Components, and optimized transitions.",
  },
  {
    title: "Global State Machine",
    description: "Complex 14-stage game loop managed entirely via Zustand with custom persist middleware, ensuring zero progress loss on reload.",
  },
  {
    title: "Mongoose x MongoDB",
    description: "Robust type-safe ORM tracking user scores, leaderboards, and hackathon projects.",
  },
  {
    title: "Generative AI Judges",
    description: "Dynamic end-game evaluations powered by OpenAI APIs. Virtual judges roast or praise your tech stack choices using tailored prompt personas.",
  },
];

export function ArchitectureShowcase() {
  return (
    <section id="architecture" className="py-24 px-4 md:px-8 border-b border-hairline bg-canvas">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="text-[16px] font-bold text-ink mb-6">
          [+] Architecture
        </h2>
        
        <div className="flex flex-col">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="py-2 bg-canvas text-body text-[16px] flex flex-col md:flex-row gap-2 md:gap-4"
            >
              <div className="font-bold text-ink whitespace-nowrap">
                [+] {feature.title}
              </div>
              <div className="text-body leading-[1.5]">
                {feature.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
