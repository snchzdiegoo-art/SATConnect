import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { UsersTable } from "./users-table";
import { Shield, ArrowLeft } from "lucide-react";

export default async function UsersPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    // Get Clerk email for whitelist fallback
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId!);
    const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
    const isSuperAdminByEmail = email === "snchzdiegoo@gmail.com" || email.endsWith("@satmexico.com");

    // Also check DB role
    const dbUser = await prisma.user.findUnique({ where: { id: userId! } });
    const isSuperAdmin = dbUser?.role === "super_admin" || isSuperAdminByEmail;
    if (!isSuperAdmin) redirect("/dashboard");

    const users = await prisma.user.findMany({
        orderBy: [{ role: "asc" }, { created_at: "desc" }],
    });

    return (
        <div className="space-y-2">
            {/* Header row: back button + badge */}
            <div className="flex items-center gap-3 mb-4">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                    Dashboard
                </Link>
                <span className="text-gray-600">•</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
                    <Shield className="h-3 w-3" />
                    Zona de Super Admin
                </span>
            </div>
            <UsersTable users={users as any} currentUserId={userId!} />
        </div>
    );
}
