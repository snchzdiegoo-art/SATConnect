import { HeroHome } from "@/components/hero-home";
import { ThriveEngine } from "@/components/thrive-engine";

export default function Home() {
  return (
    <main>
      <HeroHome />
      <ThriveEngine />
      {/* 
         TODO: Migrate ThreeSteps, ProblemSolution, PricingTable components 
         and add them here to complete the page match.
         For the "Preview", Hero + Thrive is enough to verify migration success.
      */}
      <div className="py-20 text-center">
        <p className="text-gray-500">More sections coming...</p>
      </div>
    </main>
  );
}
