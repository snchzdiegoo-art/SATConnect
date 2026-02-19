'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import {
    Building2, Plus, Pencil, ToggleLeft, ToggleRight,
    Search, Badge, AlertCircle, CheckCircle2, Loader2
} from 'lucide-react';

// ---------------------------------------------------------------------------
//  Types
// ---------------------------------------------------------------------------

interface ContactInfo {
    email?: string;
    phone?: string;
}

interface Supplier {
    id: number;
    name: string;
    contact_info: ContactInfo | null;
    badges: string[];
    is_active: boolean;
    profile_status: string; // "Complete" | "Incomplete Profile"
    _count?: { tours: number };
    createdAt: string;
}

interface SupplierFormData {
    name: string;
    email: string;
    phone: string;
    badges: string; // comma-separated
    is_active: boolean;
}

function emptyForm(): SupplierFormData {
    return { name: '', email: '', phone: '', badges: '', is_active: true };
}

// ---------------------------------------------------------------------------
//  SuppliersManager Component
// ---------------------------------------------------------------------------

export function SuppliersManager() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Supplier | null>(null);
    const [form, setForm] = useState<SupplierFormData>(emptyForm());
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSuppliers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/suppliers?search=${encodeURIComponent(search)}`);
            const data = await res.json();
            if (data.success) setSuppliers(data.data);
        } catch {
            setError('Failed to load suppliers');
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        const timer = setTimeout(fetchSuppliers, 300);
        return () => clearTimeout(timer);
    }, [fetchSuppliers]);

    function openCreate() {
        setEditing(null);
        setForm(emptyForm());
        setModalOpen(true);
    }

    function openEdit(supplier: Supplier) {
        setEditing(supplier);
        setForm({
            name: supplier.name,
            email: supplier.contact_info?.email || '',
            phone: supplier.contact_info?.phone || '',
            badges: supplier.badges.join(', '),
            is_active: supplier.is_active,
        });
        setModalOpen(true);
    }

    async function handleSave() {
        if (!form.name.trim()) return;
        setSaving(true);
        setError(null);

        const payload = {
            name: form.name.trim(),
            contact_info: {
                email: form.email || undefined,
                phone: form.phone || undefined,
            },
            badges: form.badges
                .split(',')
                .map((b) => b.trim())
                .filter(Boolean),
            is_active: form.is_active,
            profile_status: 'Complete',
        };

        try {
            const url = editing ? `/api/suppliers/${editing.id}` : '/api/suppliers';
            const method = editing ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (!data.success) {
                setError(data.error || 'Save failed');
            } else {
                setModalOpen(false);
                fetchSuppliers();
            }
        } catch {
            setError('Network error');
        } finally {
            setSaving(false);
        }
    }

    async function toggleActive(supplier: Supplier) {
        try {
            await fetch(`/api/suppliers/${supplier.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !supplier.is_active }),
            });
            fetchSuppliers();
        } catch {
            setError('Failed to update supplier');
        }
    }

    const filtered = suppliers.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20">
                        <Building2 className="h-5 w-5 text-teal-500 dark:text-brand-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display">
                            Suppliers
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {suppliers.length} registered · {suppliers.filter(s => s.profile_status === 'Incomplete Profile').length} incomplete
                        </p>
                    </div>
                </div>
                <button
                    onClick={openCreate}
                    className="btn-teal"
                >
                    <Plus className="h-4 w-4" />
                    Nuevo Proveedor
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search suppliers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 text-sm"
                />
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-16 text-gray-400">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading suppliers...
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl">
                    <Building2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No suppliers found</p>
                    <p className="text-sm mt-1">Create your first supplier or import a CSV.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/10">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                                <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Contact</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Badges</th>
                                <th className="text-center px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Tours</th>
                                <th className="text-center px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                                <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {filtered.map((supplier) => {
                                const isIncomplete = supplier.profile_status === 'Incomplete Profile';
                                return (
                                    <tr
                                        key={supplier.id}
                                        className={`transition-colors group ${isIncomplete
                                                ? 'border-l-2 border-l-amber-400 dark:border-l-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-500/[0.05]'
                                                : 'hover:bg-gray-50 dark:hover:bg-white/[0.04]'
                                            }`}
                                    >
                                        {/* Name */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {isIncomplete ? (
                                                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                                                ) : (
                                                    <CheckCircle2 className="h-4 w-4 text-teal-500 dark:text-[#29FFC6] shrink-0" />
                                                )}
                                                <div className="min-w-0">
                                                    <span className="font-medium text-gray-900 dark:text-white block truncate">
                                                        {supplier.name}
                                                    </span>
                                                    {isIncomplete && (
                                                        <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wide">Perfil Incompleto</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                            <div>{(supplier.contact_info as ContactInfo | null)?.email || '—'}</div>
                                            <div className="text-xs">{(supplier.contact_info as ContactInfo | null)?.phone || ''}</div>
                                        </td>

                                        {/* Badges */}
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {supplier.badges.length > 0 ? supplier.badges.map((badge) => (
                                                    <span
                                                        key={badge}
                                                        className="px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 dark:bg-brand-primary/10 text-teal-700 dark:text-brand-primary border border-teal-200 dark:border-brand-primary/20"
                                                    >
                                                        {badge}
                                                    </span>
                                                )) : <span className="text-gray-400 text-xs">None</span>}
                                            </div>
                                        </td>

                                        {/* Tour count */}
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="font-bold tabular-nums text-gray-900 dark:text-white text-sm leading-none">
                                                    {supplier._count?.tours ?? 0}
                                                </span>
                                                <span className="text-[10px] text-gray-400 mt-0.5">tours</span>
                                            </div>
                                        </td>

                                        {/* Active */}
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => toggleActive(supplier)}
                                                className="transition-all hover:scale-110 duration-150"
                                                title={supplier.is_active ? 'Desactivar' : 'Activar'}
                                            >
                                                {supplier.is_active ? (
                                                    <ToggleRight className="h-6 w-6 text-[#29FFC6] drop-shadow-[0_0_4px_rgba(41,255,198,0.6)]" />
                                                ) : (
                                                    <ToggleLeft className="h-6 w-6 text-gray-400" />
                                                )}
                                            </button>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3 text-right">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => openEdit(supplier)}
                                                className="text-gray-400 hover:text-[#29FFC6] dark:hover:text-[#29FFC6] opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create / Edit Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-lg bg-white dark:bg-brand-dark border border-gray-200 dark:border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-white font-display">
                            {editing ? `Edit: ${editing.name}` : 'New Supplier'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg p-3">
                                {error}
                            </p>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Zyanya Experiences"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    placeholder="contact@supplier.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                                <input
                                    type="text"
                                    placeholder="+52 998 000 0000"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Badges <span className="text-gray-400 font-normal">(comma-separated)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Top Seller, Verified, Premium"
                                value={form.badges}
                                onChange={(e) => setForm({ ...form, badges: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Active</label>
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, is_active: !form.is_active })}
                                className="transition-colors"
                            >
                                {form.is_active ? (
                                    <ToggleRight className="h-6 w-6 text-teal-500 dark:text-brand-primary" />
                                ) : (
                                    <ToggleLeft className="h-6 w-6 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalOpen(false)} className="text-gray-700 dark:text-gray-300">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving || !form.name.trim()}
                            className="btn-teal"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {editing ? 'Save Changes' : 'Create Supplier'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
