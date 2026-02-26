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
        <div className="flex flex-col h-full bg-gradient-to-b from-black via-[#070b14] to-[#070b14] relative">
            {/* Tech Pattern Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)' }} />

            {/* Header */}
            <div className="h-16 flex items-center px-8 border-b border-white/10 shrink-0 bg-black/40 backdrop-blur-xl sticky top-0 z-10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] justify-between">
                <div className="flex items-center">
                    <FileText className="w-5 h-5 text-teal-400 mr-3 glow-teal" />
                    <h1 className="text-xl font-bold text-white font-syne tracking-tight uppercase">Documentos</h1>
                    <span className="ml-3 text-xs bg-white/10 text-gray-400 px-2.5 py-0.5 rounded-full font-medium">
                        {docs.length}
                    </span>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-xs font-bold tracking-wider transition-all border border-teal-500/30 shadow-[0_0_15px_rgba(41,255,198,0.1)]">
                    <Plus className="w-4 h-4" />
                    NUEVO DOC
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
                                className="group flex flex-col p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 hover:border-teal-500/30 relative overflow-hidden backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                            >
                                {/* Inner glow on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                <div className="flex items-start justify-between mb-4 relative z-10">
                                    <div className="text-3xl drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{doc.emoji}</div>
                                    <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase">
                                        {new Date(doc.updated_at).toLocaleDateString("es-MX", { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                                <h3 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors truncate relative z-10 font-syne tracking-tight">
                                    {doc.title}
                                </h3>
                                <div className="text-xs text-gray-500 line-clamp-2 mt-2 leading-relaxed relative z-10">
                                    {(doc.content || "Sin contenido").slice(0, 100)}...
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
