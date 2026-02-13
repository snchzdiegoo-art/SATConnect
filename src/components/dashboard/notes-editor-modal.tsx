/**
 * SAT Connect - Notes Editor Modal
 * Modal for editing tour notes with save functionality
 */

'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface NotesEditorModalProps {
    tourId: number;
    tourName: string;
    currentNotes: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaveSuccess?: () => void;
}

export function NotesEditorModal({
    tourId,
    tourName,
    currentNotes,
    open,
    onOpenChange,
    onSaveSuccess,
}: NotesEditorModalProps) {
    const [notes, setNotes] = useState(currentNotes || '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset notes when currentNotes or tourId changes
    useEffect(() => {
        setNotes(currentNotes || '');
        setError(null);
    }, [currentNotes, tourId]);

    async function handleSave() {
        setSaving(true);
        setError(null);

        try {
            // For now, use placeholder user data
            // TODO: Replace with actual Clerk user data when authentication is implemented
            const response = await fetch(`/api/tours/${tourId}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    notes,
                    userId: 'temp_user_001', // Placeholder
                    userName: 'System User', // Placeholder
                    userEmail: 'user@satconnect.mx', // Placeholder
                }),
            });

            const data = await response.json();

            if (data.success) {
                onSaveSuccess?.();
                onOpenChange(false);
            } else {
                setError(data.error || 'Failed to save notes');
            }
        } catch (err) {
            setError('Network error - please try again');
        } finally {
            setSaving(false);
        }
    }

    const charCount = notes.length;
    const hasChanges = notes !== (currentNotes || '');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                onPointerDownOutside={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('[data-id="sidebar"]')) {
                        e.preventDefault();
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        📝 Add / Edit Notes: {tourName}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add notes about this tour..."
                        rows={12}
                        className="resize-none text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 border-2 border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 bg-white dark:bg-gray-950"
                    />

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-400 font-medium">{charCount} characters</span>
                        {hasChanges && <span className="text-orange-600 dark:text-orange-400 font-medium">• Unsaved changes</span>}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                            <p className="text-sm text-red-800 dark:text-red-300">✗ {error}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={saving}
                            className="text-gray-700 dark:text-gray-300 font-medium border-2 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving || !hasChanges}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {saving ? '💾 Saving...' : '💾 Save Notes'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
