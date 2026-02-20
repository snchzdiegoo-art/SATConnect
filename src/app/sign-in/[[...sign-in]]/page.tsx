import { SignIn } from "@clerk/nextjs";
import { Rocket } from "lucide-react";

export default function Page() {
    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#0a0f1e]">

            {/* Background Video with Overlay */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                >
                    <source src="/videos/12920663.mp4" type="video/mp4" />
                </video>
                {/* Deep Navy to Black Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e]/40 via-[#0a0f1e]/80 to-[#0a0f1e]"></div>
            </div>

            {/* Main Content Wrapper */}
            <main className="relative z-10 w-full max-w-sm flex flex-col items-center gap-8">

                {/* Header Branding */}
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-[#0a0f1e]/80 flex items-center justify-center border border-[#29ffcd]/30 drop-shadow-[0_0_8px_rgba(41,255,205,0.6)]">
                        <Rocket className="w-8 h-8 text-[#29ffcd]" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            SAT Connect
                        </h1>
                        <p className="text-slate-400 text-sm max-w-[260px] mx-auto leading-relaxed">
                            Manage your tours, grow your business. Mission control for Caribbean & Mexico operations.
                        </p>
                    </div>
                </div>

                {/* Clerk Sign In Component Customization */}
                <div className="w-full">
                    <SignIn
                        appearance={{
                            variables: {
                                colorBackground: 'transparent',
                                colorPrimary: '#29ffcd',
                                colorText: 'white',
                                colorInputText: 'white',
                                colorInputBackground: 'rgba(255, 255, 255, 0.05)',
                            },
                            elements: {
                                rootBox: "w-full",
                                card: "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl w-full p-6",
                                headerTitle: "hidden",
                                headerSubtitle: "hidden",
                                socialButtonsBlockButton: "text-white border-white/20 hover:bg-white/5 hover:border-white/40",
                                socialButtonsBlockButtonText: "text-white font-medium",
                                dividerLine: "bg-white/10",
                                dividerText: "text-slate-500 uppercase text-[10px] tracking-widest",
                                formFieldLabel: "text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1 mb-2",
                                formFieldInput: "bg-[#1b2825]/40 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus:ring-[#29ffcd] focus:border-[#29ffcd]",
                                footer: "hidden",
                                footerActionLink: "text-[#29ffcd] hover:text-[#00d4ff]",
                                formButtonPrimary: "bg-gradient-to-r from-[#29ffcd] to-[#00d4ff] text-[#0a0f1e] font-bold py-3 rounded-xl hover:shadow-[0_0_15px_rgba(41,255,205,0.4)] transition-all",
                            },
                            layout: {
                                socialButtonsPlacement: "bottom",
                                socialButtonsVariant: "blockButton",
                            }
                        }}
                    />
                </div>

                {/* Footer */}
                <footer className="mt-auto relative z-10 w-full py-4 text-center">
                    <div className="flex justify-center gap-6 text-[11px] font-medium text-slate-500/80 tracking-wide uppercase">
                        <a href="#" className="hover:text-[#29ffcd] transition-colors">Help</a>
                        <span className="text-white/10">•</span>
                        <a href="#" className="hover:text-[#29ffcd] transition-colors">Privacy Policy</a>
                        <span className="text-white/10">•</span>
                        <a href="#" className="hover:text-[#29ffcd] transition-colors">Terms</a>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-4">
                        © 2026 SAT Connect Operations.
                    </p>
                </footer>

            </main>
        </div>
    );
}
