/**
 * SAT Connect - Tour Detail Modal Component
 * 3-Section modal showing complete tour information
 */

'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HealthBadge } from '@/components/ui/health-badge';
import { OTAScoreBar } from '@/components/ui/ota-score-bar';
import { NotesEditorModal } from './notes-editor-modal';
import { ChangeHistoryModal } from './change-history-modal';
import { OTACommissionCalculator } from './ota-commission-calculator';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { HealthStatus } from '@/components/ui/health-badge';

interface TourDetail {
    id: number;
    bokun_id?: number | null;
    product_name: string;
    supplier: string;
    location: string;
    is_active: boolean;
    is_audited: boolean;
    last_update: string;
    pricing?: {
        net_rate_adult: string;
        shared_factor: string;
        net_rate_child?: string | null;
        infant_age_threshold?: number | null;
        shared_min_pax?: number | null;
        net_rate_private?: string | null;
        private_factor: string;
        private_min_pax?: number | null;
        private_min_pax_net_rate?: string | null;
        extra_fees?: string | null;
    } | null;
    logistics?: {
        duration?: string | null;
        days_of_operation?: string | null;
        cxl_policy?: string | null;
        meeting_point_info?: string | null;
        pickup_info?: string | null;
    } | null;
    assets?: {
        pictures_url?: string | null;
        landing_page_url?: string | null;
        storytelling_url?: string | null;
        notes?: string | null;
    } | null;
    distribution?: {
        website_markup?: string | null;
        marketplace_bokun_markup?: string | null;
        marketplace_b2b_markup?: string | null;

        viator_id?: string | null;
        viator_status?: string | null;
        viator_commission_percent?: string | null;

        expedia_id?: number | null;
        expedia_status?: string | null;
        expedia_commission?: number | null;

        project_expedition_id?: number | null;
        project_expedition_status?: string | null;
        project_expedition_commission?: number | null;

        klook_id?: number | null;
        klook_status?: string | null;
        klook_commission?: number | null;

        tur_com_status?: string | null;
        tur_com_commission?: number | null;

        tourist_com_status?: string | null;
        tourist_com_commission?: number | null;

        headout_status?: string | null;
        headout_commission?: number | null;

        tourradar_status?: string | null;
        tourradar_commission?: number | null;
    } | null;
    audit?: {
        product_health_score: string;
        otas_distribution_score: number;
        is_suitable_for_global_distribution: boolean;
    } | null;
    change_logs?: Array<{
        id: number;
        change_type: string;
        user_name: string | null;
        user_email: string | null;
        created_at: string;
    }>;
    calculations?: {
        suggestedPvpAdult: string;
        suggestedPvpChild?: string | null;
        suggestedPvpPrivate?: string | null;
        perPaxCost?: string | null;
    } | null;
    variants?: Array<{
        id: number;
        name: string;
        description: string | null;
        net_rate_adult: string;
        net_rate_child: string | null;
        duration: string | null;
        is_active: boolean;
    }>;
    custom_fields?: Array<{
        id: number;
        definition_id: number;
        value: string;
        definition: {
            id: number;
            label: string;
            key: string;
            type: string;
            options: string | null;
        };
    }>;
    health_issues?: string[]; // Added for detailed health feedback
    health_score?: number;    // Added for health score
}

interface TourDetailModalProps {
    tourId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit?: (tour: TourDetail) => void;
}

