import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // 🛡️ RBAC & Identity Gate
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const email = user.emailAddresses[0]?.emailAddress;

    // Whitelist Logic
    // TODO: Move this to a database check in Phase 2 for scalability
    const isSatMexico = email?.endsWith("@satmexico.com") || email === "snchzdiegoo@gmail.com";

    // Allow Super Admin status from metadata if present
    const isSuperAdmin = user.publicMetadata?.role === "super_admin";

    if (!isSatMexico && !isSuperAdmin) {
        redirect("/pending-approval");
    }

    return (
        <div className="flex h-screen w-full bg-transparent font-sans antialiased text-gray-900 dark:text-gray-100 overflow-hidden">
            {/* Sidebar - Auto-sizes based on collapsed state */}
            <Sidebar />

            {/* Main Content Column */}
            <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
                <Topbar />

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-gray-800">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
