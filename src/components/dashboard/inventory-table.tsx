import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { HealthBadge } from '@/components/ui/health-badge';
import type { HealthStatus } from '@/components/ui/health-badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Columns, ListFilter } from 'lucide-react';

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
        net_rate_child?: string;
        net_rate_private?: string;
        private_factor?: string;
        infant_age_threshold?: number;
        shared_min_pax?: number;
        private_min_pax?: number;
    } | null;
    logistics?: {
        duration?: string;
        days_of_operation?: string;
        cxl_policy?: string;
    } | null;
    audit?: {
        product_health_score: string;
    } | null;
    calculations?: {
        suggestedPvpAdult: string;
        suggestedPvpChild?: string;
        suggestedPvpPrivate?: string;
    } | null;
}

interface InventoryTableProps {
    onTourClick?: (tourId: number) => void;
    selectedIds?: number[];
    onSelectionChange?: (ids: number[]) => void;
}

type ColumnId =
    | 'bokun_id'
    | 'provider'
    | 'location'
    | 'health'
    | 'net_rate'
    | 'pvp'
    | 'status'
    | 'duration'
    | 'operation'
    | 'cxl'
    | 'infant_age'
    | 'child_net'
    | 'child_pvp'
    | 'private_net'
    | 'private_pvp'
    | 'min_pax_shared'
    | 'min_pax_private'
    | 'shared_factor'
    | 'private_factor';

