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
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-14 flex items-center px-8 border-b border-white/5 shrink-0 bg-white/5 backdrop-blur-md">
                <Inbox className="w-5 h-5 text-teal-400 mr-3" />
                <h1 className="text-lg font-bold text-white font-syne tracking-wide">Inbox</h1>
                <span className="ml-3 text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">
                    {tasks.length}
                </span>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                <div className="max-w-3xl mx-auto space-y-1">
                    {tasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                            <Inbox className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-sm">Todo limpio, ¡bien hecho!</p>
                        </div>
                    ) : (
                        tasks.map((task: any) => (
                            <TaskRow key={task.id} task={task} />
                        ))
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
