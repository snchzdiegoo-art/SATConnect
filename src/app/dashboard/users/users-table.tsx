"use client";

import { useState } from "react";
import { updateUserRole, updateUserStatus, syncUsersFromClerk } from "./actions";
import { RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ROLES = [
    { value: "super_admin", label: "Super Admin", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
    { value: "admin", label: "Admin", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
    { value: "editor", label: "Editor", color: "text-teal-400 bg-teal-500/10 border-teal-500/30" },
    { value: "viewer", label: "Viewer", color: "text-gray-400 bg-gray-500/10 border-gray-500/30" },
];

const STATUSES = [
    { value: "active", label: "Activo", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
    { value: "pending", label: "Pendiente", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
    { value: "disabled", label: "Desactivado", color: "text-red-400 bg-red-500/10 border-red-500/30" },
];

function getRoleStyle(role: string) {
    return ROLES.find(r => r.value === role)?.color ?? "text-gray-400 bg-gray-500/10 border-gray-500/30";
}
function getStatusStyle(status: string) {
    return STATUSES.find(s => s.value === status)?.color ?? "text-gray-400 bg-gray-500/10 border-gray-500/30";
}

interface User {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
    role: string;
    status: string;
    last_sign_in_at: Date | null;
    created_at: Date;
}

export function UsersTable({ users, currentUserId }: { users: User[]; currentUserId: string }) {
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const [syncing, setSyncing] = useState(false);

    const setRowLoading = (id: string, val: boolean) =>
        setLoading(prev => ({ ...prev, [id]: val }));

    const handleRoleChange = async (userId: string, role: string) => {
        setRowLoading(userId, true);
        await updateUserRole(userId, role);
        setRowLoading(userId, false);
    };

    const handleStatusChange = async (userId: string, status: string) => {
        setRowLoading(userId, true);
        await updateUserStatus(userId, status);
        setRowLoading(userId, false);
    };

    const handleSync = async () => {
        setSyncing(true);
        await syncUsersFromClerk();
        setSyncing(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Usuarios & Accesos</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Gestiona roles y permisos del equipo SAT Connect.</p>
                </div>
                <Button
                    onClick={handleSync}
                    disabled={syncing}
                    className="bg-teal-500 hover:bg-teal-400 text-gray-900 font-semibold gap-2 shadow-[0_0_16px_rgba(41,255,198,0.25)]"
                >
                    {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    Sincronizar Clerk
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: "Total", value: users.length, color: "text-white" },
                    { label: "Activos", value: users.filter(u => u.status === "active").length, color: "text-emerald-400" },
                    { label: "Pendientes", value: users.filter(u => u.status === "pending").length, color: "text-amber-400" },
                    { label: "Super Admins", value: users.filter(u => u.role === "super_admin").length, color: "text-purple-400" },
                ].map(stat => (
                    <div key={stat.label} className="glass-panel rounded-xl p-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                {users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-600">
                        <p className="text-sm">No hay usuarios sincronizados.</p>
                        <p className="text-xs">Haz clic en "Sincronizar Clerk" para importar usuarios.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-5 py-3.5 text-left text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Usuario</th>
                                <th className="px-5 py-3.5 text-left text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Email</th>
                                <th className="px-5 py-3.5 text-left text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Rol</th>
                                <th className="px-5 py-3.5 text-left text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Estado</th>
                                <th className="px-5 py-3.5 text-left text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Último acceso</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, i) => {
                                const isCurrentUser = user.id === currentUserId;
                                const isLoading = loading[user.id];
                                const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "Usuario";
                                const initials = [user.first_name?.[0], user.last_name?.[0]].filter(Boolean).join("") || "?";

                                return (
                                    <tr
                                        key={user.id}
                                        className={`border-b border-white/[0.04] transition-colors ${isCurrentUser ? "bg-teal-500/[0.04]" : "hover:bg-white/[0.02]"} ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
                                    >
                                        {/* Avatar + name */}
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="relative shrink-0">
                                                    {user.image_url ? (
                                                        <img src={user.image_url} alt={fullName} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-xs font-bold text-white">
                                                            {initials}
                                                        </div>
                                                    )}
                                                    {user.status === "active" && (
                                                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#07101E] rounded-full" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white text-sm leading-tight">
                                                        {fullName}
                                                        {isCurrentUser && <span className="ml-2 text-[10px] text-teal-400 font-semibold">(tú)</span>}
                                                    </p>
                                                    <p className="text-[10px] text-gray-600 font-mono mt-0.5">{user.id.slice(0, 16)}…</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-5 py-3.5 text-gray-400 text-xs">{user.email}</td>

                                        {/* Role selector */}
                                        <td className="px-5 py-3.5">
                                            <select
                                                value={user.role}
                                                onChange={e => handleRoleChange(user.id, e.target.value)}
                                                disabled={isCurrentUser}
                                                className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer bg-transparent transition-colors appearance-none ${getRoleStyle(user.role)} ${isCurrentUser ? "opacity-60 cursor-not-allowed" : "hover:opacity-80"}`}
                                            >
                                                {ROLES.map(r => (
                                                    <option key={r.value} value={r.value} className="bg-[#07101E] text-white">
                                                        {r.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        {/* Status selector */}
                                        <td className="px-5 py-3.5">
                                            <select
                                                value={user.status}
                                                onChange={e => handleStatusChange(user.id, e.target.value)}
                                                disabled={isCurrentUser}
                                                className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer bg-transparent transition-colors appearance-none ${getStatusStyle(user.status)} ${isCurrentUser ? "opacity-60 cursor-not-allowed" : "hover:opacity-80"}`}
                                            >
                                                {STATUSES.map(s => (
                                                    <option key={s.value} value={s.value} className="bg-[#07101E] text-white">
                                                        {s.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        {/* Last sign in */}
                                        <td className="px-5 py-3.5 text-xs text-gray-600 font-mono">
                                            {user.last_sign_in_at
                                                ? new Date(user.last_sign_in_at).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })
                                                : "—"
                                            }
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
