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
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-14 flex items-center px-8 border-b border-white/5 shrink-0 bg-white/5 backdrop-blur-md justify-between">
                <div className="flex items-center">
                    <Target className="w-5 h-5 text-teal-400 mr-3" />
                    <h1 className="text-lg font-bold text-white font-syne tracking-wide">Objectives & Key Results</h1>
                    <span className="ml-3 text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">
                        {objectives.length}
                    </span>
                </div>

                <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-xs font-medium transition-colors border border-teal-500/20">
                    <Plus className="w-3.5 h-3.5" />
                    New Objective
                </button>
            </div>

            {/* OKR Grid */}
            <div className="flex-1 overflow-y-auto p-8">
                {objectives.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                        <Target className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-sm">No active objectives. Set your goals!</p>
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
