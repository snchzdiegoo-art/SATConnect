import { SignIn } from "@clerk/nextjs";
import { Rocket } from "lucide-react";

export default function Page() {
    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gray-50 dark:bg-[#0a0f1e] transition-colors duration-500">

            {/* Background Video with Overlay */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-60 mix-blend-multiply dark:mix-blend-normal blur-[2px]"
                >
                    <source src="/videos/12920663.mp4" type="video/mp4" />
                </video>
                {/* Responsive Gradient Overlay (Light/Dark) */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-gray-100/80 to-gray-50 dark:from-[#0a0f1e]/40 dark:via-[#0a0f1e]/80 dark:to-[#0a0f1e] transition-colors duration-500"></div>
            </div>

            {/* Main Content Wrapper */}
            <main className="relative z-10 w-full max-w-sm flex flex-col items-center gap-6 md:gap-8">

                {/* Header Branding */}
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white/50 dark:bg-[#0a0f1e]/80 backdrop-blur-md flex items-center justify-center border border-teal-500/20 dark:border-[#29ffcd]/30 shadow-lg dark:drop-shadow-[0_0_8px_rgba(41,255,205,0.6)]">
                        <Rocket className="w-8 h-8 text-teal-600 dark:text-[#29ffcd]" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-syne">
                            SAT Connect
                        </h1>
                        <p className="text-gray-600 dark:text-slate-400 text-sm max-w-[260px] mx-auto leading-relaxed font-medium">
                            Manage your tours, grow your business. Mission control for Caribbean & Mexico operations.
                        </p>
                    </div>
                </div>

                {/* Clerk Sign In Component Customization */}
                <div className="w-full relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/0 via-teal-500/10 to-teal-500/0 dark:via-[#29ffcd]/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <SignIn
                        forceRedirectUrl="/dashboard"
                        fallbackRedirectUrl="/dashboard"
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "bg-white/10 dark:bg-black/20 backdrop-blur-3xl border border-white/20 dark:border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full p-6 md:p-8 transition-all duration-300 relative z-20 overflow-hidden before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-20",
                                headerTitle: "hidden",
                                headerSubtitle: "hidden",
                                socialButtonsBlockButton: "bg-white/20 dark:bg-white/5 backdrop-blur-md border border-white/30 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/10 text-gray-900 dark:text-white transition-all rounded-xl shadow-sm",
                                socialButtonsBlockButtonText: "font-semibold",
                                socialButtonsBlockButtonArrow: "text-gray-900 dark:text-white",
                                dividerLine: "bg-gray-300 dark:bg-white/10",
                                dividerText: "text-gray-500 dark:text-gray-400 uppercase text-[10px] font-bold tracking-widest bg-transparent",
                                formFieldLabel: "text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 ml-1 mb-2",
                                formFieldInput: "bg-white/30 dark:bg-black/30 backdrop-blur-lg border border-white/40 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 rounded-xl focus:ring-2 focus:ring-teal-500/50 dark:focus:ring-[#29ffcd]/50 focus:border-teal-500 dark:focus:border-[#29ffcd] transition-all shadow-inner",
                                footer: "hidden",
                                footerActionLink: "text-teal-600 dark:text-[#29ffcd] hover:text-teal-700 dark:hover:text-[#00d4ff] font-bold",
                                formButtonPrimary: "bg-teal-500 dark:bg-gradient-to-r dark:from-[#29ffcd] dark:to-[#00d4ff] text-white dark:text-[#0a0f1e] text-sm font-black py-4 rounded-xl hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] dark:hover:shadow-[0_0_20px_rgba(41,255,205,0.5)] transition-all uppercase tracking-widest",
                                identityPreviewText: "text-gray-900 dark:text-white font-medium",
                                identityPreviewEditButtonIcon: "text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
                            },
                            layout: {
                                socialButtonsPlacement: "bottom",
                                socialButtonsVariant: "blockButton",
                            }
                        }}
                    />
                </div>

                {/* Footer */}
                <footer className="mt-8 relative z-10 w-full py-4 text-center">
                    <div className="flex justify-center gap-6 text-[10px] font-bold text-gray-400 dark:text-slate-500/80 tracking-widest uppercase mb-4">
                        <a href="#" className="hover:text-teal-600 dark:hover:text-[#29ffcd] transition-colors">Help</a>
                        <span className="text-gray-300 dark:text-white/10">•</span>
                        <a href="#" className="hover:text-teal-600 dark:hover:text-[#29ffcd] transition-colors">Privacy Policy</a>
                        <span className="text-gray-300 dark:text-white/10">•</span>
                        <a href="#" className="hover:text-teal-600 dark:hover:text-[#29ffcd] transition-colors">Terms</a>
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-slate-600 font-medium">
                        © 2026 SAT Connect Operations.
                    </p>
                </footer>

            </main >
        </div >
    );
}
