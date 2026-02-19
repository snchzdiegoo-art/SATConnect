'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import {
    Share2, Plus, Pencil, ToggleLeft, ToggleRight, Loader2, Zap
} from 'lucide-react';

// Per-OTA brand colours
const OTA_STYLES: Record<string, { accent: string; ring: string; dot: string; bg: string; label: string }> = {
    'Viator': { accent: 'border-t-orange-500', ring: 'dark:border-orange-500/20 border-orange-200', dot: 'bg-orange-400', bg: 'dark:bg-orange-500/[0.04]', label: 'text-orange-400' },
    'Expedia': { accent: 'border-t-yellow-500', ring: 'dark:border-yellow-500/20 border-yellow-200', dot: 'bg-yellow-400', bg: 'dark:bg-yellow-500/[0.04]', label: 'text-yellow-400' },
    'Project Expedition': { accent: 'border-t-blue-500', ring: 'dark:border-blue-500/20 border-blue-200', dot: 'bg-blue-400', bg: 'dark:bg-blue-500/[0.04]', label: 'text-blue-400' },
    'Klook': { accent: 'border-t-red-500', ring: 'dark:border-red-500/20 border-red-200', dot: 'bg-red-400', bg: 'dark:bg-red-500/[0.04]', label: 'text-red-400' },
};

function getOTAStyle(name: string) {
    return OTA_STYLES[name] ?? { accent: 'border-t-purple-500', ring: 'dark:border-purple-500/20 border-purple-200', dot: 'bg-purple-400', bg: 'dark:bg-purple-500/[0.04]', label: 'text-purple-400' };
}

// ---------------------------------------------------------------------------
//  Types
// ---------------------------------------------------------------------------

interface Channel {
    id: number;
    name: string;
    base_commission_percent: string; // Decimal comes as string from JSON
    is_active: boolean;
    _count?: { channel_links: number };
    createdAt: string;
}

interface ChannelFormData {
    name: string;
    base_commission_percent: string;
    is_active: boolean;
}

function emptyForm(): ChannelFormData {
    return { name: '', base_commission_percent: '0', is_active: true };
}

// ---------------------------------------------------------------------------
//  ChannelsManager Component
// ---------------------------------------------------------------------------

