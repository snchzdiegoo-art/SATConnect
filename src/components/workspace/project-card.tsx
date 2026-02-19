"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { FolderOpen, Clock, MoreVertical, ArrowRight } from "lucide-react";

interface Project {
    id: number;
    title: string;
    description: string | null;
    color: string;
    icon: string;
    status: string;
    due_date: Date | null;
    _count?: {
        tasks: number;
    };
}

export function ProjectCard({ project }: { project: Project }) {
    const taskCount = project._count?.tasks ?? 0;
    // Placeholder progress for now (later we can calculate based on completed tasks)
    const progress = Math.floor(Math.random() * 100);

    return (
        <Link
            href={`/dashboard/workspace/projects/${project.id}`}
            className="group relative flex flex-col p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
        >
            {/* Header Color Line */}
            <div
                className="absolute top-0 left-5 right-5 h-[3px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: project.color }}
            />

            <div className="flex justify-between items-start mb-4 pt-2">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/80 group-hover:text-white group-hover:bg-white/10 transition-colors">
                    <FolderOpen className="w-5 h-5" />
                </div>
                <button className="text-gray-500 hover:text-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>

            <h3 className="text-lg font-bold text-white font-syne mb-1 truncate group-hover:text-teal-400 transition-colors">
                {project.title}
            </h3>

            <p className="text-xs text-gray-500 line-clamp-2 mb-6 h-8 leading-relaxed">
                {project.description || "No description provided."}
            </p>

            {/* Progress */}
            <div className="mt-auto space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-gray-500 group-hover:text-gray-400">
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%`, backgroundColor: project.color }}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <Clock className="w-3 h-3" />
                    {project.due_date ? new Date(project.due_date).toLocaleDateString() : "No Deadline"}
                </div>
                <div className="text-[10px] font-medium text-white/40 flex items-center gap-1 group-hover:text-teal-400/80 transition-colors">
                    {taskCount} tasks <ArrowRight className="w-3 h-3" />
                </div>
            </div>
        </Link>
    );
}
