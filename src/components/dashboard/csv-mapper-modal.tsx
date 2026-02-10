'use client';

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileSpreadsheet, Upload, Check } from 'lucide-react';

interface CsvMapperModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onImportSuccess: () => void;
}

interface SystemField {
    key: string;
    label: string;
    required?: boolean;
}

const SYSTEM_FIELDS: SystemField[] = [
    { key: 'bokun_id', label: 'Bókun ID / SKU (Required)', required: true },
    { key: 'product_name', label: 'Product Name (Required)', required: true },
    { key: 'supplier', label: 'Supplier' },
    { key: 'location', label: 'Location' },
    { key: 'bokun_status', label: 'Bókun Status' },

    // Pricing
    { key: 'net_rate_adult', label: 'Net Rate (Adult)' },
    { key: 'net_rate_child', label: 'Net Rate (Child)' },
    { key: 'net_rate_private', label: 'Net Rate (Private)' },
    { key: 'shared_factor', label: 'Shared Factor' },
    { key: 'private_factor', label: 'Private Factor' },
    { key: 'min_pax_shared', label: 'Min Pax (Shared)' },
    { key: 'min_pax_private', label: 'Min Pax (Private)' },
    { key: 'infant_age_threshold', label: 'Infant Age Threshold' },
    { key: 'extra_fees', label: 'Extra Fees' },

    // Logistics & Assets
    { key: 'duration', label: 'Duration' },
    { key: 'timeline', label: 'Days of Operation' },
    { key: 'meeting_point_info', label: 'Meeting Point' },
    { key: 'cxl_policy', label: 'Cancelation Policy' },
    { key: 'pictures_url', label: 'Pictures URL' },
    { key: 'landing_page_url', label: 'Landing Page URL' },
    { key: 'storytelling_url', label: 'Storytelling URL' },
    { key: 'notes', label: 'Notes' },

    // OTAs (Specific mappings based on known CSV structure)
    { key: 'viator_id', label: 'Viator ID' },
    { key: 'viator_status', label: 'Viator Status' },
    { key: 'expedia_id', label: 'Expedia ID' },
    { key: 'expedia_status', label: 'Expedia Status' },
    { key: 'gyg_id', label: 'GetYourGuide/Proj. Exp ID' },
    { key: 'gyg_status', label: 'GetYourGuide/Proj. Exp Status' },
    { key: 'klook_id', label: 'Klook ID' },
    { key: 'klook_status', label: 'Klook Status' },
];

// Helper to convert index to Excel-style column (A, B, ... AA, AB)
function getColumnLabel(index: number): string {
    let label = '';
    let i = index;
    while (i >= 0) {
        label = String.fromCharCode(65 + (i % 26)) + label;
        i = Math.floor(i / 26) - 1;
    }
    return label;
}

