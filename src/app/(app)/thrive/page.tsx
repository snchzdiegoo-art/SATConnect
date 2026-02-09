/**
 * SAT Connect - T.H.R.I.V.E. Dashboard Page
 * Main interface for tour inventory management
 */

'use client';

import { useState, useEffect } from 'react';
import { InventoryTable } from '@/components/dashboard/inventory-table';
import { TourDetailModal } from '@/components/dashboard/tour-detail-modal';
import { LoadCenterForm } from '@/components/dashboard/load-center-form';
import { ThriveFilters } from '@/components/dashboard/thrive-filters';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';

export default function ThriveEnginePage() {
    const [selectedTourId, setSelectedTourId] = useState<number | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showLoadCenter, setShowLoadCenter] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [showImportCSV, setShowImportCSV] = useState(false);
    const [providers, setProviders] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);

    // Fetch unique filter options
    useEffect(() => {
        fetchFiltersData();
    }, []);

    async function fetchFiltersData() {
        try {
            const response = await fetch('/api/tours?limit=1000');
            const data = await response.json();
            if (data.success) {
                const uniqueProviders = Array.from(
                    new Set(data.data.map((t: any) => t.supplier).filter(Boolean))
                ) as string[];
                setProviders(uniqueProviders.sort());

                const uniqueLocations = Array.from(
                    new Set(data.data.map((t: any) => t.location).filter(Boolean))
                ) as string[];
                setLocations(uniqueLocations.sort());
            }
        } catch (error) {
            console.error('Error fetching filter data:', error);
        }
    }

    function handleTourClick(tourId: number) {
        setSelectedTourId(tourId);
        setShowDetailModal(true);
    }

    function handleLoadCenterSuccess() {
        setShowLoadCenter(false);
        setRefreshKey(prev => prev + 1); // Refresh table
    }

    async function handleCSVImport(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/tours/import/csv', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                alert(`✓ CSV imported successfully!\n${result.created} created, ${result.updated} updated`);
                setRefreshKey(prev => prev + 1);
            } else {
                alert(`✗ Import failed: ${result.error}`);
            }
        } catch (error) {
            alert(`✗ Network error: ${error}`);
        }

        // Reset input
        event.target.value = '';
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white border-b shadow-sm">
                <div className="w-full px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                T.H.R.I.V.E. Engine
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Tour Health, Revenue Intelligence, Value Evaluation
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => setShowLoadCenter(!showLoadCenter)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3"
                            >
                                {showLoadCenter ? '📊 View Inventory' : '➕ Load Center'}
                            </Button>
                            <label htmlFor="csv-upload">
                                <Button
                                    variant="outline"
                                    className="border-green-500 text-green-700 hover:bg-green-50"
                                    onClick={() => document.getElementById('csv-upload')?.click()}
                                >
                                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                                    Import CSV
                                </Button>
                                <input
                                    id="csv-upload"
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    onChange={handleCSVImport}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8">
                {showLoadCenter ? (
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl">🚀</span>
                            <h2 className="text-2xl font-bold text-gray-900">Load Center</h2>
                            <span className="text-gray-500">Deploy New Tour to System</span>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <LoadCenterForm onSuccess={handleLoadCenterSuccess} />
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl">📊</span>
                            <h2 className="text-2xl font-bold text-gray-900">Tour Inventory</h2>
                            <span className="text-gray-500">Click on any tour to view details</span>
                        </div>

                        {/* Filters */}
                        <ThriveFilters
                            providers={providers}
                            locations={locations}
                            onFilterChange={() => setRefreshKey(prev => prev + 1)}
                        />

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <InventoryTable key={refreshKey} onTourClick={handleTourClick} />
                        </div>
                    </div>
                )}
            </main>

            {/* Tour Detail Modal */}
            <TourDetailModal
                tourId={selectedTourId}
                open={showDetailModal}
                onOpenChange={setShowDetailModal}
            />

            {/* Footer Stats */}
            <footer className="w-full px-6 py-8">
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow border border-green-200">
                        <div className="flex items-center gap-2 text-green-600">
                            <span className="text-2xl">⭐</span>
                            <span className="text-sm font-medium">Healthy Products</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">—</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow border border-yellow-200">
                        <div className="flex items-center gap-2 text-yellow-600">
                            <span className="text-2xl">⚠️</span>
                            <span className="text-sm font-medium">Audit Required</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">—</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow border border-red-200">
                        <div className="flex items-center gap-2 text-red-600">
                            <span className="text-2xl">❌</span>
                            <span className="text-sm font-medium">Incomplete</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">—</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow border border-blue-200">
                        <div className="flex items-center gap-2 text-blue-600">
                            <span className="text-2xl">🌐</span>
                            <span className="text-sm font-medium">Global Ready</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">—</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
