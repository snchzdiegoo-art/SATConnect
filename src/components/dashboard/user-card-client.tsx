"use client";

import { useState, useEffect } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { Bell, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

interface UserCardClientProps {
    name: string;
    imageUrl: string;
    role: string;
}

function ThemePill() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return <div className="w-16 h-7" />;

    const isDark = resolvedTheme === "dark";
    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            className={`relative flex items-center w-14 h-7 rounded-full transition-colors duration-300 px-0.5 ${isDark ? "bg-slate-700 border border-slate-600" : "bg-amber-100 border border-amber-300"
                }`}
        >
            {/* Sliding circle */}
            <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full shadow transition-all duration-300 ${isDark
                    ? "left-7 bg-slate-900"
                    : "left-0.5 bg-amber-400"
                }`}>
                {isDark
                    ? <Moon className="h-3.5 w-3.5 text-blue-300" />
                    : <Sun className="h-3.5 w-3.5 text-white" />
                }
            </span>
            {/* Background icons */}
            <Sun className={`h-3 w-3 ml-1 transition-opacity ${isDark ? "opacity-30 text-amber-300" : "opacity-0"}`} />
            <Moon className={`h-3 w-3 ml-auto mr-1 transition-opacity ${isDark ? "opacity-0" : "opacity-30 text-slate-500"}`} />
        </button>
    );
}

export function UserCardClient({ name, imageUrl, role }: UserCardClientProps) {
    return (
        <div className="flex items-center gap-2 border-l border-white/10 pl-3">
            {/* Theme pill */}
            <ThemePill />

            {/* Notification bell */}
            <button
                className="relative w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Notificaciones"
            >
                <Bell className="h-4 w-4" />
                {/* Red dot with hard border so it stands out */}
                <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-[#07101E]" />
                </span>
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-white/10" />

            {/* Avatar + name pill */}
            <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-2.5 py-1.5 transition-colors cursor-default">
                <div className="relative shrink-0">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-7 h-7 rounded-full border-[1.5px] border-teal-400/70 object-cover"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#07101E] rounded-full" />
                </div>
                <div className="flex flex-col leading-tight">
                    <span className="text-[12px] font-semibold text-white whitespace-nowrap">{name}</span>
                    <span className="text-[10px] text-teal-400 font-semibold tracking-wider uppercase whitespace-nowrap">
                        {role.replace(/_/g, " ")}
                    </span>
                </div>
            </div>

            {/* Sign out */}
            <SignOutButton redirectUrl="/">
                <button
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    title="Salir"
                >
                    <LogOut className="h-4 w-4" />
                </button>
            </SignOutButton>
        </div>
    );
}
