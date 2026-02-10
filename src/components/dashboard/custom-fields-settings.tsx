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
            <div className="flex items-end gap-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
                <div className="space-y-2 flex-1">
                    <label className="text-sm font-semibold text-gray-700">Field Label</label>
                    <Input
                        placeholder="e.g., Difficulty Level"
                        value={newField.label}
                        className="bg-white border-gray-300 focus:border-blue-500"
                        onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                    />
                </div>
                <div className="space-y-2 flex-1">
                    <label className="text-sm font-semibold text-gray-700">Key (slug)</label>
                    <Input
                        placeholder="e.g., difficulty_level"
                        value={newField.key}
                        className="bg-white border-gray-300 focus:border-blue-500 font-mono"
                        onChange={(e) => setNewField({ ...newField, key: e.target.value })}
                    />
                </div>
                <div className="space-y-2 w-40">
                    <label className="text-sm font-semibold text-gray-700">Type</label>
                    <Select
                        value={newField.type}
                        onValueChange={(val) => setNewField({ ...newField, type: val })}
                    >
                        <SelectTrigger className="bg-white border-gray-300">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean (Yes/No)</SelectItem>
                            <SelectItem value="select">Select (Dropdown)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {newField.type === 'select' && (
                    <div className="space-y-2 flex-1">
                        <label className="text-sm font-semibold text-gray-700">Options</label>
                        <Input
                            placeholder="e.g., Easy, Medium, Hard"
                            value={newField.options}
                            className="bg-white border-gray-300"
                            onChange={(e) => setNewField({ ...newField, options: e.target.value })}
                        />
                    </div>
                )}
                <Button
                    onClick={handleCreate}
                    disabled={isCreating || !newField.label || !newField.key}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                    Add Field
                </Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Label</TableHead>
                            <TableHead>Key</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Options</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
                            </TableRow>
                        ) : fields.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    No custom fields defined yet. Add one above!
                                </TableCell>
                            </TableRow>
                        ) : (
                            fields.map((field) => (
                                <TableRow key={field.id}>
                                    <TableCell className="font-medium">{field.label}</TableCell>
                                    <TableCell className="font-mono text-xs text-gray-500">{field.key}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{field.type}</Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                        {field.options ? JSON.parse(field.options).join(', ') : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={field.is_active ? 'success' : 'outline'} className={field.is_active ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
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
