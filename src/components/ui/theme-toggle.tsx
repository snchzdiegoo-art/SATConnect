"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => { setMounted(true) }, [])

    if (!mounted) {
        return <div className="w-14 h-7 rounded-full bg-white/5 animate-pulse" />
    }

    const isDark = resolvedTheme === "dark"

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            title={isDark ? "Modo claro" : "Modo oscuro"}
            className={`relative flex items-center w-14 h-7 rounded-full transition-colors duration-300 px-0.5 shrink-0 ${isDark
                    ? "bg-slate-800 border border-slate-600/50"
                    : "bg-amber-100 border border-amber-300"
                }`}
        >
            {/* Sliding knob */}
            <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full shadow-md transition-all duration-300 ${isDark
                    ? "left-[30px] bg-slate-950 shadow-slate-900"
                    : "left-0.5 bg-amber-400 shadow-amber-200"
                }`}>
                {isDark
                    ? <Moon className="h-3.5 w-3.5 text-blue-300" />
                    : <Sun className="h-3.5 w-3.5 text-white" />
                }
            </span>

            {/* Track icons */}
            <Sun className={`h-3 w-3 ml-1 transition-opacity duration-200 ${isDark ? "opacity-25 text-amber-300" : "opacity-0"}`} />
            <Moon className={`h-3 w-3 ml-auto mr-1 transition-opacity duration-200 ${isDark ? "opacity-0" : "opacity-25 text-slate-500"}`} />
        </button>
    )
}
