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
            className="group relative flex flex-col p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:bg-gray-50/50 dark:hover:bg-white/[0.04] transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-md dark:shadow-none"
        >
            {/* Header Color Line */}
            <div
                className="absolute top-0 left-5 right-5 h-[3px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: project.color }}
            />

            <div className="flex justify-between items-start mb-4 pt-2">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-white/80 group-hover:text-gray-900 dark:group-hover:text-white group-hover:bg-gray-200 dark:group-hover:bg-white/10 transition-colors">
                    <FolderOpen className="w-5 h-5" />
                </div>
                <button className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-syne mb-1 truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors tracking-tight">
                {project.title}
            </h3>

            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 h-8 leading-relaxed font-medium">
                {project.description || "Sin descripción proporcionada."}
            </p>

            {/* Progress */}
            <div className="mt-auto space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:group-hover:text-gray-400">
                    <span>Progreso</span>
                    <span>{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%`, backgroundColor: project.color }}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {project.due_date ? new Date(project.due_date).toLocaleDateString() : "Sin fecha"}
                </div>
                <div className="text-[10px] font-bold text-gray-400 dark:text-white/40 flex items-center gap-1 group-hover:text-teal-600 dark:group-hover:text-teal-400/80 transition-colors uppercase tracking-widest">
                    {taskCount} tareas <ArrowRight className="w-3.5 h-3.5" />
                </div>
            </div>
        </Link>
    );
}
