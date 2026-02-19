import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FileText, Plus, Search } from "lucide-react";
import Link from "next/link";

export default async function DocsPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const docs = await prisma.doc.findMany({
        where: {
            author_id: userId,
        },
        orderBy: { updated_at: "desc" },
    });

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-14 flex items-center px-8 border-b border-white/5 shrink-0 bg-white/5 backdrop-blur-md justify-between">
                <div className="flex items-center">
                    <FileText className="w-5 h-5 text-teal-400 mr-3" />
                    <h1 className="text-lg font-bold text-white font-syne tracking-wide">Documents</h1>
                    <span className="ml-3 text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">
                        {docs.length}
                    </span>
                </div>

                <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-xs font-medium transition-colors border border-teal-500/20">
                    <Plus className="w-3.5 h-3.5" />
                    New Doc
                </button>
            </div>

            {/* Docs List */}
            <div className="flex-1 overflow-y-auto p-8">
                {docs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                        <FileText className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-sm">No documents yet. Write something!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {docs.map((doc: any) => (
                            <Link
                                key={doc.id}
                                href={`/dashboard/workspace/docs/${doc.id}`}
                                className="group flex flex-col p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-200 hover:border-white/10"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="text-2xl">{doc.emoji}</div>
                                    <span className="text-[10px] text-gray-500">
                                        {new Date(doc.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-sm font-medium text-white group-hover:text-teal-400 transition-colors truncate">
                                    {doc.title}
                                </h3>
                                <div className="text-xs text-gray-500 line-clamp-2 mt-1">
                                    {(doc.content || "No content").slice(0, 100)}...
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
