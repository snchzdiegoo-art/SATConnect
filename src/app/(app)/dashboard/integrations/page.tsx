import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { IntegrationsClient } from "./integrations-client"
import { defaultIntegrations } from "./data"

export const metadata = {
    title: "Integrations & Intelligence | SAT Connect",
    description: "Internal intelligence and integration management for SAT Connect.",
}

export default async function IntegrationsPage() {
    const user = await currentUser()

    // Auth & Role check
    if (!user) {
        redirect("/sign-in")
    }

    const roleRaw = (user.publicMetadata?.role as string) || "super_admin"
    const isAdmin = roleRaw === "admin"
    const isSuperAdmin = roleRaw === "super_admin"

    // If neither admin nor super_admin, kick them back to dashboard
    if (!isAdmin && !isSuperAdmin) {
        redirect("/dashboard")
    }

    // Only super_admin can edit
    const canEdit = isSuperAdmin

    return (
        <IntegrationsClient
            initialIntegrations={defaultIntegrations}
            canEdit={canEdit}
        />
    )
}