export function TourDetailModal({ tourId, open, onOpenChange, onEdit }: TourDetailModalProps) {
    const [tour, setTour] = useState<TourDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [showNotesEditor, setShowNotesEditor] = useState(false);
    const [showChangeHistory, setShowChangeHistory] = useState(false);

    useEffect(() => {
        if (open && tourId) {
            fetchTourDetail();
        }
    }, [open, tourId]);

    async function fetchTourDetail() {
        try {
            setLoading(true);
            const response = await fetch(`/api/tours/${tourId}`);
            const data = await response.json();
            if (data.success) {
                setTour(data.data);
            }
        } catch (error) {
            console.error('Error fetching tour:', error);
        } finally {
            setLoading(false);
        }
    }

    function formatCurrency(value?: string | null): string {
        if (!value) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(parseFloat(value));
    }

    const [selectedOTA, setSelectedOTA] = useState<{
        key: string;
        name: string;
        status: string;
        commission?: number;
    } | null>(null);

    async function handleOTASave(data: { status: string; commission: number }) {
        if (!tour || !selectedOTA) return;

        try {
            // Construct payload dynamically based on channel key
            const payload: any = {};

            if (selectedOTA.key === 'viator') {
                payload.viator_status = data.status;
                payload.viator_commission_percent = data.commission;
            } else if (selectedOTA.key === 'expedia') {
                payload.expedia_status = data.status;
                payload.expedia_commission = data.commission;
            } else if (selectedOTA.key === 'project_expedition') {
                payload.project_expedition_status = data.status;
                payload.project_expedition_commission = data.commission;
            } else if (selectedOTA.key === 'klook') {
                payload.klook_status = data.status;
                payload.klook_commission = data.commission;
            } else if (selectedOTA.key === 'tur_com') {
                payload.tur_com_status = data.status;
                payload.tur_com_commission = data.commission;
            } else if (selectedOTA.key === 'tourist_com') {
                payload.tourist_com_status = data.status;
                payload.tourist_com_commission = data.commission;
            } else if (selectedOTA.key === 'headout') {
                payload.headout_status = data.status;
                payload.headout_commission = data.commission;
            } else if (selectedOTA.key === 'tourradar') {
                payload.tourradar_status = data.status;
                payload.tourradar_commission = data.commission;
            }

            const response = await fetch(`/api/tours/${tour.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    distribution: payload
                })
            });

            const result = await response.json();
            if (result.success) {
                // Refresh tour data
                fetchTourDetail();
            }
        } catch (error) {
            console.error('Error saving OTA settings:', error);
        }
    }

    // Custom Health Logic based on User's Formula
    function calculateHealthStatus(currentTour: TourDetail) {
        const critList: string[] = [];
        if (!currentTour.pricing?.net_rate_adult || parseFloat(currentTour.pricing.net_rate_adult) <= 0) critList.push("Net Rate");
        // Check for infant age specifically (prop might need adding to type if missing, checking schema it is optional Int)
        if (currentTour.pricing?.infant_age_threshold === undefined || currentTour.pricing?.infant_age_threshold === null) critList.push("Infant Age");
        if (!currentTour.assets?.pictures_url) critList.push("Pictures");
        if (!currentTour.logistics?.duration) critList.push("Duration");
        if (!currentTour.logistics?.days_of_operation) critList.push("Operation Days");
        if (!currentTour.logistics?.cxl_policy) critList.push("CXL Policy");
        if (!currentTour.logistics?.meeting_point_info && !currentTour.logistics?.pickup_info) critList.push("Meeting Pt"); // Checking both as they are similar

        const warnList: string[] = [];
        if (!currentTour.assets?.landing_page_url) warnList.push("Landing Page");
        if (!currentTour.assets?.storytelling_url) warnList.push("Storytelling");

        let statusText = "✅ PRODUCT HEALTHY";
        let statusClass = "bg-green-600 text-white border-green-500";

        if (critList.length > 0) {
            statusText = `🚨 INCOMPLETE: ${critList.join(", ")}`;
            if (warnList.length > 0) {
                statusText += ` | ⚠️ Also Missing: ${warnList.join(", ")}`;
            }
            statusClass = "bg-red-600 text-white border-red-500";
        } else if (warnList.length > 0) {
            statusText += ` | ⚠️ Missing: ${warnList.join(", ")}`;
            // User formula implies it's still "PRODUCT HEALTHY" but with warnings, so maybe keep green or use yellow?
            // "✅ PRODUCT HEALTHY | ⚠️ Missing: ..."
            // I'll stick to a slightly different green or just green with the warning text.
            statusClass = "bg-green-600 text-white border-green-500";
        }

        return { text: statusText, className: statusClass };
    }

    const [isEditingImage, setIsEditingImage] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState("");

    const handleImageUpdate = async () => {
        if (!tour) return;
        try {
            const res = await fetch(`/api/tours/${tour.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assets: {
                        ...tour.assets,
                        pictures_url: newImageUrl
                    }
                })
            });
            const data = await res.json();
            if (data.success) {
                fetchTourDetail();
                setIsEditingImage(false);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to update image");
        }
    }

    if (!tour && !loading) return null;

    const healthStatus = tour ? calculateHealthStatus(tour) : { text: "Loading...", className: "" };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                onPointerDownOutside={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('[data-id="sidebar"]')) {
                        e.preventDefault();
                    }
                }}
            >
                <DialogHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 border border-gray-200 dark:border-gray-700 inline-block px-1">
                                {tour?.bokun_id || 'NO ID'}
                            </div>
                            <DialogTitle className="text-2xl font-bold text-black dark:text-white mt-1">
                                {tour?.product_name || 'Loading...'}
                            </DialogTitle>
                        </div>
                        <div className="text-right">
                            {/* Placeholder for top right actions if needed */}
                        </div>
                    </div>
                </DialogHeader>

                {loading ? (
                    <div className="py-12 text-center text-gray-500">Loading tour details...</div>
                ) : tour ? (
                    <div className="space-y-6">
                        <Tabs defaultValue="general" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                <TabsTrigger value="general" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm">General Info</TabsTrigger>
                                <TabsTrigger value="variants" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm">Variants ({tour.variants?.length || 0})</TabsTrigger>
                                <TabsTrigger value="custom-fields" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm">Custom Fields ({tour.custom_fields?.length || 0})</TabsTrigger>
                            </TabsList>

                            <TabsContent value="general" className="space-y-6">
                                {/* SECTION 1: Technical Specifications */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-black dark:text-gray-200 flex items-center gap-2">
                                        <span>📋</span>
                                        <span>Technical Specifications</span>
                                    </h3>

                                    {/* Custom Grid Layout matching Image 2 style approximately */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 bg-gray-50 dark:bg-gray-950/50 p-4 rounded-lg border border-gray-200 dark:border-gray-800/50">

                                        {/* Row 1: Activity Name (Full Width) handled in header, but user wants specific fields */}
                                        <div className="md:col-span-3">
                                            <label className="text-xs font-bold text-gray-700 dark:text-gray-500 uppercase">Activity</label>
                                            <div className="text-black dark:text-gray-200 font-medium">{tour.product_name}</div>
                                        </div>

                                        {/* Row 2: Duration | Operation | CXL */}
                                        <div className="md:col-span-3 grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-700 dark:text-gray-500 uppercase">Duration</label>
                                                <div className="text-black dark:text-gray-200">{tour.logistics?.duration || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-700 dark:text-gray-500 uppercase">Operation</label>
                                                <div className="text-black dark:text-gray-200">{tour.logistics?.days_of_operation || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-700 dark:text-gray-500 uppercase">CXL Policy</label>
                                                <div className="text-black dark:text-gray-200">{tour.logistics?.cxl_policy || 'N/A'}</div>
                                            </div>
                                        </div>

                                        {/* Row 3: Pickup Info */}
                                        <div className="md:col-span-3">
                                            <label className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase">Pick Up Info</label>
                                            <div className="text-gray-800 dark:text-gray-200">{tour.logistics?.pickup_info || tour.logistics?.meeting_point_info || 'N/A'}</div>
                                        </div>

                                        {/* Row 4: Supplier */}
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-gray-700 dark:text-gray-500 uppercase">Supplier</label>
                                            <div className="text-black dark:text-gray-200">{tour.supplier}</div>
                                        </div>
                                        <div className="md:col-span-1">
                                            <label className="text-xs font-bold text-gray-700 dark:text-gray-500 uppercase">Last Update</label>
                                            <div className="text-black dark:text-gray-200 bg-blue-100 dark:bg-blue-900/20 px-2 py-0.5 rounded inline-block">
                                                {new Date(tour.last_update).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>

                                        {/* Row 5: Free Infant Age & Health */}
                                        <div>
                                            <label className="text-xs font-bold text-gray-700 dark:text-gray-500 uppercase">Free Infant Age</label>
                                            <div className="text-black dark:text-gray-200 bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded inline-block">
                                                {tour.pricing?.infant_age_threshold !== undefined && tour.pricing?.infant_age_threshold !== null
                                                    ? `-${tour.pricing.infant_age_threshold}`
                                                    : 'N/A'}
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 flex items-center gap-2">
                                            <label className="text-xs font-bold text-gray-700 dark:text-gray-500 uppercase whitespace-nowrap">Product Health:</label>
                                            <div className={`flex-1 px-3 py-2 rounded text-xs font-bold border ${healthStatus.className}`}>
                                                {healthStatus.text}
                                            </div>
                                        </div>

                                    </div>

                                    {/* Image Display */}
                                    <div className="mt-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block">Tour Image</label>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 text-xs border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                                                onClick={() => {
                                                    setNewImageUrl(tour.assets?.pictures_url || "");
                                                    setIsEditingImage(!isEditingImage);
                                                }}
                                            >
                                                {isEditingImage ? "Cancel Edit" : "Change Image"}
                                            </Button>
                                        </div>

                                        {isEditingImage && (
                                            <div className="space-y-3 mb-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
                                                <div>
                                                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Upload Image</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (!file) return;

                                                                const formData = new FormData();
                                                                formData.append('file', file);

                                                                try {
                                                                    // Show loading state if needed
                                                                    const res = await fetch('/api/upload', {
                                                                        method: 'POST',
                                                                        body: formData,
                                                                    });
                                                                    const data = await res.json();
                                                                    if (data.success) {
                                                                        setNewImageUrl(data.url);
                                                                    } else {
                                                                        alert('Upload failed');
                                                                    }
                                                                } catch (err) {
                                                                    console.error(err);
                                                                    alert('Upload error');
                                                                }
                                                            }}
                                                            className="flex-1 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-900/20 file:text-blue-400 hover:file:bg-blue-900/30"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="relative">
                                                    <div className="absolute inset-0 flex items-center">
                                                        <span className="w-full border-t border-gray-200 dark:border-gray-800" />
                                                    </div>
                                                    <div className="relative flex justify-center text-xs uppercase">
                                                        <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">Or use URL</span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={newImageUrl}
                                                        onChange={(e) => setNewImageUrl(e.target.value)}
                                                        placeholder="Enter image URL..."
                                                        className="flex-1 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                                                    />
                                                    <Button size="sm" onClick={handleImageUpdate} className="bg-blue-600 hover:bg-blue-700 text-white">
                                                        Save
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="relative h-64 w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 group bg-gray-100 dark:bg-gray-950">
                                            {tour.assets?.pictures_url ? (
                                                <>
                                                    <img
                                                        src={tour.assets.pictures_url}
                                                        alt={tour.product_name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                        }}
                                                    />
                                                    <div className="hidden w-full h-full flex items-center justify-center text-gray-500 bg-gray-100 dark:bg-gray-900">
                                                        <span className="text-lg">Image Load Failed</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-white text-5xl font-medium bg-gray-100 dark:bg-gray-900">
                                                    No Image
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                                <p className="text-white font-medium text-xl drop-shadow-md">{tour.product_name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION 2: Shared & Private Rates */}
                                <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-white dark:bg-gray-900/50">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-teal-600 dark:text-teal-400">
                                        <span>💰</span>
                                        <span>Shared & Private Rates</span>
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-100 dark:bg-gray-800">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Type</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Net Rate</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Factor</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Suggested PVP</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Min Pax</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Per Pax Cost</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                                {/* Shared Adult */}
                                                <tr className="border-b border-gray-200 dark:border-gray-800">
                                                    <td className="px-4 py-3 text-sm font-medium text-black dark:text-gray-200">Shared Adult</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-800 dark:text-gray-300">{formatCurrency(tour.pricing?.net_rate_adult)}</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-400">{tour.pricing?.shared_factor || '1.5'} ×</td>
                                                    <td className="px-4 py-3 text-sm text-right font-medium text-teal-700 dark:text-teal-400">{formatCurrency(tour.calculations?.suggestedPvpAdult)}</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-800 dark:text-gray-300">{tour.pricing?.shared_min_pax || '1'}</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-500 dark:text-gray-500">—</td>
                                                </tr>
                                                {/* Shared Child */}
                                                <tr className="border-b border-gray-200 dark:border-gray-800">
                                                    <td className="px-4 py-3 text-sm font-medium text-black dark:text-gray-200">Shared Child</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-800 dark:text-gray-300">{formatCurrency(tour.pricing?.net_rate_child)}</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-400">{tour.pricing?.shared_factor || '1.5'} ×</td>
                                                    <td className="px-4 py-3 text-sm text-right font-medium text-teal-700 dark:text-teal-400">{formatCurrency(tour.calculations?.suggestedPvpChild)}</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-700 dark:text-gray-300">—</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-500 dark:text-gray-500">—</td>
                                                </tr>
                                                {/* Private */}
                                                <tr className="bg-blue-50 dark:bg-blue-900/10 border-b border-gray-200 dark:border-gray-800">
                                                    <td className="px-4 py-3 text-sm font-medium text-blue-700 dark:text-blue-200">Private</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-700 dark:text-gray-300">{formatCurrency(tour.pricing?.private_min_pax_net_rate)}</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-500 dark:text-gray-400">{tour.pricing?.private_factor || '1.5'} ×</td>
                                                    <td className="px-4 py-3 text-sm text-right font-medium text-blue-600 dark:text-blue-400">{formatCurrency(tour.calculations?.suggestedPvpPrivate)}</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-700 dark:text-gray-300">{tour.pricing?.private_min_pax || 'N/A'}</td>
                                                    <td className="px-4 py-3 text-sm text-right font-medium text-blue-600 dark:text-blue-300">{formatCurrency(tour.calculations?.perPaxCost)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {tour.pricing?.extra_fees && (
                                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                                            <p className="text-sm text-yellow-800 dark:text-yellow-200"><strong className="text-yellow-700 dark:text-yellow-400">Extra Fees:</strong> {tour.pricing.extra_fees}</p>
                                        </div>
                                    )}
                                </div>

                                {/* SECTION 3: OTAs Markup */}
                                <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                        <span>🌐</span>
                                        <span>OTAs Markup & Distribution</span>
                                    </h3>

                                    {/* OTA Channels Grid */}
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        {[
                                            {
                                                key: 'website',
                                                name: 'Website',
                                                status: tour.distribution?.website_markup ? 'Active' : 'Inactive',
                                                commission: 0 // Website doesn't use commission logic here usually
                                            },
                                            {
                                                key: 'viator',
                                                name: 'Viator',
                                                status: tour.distribution?.viator_status || 'Not Listed',
                                                commission: tour.distribution?.viator_commission_percent ? parseFloat(tour.distribution.viator_commission_percent) : null
                                            },
                                            {
                                                key: 'expedia',
                                                name: 'Expedia',
                                                status: tour.distribution?.expedia_status || 'Not Listed',
                                                commission: tour.distribution?.expedia_commission
                                            },
                                            {
                                                key: 'project_expedition',
                                                name: 'Project Expedition',
                                                status: tour.distribution?.project_expedition_status || 'Not Listed',
                                                commission: tour.distribution?.project_expedition_commission
                                            },
                                            {
                                                key: 'klook',
                                                name: 'Klook',
                                                status: tour.distribution?.klook_status || 'Not Listed',
                                                commission: tour.distribution?.klook_commission
                                            },
                                            {
                                                key: 'tur_com',
                                                name: 'Tur.com',
                                                status: tour.distribution?.tur_com_status || 'Not Listed',
                                                commission: tour.distribution?.tur_com_commission
                                            },
                                            {
                                                key: 'tourist_com',
                                                name: 'Tourist.com',
                                                status: tour.distribution?.tourist_com_status || 'Not Listed',
                                                commission: tour.distribution?.tourist_com_commission
                                            },
                                            {
                                                key: 'headout',
                                                name: 'Headout',
                                                status: tour.distribution?.headout_status || 'Not Listed',
                                                commission: tour.distribution?.headout_commission
                                            },
                                            {
                                                key: 'tourradar',
                                                name: 'TourRadar',
                                                status: tour.distribution?.tourradar_status || 'Not Listed',
                                                commission: tour.distribution?.tourradar_commission
                                            },
                                        ].map((channel) => (
                                            <div
                                                key={channel.name}
                                                onClick={() => {
                                                    if (channel.key !== 'website' && channel.key !== 'marketplace') {
                                                        setSelectedOTA({
                                                            key: channel.key,
                                                            name: channel.name,
                                                            status: channel.status,
                                                            commission: channel.commission || undefined
                                                        });
                                                    }
                                                }}
                                                className={`flex items-center justify-between p-2 bg-white dark:bg-gray-950 rounded border border-gray-200 dark:border-gray-800 transition-all ${channel.key !== 'website' ? 'cursor-pointer hover:border-indigo-500 hover:shadow-sm hover:shadow-indigo-900/20' : ''
                                                    }`}
                                            >
                                                <span className="text-sm font-medium text-black dark:text-gray-300">{channel.name}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded ${channel.status.toLowerCase().includes('active') || channel.status.toLowerCase().includes('published') || channel.status.toLowerCase().includes('live')
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-400 border border-green-300 dark:border-green-800'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-500 border border-gray-300 dark:border-gray-700'
                                                    }`}>
                                                    {channel.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Distribution Metrics */}
                                    <div className="space-y-4 bg-gray-50 dark:bg-gray-950 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">OTAs Distribution Score</label>
                                            <OTAScoreBar score={tour.audit?.otas_distribution_score || 0} className="mt-2" />
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                                            <span className="text-sm font-medium text-gray-800 dark:text-gray-300">Suitable for Global Distribution?</span>
                                            {tour.audit?.is_suitable_for_global_distribution ? (
                                                <span className="flex items-center gap-1 text-green-400 font-medium">
                                                    <span>✓</span>
                                                    <span>Yes</span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-red-400 font-medium">
                                                    <span>✗</span>
                                                    <span>No</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Links */}
                                    <div className="mt-6 grid grid-cols-3 gap-3">
                                        {tour.assets?.pictures_url && (
                                            <a
                                                href={tour.assets.pictures_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-700 text-purple-900 dark:text-purple-200 rounded-md text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-800 text-center transition-colors"
                                            >
                                                📸 Pictures
                                            </a>
                                        )}
                                        {tour.assets?.landing_page_url && (
                                            <a
                                                href={tour.assets.landing_page_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-200 rounded-md text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 text-center transition-colors"
                                            >
                                                🔗 Landing Page
                                            </a>
                                        )}
                                        {tour.assets?.storytelling_url && (
                                            <a
                                                href={tour.assets.storytelling_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200 rounded-md text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-800 text-center transition-colors"
                                            >
                                                📖 Storytelling
                                            </a>
                                        )}
                                    </div>

                                    {/* Notes */}
                                    {tour.assets?.notes && (
                                        <div className="mt-4 p-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md">
                                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Notes</label>
                                            <p className="text-sm mt-1 text-gray-800 dark:text-gray-300 whitespace-pre-wrap">{tour.assets.notes}</p>

                                            {/* Mini Timeline - Last 3 Changes */}
                                            {tour.change_logs && tour.change_logs.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                                                    <p className="text-xs font-medium text-gray-500 mb-2">Recent Changes:</p>
                                                    <div className="space-y-1.5">
                                                        {tour.change_logs.map((log) => (
                                                            <div key={log.id} className="flex items-center gap-2 text-xs">
                                                                <span className="text-gray-400 dark:text-gray-600">•</span>
                                                                <span className="font-medium text-gray-700 dark:text-gray-400">
                                                                    {log.user_name || 'Unknown User'}
                                                                </span>
                                                                <span className="text-gray-500">
                                                                    {log.change_type === 'notes_added' ? 'added notes' : 'edited notes'}
                                                                </span>
                                                                <span className="text-gray-600">
                                                                    {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                            </TabsContent>

                            <TabsContent value="variants" className="space-y-6">
                                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 text-center">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">Tour Variants</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">Manage different options for this tour (e.g., Ticket Only, All Inclusive).</p>

                                    {tour.variants && tour.variants.length > 0 ? (
                                        <div className="space-y-4 text-left">
                                            {tour.variants.map((variant) => (
                                                <div key={variant.id} className="border border-gray-200 dark:border-gray-800 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors bg-white dark:bg-gray-950">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-medium text-gray-900 dark:text-gray-200">{variant.name}</h4>
                                                            <p className="text-sm text-gray-500">{variant.description || 'No description'}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-medium text-gray-900 dark:text-white">{formatCurrency(variant.net_rate_adult.toString())} <span className="text-xs text-gray-500">Adult</span></div>
                                                            {variant.net_rate_child && (
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(variant.net_rate_child.toString())} <span className="text-xs text-gray-500">Child</span></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-8 bg-gray-50 dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 border-dashed">
                                            <p className="text-gray-500">No variants defined yet.</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="custom-fields" className="space-y-6">
                                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4">Custom Fields</h3>
                                    {tour.custom_fields && tour.custom_fields.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {tour.custom_fields.map((field) => (
                                                <div key={field.id} className="space-y-1">
                                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{field.definition.label}</label>
                                                    <div className="p-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md text-sm text-gray-800 dark:text-gray-300">
                                                        {field.value || '-'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-12 text-center bg-gray-50 dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 border-dashed">
                                            <p className="text-gray-500">No custom field values set for this tour.</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <Button
                                onClick={() => setShowChangeHistory(true)}
                                className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium border border-gray-200 dark:border-gray-700"
                            >
                                📋 View Change History
                            </Button>
                            <Button
                                onClick={() => setShowNotesEditor(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                            >
                                📝 Add / Edit Notes
                            </Button>
                            {onEdit && (
                                <Button
                                    onClick={() => tour && onEdit(tour)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                >
                                    ✏️ Edit Tour Details
                                </Button>
                            )}
                        </div>
                    </div>
                ) : null}

                {/* Notes Editor Modal */}
                {tour && (
                    <NotesEditorModal
                        tourId={tour.id}
                        tourName={tour.product_name}
                        currentNotes={tour.assets?.notes || null}
                        open={showNotesEditor}
                        onOpenChange={setShowNotesEditor}
                        onSaveSuccess={fetchTourDetail}
                    />
                )}

                {/* Change History Modal */}
                {tour && (
                    <ChangeHistoryModal
                        tourId={tour.id}
                        tourName={tour.product_name}
                        open={showChangeHistory}
                        onOpenChange={setShowChangeHistory}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
