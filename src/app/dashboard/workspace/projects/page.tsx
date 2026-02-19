import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/workspace/project-card";
import { FolderOpen, Plus } from "lucide-react";

export default async function ProjectsPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const projects = await prisma.project.findMany({
        where: {
            owner_id: userId,
            status: "active",
        },
        include: {
            _count: {
                select: { tasks: true },
            },
        },
        orderBy: { updated_at: "desc" },
    });

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-14 flex items-center px-8 border-b border-white/5 shrink-0 bg-white/5 backdrop-blur-md justify-between">
                <div className="flex items-center">
                    <FolderOpen className="w-5 h-5 text-teal-400 mr-3" />
                    <h1 className="text-lg font-bold text-white font-syne tracking-wide">Projects</h1>
                    <span className="ml-3 text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">
                        {projects.length}
                    </span>
                </div>

                <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-xs font-medium transition-colors border border-teal-500/20">
                    <Plus className="w-3.5 h-3.5" />
                    New Project
                </button>
            </div>

            {/* Project Grid */}
            <div className="flex-1 overflow-y-auto p-8">
                {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                        <FolderOpen className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-sm">No active projects yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {projects.map((project: any) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
