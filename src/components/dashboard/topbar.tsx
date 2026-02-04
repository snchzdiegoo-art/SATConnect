"use client"

import { Bell, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // We might need to create this primitive if missing
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu" // Assuming we have these or need to add mockup logic

// Mock Organization Data
const organizations = [
    { id: "org_1", name: "Mundo Maya Travel" },
    { id: "org_2", name: "Caribe Tours VIP" }
]

export function Topbar() {
    return (
        <header className="h-16 border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm sticky top-0 z-40 px-6 flex items-center justify-between">

            {/* Left: Global Search (Optional) or Breadcrumbs */}
            <div className="flex items-center w-full max-w-md">
                {/* Organization Switcher */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="text-gray-300 hover:text-white flex items-center gap-2 px-2 hover:bg-white/5 border border-transparent hover:border-white/10 rounded-lg h-9">
                            <span className="w-6 h-6 rounded bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                                MM
                            </span>
                            <span className="font-medium text-sm">Mundo Maya Travel</span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    {/* Minimal Dropdown Content Mockup */}
                    <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800 text-gray-200">
                        <DropdownMenuLabel>Mis Organizaciones</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-800" />
                        <DropdownMenuItem className="focus:bg-teal-500/10 focus:text-teal-400 cursor-pointer">
                            Mundo Maya Travel
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-teal-500/10 focus:text-teal-400 cursor-pointer">
                            Caribe Tours VIP
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-800" />
                        <DropdownMenuItem className="text-teal-400 focus:bg-teal-500/10 cursor-pointer">
                            + Crear Nueva Organización
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="h-6 w-px bg-gray-800 mx-4"></div>

                <div className="relative w-full max-w-xs hidden md:block">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar reserva, tour o cliente..."
                        className="w-full bg-gray-900 border border-gray-800 text-sm rounded-md pl-9 pr-4 py-1.5 text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-teal-500/50 transition-colors"
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-950"></span>
                </Button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-3 border-l border-gray-800">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-medium text-white">Diego Sánchez</div>
                        <div className="text-xs text-gray-500">Admin</div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gray-800 border-2 border-gray-700 overflow-hidden cursor-pointer hover:border-teal-500 transition-colors">
                        <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Diego" alt="User" />
                    </div>
                </div>
            </div>
        </header>
    )
}
