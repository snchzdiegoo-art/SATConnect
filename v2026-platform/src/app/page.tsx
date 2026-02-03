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
      <BenchmarkingTable />
      <Footer />
    </main>
  );
}
