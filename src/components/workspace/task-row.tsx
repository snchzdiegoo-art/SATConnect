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
        high: "text-rose-500 bg-rose-500/10 border-rose-500/20",
        medium: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        low: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        none: "text-gray-500 hover:text-gray-400",
    }[task.priority] || "text-gray-500";

    return (
        <div className={cn(
            "group flex items-start gap-3 py-3 px-4 rounded-xl transition-all duration-200 border border-transparent",
            "hover:bg-white/[0.03] hover:border-white/[0.05]",
            isCompleted && "opacity-50 hover:opacity-70"
        )}>
            {/* Drag Handle (Visual only for now) */}
            <div className="mt-1 text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                <GripVertical className="w-4 h-4" />
            </div>

            {/* Checkbox */}
            <button
                onClick={handleToggle}
                className={cn(
                    "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    isCompleted
                        ? "bg-teal-500 border-teal-500 scale-100 shadow-[0_0_10px_rgba(41,255,198,0.3)]"
                        : "border-gray-600 hover:border-teal-400 bg-transparent"
                )}
            >
                <Check className={cn(
                    "w-3 h-3 text-black stroke-[3.5] transition-transform duration-300",
                    isCompleted ? "scale-100" : "scale-0"
                )} />
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col pt-0.5">
                <span className={cn(
                    "text-sm font-medium transition-all duration-300 truncate select-none",
                    isCompleted ? "text-gray-500 line-through decoration-gray-600 decoration-1" : "text-gray-200"
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
                                "text-[10px] flex items-center gap-1 px-1.5 py-0.5 rounded border border-transparent",
                                new Date(task.due_date) < new Date() && !isCompleted ? "text-rose-400 bg-rose-500/10 border-rose-500/20" : "text-gray-500 bg-white/5"
                            )}>
                                <CalendarIcon className="w-3 h-3" />
                                {new Date(task.due_date).toLocaleDateString("es-MX", { day: 'numeric', month: 'short' })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Actions (Hover) */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <button
                    onClick={handleDelete}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
