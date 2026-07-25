import { HeroSection } from "@/frontend/components/landing/HeroSection";
import { ArchitectureShowcase } from "@/frontend/components/landing/ArchitectureShowcase";
import { GuidanceSection } from "@/frontend/components/landing/GuidanceSection";
import { LiveTicker } from "@/frontend/components/landing/LiveTicker";
import { getRecentRuns } from "@/app/actions/getRecentRuns";

export default async function HomePage() {
  const recentRuns = await getRecentRuns();

  return (
    <main className="min-h-screen bg-canvas text-ink flex flex-col">
      <div className="flex-1">
        <HeroSection />
        <ArchitectureShowcase />
        <GuidanceSection />
      </div>
      <LiveTicker initialRuns={recentRuns} />
    </main>
  );
}

