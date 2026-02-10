/**
 * SAT Connect - Inventory Table Component
 * Main table for T.H.R.I.V.E. tour inventory with pagination
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { HealthBadge } from '@/components/ui/health-badge';
import type { HealthStatus } from '@/components/ui/health-badge';

interface TourListItem {
    id: number;
    bokun_id: number;
    product_name: string;
    supplier: string;
    location: string;
    is_active: boolean;
    pricing?: {
        net_rate_adult: string;
        shared_factor: string;
    } | null;
    audit?: {
        product_health_score: string;
    } | null;
    calculations?: {
        suggestedPvpAdult: string;
    } | null;
}

interface InventoryTableProps {
    onTourClick?: (tourId: number) => void;
}

export function InventoryTable({ onTourClick }: InventoryTableProps) {
    const searchParams = useSearchParams();
    const [tours, setTours] = useState<TourListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchTours();
    }, [page, searchParams]);

    async function fetchTours() {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20',
            });

            // Add filter params from URL
            const search = searchParams.get('search');
            const providers = searchParams.get('providers');
            const locations = searchParams.get('locations');
            const health = searchParams.get('health');
            const sortBy = searchParams.get('sortBy');
            const sortOrder = searchParams.get('sortOrder');

            if (search) params.set('search', search);
            if (providers) params.set('providers', providers);
            if (locations) params.set('locations', locations);
            if (health) params.set('health', health);
            if (sortBy) params.set('sortBy', sortBy);
            if (sortOrder) params.set('sortOrder', sortOrder);

            const response = await fetch(`/api/tours?${params}`);
            const data = await response.json();

            if (data.success) {
                setTours(data.data);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Error fetching tours:', error);
        } finally {
            setLoading(false);
        }
    }

    function formatCurrency(value?: string | null): string {
        if (!value) return '$0.00';
        const num = parseFloat(value);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(num);
    }

    return (
        <div className="space-y-4">
            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100 border-b-2 border-gray-300">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Bokun ID</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Product Name</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Provider</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Location</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Health</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-900 uppercase tracking-wider">Net Rate</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-900 uppercase tracking-wider">Suggested PVP</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-gray-600 font-medium">
                                    Loading tours...
                                </td>
                            </tr>
                        ) : tours.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-gray-600 font-medium">
                                    No tours found
                                </td>
                            </tr>
                        ) : (
                            tours.map((tour) => (
                                <tr
                                    key={tour.id}
                                    onClick={() => onTourClick?.(tour.id)}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{tour.bokun_id}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{tour.product_name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{tour.supplier}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{tour.location}</td>
                                    <td className="px-4 py-3">
                                        {tour.audit && (
                                            <HealthBadge status={tour.audit.product_health_score as HealthStatus} />
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                                        {tour.pricing?.net_rate_adult ? formatCurrency(String(tour.pricing.net_rate_adult)) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right font-semibold text-green-700">
                                        {tour.calculations?.suggestedPvpAdult ? formatCurrency(String(tour.calculations.suggestedPvpAdult)) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {tour.is_active ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
