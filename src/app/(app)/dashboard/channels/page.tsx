import { ChannelsManager } from '@/components/dashboard/channels-manager';
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata = {
    title: 'Distribution Channels — SAT Connect',
    description: 'Manage OTA distribution channels and commission rates',
};

export default async function ChannelsPage() {
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
            <ChannelsManager />
        </main>
    );
}
