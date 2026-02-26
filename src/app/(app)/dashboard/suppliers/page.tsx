import { SuppliersManager } from '@/components/dashboard/suppliers-manager';
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata = {
    title: 'Suppliers — SAT Connect',
    description: 'Manage tour suppliers and provider profiles',
};

export default async function SuppliersPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const roleRaw = (user.publicMetadata?.role as string) || "super_admin";
    const isAdmin = roleRaw === "admin";
    const isSuperAdmin = roleRaw === "super_admin";

    if (!isAdmin && !isSuperAdmin) {
        redirect("/dashboard");
    }

    return (
        <main className="p-6 max-w-7xl mx-auto">
            <SuppliersManager />
        </main>
    );
}
