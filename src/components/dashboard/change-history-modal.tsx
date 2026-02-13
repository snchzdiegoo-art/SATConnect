/**
 * SAT Connect - Change History Modal
 * Timeline view of all changes made to a tour
 */

'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';

interface ChangeLog {
    id: number;
    changeType: string;
    fieldName: string | null;
    oldValue: string | null;
    newValue: string | null;
    userId: string;
    userName: string | null;
    userEmail: string | null;
    createdAt: string;
}

interface ChangeHistoryModalProps {
    tourId: number;
    tourName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ChangeHistoryModal({ tourId, tourName, open, onOpenChange }: ChangeHistoryModalProps) {
    const [changes, setChanges] = useState<ChangeLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (open) {
            fetchChanges();
        }
    }, [open, tourId]);

    async function fetchChanges() {
        setLoading(true);
        try {
            const response = await fetch(`/api/tours/${tourId}/changelog?limit=50`);
            const data = await response.json();

            if (data.success) {
                setChanges(data.changes);
                setTotal(data.total);
            }
        } catch (error) {
            console.error('Error fetching changes:', error);
        } finally {
            setLoading(false);
        }
    }

    function getChangeIcon(changeType: string): string {
        if (changeType.includes('notes')) return '📝';
        if (changeType.includes('pricing')) return '💰';
        if (changeType.includes('created')) return '✨';
        if (changeType.includes('logistics')) return '⚙️';
        if (changeType.includes('assets')) return '📸';
        return '🔵';
    }

    function getChangeLabel(changeType: string): string {
        return changeType
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    function formatTimestamp(dateString: string): { relative: string; absolute: string } {
        const date = new Date(dateString);
        return {
            relative: formatDistanceToNow(date, { addSuffix: true }),
            absolute: date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
        };
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col bg-white"
                onPointerDownOutside={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('[data-id="sidebar"]')) {
                        e.preventDefault();
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">
                        📋 Change History: {tourName}
                    </DialogTitle>
                    <p className="text-sm text-gray-900 font-medium">{total} total changes</p>
                </DialogHeader>

                {loading ? (
                    <div className="py-12 text-center text-gray-500">Loading history...</div>
                ) : changes.length === 0 ? (
                    <div className="py-12 text-center text-gray-500">No changes recorded yet</div>
                ) : (
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {changes.map((change) => {
                            const time = formatTimestamp(change.createdAt);
                            return (
                                <div
                                    key={change.id}
                                    className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{getChangeIcon(change.changeType)}</span>
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {change.userName || 'Unknown User'}
                                                    {change.userEmail && (
                                                        <span className="text-sm font-normal text-gray-600 ml-2">
                                                            ({change.userEmail})
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {time.relative} • {time.absolute}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded font-medium">
                                            {getChangeLabel(change.changeType)}
                                        </span>
                                    </div>

                                    {/* Change Details */}
                                    {change.fieldName && (
                                        <div className="mt-3 space-y-2 pl-9">
                                            {change.oldValue !== null && (
                                                <div className="bg-red-50 border border-red-200 rounded p-2">
                                                    <p className="text-xs font-medium text-red-700 mb-1">Before:</p>
                                                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                                        {change.oldValue || '(empty)'}
                                                    </p>
                                                </div>
                                            )}
                                            {change.newValue !== null && (
                                                <div className="bg-green-50 border border-green-200 rounded p-2">
                                                    <p className="text-xs font-medium text-green-700 mb-1">After:</p>
                                                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                                        {change.newValue || '(empty)'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
