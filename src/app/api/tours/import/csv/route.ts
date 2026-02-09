/**
 * SAT Connect - CSV Import API
 * POST: Upload CSV file and create/update tours
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        // Read CSV content
        const text = await file.text();
        const lines = text.split('\n');
        if (lines.length < 2) {
            return NextResponse.json({ success: false, error: 'CSV file is empty' }, { status: 400 });
        }

        // Parse headers
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

        let created = 0;
        let updated = 0;
        let errors = 0;

        // Process each row
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = parseCSVLine(line);
            if (values.length !== headers.length) {
                console.warn(`Skipping row ${i + 1}: column count mismatch`);
                errors++;
                continue;
            }

            // Map CSV to object
            const row: Record<string, string> = {};
            headers.forEach((header, idx) => {
                row[header] = values[idx];
            });

            try {
                // Check if tour exists by bokun_id
                const bokunId = row.bokun_id_txt ? parseInt(row.bokun_id_txt) : undefined;
                const existing = bokunId ? await prisma.tour.findUnique({ where: { bokun_id: bokunId } }) : null;

                const tourData = {
                    product_name: row.product_name,
                    supplier: row.supplier,
                    location: row.location,
                    bokun_id: bokunId,
                    is_active: row.is_active?.toLowerCase() === 'true' || row.is_active === '1',
                    is_audited: false,
                };

                if (existing) {
                    // UPDATE
                    await prisma.tour.update({
                        where: { id: existing.id },
                        data: {
                            ...tourData,
                            pricing: {
                                update: {
                                    net_rate_adult: parseDecimal(row.net_rate_adult),
                                    shared_factor: parseDecimal(row.shared_factor) || new Prisma.Decimal(1.5),
                                    net_rate_child: row.net_rate_child ? parseDecimal(row.net_rate_child) : undefined,
                                    infant_age_threshold: row.infant_age_threshold ? parseInt(row.infant_age_threshold) : undefined,
                                    shared_min_pax: row.shared_min_pax ? parseInt(row.shared_min_pax) : undefined,
                                    net_rate_private: row.private_min_pax_net_rate ? parseDecimal(row.private_min_pax_net_rate) : undefined,
                                    private_factor: parseDecimal(row.private_factor) || new Prisma.Decimal(1.5),
                                    private_min_pax: row.private_min_pax ? parseInt(row.private_min_pax) : undefined,
                                    extra_fees: row.extra_fees || undefined,
                                },
                            },
                            logistics: {
                                update: {
                                    duration: row.duration || undefined,
                                    days_of_operation: row.days_of_operation || undefined,
                                    cxl_policy: row.cxl_policy || undefined,
                                    meeting_point_info: row.meeting_point_info || undefined,
                                    pickup_info: row.pickup_info || undefined,
                                },
                            },
                            assets: {
                                update: {
                                    pictures_url: row.pictures_url || undefined,
                                    landing_page_url: row.landing_page_url || undefined,
                                    storytelling_url: row.storytelling_url || undefined,
                                    notes: row.notes || undefined,
                                },
                            },
                        },
                    });
                    updated++;
                } else {
                    // CREATE
                    await prisma.tour.create({
                        data: {
                            ...tourData,
                            pricing: {
                                create: {
                                    net_rate_adult: parseDecimal(row.net_rate_adult) || new Prisma.Decimal(0),
                                    shared_factor: parseDecimal(row.shared_factor) || new Prisma.Decimal(1.5),
                                    net_rate_child: row.net_rate_child ? parseDecimal(row.net_rate_child) : undefined,
                                    infant_age_threshold: row.infant_age_threshold ? parseInt(row.infant_age_threshold) : undefined,
                                    shared_min_pax: row.shared_min_pax ? parseInt(row.shared_min_pax) : undefined,
                                    net_rate_private: row.private_min_pax_net_rate ? parseDecimal(row.private_min_pax_net_rate) : undefined,
                                    private_factor: parseDecimal(row.private_factor) || new Prisma.Decimal(1.5),
                                    private_min_pax: row.private_min_pax ? parseInt(row.private_min_pax) : undefined,
                                    extra_fees: row.extra_fees || undefined,
                                },
                            },
                            logistics: {
                                create: {
                                    duration: row.duration || undefined,
                                    days_of_operation: row.days_of_operation || undefined,
                                    cxl_policy: row.cxl_policy || undefined,
                                    meeting_point_info: row.meeting_point_info || undefined,
                                    pickup_info: row.pickup_info || undefined,
                                },
                            },
                            assets: {
                                create: {
                                    pictures_url: row.pictures_url || undefined,
                                    landing_page_url: row.landing_page_url || undefined,
                                    storytelling_url: row.storytelling_url || undefined,
                                    notes: row.notes || undefined,
                                },
                            },
                            distribution: {
                                create: {},
                            },
                            audit: {
                                create: {
                                    product_health_score: 'INCOMPLETE',
                                    otas_distribution_score: 0,
                                    global_distribution_ready: false,
                                },
                            },
                        },
                    });
                    created++;
                }
            } catch (err) {
                console.error(`Error processing row ${i + 1}:`, err);
                errors++;
            }
        }

        return NextResponse.json({
            success: true,
            created,
            updated,
            errors,
            message: `Import complete: ${created} created, ${updated} updated, ${errors} errors`,
        });
    } catch (error) {
        console.error('CSV Import Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process CSV file' },
            { status: 500 }
        );
    }
}

// Helper: Parse CSV line handling quoted values
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());

    return result;
}

// Helper: Parse decimal values
function parseDecimal(value: string | undefined): Prisma.Decimal | undefined {
    if (!value || value === '') return undefined;
    const num = parseFloat(value);
    return isNaN(num) ? undefined : new Prisma.Decimal(num);
}
