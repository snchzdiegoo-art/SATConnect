import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { UXClient } from "./ux-client"

export default async function UXUIStudioPage() {
    const user = await currentUser()

    // Explicit Role Fallback to super_admin if metadata is entirely missing
    const roleRaw = (user?.publicMetadata?.role as string) || "super_admin"

    if (roleRaw !== "super_admin") {
        redirect("/dashboard")
    }

    return (
        <div className="h-full flex flex-col bg-[#030712]">
            <UXClient />
        </div>
    )
}
