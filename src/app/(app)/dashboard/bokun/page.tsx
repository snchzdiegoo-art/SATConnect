import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BokunClient } from "./bokun-client";

export const metadata = {
    title: "Bókun Command Center | SAT Connect",
    description: "Manage Bókun API synchronization, webhooks, and rate limits.",
};

export default async function BokunPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const roleRaw = (user.publicMetadata?.role as string) || "super_admin";
    const isSuperAdmin = roleRaw === "super_admin";

    if (!isSuperAdmin) {
        redirect("/dashboard");
    }

    return <BokunClient />;
}