export function CsvMapperModal({ open, onOpenChange, onImportSuccess }: CsvMapperModalProps) {
    const [step, setStep] = useState<'upload' | 'mapping' | 'importing'>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [headers, setHeaders] = useState<string[]>([]);
    const [mapping, setMapping] = useState<Record<string, number>>({});
    const [previewRows, setPreviewRows] = useState<string[][]>([]);
    const [headerRowIndex, setHeaderRowIndex] = useState<number>(0);
    const [availableFields, setAvailableFields] = useState<SystemField[]>(SYSTEM_FIELDS);

    // Progress State
    const [progress, setProgress] = useState(0);

    // Fetch custom fields on mount
    useEffect(() => {
        const fetchCustomFields = async () => {
            try {
                const res = await fetch('/api/custom-fields');
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    const customFields = data.data.map((f: any) => ({
                        key: `custom_${f.key}`, // Prefix to distinguish/handle in backend
                        label: `${f.label} (Custom)`,
                        required: false
                    }));
                    setAvailableFields([...SYSTEM_FIELDS, ...customFields]);
                }
            } catch (err) {
                console.error('Failed to fetch custom fields for mapping', err);
            }
        };
        if (open) {
            fetchCustomFields();
        }
    }, [open]);
    const [importLogs, setImportLogs] = useState<string[]>([]);
    const logEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logs
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [importLogs]);

    async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        // Fetch preview
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const res = await fetch('/api/tours/import/preview', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                setHeaders(data.headers);
                setPreviewRows(data.preview);
                setHeaderRowIndex(data.headerRowIndex || 0);

                // Auto-map columns
                const newMapping: Record<string, number> = {};
                availableFields.forEach(field => {
                    // Try to find a matching header (case insensitive)
                    const normalizedKey = field.key.replace(/_/g, ' ').toLowerCase();
                    const normalizedLabel = field.label.toLowerCase();

                    const index = data.headers.findIndex((h: string) => {
                        const val = h.toLowerCase();
                        return val.includes(normalizedKey) || val.includes(normalizedLabel);
                    });

                    if (index !== -1) {
                        newMapping[field.key] = index;
                    }
                });
                setMapping(newMapping);
                setStep('mapping');
            } else {
                alert('Failed to preview CSV: ' + data.error);
            }
        } catch (err) {
            alert('Error reading file');
            console.error(err);
        }
    }

    async function handleImport() {
        if (!file) return;

        const missingRequired = availableFields.filter(f => f.required && mapping[f.key] === undefined);
        if (missingRequired.length > 0) {
            alert(`Please map the following required fields: ${missingRequired.map(f => f.label).join(', ')}`);
            return;
        }

        setStep('importing');
        setProgress(0);
        setImportLogs([]);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('mapping', JSON.stringify(mapping));
        formData.append('headerRowIndex', String(headerRowIndex));

        try {
            const response = await fetch('/api/tours/import/csv', {
                method: 'POST',
                body: formData
            });

            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedData = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                accumulatedData += decoder.decode(value, { stream: true });
                const lines = accumulatedData.split('\n');

                // Process all complete lines
                accumulatedData = lines.pop() || ''; // Keep the last partial line

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const msg = JSON.parse(line);

                        if (msg.type === 'start') {
                            setImportLogs(prev => [...prev, `Starting import of ${msg.total} records...`]);
                        } else if (msg.type === 'progress') {
                            const percent = Math.round((msg.current / msg.total) * 100);
                            setProgress(percent);
                        } else if (msg.type === 'log') {
                            setImportLogs(prev => [...prev, msg.message]);
                        } else if (msg.type === 'complete') {
                            setImportLogs(prev => [...prev, `Completed! Updated: ${msg.updated}, Errors: ${msg.errors}`]);

                            // Small delay to read the success msg being closing
                            setTimeout(() => {
                                // alert(`Import Finished! Updated: ${msg.updated}, Errors: ${msg.errors}`);
                                onImportSuccess();
                                // onOpenChange(false); // Don't auto-close so user can see logs
                                // setStep('upload');
                                // setFile(null);
                            }, 500);
                        } else if (msg.type === 'error') {
                            setImportLogs(prev => [...prev, `Error: ${msg.message}`]);
                            alert('Import Error: ' + msg.message);
                        }

                    } catch (e) {
                        console.error('Error parsing stream line:', line, e);
                    }
                }
            }

        } catch (err) {
            alert('Network Error during import');
            setStep('mapping');
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white text-gray-900 border border-gray-200 shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">Import Tours (CSV/XLSX)</DialogTitle>
                </DialogHeader>

                {step === 'upload' && (
                    <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                        <FileSpreadsheet className="h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">Upload your CSV or XLSX file</p>
                        <p className="text-sm text-gray-500 mb-6">Supports .csv and .xlsx formats</p>
                        <input
                            id="csv-upload-input"
                            type="file"
                            accept=".csv,.xlsx"
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                        <Button
                            className="bg-blue-600 text-white hover:bg-blue-700 font-medium"
                            onClick={() => document.getElementById('csv-upload-input')?.click()}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Select File
                        </Button>
                    </div>
                )}

                {step === 'mapping' && (
                    <div className="space-y-6">
                        <p className="text-sm text-gray-600">
                            Map the columns from your CSV to the system fields. We've tried to auto-detect them for you.
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* System Fields List */}
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                                {availableFields.map((field) => (
                                    <div key={field.key} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="mb-2 sm:mb-0">
                                            <p className="font-semibold text-gray-900 text-sm">
                                                {field.label}
                                                {field.required && <span className="text-red-600 ml-1">*</span>}
                                            </p>
                                            <p className="text-xs text-gray-500">System Field</p>
                                        </div>
                                        <ArrowRight className="hidden sm:block h-4 w-4 text-gray-400 mx-4" />
                                        <div className="w-full sm:w-1/2">
                                            <select
                                                className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 p-2"
                                                value={mapping[field.key] ?? -1}
                                                onChange={(e) => setMapping(prev => ({ ...prev, [field.key]: parseInt(e.target.value) }))}
                                            >
                                                <option value={-1} className="text-gray-400">-- Ignore --</option>
                                                {headers.map((header, idx) => (
                                                    <option key={idx} value={idx} className="text-gray-900">
                                                        {header} (Col {getColumnLabel(idx)})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Preview Panel */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-fit sticky top-0">
                                <h4 className="font-semibold mb-4 text-gray-900">File Preview (First 3 Rows)</h4>
                                <div className="space-y-4 overflow-x-auto">
                                    {previewRows.length > 0 ? previewRows.map((row, rowIdx) => (
                                        <div key={rowIdx} className="text-xs border-b border-gray-200 pb-3 mb-2 last:border-0">
                                            {row.slice(0, 5).map((cell, cellIdx) => (
                                                <div key={cellIdx} className="flex gap-2 mb-1">
                                                    <span className="font-bold text-gray-700 w-1/3 truncate" title={headers[cellIdx]}>
                                                        {headers[cellIdx] || `Col ${cellIdx}`}:
                                                    </span>
                                                    <span className="text-gray-900 w-2/3 truncate" title={cell}>{cell}</span>
                                                </div>
                                            ))}
                                            {row.length > 5 && <p className="text-gray-500 italic mt-1">... {row.length - 5} more columns</p>}
                                        </div>
                                    )) : (
                                        <p className="text-gray-500 italic">No preview data available.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => { setStep('upload'); setFile(null); }} className="text-gray-700 border-gray-300 hover:bg-gray-100">
                                Back
                            </Button>
                            <Button onClick={handleImport} className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                                <Check className="mr-2 h-4 w-4" />
                                Confirm Import
                            </Button>
                        </DialogFooter>
                    </div>
                )}

                {step === 'importing' && (
                    <div className="py-12 px-6 flex flex-col items-center justify-center max-w-2xl mx-auto">
                        <div className="w-full mb-4">
                            <div className="flex justify-between text-sm font-medium text-gray-900 mb-2">
                                <span>Importing data...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                    className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                        {/* Log Console */}
                        <div className="w-full relative">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-semibold text-gray-700">Import Logs</label>
                                {importLogs.length > 0 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-6 text-xs"
                                        onClick={() => {
                                            const text = importLogs.join('\n');
                                            navigator.clipboard.writeText(text);
                                            alert('Logs copied to clipboard!');
                                        }}
                                    >
                                        📋 Copy Logs
                                    </Button>
                                )}
                            </div>
                            <div className="w-full bg-gray-900 text-green-400 font-mono text-xs p-4 rounded-lg h-48 overflow-y-auto border border-gray-700 shadow-inner">
                                {importLogs.length === 0 && <p className="text-gray-500">Waiting for server...</p>}
                                {importLogs.map((log, i) => (
                                    <div key={i} className="mb-1 whitespace-pre-wrap">{log}</div>
                                ))}
                                <div ref={logEndRef} />
                            </div>
                        </div>

                        <div className="mt-6 w-full flex justify-center">
                            <Button onClick={() => onOpenChange(false)} variant="outline">
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog >
    );
}
