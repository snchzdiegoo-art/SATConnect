/**
 * SAT Connect - API Type Definitions
 * Precise types to replace `any` usage across the application
 */

import { Decimal } from '@prisma/client/runtime/library';

// ============================================================================
// OTA Channel Types
// ============================================================================

/**
 * Payload for updating OTA channel distribution settings
 */
export interface OTAUpdatePayload {
    // Viator
    viator_id?: string;
    viator_status?: string;
    viator_commission_percent?: number;

    // Expedia
    expedia_id?: string;
    expedia_status?: string;
    expedia_commission?: number;

    // Project Expedition
    project_expedition_id?: string;
    project_expedition_status?: string;
    project_expedition_commission?: number;

    // Klook
    klook_id?: string;
    klook_status?: string;
    klook_commission?: number;

    // Tur.com
    tur_com_status?: string;
    tur_com_commission?: number;

    // Tourist.com
    tourist_com_status?: string;
    tourist_com_commission?: number;

    // Headout
    headout_status?: string;
    headout_commission?: number;

    // TourRadar
    tourradar_status?: string;
    tourradar_commission?: number;

    // Marketplace
    marketplace_b2b_markup?: number;
    marketplace_bokun_markup?: number;
    website_markup?: number;
}

/**
 * Global OTA Settings from database
 */
export interface GlobalOTASetting {
    id: number;
    channel_key: string;
    channel_name: string;
    default_commission: Decimal | string | number;
    is_active: boolean;
}

/**
 * OTA Channel Info for UI display
 */
export interface OTAChannelInfo {
    key: string;
    name: string;
    status: string;
    commission?: number;
}

// ============================================================================
// Tour Variant Types
// ============================================================================

/**
 * Tour variant data for create/update operations
 */
export interface TourVariantInput {
    id?: number; // If present, update; if absent, create
    name: string;
    description?: string | null;
    net_rate_adult: number | string;
    net_rate_child?: number | string | null;
    duration?: string | null;
    is_active?: boolean;
}

// ============================================================================
// Custom Field Types
// ============================================================================

/**
 * Custom field value input
 */
export interface CustomFieldValueInput {
    definition_id: number;
    value: string;
}

/**
 * Custom field definition from database
 */
export interface CustomFieldDefinition {
    id: number;
    key: string;
    label: string;
    type: 'text' | 'number' | 'boolean' | 'select';
    options: string | null; // JSON string for select options
    is_active: boolean;
}

// ============================================================================
// CSV Import/Export Types
// ============================================================================

/**
 * Type-safe primitive value types for CSV parsing
 */
export type CSVPrimitiveValue = string | number | null | undefined;

/**
 * CSV row data (generic key-value pairs)
 */
export type CSVRowData = Record<string, CSVPrimitiveValue>;

/**
 * Type guard to check if value is valid CSV primitive
 */
export function isCSVPrimitiveValue(value: unknown): value is CSVPrimitiveValue {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        value === null ||
        value === undefined
    );
}

// ============================================================================
// Utility Types for Type-Safe Data Transformation
// ============================================================================

/**
 * Helper to build OTA update payload from channel key and data
 */
export function buildOTAPayload(
    channelKey: string,
    data: { status: string; commission: number }
): Partial<OTAUpdatePayload> {
    const payload: Partial<OTAUpdatePayload> = {};

    switch (channelKey) {
        case 'viator':
            payload.viator_status = data.status;
            payload.viator_commission_percent = data.commission;
            break;
        case 'expedia':
            payload.expedia_status = data.status;
            payload.expedia_commission = data.commission;
            break;
        case 'project_expedition':
            payload.project_expedition_status = data.status;
            payload.project_expedition_commission = data.commission;
            break;
        case 'klook':
            payload.klook_status = data.status;
            payload.klook_commission = data.commission;
            break;
        case 'tur_com':
            payload.tur_com_status = data.status;
            payload.tur_com_commission = data.commission;
            break;
        case 'tourist_com':
            payload.tourist_com_status = data.status;
            payload.tourist_com_commission = data.commission;
            break;
        case 'headout':
            payload.headout_status = data.status;
            payload.headout_commission = data.commission;
            break;
        case 'tourradar':
            payload.tourradar_status = data.status;
            payload.tourradar_commission = data.commission;
            break;
    }

    return payload;
}

/**
 * Type-safe currency parser
 */
export function parseCurrency(value: CSVPrimitiveValue): number {
    if (value === null || value === undefined || value === '') return 0;

    const stringValue = String(value);
    const cleaned = stringValue.replace(/[$,\s]/g, '');
    const parsed = parseFloat(cleaned);

    return isNaN(parsed) ? 0 : parsed;
}

/**
 * Type-safe number-to-string parser (for display fields)
 */
export function parseNumberToString(value: CSVPrimitiveValue): string {
    if (value === null || value === undefined || value === '') return '';
    return String(value);
}
