import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DirectivesClient } from "./directives-client"

export const metadata = {
    title: "Core Directives & Brand Unification | SAT Connect",
    description: "Foundational rules for corporate image, language, and development.",
}

export default async function DirectivesPage() {
    const user = await currentUser()

    if (!user) {
        redirect("/sign-in")
    }

    const roleRaw = (user.publicMetadata?.role as string) || "super_admin"
    const isSuperAdmin = roleRaw === "super_admin"

    if (!isSuperAdmin) {
        redirect("/dashboard")
    }

    return (
        <DirectivesClient />
    )
}
