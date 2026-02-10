import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = file.name.toLowerCase();

        let records: string[][];
        let headerRowIndex = 0;

        // Check file type and parse accordingly
        if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
            // Parse XLSX file
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert to array of arrays (rows and columns)
            records = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: false });

            // Find header row (first non-empty row)
            headerRowIndex = records.findIndex(row => row.some(cell => cell?.toString().trim()));
        } else {
            // Parse CSV file
            const content = buffer.toString('utf-8');
            records = parse(content, {
                columns: false,
                skip_empty_lines: false,
                relax_quotes: true,
                relax_column_count: true
            });

            // Find header row (first non-empty row)
            headerRowIndex = records.findIndex(row => row.some(cell => cell?.trim()));
        }

        if (headerRowIndex === -1) {
            return NextResponse.json({ success: false, error: 'No header row found' }, { status: 400 });
        }

        const headers = records[headerRowIndex];
        const previewRows = records.slice(headerRowIndex + 1, headerRowIndex + 4);

        return NextResponse.json({
            success: true,
            headers,
            preview: previewRows,
            headerRowIndex
        });
    } catch (error: any) {
        console.error('Preview error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
