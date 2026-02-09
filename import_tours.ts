import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

function parseCurrency(value: any): number {
    if (!value) return 0
    let cleaned = String(value).replace(/US\$|[$€£¥]/g, '').trim()
    cleaned = cleaned.replace(/\.(?=\d{3})/g, '').replace(/,/g, '.')
    return parseFloat(cleaned) || 0
}

function parseNumber(value: any): string {
    if (!value) return ""
    const match = String(value).match(/(-?\d+)/)
    return match ? match[1] : ""
}

function parseImages(value: any): string[] {
    if (!value) return []
    return String(value).split(/[,\n]/).map(url => url.trim()).filter(url => url.length > 0)
}

async function importCSV() {
    const csvPath = 'c:\\Users\\diego\\Documents\\SAT Connect\\DOCUMENTOS BASE\\OTAs TOUR & Activities AUDIT - AUDITORIA_MAESTRA_OTAS (1).csv'

    console.log('Reading CSV file...')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const lines = csvContent.split('\n')

    // Skip first 3 rows (headers)
    const dataLines = lines.slice(3)

    let created = 0
    let updated = 0
    let failed = 0

    for (let i = 0; i < dataLines.length; i++) {
        const line = dataLines[i].trim()
        if (!line) continue

        // Simple CSV parsing (handles quoted fields)
        const row: string[] = []
        let currentField = ''
        let inQuotes = false

        for (let char of line) {
            if (char === '"') {
                inQuotes = !inQuotes
            } else if (char === ',' && !inQuotes) {
                row.push(currentField)
                currentField = ''
            } else {
                currentField += char
            }
        }
        row.push(currentField)

        if (row.length < 20) continue

        const tourId = row[0]?.trim()
        if (!tourId) continue

        const tourData = {
            id: tourId,
            name: row[1]?.trim() || `Tour ${tourId}`,
            provider: row[2]?.trim() || "Por Definir",
            location: row[3]?.trim() || "",

            netRate: parseCurrency(row[8]),
            factorShared: parseFloat(row[9]?.replace(',', '.')) || 0,
            publicPrice: parseCurrency(row[10]),

            netChild: parseCurrency(row[11]),
            publicChild: parseCurrency(row[12]),

            infantAge: parseNumber(row[13]),
            minPaxShared: parseInt(row[14]) || 1,
            minPaxPrivate: parseInt(row[15]) || 1,

            netPrivate: parseCurrency(row[16]),
            factorPrivate: parseFloat(row[17]?.replace(',', '.')) || 0,
            publicPrivate: parseCurrency(row[18]),

            lastUpdate: row[19]?.trim() || "",

            images: parseImages(row[20]),
            duration: row[21]?.trim() || "",
            opsDays: row[22]?.trim() || "",
            cxlPolicy: row[23]?.trim() || "",
            landingPageUrl: row[24]?.trim() || "",
            storytelling: row[25]?.trim() || "",
            meetingPoint: row[26]?.trim() || "",

            extraFees: row[27]?.trim() || "",
            auditNotes: row[37]?.trim() || ""
        }

        // Debug Holbox
        if (tourData.name.toLowerCase().includes('holbox')) {
            console.log('\nHolbox Tour Data:')
            console.log(`  Net Rate: $${tourData.netRate}`)
            console.log(`  Public Price: $${tourData.publicPrice}`)
            console.log(`  Factor: ${tourData.factorShared}`)
            console.log(`  Infant Age: ${tourData.infantAge}`)
            console.log(`  Net Private: $${tourData.netPrivate}`)
        }

        try {
            await prisma.tour.upsert({
                where: { id: tourId },
                update: tourData,
                create: tourData
            })

            const existing = await prisma.tour.findUnique({ where: { id: tourId } })
            if (existing && existing.createdAt.getTime() === existing.updatedAt.getTime()) {
                created++
                console.log(`[CREATE] ${i + 1}/${dataLines.length}: ${tourData.name.substring(0, 50)}`)
            } else {
                updated++
                console.log(`[UPDATE] ${i + 1}/${dataLines.length}: ${tourData.name.substring(0, 50)}`)
            }
        } catch (error: any) {
            failed++
            console.log(`[FAIL] ${i + 1}/${dataLines.length}: ${error.message?.substring(0, 50)}`)
        }
    }

    console.log('\n' + '='.repeat(60))
    console.log('Import Complete!')
    console.log(`Created: ${created}`)
    console.log(`Updated: ${updated}`)
    console.log(`Failed: ${failed}`)
    console.log('='.repeat(60))

    await prisma.$disconnect()
}

importCSV().catch(console.error)
