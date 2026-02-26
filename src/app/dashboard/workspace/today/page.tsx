import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TaskRow } from "@/components/workspace/task-row";
import { QuickAdd } from "@/components/workspace/quick-add";
import { ListTodo, Calendar } from "lucide-react";

export default async function TodayPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch tasks due today (or overdue)
    const tasks = await prisma.task.findMany({
        where: {
            assignee_id: userId,
            status: { not: "done" }, // Only incomplete tasks
            due_date: {
                lte: tomorrow, // Less than tomorrow (i.e. today or earlier)
            },
        },
        orderBy: { due_date: "asc" },
    });

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-black via-[#070b14] to-[#070b14] relative">
            {/* Tech Pattern Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)' }} />

            {/* Header */}
            <div className="h-16 flex items-center px-8 border-b border-white/10 shrink-0 bg-black/40 backdrop-blur-xl sticky top-0 z-10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <ListTodo className="w-5 h-5 text-teal-400 mr-3 glow-teal" />
                <h1 className="text-xl font-bold text-white font-syne tracking-tight">Today</h1>
                <span className="ml-3 text-xs bg-white/10 text-gray-400 px-2.5 py-0.5 rounded-full font-medium">
                    {tasks.length}
                </span>
                <div className="ml-auto text-xs text-gray-500 flex items-center gap-2 font-medium tracking-wide">
                    <Calendar className="w-4 h-4 text-teal-500/50" />
                    {new Date().toLocaleDateString("es-MX", { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}
                </div>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                <div className="max-w-3xl mx-auto space-y-1">
                    {tasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                            <ListTodo className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-sm">Nada para hoy. ¡Disfruta el día!</p>
                        </div>
                    ) : (
                        tasks.map((task: any) => (
                            <TaskRow key={task.id} task={task} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
