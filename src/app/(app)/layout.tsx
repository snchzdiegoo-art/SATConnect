"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
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
