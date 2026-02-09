import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkHolbox() {
    try {
        const holbox = await prisma.tour.findMany({
            where: {
                name: {
                    contains: 'Holbox',
                    mode: 'insensitive'
                }
            }
        })

        if (holbox.length === 0) {
            console.log('❌ No Holbox tour found in database')
        } else {
            console.log(`✅ Found ${holbox.length} Holbox tour(s):\n`)
            holbox.forEach((tour, idx) => {
                console.log(`\n--- Tour ${idx + 1} ---`)
                console.log(`ID: ${tour.id}`)
                console.log(`Name: ${tour.name}`)
                console.log(`Provider: ${tour.provider}`)
                console.log(`\nECONOMICS - SHARED:`)
                console.log(`  Net Rate: $${tour.netRate}`)
                console.log(`  Public Price: $${tour.publicPrice}`)
                console.log(`  Factor Shared: ${tour.factorShared}`)
                console.log(`\nECONOMICS - CHILD:`)
                console.log(`  Net Child: $${tour.netChild}`)
                console.log(`  Public Child: $${tour.publicChild}`)
                console.log(`\nECONOMICS - PRIVATE:`)
                console.log(`  Net Private: $${tour.netPrivate}`)
                console.log(`  Public Private: $${tour.publicPrivate}`)
                console.log(`  Factor Private: ${tour.factorPrivate}`)
                console.log(`\nOPERATIONAL:`)
                console.log(`  Min Pax Shared: ${tour.minPaxShared}`)
                console.log(`  Min Pax Private: ${tour.minPaxPrivate}`)
                console.log(`  Infant Age: ${tour.infantAge}`)
            })
        }
    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkHolbox()
