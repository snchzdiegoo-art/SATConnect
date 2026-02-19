"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function syncUsersFromClerk() {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Not authenticated" };

    try {
        const client = await clerkClient();
        const clerkUsers = await client.users.getUserList({ limit: 100 });

        let syncCount = 0;
        for (const clerkUser of clerkUsers.data) {
            const email = clerkUser.emailAddresses[0]?.emailAddress;
            if (!email) continue;

            let role = "viewer";
            let status = "pending";

            // Only Diego's specific email gets super_admin by default
            if (clerkUser.publicMetadata?.role === "super_admin" || email === "snchzdiegoo@gmail.com") {
                role = "super_admin";
                status = "active";
            } else if (email.endsWith("@satmexico.com")) {
                // New @satmexico.com users start as editor/active
                // (role can be changed in the Users panel)
                role = "editor";
                status = "active";
            }

            await prisma.user.upsert({
                where: { id: clerkUser.id },
                update: {
                    // Only update contact/profile fields — do NOT overwrite role/status
                    // so manual changes made in the Users panel are preserved
                    email,
                    first_name: clerkUser.firstName,
                    last_name: clerkUser.lastName,
                    image_url: clerkUser.imageUrl,
                    last_sign_in_at: new Date(clerkUser.lastSignInAt || Date.now()),
                },
                create: {
                    id: clerkUser.id,
                    email,
                    first_name: clerkUser.firstName,
                    last_name: clerkUser.lastName,
                    image_url: clerkUser.imageUrl,
                    role,
                    status,
                    last_sign_in_at: new Date(clerkUser.lastSignInAt || Date.now()),
                },
            });
            syncCount++;
        }

        revalidatePath("/dashboard/users");
        return { success: true, count: syncCount };
    } catch (error) {
        console.error("Error syncing users:", error);
        return { success: false, error: "Failed to sync users" };
    }
}

export async function updateUserRole(userId: string, role: string) {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) return { success: false, error: "Not authenticated" };

    // Only allow super admins to change roles
    const currentUser = await prisma.user.findUnique({ where: { id: currentUserId } });
    if (!currentUser || currentUser.role !== "super_admin") {
        return { success: false, error: "Unauthorized" };
    }

    await prisma.user.update({ where: { id: userId }, data: { role } });
    revalidatePath("/dashboard/users");
    return { success: true };
}

export async function updateUserStatus(userId: string, status: string) {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) return { success: false, error: "Not authenticated" };

    const currentUser = await prisma.user.findUnique({ where: { id: currentUserId } });
    if (!currentUser || currentUser.role !== "super_admin") {
        return { success: false, error: "Unauthorized" };
    }

    await prisma.user.update({ where: { id: userId }, data: { status } });
    revalidatePath("/dashboard/users");
    return { success: true };
}
