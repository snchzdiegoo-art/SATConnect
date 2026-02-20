import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";

export default function WorkspaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50/50 dark:bg-[#070b14]">
            {/* Left Sidebar */}
            <WorkspaceSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                {children}
            </main>
        </div>
    );
}
