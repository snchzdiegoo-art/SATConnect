import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OkrCard } from "@/components/workspace/okr-card";
import { Target, Plus } from "lucide-react";

export default async function OkrsPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const objectives = await prisma.objective.findMany({
        where: {
            owner_id: userId,
        },
        include: {
            key_results: true,
        },
        orderBy: { created_at: "desc" },
    });

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-black via-[#070b14] to-[#070b14] relative">
            {/* Tech Pattern Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)' }} />

            {/* Header */}
            <div className="h-16 flex items-center px-8 border-b border-white/10 shrink-0 bg-black/40 backdrop-blur-xl sticky top-0 z-10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] justify-between">
                <div className="flex items-center">
                    <Target className="w-5 h-5 text-teal-400 mr-3 glow-teal" />
                    <h1 className="text-xl font-bold text-white font-syne tracking-tight">Objectives & Key Results</h1>
                    <span className="ml-3 text-xs bg-white/10 text-gray-400 px-2.5 py-0.5 rounded-full font-medium">
                        {objectives.length}
                    </span>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-xs font-bold tracking-wider transition-all border border-teal-500/30 shadow-[0_0_15px_rgba(41,255,198,0.1)]">
                    <Plus className="w-4 h-4" />
                    NEW OBJECTIVE
                </button>
            </div>

            {/* OKR Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                {objectives.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
                        <Target className="w-12 h-12 mb-4 opacity-30" />
                        <p className="text-sm font-medium">No active objectives. Set your goals!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {objectives.map((objective: any) => (
                            <OkrCard key={objective.id} objective={objective} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
