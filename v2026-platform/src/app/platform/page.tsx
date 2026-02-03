import { ThriveEngine } from "@/components/thrive-engine";
import { BenchmarkingTable } from "@/components/benchmarking-table";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";

export default function Platform() {
    return (
        <main>
            {/* HERO SECTION (Video Ready) */}
            <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gray-900">
                <div className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent"></div>

                <div className="relative z-10 container mx-auto px-6 text-center pt-24">
                    <Badge variant="purple" className="mb-6 inline-flex bg-purple-500/20 text-purple-300 border-purple-500/50">
                        <Layers className="mr-2 h-4 w-4" /> Infraestructura T.H.R.I.V.E.
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white">
                        La Plataforma <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-500">Inteligente</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
                        Más que un sistema de reservas. Un motor de crecimiento diseñado para escalar operaciones turísticas y erradicar el error humano.
                    </p>
                </div>
            </section>

            <BenchmarkingTable />
            <ThriveEngine />
        </main>
    );
}
