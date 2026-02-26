import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TaskRow } from "@/components/workspace/task-row";
import { QuickAdd } from "@/components/workspace/quick-add";
import { Inbox } from "lucide-react";

export default async function InboxPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    // Fetch inbox tasks
    const tasks = await prisma.task.findMany({
        where: {
            assignee_id: userId,
            status: "inbox",
        },
        orderBy: { created_at: "desc" },
    });

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-black via-[#070b14] to-[#070b14] relative">
            {/* Tech Pattern Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)' }} />

            {/* Header */}
            <div className="h-16 flex items-center px-8 border-b border-white/10 shrink-0 bg-black/40 backdrop-blur-xl sticky top-0 z-10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <Inbox className="w-5 h-5 text-teal-600 dark:text-teal-400 mr-3" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Inbox</h1>
                <span className="ml-3 text-xs bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400 px-2.5 py-0.5 rounded-full font-medium">
                    {tasks.length}
                </span>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                <div className="max-w-2xl mx-auto">
                    {tasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
                            <Inbox className="w-12 h-12 mb-4 opacity-30" />
                            <p className="text-sm font-medium">Todo limpio, ¡bien hecho!</p>
                        </div>
                    ) : (
                        <div className="bg-white/[0.02] border border-white/10 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-md relative">
                            {/* Circuit traces top edge */}
                            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent opacity-50"></div>
                            {tasks.map((task: any) => (
                                <TaskRow key={task.id} task={task} />
                            ))}
                        </div>
                    )}

                    {/* Quick Add */}
                    <div className="pt-2">
                        <QuickAdd />
                    </div>
                </div>
            </div>
        </div>
    );
}