export function ChannelsManager() {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Channel | null>(null);
    const [form, setForm] = useState<ChannelFormData>(emptyForm());
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchChannels = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/channels');
            const data = await res.json();
            if (data.success) setChannels(data.data);
        } catch {
            setError('Failed to load channels');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchChannels(); }, [fetchChannels]);

    function openCreate() {
        setEditing(null);
        setForm(emptyForm());
        setModalOpen(true);
    }

    function openEdit(channel: Channel) {
        setEditing(channel);
        setForm({
            name: channel.name,
            base_commission_percent: String(parseFloat(channel.base_commission_percent)),
            is_active: channel.is_active,
        });
        setModalOpen(true);
    }

    async function handleSave() {
        if (!form.name.trim()) return;
        setSaving(true);
        setError(null);

        const payload = {
            name: form.name.trim(),
            base_commission_percent: parseFloat(form.base_commission_percent) || 0,
            is_active: form.is_active,
        };

        try {
            const url = editing ? `/api/channels/${editing.id}` : '/api/channels';
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
                fetchChannels();
            }
        } catch {
            setError('Network error');
        } finally {
            setSaving(false);
        }
    }

    async function toggleActive(channel: Channel) {
        try {
            await fetch(`/api/channels/${channel.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !channel.is_active }),
            });
            fetchChannels();
        } catch {
            setError('Failed to update channel');
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                        <Share2 className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display">
                            Canales de Distribución
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {channels.length} canales · La comisión afecta todos los tours vinculados
                        </p>
                    </div>
                </div>
                <button
                    onClick={openCreate}
                    className="btn-purple"
                >
                    <Plus className="h-4 w-4" />
                    Nuevo Canal
                </button>
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-sm text-purple-700 dark:text-purple-300">
                <Zap className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                    <strong>Gestión Centralizada:</strong> Editar la comisión base de un canal actualiza
                    automáticamente el Ingreso Neto de todos los tours vinculados.
                </span>
            </div>

            {/* Channel grid */}
            {loading ? (
                <div className="flex items-center justify-center py-16 text-gray-400">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading channels...
                </div>
            ) : channels.length === 0 ? (
                <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl">
                    <Share2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No channels yet</p>
                    <p className="text-sm mt-1">Add Viator, Expedia, or any OTA partner.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {channels.map((channel) => {
                        const style = getOTAStyle(channel.name);
                        const tourCount = channel._count?.channel_links ?? 0;
                        return (
                            <div
                                key={channel.id}
                                className={`relative flex flex-col rounded-xl border border-t-4 card-glass transition-all duration-300 overflow-hidden ${channel.is_active
                                        ? `${style.accent} ${style.ring} ${style.bg} hover:-translate-y-0.5 hover:shadow-md`
                                        : 'border-t-gray-300 dark:border-t-gray-700 border-gray-100 dark:border-white/5 opacity-50'
                                    }`}
                            >
                                {/* Status + Name row */}
                                <div className="flex items-center gap-3 p-4 pb-2">
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${channel.is_active ? `${style.dot} animate-pulse-glow` : 'bg-gray-400'}`} />
                                    <h3 className={`font-bold text-sm ${style.label} flex-1 truncate`}>{channel.name}</h3>
                                    <button
                                        onClick={() => toggleActive(channel)}
                                        className="transition-colors shrink-0 hover:scale-110 duration-150"
                                        title={channel.is_active ? 'Desactivar' : 'Activar'}
                                    >
                                        {channel.is_active
                                            ? <ToggleRight className="h-5 w-5 text-[#29FFC6]" />
                                            : <ToggleLeft className="h-5 w-5 text-gray-400" />}
                                    </button>
                                </div>

                                {/* Commission — centered & prominent */}
                                <div className="flex flex-col items-center justify-center py-5 flex-1">
                                    <span className={`text-4xl font-bold tabular-nums font-display ${style.label}`}>
                                        {parseFloat(channel.base_commission_percent).toFixed(1)}%
                                    </span>
                                    <span className="text-xs text-gray-400 mt-1">comisión base</span>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-white/[0.06] bg-white/30 dark:bg-white/[0.02]">
                                    <Link
                                        href={`/dashboard/inventory`}
                                        className={`text-xs font-medium ${style.label} hover:underline`}
                                    >
                                        {tourCount} tours vinculados →
                                    </Link>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => openEdit(channel)}
                                        className="h-7 px-2 text-xs text-gray-400 hover:text-purple-400"
                                    >
                                        <Pencil className="h-3 w-3 mr-1" />
                                        Editar
                                    </Button>
                                </div>
                            </div>
                        )
                    })}

                    {/* Add Channel ghost card */}
                    <button
                        onClick={openCreate}
                        className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-purple-200 dark:border-purple-500/20 p-6 text-purple-400 hover:border-purple-400 dark:hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-500/[0.05] transition-all duration-200 min-h-[180px]"
                    >
                        <Plus className="h-8 w-8 opacity-50" />
                        <div className="text-center">
                            <p className="text-sm font-semibold">Agregar Canal</p>
                            <p className="text-xs opacity-60 mt-0.5">Conectar nuevo canal OTA</p>
                        </div>
                    </button>
                </div>
            )}

            {/* Create / Edit Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-md bg-white dark:bg-brand-dark border border-gray-200 dark:border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-white font-display">
                            {editing ? `Edit: ${editing.name}` : 'New Distribution Channel'}
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
                                Channel Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Viator, Expedia, Klook"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Base Commission (%)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.5"
                                    placeholder="25"
                                    value={form.base_commission_percent}
                                    onChange={(e) =>
                                        setForm({ ...form, base_commission_percent: e.target.value })
                                    }
                                    className="w-full px-3 py-2 pr-8 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                Changing this will update Net Revenue for all tours on this channel.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Active</label>
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, is_active: !form.is_active })}
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
                            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {editing ? 'Save Changes' : 'Create Channel'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
