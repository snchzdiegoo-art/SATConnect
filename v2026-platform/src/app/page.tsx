import { HeroHome } from "@/components/hero-home";
import { ProblemSolution } from "@/components/problem-solution";
import { PricingTable } from "@/components/pricing-table";
import { BenchmarkingTable } from "@/components/benchmarking-table";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main>
      <HeroHome />
      <ProblemSolution />
      <PricingTable />

      {/* Reusing the Benchmarking Table as "Guerra contra Excel" section */}
      <div className="bg-gray-950 py-10">
        <BenchmarkingTable />
      </div>

      <Footer />
    </main>
  );
}
