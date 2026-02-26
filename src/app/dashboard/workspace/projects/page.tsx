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
            <div className="h-14 flex items-center px-8 border-b border-gray-200 dark:border-white/5 shrink-0 bg-white dark:bg-black/20 justify-between">
                <div className="flex items-center">
                    <FolderOpen className="w-5 h-5 text-teal-600 dark:text-teal-400 mr-3" />
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white font-syne tracking-wide">Projects</h1>
                    <span className="ml-3 text-xs bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full font-medium">
                        {projects.length}
                    </span>
                </div>

                <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-teal-50 hover:bg-teal-100 dark:bg-teal-500/10 dark:hover:bg-teal-500/20 text-teal-700 dark:text-teal-400 text-xs font-bold tracking-wide transition-colors border border-teal-200 dark:border-teal-500/20">
                    <Plus className="w-3.5 h-3.5" />
                    New Project
                </button>
            </div>

            {/* Project Grid */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50 dark:bg-transparent">
                {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
                        <FolderOpen className="w-12 h-12 mb-4 opacity-30" />
                        <p className="text-sm font-medium">No active projects yet.</p>
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
