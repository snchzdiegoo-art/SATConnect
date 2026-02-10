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
import { FileSpreadsheet, Settings } from 'lucide-react';
import { CsvMapperModal } from '@/components/dashboard/csv-mapper-modal';
import { CustomFieldsSettings } from '@/components/dashboard/custom-fields-settings';
import { OTASettings } from '@/components/dashboard/settings/ota-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { TourEditModal } from '@/components/dashboard/inventory/tour-edit-modal';
import type { TourInput } from '@/lib/thrive-engine';

export default function ThriveEnginePage() {
    const [selectedTourId, setSelectedTourId] = useState<number | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingTour, setEditingTour] = useState<TourInput | null>(null);
    const [showLoadCenter, setShowLoadCenter] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [showImportCSV, setShowImportCSV] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
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

    function handleEditTour(tour: any) {
        // Transform TourDetail to TourInput
        const tourInput: TourInput = {
            id: tour.id.toString(),
            name: tour.product_name,
            provider: tour.supplier,
            netRate: tour.pricing?.net_rate_adult ? parseFloat(tour.pricing.net_rate_adult) : 0,
            publicPrice: tour.calculations?.suggestedPvpAdult ? parseFloat(tour.calculations.suggestedPvpAdult) : 0,

            netChild: tour.pricing?.net_rate_child ? parseFloat(tour.pricing.net_rate_child) : undefined,
            publicChild: tour.calculations?.suggestedPvpChild ? parseFloat(tour.calculations.suggestedPvpChild) : undefined,

            netPrivate: tour.pricing?.net_rate_private ? parseFloat(tour.pricing.net_rate_private) : undefined,
            publicPrivate: tour.calculations?.suggestedPvpPrivate ? parseFloat(tour.calculations.suggestedPvpPrivate) : undefined,

            minPaxShared: tour.pricing?.shared_min_pax,
            minPaxPrivate: tour.pricing?.private_min_pax,
            infantAge: tour.pricing?.infant_age_threshold?.toString(),

            factorShared: tour.pricing?.shared_factor ? parseFloat(tour.pricing.shared_factor) : undefined,
            factorPrivate: tour.pricing?.private_factor ? parseFloat(tour.pricing.private_factor) : undefined,

            images: tour.assets?.pictures_url ? [tour.assets.pictures_url] : [],
            duration: tour.logistics?.duration,
            opsDays: tour.logistics?.days_of_operation,
            cxlPolicy: tour.logistics?.cxl_policy,
            meetingPoint: tour.logistics?.meeting_point_info || tour.logistics?.pickup_info,

            landingPageUrl: tour.assets?.landing_page_url,
            storytelling: tour.assets?.storytelling_url,

            extraFees: tour.pricing?.extra_fees,
            lastUpdate: tour.last_update,
            auditNotes: tour.assets?.notes,

            location: tour.location,
            variants: tour.variants?.map((v: any) => ({
                id: v.id,
                name: v.name,
                description: v.description,
                net_rate_adult: parseFloat(v.net_rate_adult),
                net_rate_child: v.net_rate_child ? parseFloat(v.net_rate_child) : undefined,
                duration: v.duration,
                is_active: v.is_active
            })),
            custom_fields: tour.custom_fields?.map((f: any) => ({
                definition_id: f.definition_id,
                value: f.value
            }))
        };

        setEditingTour(tourInput);
        setShowDetailModal(false);
        setShowEditModal(true);
    }

    function handleLoadCenterSuccess() {
        setShowLoadCenter(false);
        setRefreshKey(prev => prev + 1);
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
                            <Button
                                variant="outline"
                                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 ml-2 mr-2"
                                onClick={async () => {
                                    if (confirm('ARE YOU SURE? This will delete ALL tours from the database. This action cannot be undone.')) {
                                        try {
                                            const res = await fetch('/api/tours', { method: 'DELETE' });
                                            const data = await res.json();
                                            if (data.success) {
                                                alert(`Cleared ${data.count} tours.`);
                                                setRefreshKey(p => p + 1);
                                            } else {
                                                alert('Failed to delete: ' + data.error);
                                            }
                                        } catch (e) {
                                            alert('Network error');
                                        }
                                    }
                                }}
                            >
                                <span className="mr-2">🗑️</span> Clear Data
                            </Button>
                            <Button
                                variant="outline"
                                className="border-green-500 text-green-700 hover:bg-green-50"
                                onClick={() => setShowImportCSV(true)}
                            >
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                Import CSV
                            </Button>
                            <Button
                                variant="outline"
                                className="border-blue-500 text-blue-700 hover:bg-blue-50"
                                onClick={async () => {
                                    try {
                                        const response = await fetch('/api/export/csv');
                                        if (!response.ok) throw new Error('Export failed');

                                        const blob = await response.blob();
                                        const url = window.URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `sat_connect_tours_${new Date().toISOString().split('T')[0]}.csv`;
                                        document.body.appendChild(a);
                                        a.click();
                                        window.URL.revokeObjectURL(url);
                                        document.body.removeChild(a);
                                    } catch (error) {
                                        console.error('Export error:', error);
                                        alert('Failed to export CSV');
                                    }
                                }}
                            >
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                Export CSV
                            </Button>
                            <Button
                                variant="secondary"
                                className={`ml-2 bg-gray-900 text-white hover:bg-gray-800 ${showSettings ? 'ring-2 ring-offset-2 ring-gray-900' : ''}`}
                                onClick={() => setShowSettings(!showSettings)}
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8">
                {showSettings ? (
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">System Settings</h2>
                            <p className="text-gray-500">Manage custom fields and system configurations.</p>
                        </div>

                        <Tabs defaultValue="custom-fields" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-8">
                                <TabsTrigger value="custom-fields">Custom Fields</TabsTrigger>
                                <TabsTrigger value="ota-config">OTA Configuration</TabsTrigger>
                            </TabsList>

                            <TabsContent value="custom-fields">
                                <CustomFieldsSettings />
                            </TabsContent>

                            <TabsContent value="ota-config">
                                <OTASettings />
                            </TabsContent>
                        </Tabs>
                    </div>
                ) : (
                    <>
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
                                />

                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <InventoryTable key={refreshKey} onTourClick={handleTourClick} />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Tour Detail Modal */}
            <TourDetailModal
                tourId={selectedTourId}
                open={showDetailModal}
                onOpenChange={setShowDetailModal}
                onEdit={handleEditTour}
            />

            <TourEditModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                tour={editingTour}
                onSave={() => {
                    setRefreshKey(p => p + 1);
                    setShowEditModal(false);
                }}
            />

            {/* CSV Mapper Modal */}
            <CsvMapperModal
                open={showImportCSV}
                onOpenChange={setShowImportCSV}
                onImportSuccess={() => setRefreshKey(prev => prev + 1)}
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
