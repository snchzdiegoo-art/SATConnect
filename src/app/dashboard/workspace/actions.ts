"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const status = (formData.get("status") as string) || "inbox";
    const priority = (formData.get("priority") as string) || "none";

    if (!title) return;

    await prisma.task.create({
        data: {
            title,
            status,
            priority,
            assignee_id: userId,
        },
    });

    revalidatePath("/dashboard/workspace");
}

export async function updateTaskStatus(taskId: number, status: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await prisma.task.update({
        where: { id: taskId },
        data: {
            status,
            completed_at: status === "done" ? new Date() : null,
        },
    });

    revalidatePath("/dashboard/workspace");
}

export async function deleteTask(taskId: number) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await prisma.task.delete({
        where: { id: taskId },
    });

    revalidatePath("/dashboard/workspace");
}

export async function updateTaskPriority(taskId: number, priority: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await prisma.task.update({
        where: { id: taskId },
        data: { priority },
    });

    revalidatePath("/dashboard/workspace");
}
