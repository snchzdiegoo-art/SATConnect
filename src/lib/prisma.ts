import { PrismaClient } from '@prisma/client'

// ─── Connection Pool Configuration ───────────────────────────────────────────
// Ensures only one PrismaClient instance exists in development (hot-reload safe)
// In production, connection_limit is set for high-throughput marketplace traffic.

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const isDev = process.env.NODE_ENV === 'development'

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: isDev ? ['error', 'warn'] : ['error'],
    datasources: {
        db: {
            url: process.env.POSTGRES_PRISMA_URL,
        }
    }
})

if (isDev) globalForPrisma.prisma = prisma
