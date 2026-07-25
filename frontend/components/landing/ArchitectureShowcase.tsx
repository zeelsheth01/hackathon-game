"use client";

const features = [
  {
    title: "Hackathon Simulator",
    description: "Experience the brutal 24-hour development lifecycle in a high-stakes, 14-stage interactive simulation.",
  },
  {
    title: "AI Judge Panel",
    description: "Face a panel of ruthless virtual judges powered by Google Gemini. They will aggressively roast or praise your tech stack choices.",
  },
  {
    title: "Global Leaderboard",
    description: "Compete against developers worldwide. Track your score, analyze rival projects, and climb the ranks.",
  },
  {
    title: "GitHub Identity",
    description: "Seamlessly authenticate with your GitHub profile to showcase your real developer identity on the leaderboard.",
  },
];

export function ArchitectureShowcase() {
  return (
    <section id="features" className="py-24 px-4 md:px-8 border-b border-hairline bg-canvas">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="text-[16px] font-bold text-ink mb-6">
          [+] Game Features
        </h2>
        
        <div className="flex flex-col">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="py-2 bg-canvas text-body text-[16px] flex flex-col md:flex-row gap-2 md:gap-4"
            >
              <div className="font-bold text-ink whitespace-nowrap min-w-[200px]">
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
