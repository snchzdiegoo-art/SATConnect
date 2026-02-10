
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Trash2, Save } from 'lucide-react';

interface OTASetting {
    id?: number;
    channel_key: string;
    channel_name: string;
    default_commission: number;
    is_active: boolean;
}

export function OTASettings() {
    const [settings, setSettings] = useState<OTASetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        try {
            setLoading(true);
            const response = await fetch('/api/settings/ota');
            const data = await response.json();
            if (data.success) {
                // Determine which known OTAs are missing and add them as defaults
                const knownOTAs = [
                    { key: 'viator', name: 'Viator' },
                    { key: 'getyourguide', name: 'GetYourGuide' },
                    { key: 'expedia', name: 'Expedia' },
                    { key: 'klook', name: 'Klook' },
                    { key: 'project_expedition', name: 'Project Expedition' },
                    { key: 'tur_com', name: 'Tur.com' },
                    { key: 'tourist_com', name: 'Tourist.com' },
                    { key: 'headout', name: 'Headout' },
                    { key: 'tourradar', name: 'TourRadar' },
                    { key: 'civitatis', name: 'Civitatis' },
                ];

                const fetched: OTASetting[] = data.data;
                const merged = knownOTAs.map(known => {
                    const existing = fetched.find(s => s.channel_key === known.key);
                    return existing || {
                        channel_key: known.key,
                        channel_name: known.name,
                        default_commission: 0,
                        is_active: false
                    };
                });

                // Add any user-defined custom OTAs that might exist in DB but not in known list
                const custom = fetched.filter(s => !knownOTAs.some(k => k.key === s.channel_key));

                setSettings([...merged, ...custom]);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(setting: OTASetting) {
        try {
            setSaving(setting.channel_key);
            const response = await fetch('/api/settings/ota', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(setting),
            });
            const data = await response.json();
            if (data.success) {
                // Update local state with returned data (e.g. id)
                setSettings(prev => prev.map(s =>
                    s.channel_key === setting.channel_key ? { ...s, ...data.data } : s
                ));
            }
        } catch (error) {
            console.error('Error saving setting:', error);
        } finally {
            setSaving(null);
        }
    }

    const updateSetting = (key: string, updates: Partial<OTASetting>) => {
        setSettings(prev => prev.map(s =>
            s.channel_key === key ? { ...s, ...updates } : s
        ));
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>OTA Commission Configuration</CardTitle>
                <CardDescription>
                    Manage active Online Travel Agencies and their default commission percentages.
                    These defaults will be used to calculate net revenue unless overridden on a specific tour.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-12 gap-4 font-medium text-sm text-gray-500 border-b pb-2">
                        <div className="col-span-1 text-center">Active</div>
                        <div className="col-span-4">Channel Name</div>
                        <div className="col-span-3">Default Commission (%)</div>
                        <div className="col-span-4 text-right">Actions</div>
                    </div>

                    {settings.map((setting) => (
                        <div key={setting.channel_key} className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-1 flex justify-center">
                                <Switch
                                    checked={setting.is_active}
                                    onCheckedChange={(checked) => updateSetting(setting.channel_key, { is_active: checked })}
                                />
                            </div>
                            <div className="col-span-4">
                                <div className="font-medium">{setting.channel_name}</div>
                                <div className="text-xs text-gray-400 font-mono">{setting.channel_key}</div>
                            </div>
                            <div className="col-span-3">
                                <div className="relative">
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={setting.default_commission}
                                        onChange={(e) => updateSetting(setting.channel_key, { default_commission: parseFloat(e.target.value) || 0 })}
                                        className="pr-8 text-right"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                                </div>
                            </div>
                            <div className="col-span-4 flex justify-end gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSave(setting)}
                                    disabled={saving === setting.channel_key}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    {saving === setting.channel_key ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <div className="flex items-center gap-1"><Save className="h-4 w-4" /> Save</div>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
