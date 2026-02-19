import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";

export default function WorkspaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-[calc(100vh-theme(spacing.14))] overflow-hidden">
            {/* Left Sidebar */}
            <WorkspaceSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-black/20 relative">
                {children}
            </main>
        </div>
    );
}
