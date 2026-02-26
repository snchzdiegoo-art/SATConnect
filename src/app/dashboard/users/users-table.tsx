"use client";

import { useState } from "react";
import { updateUserRole, updateUserStatus, syncUsersFromClerk } from "./actions";
import { RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ROLES = [
    { value: "super_admin", label: "Super Admin", color: "text-purple-700 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/30" },
    { value: "admin", label: "Admin", color: "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/30" },
    { value: "editor", label: "Editor", color: "text-teal-700 bg-teal-50 border-teal-200 dark:text-teal-400 dark:bg-teal-500/10 dark:border-teal-500/30" },
    { value: "viewer", label: "Viewer", color: "text-gray-700 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-500/10 dark:border-gray-500/30" },
];

const STATUSES = [
    { value: "active", label: "Activo", color: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/30" },
    { value: "pending", label: "Pendiente", color: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/30" },
    { value: "disabled", label: "Desactivado", color: "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/30" },
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
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-syne tracking-tight">Usuarios & Accesos</h1>
                    <p className="text-sm font-medium text-gray-500 mt-0.5">Gestiona roles y permisos del equipo SAT Connect.</p>
                </div>
                <Button
                    onClick={handleSync}
                    disabled={syncing}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-teal-500 text-gray-900 hover:bg-teal-400 transition-all shadow-sm"
                >
                    {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    Sincronizar Clerk
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total", value: users.length, color: "text-gray-900 dark:text-white", border: "border-gray-200 dark:border-white/10" },
                    { label: "Activos", value: users.filter(u => u.status === "active").length, color: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-500/20" },
                    { label: "Pendientes", value: users.filter(u => u.status === "pending").length, color: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-500/20" },
                    { label: "Super Admins", value: users.filter(u => u.role === "super_admin").length, color: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-500/20" },
                ].map(stat => (
                    <div key={stat.label} className={`rounded-2xl p-5 bg-white dark:bg-white/[0.02] border shadow-sm ${stat.border}`}>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">{stat.label}</p>
                        <p className={`text-3xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
                {users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500 dark:text-gray-400">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">No hay usuarios sincronizados.</p>
                        <p className="text-xs">Haz clic en "Sincronizar Clerk" para importar usuarios.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-black/20 border-b border-gray-200 dark:border-white/5 uppercase tracking-wider text-[11px]">
                                    <th className="px-5 py-3.5 text-left font-bold text-gray-500 dark:text-gray-400">Usuario</th>
                                    <th className="px-5 py-3.5 text-left font-bold text-gray-500 dark:text-gray-400">Email</th>
                                    <th className="px-5 py-3.5 text-left font-bold text-gray-500 dark:text-gray-400">Rol</th>
                                    <th className="px-5 py-3.5 text-left font-bold text-gray-500 dark:text-gray-400">Estado</th>
                                    <th className="px-5 py-3.5 text-left font-bold text-gray-500 dark:text-gray-400">Último acceso</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {users.map((user, i) => {
                                    const isCurrentUser = user.id === currentUserId;
                                    const isLoading = loading[user.id];
                                    const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "Usuario";
                                    const initials = [user.first_name?.[0], user.last_name?.[0]].filter(Boolean).join("") || "?";

                                    return (
                                        <tr
                                            key={user.id}
                                            className={`transition-colors duration-200 ${isCurrentUser ? "bg-teal-50 dark:bg-teal-500/[0.04]" : "hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"} ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
                                        >
                                            {/* Avatar + name */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative shrink-0">
                                                        {user.image_url ? (
                                                            <img src={user.image_url} alt={fullName} className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-white/10" />
                                                        ) : (
                                                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                                                {initials}
                                                            </div>
                                                        )}
                                                        {user.status === "active" && (
                                                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 dark:bg-emerald-400 border-2 border-white dark:border-[#07101E] rounded-full" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-gray-900 dark:text-white text-[13px] tracking-tight truncate">
                                                            {fullName}
                                                            {isCurrentUser && <span className="ml-2 text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest bg-teal-100 dark:bg-teal-500/20 px-1.5 py-0.5 rounded">Tú</span>}
                                                        </p>
                                                        <p className="text-[11px] text-gray-500 font-mono mt-0.5 font-medium truncate">{user.id.slice(0, 16)}…</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="px-5 py-4 text-gray-600 dark:text-gray-400 text-[13px] font-medium truncate max-w-[180px]">{user.email}</td>

                                            {/* Role selector */}
                                            <td className="px-5 py-4">
                                                <select
                                                    value={user.role}
                                                    onChange={e => handleRoleChange(user.id, e.target.value)}
                                                    disabled={isCurrentUser}
                                                    className={`text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full border cursor-pointer bg-transparent transition-colors appearance-none ${getRoleStyle(user.role)} ${isCurrentUser ? "opacity-60 cursor-not-allowed" : "hover:opacity-80"}`}
                                                >
                                                    {ROLES.map(r => (
                                                        <option key={r.value} value={r.value} className="bg-white dark:bg-[#07101E] text-gray-900 dark:text-white">
                                                            {r.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>

                                            {/* Status selector */}
                                            <td className="px-5 py-4">
                                                <select
                                                    value={user.status}
                                                    onChange={e => handleStatusChange(user.id, e.target.value)}
                                                    disabled={isCurrentUser}
                                                    className={`text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full border cursor-pointer bg-transparent transition-colors appearance-none ${getStatusStyle(user.status)} ${isCurrentUser ? "opacity-60 cursor-not-allowed" : "hover:opacity-80"}`}
                                                >
                                                    {STATUSES.map(s => (
                                                        <option key={s.value} value={s.value} className="bg-white dark:bg-[#07101E] text-gray-900 dark:text-white">
                                                            {s.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>

                                            {/* Last sign in */}
                                            <td className="px-5 py-4 text-xs text-gray-500 font-mono font-medium">
                                                {user.last_sign_in_at
                                                    ? new Date(user.last_sign_in_at).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
                                                    : "—"
                                                }
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
