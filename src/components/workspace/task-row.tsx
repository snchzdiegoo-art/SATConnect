"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Check, Trash2, Calendar as CalendarIcon, Flag, GripVertical } from "lucide-react";
import { updateTaskStatus, deleteTask, updateTaskPriority } from "@/app/dashboard/workspace/actions";

interface Task {
    id: number;
    title: string;
    status: string;
    priority: string;
    due_date: Date | null;
}

export function TaskRow({ task }: { task: Task }) {
    const [isPending, startTransition] = useTransition();
    const [isCompleted, setIsCompleted] = useState(task.status === "done");

    const handleToggle = () => {
        setIsCompleted(!isCompleted);
        startTransition(async () => {
            // Artificial delay for animation
            await new Promise(resolve => setTimeout(resolve, 300));
            await updateTaskStatus(task.id, !isCompleted ? "done" : "inbox");
        });
    };

    const handleDelete = () => {
        if (confirm('Delete this task?')) {
            startTransition(async () => {
                await deleteTask(task.id);
            });
        }
    };

    const priorityColor = {
        high: "text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20",
        medium: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20",
        low: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20",
        none: "text-gray-500 hover:text-gray-600 dark:hover:text-gray-400",
    }[task.priority] || "text-gray-500";

    return (
        <div className={cn(
            "group flex items-start gap-4 py-3.5 px-5 transition-all duration-300 border border-transparent rounded-xl mb-1 relative overflow-hidden",
            "hover:bg-white/[0.02] hover:border-white/10 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]",
            isCompleted ? "opacity-40" : "bg-transparent"
        )}>
            {/* Hover Circuit Trace */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-teal-500/0 via-teal-400 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            {/* Drag Handle (Visual only for now) */}
            <div className="mt-1 -ml-2 text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                <GripVertical className="w-4 h-4" />
            </div>

            {/* Checkbox */}
            <button
                onClick={handleToggle}
                className={cn(
                    "mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 shadow-sm relative overflow-hidden",
                    isCompleted
                        ? "bg-teal-500/20 border-teal-500 shadow-[0_0_15px_rgba(41,255,198,0.3)]"
                        : "border-gray-600 hover:border-teal-400 hover:shadow-[0_0_10px_rgba(41,255,198,0.2)] bg-black/20"
                )}
            >
                <Check className={cn(
                    "w-3.5 h-3.5 text-teal-400 stroke-[3] transition-transform duration-300",
                    isCompleted ? "scale-100" : "scale-0"
                )} />
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col pt-0.5">
                <span className={cn(
                    "text-sm font-medium transition-all duration-300 truncate select-none",
                    isCompleted ? "text-gray-400 dark:text-gray-500 line-through decoration-gray-300 dark:decoration-gray-600" : "text-gray-900 dark:text-gray-100"
                )}>
                    {task.title}
                </span>

                {/* Metadata Row */}
                {(task.due_date || task.priority !== 'none') && (
                    <div className="flex items-center gap-2 mt-1.5">
                        {task.priority !== 'none' && (
                            <div className={cn("text-[10px] flex items-center gap-1 uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border", priorityColor)}>
                                <Flag className="w-3 h-3 fill-current" />
                                {task.priority}
                            </div>
                        )}
                        {task.due_date && (
                            <div className={cn(
                                "text-[10px] flex items-center gap-1 px-1.5 py-0.5 rounded border font-medium",
                                new Date(task.due_date) < new Date() && !isCompleted
                                    ? "text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20"
                                    : "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-transparent"
                            )}>
                                <CalendarIcon className="w-3 h-3" />
                                {new Date(task.due_date).toLocaleDateString("es-MX", { day: 'numeric', month: 'short' })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Assignee Avatar (Placeholder until integrated with users) */}
            <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-[9px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-[#0a0f1e] opacity-70 group-hover:opacity-100 transition-opacity">
                    DS
                </div>
            </div>

            {/* Actions (Hover) */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center ml-1">
                <button
                    onClick={handleDelete}
                    className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-rose-600 dark:hover:text-red-400 hover:bg-rose-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
