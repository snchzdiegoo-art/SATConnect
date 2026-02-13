'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Loader2 } from 'lucide-react';

type CustomField = {
    id: number;
    key: string;
    label: string;
    type: 'text' | 'number' | 'boolean' | 'select';
    options?: string;
    is_active: boolean;
};

export function CustomFieldsSettings() {
    const [fields, setFields] = useState<CustomField[]>([]);
    const [loading, setLoading] = useState(true);
    const [newField, setNewField] = useState({
        label: '',
        key: '',
        type: 'text',
        options: ''
    });
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchFields();
    }, []);

    const fetchFields = async () => {
        try {
            const res = await fetch('/api/custom-fields');
            const data = await res.json();
            if (data.success) {
                setFields(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch fields', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newField.label) return;

        setIsCreating(true);
        try {
            const res = await fetch('/api/custom-fields', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    label: newField.label,
                    key: newField.key,
                    type: newField.type,
                    options: newField.options ? newField.options.split(',').map(o => o.trim()) : null
                })
            });

            if (res.ok) {
                setNewField({ label: '', key: '', type: 'text', options: '' });
                fetchFields();
            }
        } catch (error) {
            console.error('Failed to create field', error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-end gap-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="space-y-2 flex-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Field Label</label>
                    <Input
                        placeholder="e.g., Difficulty Level"
                        value={newField.label}
                        className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                        onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                    />
                </div>
                <div className="space-y-2 flex-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Key (slug)</label>
                    <Input
                        placeholder="e.g., difficulty_level"
                        value={newField.key}
                        className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700 focus:border-blue-500 font-mono text-gray-900 dark:text-gray-100"
                        onChange={(e) => setNewField({ ...newField, key: e.target.value })}
                    />
                </div>
                <div className="space-y-2 w-40">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Type</label>
                    <Select
                        value={newField.type}
                        onValueChange={(val) => setNewField({ ...newField, type: val as any })}
                    >
                        <SelectTrigger className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean (Yes/No)</SelectItem>
                            <SelectItem value="select">Select (Dropdown)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {newField.type === 'select' && (
                    <div className="space-y-2 flex-1">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Options</label>
                        <Input
                            placeholder="e.g., Easy, Medium, Hard"
                            value={newField.options}
                            className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                            onChange={(e) => setNewField({ ...newField, options: e.target.value })}
                        />
                    </div>
                )}
                <Button
                    onClick={handleCreate}
                    disabled={isCreating || !newField.label || !newField.key}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50"
                >
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                    Add Field
                </Button>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-900">
                        <TableRow className="border-b border-gray-200 dark:border-gray-800 hover:bg-transparent">
                            <TableHead className="text-gray-700 dark:text-gray-300">Label</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300">Key</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300">Type</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300">Options</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</TableCell>
                            </TableRow>
                        ) : fields.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No custom fields defined yet. Add one above!
                                </TableCell>
                            </TableRow>
                        ) : (
                            fields.map((field) => (
                                <TableRow key={field.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">{field.label}</TableCell>
                                    <TableCell className="font-mono text-xs text-gray-500 dark:text-gray-400">{field.key}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">{field.type}</Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                                        {field.options ? JSON.parse(field.options).map((o: string) => o.trim()).join(', ') : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={field.is_active ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'text-gray-500 border-gray-300 dark:text-gray-400 dark:border-gray-700'}>
                                            {field.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
