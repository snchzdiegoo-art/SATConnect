import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { RRSSClient } from "./rrss-client"

export const metadata = {
    title: "RRSS & Itinerary Operations | SAT Connect",
    description: "Manage social media publishing, itineraries, and automation hooks.",
}

export default async function RRSSPage() {
    const user = await currentUser()

    // Auth & Role check
    if (!user) {
        redirect("/sign-in")
    }

    const roleRaw = (user.publicMetadata?.role as string) || "super_admin"
    const isSuperAdmin = roleRaw === "super_admin"

    // Only super_admin can view RRSS operations
    if (!isSuperAdmin) {
        redirect("/dashboard")
    }

    return (
        <RRSSClient />
    )
}
