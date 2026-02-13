/**
 * SAT Connect - T.H.R.I.V.E. Dashboard Page
 * Main interface for tour inventory management
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
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
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [metrics, setMetrics] = useState({
        healthy: 0,
        audit: 0,
        incomplete: 0,
        global: 0
    });

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

                // Calculate Metrics
                const stats = {
                    healthy: 0,
                    audit: 0,
                    incomplete: 0,
                    global: 0
                };

                data.data.forEach((t: any) => {
                    const status = t.audit?.product_health_score?.toLowerCase();
                    if (status === 'healthy') stats.healthy++;
                    else if (status === 'audit_required') stats.audit++;
                    else if (status === 'incomplete') stats.incomplete++;

                    if (t.audit?.is_suitable_for_global_distribution) stats.global++;
                });
                setMetrics(stats);
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
            bokunId: tour.bokun_id,
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

    async function handleBulkDelete() {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} tours? This action cannot be undone.`)) return;

        try {
            const response = await fetch('/api/tours', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds })
            });
            const data = await response.json();
            if (data.success) {
                alert(`Successfully deleted ${data.count} tours.`);
                setSelectedIds([]);
                setRefreshKey(prev => prev + 1);
                fetchFiltersData(); // Update metrics
            } else {
                alert('Failed to delete: ' + data.error);
            }
        } catch (error) {
            alert('Network error during bulk delete');
        }
    }

    function handleBulkSettings() {
        alert('Bulk settings feature coming soon!');
    }

    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[#050F1A] text-[#29FFC6] font-display tracking-widest"><span className="animate-pulse">INITIALIZING T.H.R.I.V.E. PROTOCOL...</span></div>}>
            <div className="min-h-screen text-gray-900 dark:text-gray-100 overflow-y-scroll bg-transparent">
                {/* Header - Glass Effect */}
                <header className="sticky top-0 z-30 border-b border-gray-200/50 dark:border-gray-800/50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/60 shadow-sm transition-all duration-300">
                    <div className="w-full px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    T.H.R.I.V.E. Engine
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">
                                    Tour Health, Revenue & Inventory Value Engine
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <Button
                                    onClick={() => setShowLoadCenter(!showLoadCenter)}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3"
                                >
                                    {showLoadCenter ? '📊 View Inventory' : '➕ Load Center'}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-200 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-700 dark:hover:text-white transition-colors"
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
                                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-green-600 dark:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-green-700 dark:hover:text-green-300"
                                    onClick={() => setShowImportCSV(true)}
                                >
                                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                                    Import CSV
                                </Button>
                                <Button
                                    variant="outline"
                                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300"
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
                                    className={`ml-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 ${showSettings ? 'ring-2 ring-offset-2 ring-gray-200 dark:ring-gray-700 ring-offset-white dark:ring-offset-gray-900' : ''}`}
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
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">System Settings</h2>
                                <p className="text-gray-500 dark:text-gray-400">Manage custom fields and system configurations.</p>
                            </div>

                            <Tabs defaultValue="custom-fields" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 p-1 rounded-lg">
                                    <TabsTrigger
                                        value="custom-fields"
                                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white rounded-md transition-all shadow-sm"
                                    >
                                        Custom Fields
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="ota-config"
                                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white rounded-md transition-all shadow-sm"
                                    >
                                        OTA Configuration
                                    </TabsTrigger>
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
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Load Center</h2>
                                        <span className="text-gray-500 dark:text-gray-400">Deploy New Tour to System</span>
                                    </div>
                                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg p-6">
                                        <LoadCenterForm onSuccess={handleLoadCenterSuccess} />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="text-2xl">📊</span>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tour Inventory</h2>
                                        <span className="text-gray-500 dark:text-gray-400">Click on any tour to view details</span>
                                    </div>

                                    {/* Filters */}
                                    <ThriveFilters
                                        providers={providers}
                                        locations={locations}
                                    />

                                    {/* Bulk Actions Toolbar */}
                                    {selectedIds.length > 0 && (
                                        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-blue-300">{selectedIds.length} Selected</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={handleBulkSettings}
                                                    variant="outline"
                                                    className="bg-gray-800 hover:bg-gray-700 text-blue-400 border-gray-700"
                                                >
                                                    <Settings className="mr-2 h-4 w-4" />
                                                    Tour Settings
                                                </Button>
                                                <Button
                                                    onClick={handleBulkDelete}
                                                    variant="primary"
                                                    className="bg-red-600 hover:bg-red-700 text-white ring-red-300"
                                                >
                                                    <span className="mr-2">🗑️</span> Erase
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="glass-card p-6 overflow-hidden">
                                        <InventoryTable
                                            key={refreshKey}
                                            onTourClick={handleTourClick}
                                            selectedIds={selectedIds}
                                            onSelectionChange={setSelectedIds}
                                        />
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
                    onClose={() => {
                        setShowEditModal(false);
                        setShowDetailModal(true);
                    }}
                    tour={editingTour}
                    onSave={() => {
                        setRefreshKey(p => p + 1);
                        setShowEditModal(false);
                        setShowDetailModal(true);
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
                    <div className="grid grid-cols-4 gap-6">
                        <div className="glass-card glass-card-hover p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-green-500/20"></div>
                            <div className="flex items-center gap-3 text-green-700 dark:text-green-400 mb-2">
                                <span className="text-2xl p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">⭐</span>
                                <span className="text-sm font-bold uppercase tracking-wide opacity-80">Healthy Products</span>
                            </div>
                            <p className="text-4xl font-black mt-2 text-gray-900 dark:text-white tracking-tight">{metrics.healthy}</p>
                        </div>

                        <div className="glass-card glass-card-hover p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-yellow-500/20"></div>
                            <div className="flex items-center gap-3 text-yellow-700 dark:text-yellow-400 mb-2">
                                <span className="text-2xl p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">⚠️</span>
                                <span className="text-sm font-bold uppercase tracking-wide opacity-80">Audit Required</span>
                            </div>
                            <p className="text-4xl font-black mt-2 text-gray-900 dark:text-white tracking-tight">{metrics.audit}</p>
                        </div>

                        <div className="glass-card glass-card-hover p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-red-500/20"></div>
                            <div className="flex items-center gap-3 text-red-700 dark:text-red-400 mb-2">
                                <span className="text-2xl p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">❌</span>
                                <span className="text-sm font-bold uppercase tracking-wide opacity-80">Incomplete</span>
                            </div>
                            <p className="text-4xl font-black mt-2 text-gray-900 dark:text-white tracking-tight">{metrics.incomplete}</p>
                        </div>

                        <div className="glass-card glass-card-hover p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/20"></div>
                            <div className="flex items-center gap-3 text-blue-700 dark:text-blue-400 mb-2">
                                <span className="text-2xl p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">🌐</span>
                                <span className="text-sm font-bold uppercase tracking-wide opacity-80">Global Ready</span>
                            </div>
                            <p className="text-4xl font-black mt-2 text-gray-900 dark:text-white tracking-tight">{metrics.global}</p>
                        </div>
                    </div>
                </footer>
            </div>
        </Suspense>
    );
}
