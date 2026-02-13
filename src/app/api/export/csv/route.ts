import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { CSVPrimitiveValue, CustomFieldValueInput } from '@/lib/types/api';
import { handleAPIError } from '@/lib/api-errors';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Fetch all tours with related data
        const tours = await prisma.tour.findMany({
            include: {
                pricing: true,
                logistics: true,
                assets: true,
                distribution: true,
                custom_fields: {
                    include: {
                        definition: true
                    }
                }
            },
            orderBy: { last_update: 'desc' }
        });

        // Fetch active custom fields to add as headers
        const customFieldDefs = await prisma.customFieldDefinition.findMany({
            where: { is_active: true },
            orderBy: { id: 'asc' }
        });

        // Base Headers
        const baseHeaders = [
            'Bókun ID / SKU',
            'Product Name',
            'Supplier',
            'LOCATION',
            'Bokun MarketPlace',
            'BOKUN STATUS',
            'Active',
            'Audited',
            'Net Rate (Adult)',
            'Shared Factor',
            'SUGGESTED PVP',
            'Net Rate (Child)',
            'Suggested Child Public',
            'Infant Age Threshold',
            'Min Pax (Shared)',
            'Min Pax (Private)',
            'Net Rate (Private)',
            'Private Factor',
            'Suggested Private Public Rate',
            'Last Update',
            'Pictures URL',
            'Duration',
            'Days of Operation',
            'Cancelation Policy',
            'Landing Page URL',
            'Storytelling URL',
            'Meeting point / Pick up',
            'Extra Fees',
            'Proj. Exp ID',
            'Proj. Exp Status',
            'EXPEDIA ID',
            'Expedia Status',
            'VIATOR ID',
            '% Comision Viator',
            'Viator Status',
            'KLOOK ID',
            'Klook Status',
            'Notes'
        ];

        // Add custom field headers (use Label)
        const headers = [
            ...baseHeaders,
            ...customFieldDefs.map(d => d.label)
        ].join(',');

        // Helper to escape CSV values
        const escapeCSV = (value: CSVPrimitiveValue): string => {
            if (value === null || value === undefined) return '';
            const str = String(value);
            // If contains comma, quote, or newline, wrap in quotes and escape internal quotes
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        // Format date for CSV
        const formatDate = (date: Date | null): string => {
            if (!date) return '';
            return date.toISOString().split('T')[0]; // YYYY-MM-DD
        };

        // Calculate suggested prices (matching pricing service logic)
        const calculateSuggestedPVP = (netRate: number | null, factor: number | null): string => {
            if (!netRate || !factor) return '';
            return (netRate * factor).toFixed(2);
        };

        // CSV Rows
        const rows = tours.map(tour => {
            const p = tour.pricing;
            const l = tour.logistics;
            const a = tour.assets;
            const d = tour.distribution;

            return [
                tour.bokun_id || '',
                escapeCSV(tour.product_name),
                escapeCSV(tour.supplier),
                escapeCSV(tour.location),
                escapeCSV(tour.bokun_marketplace_status),
                escapeCSV(tour.bokun_status),
                tour.is_active ? 'TRUE' : 'FALSE',
                tour.is_audited ? 'TRUE' : 'FALSE',
                p?.net_rate_adult || '',
                p?.shared_factor || '',
                calculateSuggestedPVP(p?.net_rate_adult ? Number(p.net_rate_adult) : null, p?.shared_factor ? Number(p.shared_factor) : null),
                p?.net_rate_child || '',
                calculateSuggestedPVP(p?.net_rate_child ? Number(p.net_rate_child) : null, p?.shared_factor ? Number(p.shared_factor) : null),
                p?.infant_age_threshold || '',
                p?.shared_min_pax || '',
                p?.private_min_pax || '',
                p?.net_rate_private || '',
                p?.private_factor || '',
                calculateSuggestedPVP(p?.net_rate_private ? Number(p.net_rate_private) : null, p?.private_factor ? Number(p.private_factor) : null),
                formatDate(tour.last_update),
                escapeCSV(a?.pictures_url),
                escapeCSV(l?.duration),
                escapeCSV(l?.days_of_operation),
                escapeCSV(l?.cxl_policy),
                escapeCSV(a?.landing_page_url),
                escapeCSV(a?.storytelling_url),
                escapeCSV(l?.meeting_point_info),
                escapeCSV(p?.extra_fees),
                escapeCSV(d?.project_expedition_id),
                escapeCSV(d?.project_expedition_status),
                escapeCSV(d?.expedia_id),
                escapeCSV(d?.expedia_status),
                escapeCSV(d?.viator_id),
                d?.viator_commission_percent || '',
                escapeCSV(d?.viator_status),
                escapeCSV(d?.klook_id),
                escapeCSV(d?.klook_status),
                escapeCSV(a?.notes),
                // Map custom fields in order
                ...customFieldDefs.map(def => {
                    const fieldVal = tour.custom_fields.find(f => f.definition_id === def.id);
                    return escapeCSV(fieldVal?.value);
                })
            ].join(',');
        });

        // Generate CSV
        const csv = [headers, ...rows].join('\n');

        // Generate filename with timestamp
        const filename = `sat_connect_tours_${new Date().toISOString().split('T')[0]}.csv`;

        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'no-cache'
            }
        });
    } catch (error) {
        return handleAPIError(error, 'GET /api/export/csv');
    }
}
