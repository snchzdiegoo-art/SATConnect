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

    function formatDate(dateString?: string | null): string {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
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

    if (!tour && !loading) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {tour?.product_name || 'Loading...'}
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="py-12 text-center text-gray-500">Loading tour details...</div>
                ) : tour ? (
                    <div className="space-y-6">
                        <Tabs defaultValue="general" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-6">
                                <TabsTrigger value="general">General Info</TabsTrigger>
                                <TabsTrigger value="variants">Variants ({tour.variants?.length || 0})</TabsTrigger>
                                <TabsTrigger value="custom-fields">Custom Fields ({tour.custom_fields?.length || 0})</TabsTrigger>
                            </TabsList>

                            <TabsContent value="general" className="space-y-6">
                                {/* SECTION 1: Technical Specifications */}
                                <section className="border rounded-lg p-6 bg-gray-50">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                                        <span>📋</span>
                                        <span>Technical Specifications</span>
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Bókun ID</label>
                                            <p className="text-sm font-mono text-gray-900">{tour.bokun_id || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Activity Name</label>
                                            <p className="text-sm font-medium text-gray-900">{tour.product_name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Duration</label>
                                            <p className="text-sm text-gray-900">{tour.logistics?.duration || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Days of Operation</label>
                                            <p className="text-sm text-gray-900">{tour.logistics?.days_of_operation || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">CXL Policy</label>
                                            <p className="text-sm text-gray-900">{tour.logistics?.cxl_policy || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Supplier</label>
                                            <p className="text-sm font-medium text-gray-900">{tour.supplier}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Last Update</label>
                                            <p className="text-sm text-gray-900">{formatDate(tour.last_update)}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Free Infant Age</label>
                                            <p className="text-sm text-gray-900">{tour.pricing?.infant_age_threshold ? `${tour.pricing.infant_age_threshold} years` : 'N/A'}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-sm font-medium text-gray-700">Product Health</label>
                                            <div className="mt-1">
                                                {tour.audit && (
                                                    <HealthBadge status={tour.audit.product_health_score as HealthStatus} />
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-sm font-medium text-gray-700">Pickup Info</label>
                                            <p className="text-sm text-gray-900">{tour.logistics?.pickup_info || tour.logistics?.meeting_point_info || 'N/A'}</p>
                                        </div>
                                        {/* Image Display */}
                                        {tour.assets?.pictures_url && (
                                            <div className="col-span-2 mt-4">
                                                <label className="text-sm font-medium text-gray-700 mb-2 block">Tour Image</label>
                                                <div className="relative h-64 w-full rounded-lg overflow-hidden border border-gray-200 group">
                                                    <img
                                                        src={tour.assets.pictures_url}
                                                        alt={tour.product_name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                                        <p className="text-white font-medium text-lg drop-shadow-md">{tour.product_name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* SECTION 2: Shared & Private Rates */}
                                <section className="border rounded-lg p-6 bg-white">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                                        <span>💰</span>
                                        <span>Shared & Private Rates</span>
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Type</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Net Rate</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Factor</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Suggested PVP</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Min Pax</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Per Pax Cost</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {/* Shared Adult */}
                                                <tr className="border-b">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Shared Adult</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(tour.pricing?.net_rate_adult)}</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-900">{tour.pricing?.shared_factor || '1.5'} ×</td>
                                                    <td className="px-4 py-3 text-sm text-right font-medium text-green-600">{formatCurrency(tour.calculations?.suggestedPvpAdult)}</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-900">{tour.pricing?.shared_min_pax || 'N/A'}</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-900">—</td>
                                                </tr>
                                                {/* Shared Child */}
                                                <tr className="border-b">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Shared Child</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(tour.pricing?.net_rate_child)}</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-900">{tour.pricing?.shared_factor || '1.5'} ×</td>
                                                    <td className="px-4 py-3 text-sm text-right font-medium text-green-600">{formatCurrency(tour.calculations?.suggestedPvpChild)}</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-900">—</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-900">—</td>
                                                </tr>
                                                {/* Private */}
                                                <tr className="bg-blue-50 border-b">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Private</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(tour.pricing?.private_min_pax_net_rate)}</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-900">{tour.pricing?.private_factor || '1.5'} ×</td>
                                                    <td className="px-4 py-3 text-sm text-right font-medium text-green-600">{formatCurrency(tour.calculations?.suggestedPvpPrivate)}</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-900">{tour.pricing?.private_min_pax || 'N/A'}</td>
                                                    <td className="px-4 py-3 text-sm text-right font-medium text-blue-600">{formatCurrency(tour.calculations?.perPaxCost)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {tour.pricing?.extra_fees && (
                                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                            <p className="text-sm text-gray-900"><strong className="text-gray-900">Extra Fees:</strong> {tour.pricing.extra_fees}</p>
                                        </div>
                                    )}
                                </section>

                                {/* SECTION 3: OTAs Markup */}
                                <section className="border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
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
                                                className={`flex items-center justify-between p-2 bg-white rounded border transition-all ${channel.key !== 'website' ? 'cursor-pointer hover:border-blue-300 hover:shadow-sm' : ''
                                                    }`}
                                            >
                                                <span className="text-sm font-medium text-gray-900">{channel.name}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded ${channel.status.toLowerCase().includes('active') || channel.status.toLowerCase().includes('published') || channel.status.toLowerCase().includes('live')
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {channel.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Distribution Metrics */}
                                    <div className="space-y-4 bg-white p-4 rounded-lg border">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">OTAs Distribution Score</label>
                                            <OTAScoreBar score={tour.audit?.otas_distribution_score || 0} className="mt-2" />
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t">
                                            <span className="text-sm font-medium text-gray-900">Suitable for Global Distribution?</span>
                                            {tour.audit?.is_suitable_for_global_distribution ? (
                                                <span className="flex items-center gap-1 text-green-600 font-medium">
                                                    <span>✓</span>
                                                    <span>Yes</span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-red-600 font-medium">
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
                                                className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 text-center"
                                            >
                                                📸 Pictures
                                            </a>
                                        )}
                                        {tour.assets?.landing_page_url && (
                                            <a
                                                href={tour.assets.landing_page_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 text-center"
                                            >
                                                🔗 Landing Page
                                            </a>
                                        )}
                                        {tour.assets?.storytelling_url && (
                                            <a
                                                href={tour.assets.storytelling_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 text-center"
                                            >
                                                📖 Storytelling
                                            </a>
                                        )}
                                    </div>

                                    {/* Notes */}
                                    {tour.assets?.notes && (
                                        <div className="mt-4 p-3 bg-white border rounded-md">
                                            <label className="text-sm font-medium text-gray-700">Notes</label>
                                            <p className="text-sm mt-1 text-gray-600 whitespace-pre-wrap">{tour.assets.notes}</p>

                                            {/* Mini Timeline - Last 3 Changes */}
                                            {tour.change_logs && tour.change_logs.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-gray-200">
                                                    <p className="text-xs font-medium text-gray-500 mb-2">Recent Changes:</p>
                                                    <div className="space-y-1.5">
                                                        {tour.change_logs.map((log) => (
                                                            <div key={log.id} className="flex items-center gap-2 text-xs">
                                                                <span className="text-gray-400">•</span>
                                                                <span className="font-medium text-gray-700">
                                                                    {log.user_name || 'Unknown User'}
                                                                </span>
                                                                <span className="text-gray-500">
                                                                    {log.change_type === 'notes_added' ? 'added notes' : 'edited notes'}
                                                                </span>
                                                                <span className="text-gray-400">
                                                                    {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </section>

                            </TabsContent>

                            <TabsContent value="variants" className="space-y-6">
                                <div className="bg-white border rounded-lg p-6 text-center">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tour Variants</h3>
                                    <p className="text-gray-500 mb-6">Manage different options for this tour (e.g., Ticket Only, All Inclusive).</p>

                                    {tour.variants && tour.variants.length > 0 ? (
                                        <div className="space-y-4 text-left">
                                            {tour.variants.map((variant) => (
                                                <div key={variant.id} className="border p-4 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">{variant.name}</h4>
                                                            <p className="text-sm text-gray-500">{variant.description || 'No description'}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-medium">{formatCurrency(variant.net_rate_adult.toString())} <span className="text-xs text-gray-500">Adult</span></div>
                                                            {variant.net_rate_child && (
                                                                <div className="text-sm text-gray-600">{formatCurrency(variant.net_rate_child.toString())} <span className="text-xs text-gray-500">Child</span></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-8 bg-gray-50 rounded-lg border border-dashed">
                                            <p className="text-gray-500">No variants defined yet.</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="custom-fields" className="space-y-6">
                                <div className="bg-white border rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Custom Fields</h3>
                                    {tour.custom_fields && tour.custom_fields.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {tour.custom_fields.map((field) => (
                                                <div key={field.id} className="space-y-1">
                                                    <label className="text-sm font-medium text-gray-700">{field.definition.label}</label>
                                                    <div className="p-2 bg-gray-50 border rounded-md text-sm text-gray-900">
                                                        {field.value || '-'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-12 text-center bg-gray-50 rounded-lg border border-dashed">
                                            <p className="text-gray-500">No custom field values set for this tour.</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                onClick={() => setShowChangeHistory(true)}
                                className="bg-gray-800 hover:bg-gray-900 text-white font-medium"
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