export function InventoryTable({ onTourClick, selectedIds = [], onSelectionChange }: InventoryTableProps) {
    const searchParams = useSearchParams();
    const [tours, setTours] = useState<TourListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [visibleColumns, setVisibleColumns] = useState<Record<ColumnId, boolean>>({
        bokun_id: true,
        provider: true,
        location: true,
        health: true,
        net_rate: true,
        pvp: true,
        status: true,
        duration: false,
        operation: false,
        cxl: false,
        infant_age: false,
        child_net: false,
        child_pvp: false,
        private_net: false,
        private_pvp: false,
        min_pax_shared: false,
        min_pax_private: false,
        shared_factor: false,
        private_factor: false,
    });

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        fetchTours();
    }, [page, pageSize, searchParams]);

    async function fetchTours() {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: pageSize.toString(),
            });

            // Add filter params from URL
            const search = searchParams.get('search');
            const providers = searchParams.get('providers');
            const locations = searchParams.get('locations');
            const health = searchParams.get('health');
            const sortBy = searchParams.get('sortBy') || 'name';
            const sortOrder = searchParams.get('sortOrder') || 'asc';

            if (search) params.set('search', search);
            if (providers) params.set('providers', providers);
            if (locations) params.set('locations', locations);
            if (health) params.set('health', health);

            // Always set sort params to ensure API uses correct defaults matching UI
            params.set('sortBy', sortBy);
            params.set('sortOrder', sortOrder);

            const response = await fetch(`/api/tours?${params}`);
            const data = await response.json();

            if (data.success) {
                setTours(data.data);
                setTotalPages(data.pagination.totalPages);
                setTotalCount(data.pagination.totalCount);
            }
        } catch (error) {
            console.error('Error fetching tours:', error);
        } finally {
            setLoading(false);
        }
    }

    function formatCurrency(value?: string | number | null): string {
        if (!value) return '$0.00';
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(num);
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = tours.map(t => t.id);
            const newSelection = Array.from(new Set([...selectedIds, ...allIds]));
            onSelectionChange?.(newSelection);
        } else {
            const currentPageIds = new Set(tours.map(t => t.id));
            const newSelection = selectedIds.filter(id => !currentPageIds.has(id));
            onSelectionChange?.(newSelection);
        }
    };

    const handleSelectRow = (id: number, checked: boolean) => {
        if (checked) {
            onSelectionChange?.([...selectedIds, id]);
        } else {
            onSelectionChange?.(selectedIds.filter(selectedId => selectedId !== id));
        }
    };

    const allOnPageSelected = tours.length > 0 && tours.every(t => selectedIds.includes(t.id));

    const toggleColumn = (column: ColumnId) => {
        setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
    };

    return (
        <div className="space-y-4">
            {/* Toolbar - Glass Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5">
                <div className="text-sm font-display text-gray-500 dark:text-gray-300 ml-2">
                    Showing <span className="text-gray-900 dark:text-white font-bold">{(page - 1) * pageSize + 1}</span> to <span className="text-gray-900 dark:text-white font-bold">{Math.min(page * pageSize, totalCount)}</span> of <span className="text-teal-600 dark:text-brand-primary font-bold">{totalCount}</span> tours
                </div>

                <div className="flex items-center gap-3">
                    {/* Rows Per Page */}
                    <div className="flex items-center gap-2 mr-4">
                        <span className="text-sm text-gray-400">Rows:</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-brand-primary hover:border-[#29FFC6]/30 transition-all">
                                    {pageSize} <ChevronDown className="ml-2 h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white dark:bg-brand-teal border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
                                {[5, 10, 20, 25, 50, 100, 200].map((size) => (
                                    <DropdownMenuItem
                                        key={size}
                                        onClick={() => setPageSize(size)}
                                        className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-brand-primary/20 focus:bg-gray-100 dark:focus:bg-[#29FFC6]/20 ${pageSize === size ? 'bg-teal-50 dark:bg-brand-primary/10 text-teal-600 dark:text-brand-primary' : ''}`}
                                    >
                                        {size}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Column Toggle */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:text-teal-600 dark:hover:text-brand-primary hover:border-teal-200 dark:hover:border-brand-primary/30 transition-all">
                                <Columns className="mr-2 h-3 w-3" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-brand-teal border-gray-200 dark:border-white/10 text-gray-900 dark:text-white max-h-[500px] overflow-y-auto">
                            <DropdownMenuLabel className="text-teal-600 dark:text-brand-primary">Standard Columns</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuCheckboxItem checked={visibleColumns.bokun_id} onCheckedChange={() => toggleColumn('bokun_id')}>
                                Bokun ID
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={visibleColumns.provider} onCheckedChange={() => toggleColumn('provider')}>
                                Provider
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={visibleColumns.location} onCheckedChange={() => toggleColumn('location')}>
                                Location
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={visibleColumns.health} onCheckedChange={() => toggleColumn('health')}>
                                Health Score
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={visibleColumns.status} onCheckedChange={() => toggleColumn('status')}>
                                Status
                            </DropdownMenuCheckboxItem>

                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuLabel className="text-brand-primary">Financials & Pricing</DropdownMenuLabel>
                            <DropdownMenuCheckboxItem checked={visibleColumns.net_rate} onCheckedChange={() => toggleColumn('net_rate')}>
                                Net Rate (Adult)
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={visibleColumns.pvp} onCheckedChange={() => toggleColumn('pvp')}>
                                Suggested PVP (Adult)
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={visibleColumns.child_net} onCheckedChange={() => toggleColumn('child_net')}>
                                Child Net Rate
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={visibleColumns.child_pvp} onCheckedChange={() => toggleColumn('child_pvp')}>
                                Child PVP
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={visibleColumns.private_net} onCheckedChange={() => toggleColumn('private_net')}>
                                Private Net Rate
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={visibleColumns.private_pvp} onCheckedChange={() => toggleColumn('private_pvp')}>
                                Private PVP
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={visibleColumns.shared_factor} onCheckedChange={() => toggleColumn('shared_factor')}>
                                Shared Factor
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={visibleColumns.private_factor} onCheckedChange={() => toggleColumn('private_factor')}>
                                Private Factor
                            </DropdownMenuCheckboxItem>

                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuLabel className="text-brand-primary">Logistics & Details</DropdownMenuLabel>
                            <DropdownMenuCheckboxItem checked={visibleColumns.duration} onCheckedChange={() => toggleColumn('duration')}>
                                Duration
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={visibleColumns.operation} onCheckedChange={() => toggleColumn('operation')}>
                                Operation Days
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={visibleColumns.cxl} onCheckedChange={() => toggleColumn('cxl')}>
                                CXL Policy
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={visibleColumns.infant_age} onCheckedChange={() => toggleColumn('infant_age')}>
                                Free Infant Age
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={visibleColumns.min_pax_shared} onCheckedChange={() => toggleColumn('min_pax_shared')}>
                                Min Pax (Shared)
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={visibleColumns.min_pax_private} onCheckedChange={() => toggleColumn('min_pax_private')}>
                                Min Pax (Private)
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Table - Data Matrix */}
            <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-x-auto shadow-sm dark:shadow-[0_4px_30px_#0000004D] bg-white/50 dark:bg-brand-teal/20 backdrop-blur-md">
                <table className="w-full min-w-[1200px]">
                    <thead className="bg-gray-50/80 dark:bg-brand-dark/80 border-b border-gray-200 dark:border-white/10 backdrop-blur-md sticky top-0 z-10 text-left">
                        <tr>
                            <th className="px-4 py-4 w-10">
                                <input
                                    type="checkbox"
                                    checked={allOnPageSelected}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="rounded border-white/20 bg-white/5 text-brand-primary focus:ring-brand-primary h-4 w-4"
                                />
                            </th>
                            {visibleColumns.bokun_id && <th className="px-4 py-4 text-left text-xs font-bold text-brand-primary uppercase tracking-widest font-display">ID</th>}
                            <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest font-display">Active Product</th>
                            {visibleColumns.provider && <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest font-display">Provider</th>}
                            {visibleColumns.location && <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest font-display">Location</th>}
                            {visibleColumns.health && <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest font-display">Health</th>}

                            {/* Financials Header */}
                            {visibleColumns.net_rate && <th className="px-4 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest font-display">Net Rate</th>}
                            {visibleColumns.pvp && <th className="px-4 py-4 text-right text-xs font-bold text-brand-primary uppercase tracking-widest font-display">PVP</th>}
                            {visibleColumns.child_net && <th className="px-4 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest font-display">Child Net</th>}
                            {visibleColumns.child_pvp && <th className="px-4 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest font-display">Child PVP</th>}
                            {visibleColumns.private_net && <th className="px-4 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest font-display">Private Net</th>}
                            {visibleColumns.private_pvp && <th className="px-4 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest font-display">Private PVP</th>}
                            {visibleColumns.shared_factor && <th className="px-4 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest font-display">Shared Factor</th>}
                            {visibleColumns.private_factor && <th className="px-4 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest font-display">Private Factor</th>}

                            {/* Logistics Header */}
                            {visibleColumns.duration && <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest font-display">Duration</th>}
                            {visibleColumns.operation && <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest font-display">Operation</th>}
                            {visibleColumns.cxl && <th className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest font-display">CXL Policy</th>}
                            {visibleColumns.infant_age && <th className="px-4 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest font-display">Infant Age</th>}
                            {visibleColumns.min_pax_shared && <th className="px-4 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest font-display">Min Pax (S)</th>}
                            {visibleColumns.min_pax_private && <th className="px-4 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest font-display">Min Pax (P)</th>}

                            {visibleColumns.status && <th className="px-4 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest font-display">Status</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan={20} className="px-4 py-12 text-center text-brand-primary font-display animate-pulse tracking-widest">
                                    INITIALIZING DATA MATRIX...
                                </td>
                            </tr>
                        ) : tours.length === 0 ? (
                            <tr>
                                <td colSpan={20} className="px-4 py-12 text-center text-gray-500 font-medium">
                                    No data found in current sector
                                </td>
                            </tr>
                        ) : (
                            tours.map((tour) => (
                                <tr
                                    key={tour.id}
                                    onClick={() => onTourClick?.(tour.id)}
                                    className={`group hover:bg-teal-50/50 dark:hover:bg-brand-primary/5 transition-all duration-200 cursor-pointer ${selectedIds.includes(tour.id) ? 'bg-teal-50 dark:bg-brand-primary/10' : ''}`}
                                >
                                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(tour.id)}
                                            onChange={(e) => handleSelectRow(tour.id, e.target.checked)}
                                            className="rounded border-white/20 bg-white/5 text-brand-primary focus:ring-brand-primary h-4 w-4"
                                        />
                                    </td>
                                    {visibleColumns.bokun_id && <td className="px-4 py-3 text-xs font-mono text-gray-700 dark:text-gray-400 group-hover:text-teal-700 dark:group-hover:text-[#29FFC6] transition-colors">{tour.bokun_id}</td>}
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-white transition-colors tracking-tight">{tour.product_name}</td>
                                    {visibleColumns.provider && <td className="px-4 py-3 text-xs text-gray-400 uppercase tracking-wide">{tour.supplier}</td>}
                                    {visibleColumns.location && <td className="px-4 py-3 text-xs text-gray-400">{tour.location}</td>}
                                    {visibleColumns.health && (
                                        <td className="px-4 py-3">
                                            {tour.audit && (
                                                <HealthBadge status={tour.audit.product_health_score as HealthStatus} />
                                            )}
                                        </td>
                                    )}

                                    {/* Financials */}
                                    {visibleColumns.net_rate && (
                                        <td className="px-4 py-3 text-sm text-right font-mono text-gray-300">
                                            {tour.pricing?.net_rate_adult ? formatCurrency(tour.pricing.net_rate_adult) : '-'}
                                        </td>
                                    )}
                                    {visibleColumns.pvp && (
                                        <td className="px-4 py-3 text-sm text-right font-mono text-teal-600 dark:text-brand-primary font-bold shadow-sm dark:shadow-brand-primary/20">
                                            {tour.calculations?.suggestedPvpAdult ? formatCurrency(tour.calculations.suggestedPvpAdult) : '-'}
                                        </td>
                                    )}
                                    {visibleColumns.child_net && (
                                        <td className="px-4 py-3 text-sm text-right font-mono text-gray-400">
                                            {tour.pricing?.net_rate_child ? formatCurrency(tour.pricing.net_rate_child) : '-'}
                                        </td>
                                    )}
                                    {visibleColumns.child_pvp && (
                                        <td className="px-4 py-3 text-sm text-right font-mono text-brand-primary/80 font-medium">
                                            {tour.calculations?.suggestedPvpChild ? formatCurrency(tour.calculations.suggestedPvpChild) : '-'}
                                        </td>
                                    )}
                                    {visibleColumns.private_net && (
                                        <td className="px-4 py-3 text-sm text-right font-mono text-gray-400">
                                            {tour.pricing?.net_rate_private ? formatCurrency(tour.pricing.net_rate_private) : '-'}
                                        </td>
                                    )}
                                    {visibleColumns.private_pvp && (
                                        <td className="px-4 py-3 text-sm text-right font-mono text-brand-primary/80 font-medium">
                                            {tour.calculations?.suggestedPvpPrivate ? formatCurrency(tour.calculations.suggestedPvpPrivate) : '-'}
                                        </td>
                                    )}
                                    {visibleColumns.shared_factor && (
                                        <td className="px-4 py-3 text-xs text-right text-gray-500 font-mono">
                                            {tour.pricing?.shared_factor ?? '-'}
                                        </td>
                                    )}
                                    {visibleColumns.private_factor && (
                                        <td className="px-4 py-3 text-xs text-right text-gray-500 font-mono">
                                            {tour.pricing?.private_factor ?? '-'}
                                        </td>
                                    )}

                                    {/* Logistics */}
                                    {visibleColumns.duration && (
                                        <td className="px-4 py-3 text-xs text-gray-400 font-mono">{tour.logistics?.duration ?? '-'}</td>
                                    )}
                                    {visibleColumns.operation && (
                                        <td className="px-4 py-3 text-xs text-gray-400 max-w-[150px] truncate" title={tour.logistics?.days_of_operation ?? ''}>
                                            {tour.logistics?.days_of_operation ?? '-'}
                                        </td>
                                    )}
                                    {visibleColumns.cxl && (
                                        <td className="px-4 py-3 text-xs text-gray-400 max-w-[150px] truncate" title={tour.logistics?.cxl_policy ?? ''}>
                                            {tour.logistics?.cxl_policy ?? '-'}
                                        </td>
                                    )}
                                    {visibleColumns.infant_age && (
                                        <td className="px-4 py-3 text-xs text-right text-gray-400 font-mono">{tour.pricing?.infant_age_threshold ?? '-'}</td>
                                    )}
                                    {visibleColumns.min_pax_shared && (
                                        <td className="px-4 py-3 text-xs text-right text-gray-400 font-mono">{tour.pricing?.shared_min_pax ?? '-'}</td>
                                    )}
                                    {visibleColumns.min_pax_private && (
                                        <td className="px-4 py-3 text-xs text-right text-gray-400 font-mono">{tour.pricing?.private_min_pax ?? '-'}</td>
                                    )}

                                    {visibleColumns.status && (
                                        <td className="px-4 py-3 text-center">
                                            {tour.is_active ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[#29FFC6]/10 text-brand-primary border border-[#29FFC6]/30 shadow-[0_0_10px_#29FFC633]">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-white/5 text-gray-500 border border-white/10">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination - Glass */}
            <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-500">
                    Sector {page} / {totalPages}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-white/10 bg-white/5 text-gray-300 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#29FFC6]/20 hover:text-brand-primary hover:border-[#29FFC6]/30 transition-all uppercase text-xs font-bold tracking-wider"
                    >
                        Prev Sector
                    </button>
                    <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-teal-50 dark:hover:bg-brand-primary/20 hover:text-teal-600 dark:hover:text-brand-primary hover:border-teal-200 dark:hover:border-brand-primary/30 transition-all uppercase text-xs font-bold tracking-wider"
                    >
                        Next Sector
                    </button>
                </div>
            </div>
        </div>
    );
}
