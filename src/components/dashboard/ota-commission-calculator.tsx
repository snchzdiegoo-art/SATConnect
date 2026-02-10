
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface OTACalculatorProps {
    tourId: number;
    channelKey: string;
    channelName: string;
    currentStatus?: string | null;
    currentCommission?: number | null; // 0-100
    publicPrice: number;
    netRate: number;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { status: string; commission: number }) => Promise<void>;
}

export function OTACommissionCalculator({
    tourId,
    channelKey,
    channelName,
    currentStatus,
    currentCommission,
    publicPrice,
    netRate,
    isOpen,
    onClose,
    onSave
}: OTACalculatorProps) {
    const [status, setStatus] = useState(currentStatus || 'Inactive');
    const [commission, setCommission] = useState<string>(currentCommission?.toString() || '');
    const [loading, setLoading] = useState(false);
    const [globalDefault, setGlobalDefault] = useState<number>(0);

    // Fetch global default on open
    useEffect(() => {
        if (isOpen) {
            fetchGlobalDefault();
        }
    }, [isOpen, channelKey]);

    useEffect(() => {
        if (currentCommission !== undefined && currentCommission !== null) {
            setCommission(currentCommission.toString());
        } else if (globalDefault) {
            setCommission(globalDefault.toString());
        }
    }, [currentCommission, globalDefault, isOpen]);

    useEffect(() => {
        setStatus(currentStatus || 'Inactive');
    }, [currentStatus, isOpen]);

    async function fetchGlobalDefault() {
        try {
            const res = await fetch('/api/settings/ota');
            const data = await res.json();
            if (data.success) {
                const setting = data.data.find((s: any) => s.channel_key === channelKey);
                if (setting) {
                    setGlobalDefault(parseFloat(setting.default_commission));
                    if (!currentCommission) {
                        setCommission(setting.default_commission.toString());
                    }
                }
            }
        } catch (e) {
            console.error('Failed to fetch global defaults', e);
        }
    }

    const commissionVal = parseFloat(commission) || 0;
    const commissionAmount = (publicPrice * commissionVal) / 100;
    const netRevenue = publicPrice - commissionAmount;
    const margin = netRevenue - netRate;
    const isProfitable = margin > 0;

    async function handleSave() {
        try {
            setLoading(true);
            await onSave({
                status,
                commission: commissionVal
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Evaluate {channelName}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Status Selection */}
                    <div className="space-y-2">
                        <Label>Channel Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                                <SelectItem value="Draft">Draft</SelectItem>
                                <SelectItem value="Review">Review</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Commission Input */}
                    <div className="space-y-2">
                        <Label>Commission Percentage</Label>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Input
                                    type="number"
                                    value={commission}
                                    onChange={(e) => setCommission(e.target.value)}
                                    className="pr-8"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                            </div>
                            <div className="text-sm text-gray-500 whitespace-nowrap">
                                Default: {globalDefault}%
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Calculations */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Public Price (PVP):</span>
                            <span className="font-medium">${publicPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                            <span>- Commission ({commissionVal}%):</span>
                            <span>-${commissionAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 font-bold text-gray-900 text-base">
                            <span>Net Revenue:</span>
                            <span>${netRevenue.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-gray-500 pt-1 text-xs">
                            <span>Base Net Rate:</span>
                            <span>${netRate.toFixed(2)}</span>
                        </div>
                        <div className={`flex justify-between font-medium ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                            <span>Estimated Margin:</span>
                            <span>{isProfitable ? '+' : ''}${margin.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
