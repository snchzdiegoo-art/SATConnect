import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkHolbox() {
    try {
        const holbox = await prisma.tour.findMany({
            where: {
                product_name: {
                    contains: 'Holbox',
                    mode: 'insensitive'
                }
            },
            include: {
                pricing: true,
                logistics: true
            }
        })

        if (holbox.length === 0) {
            console.log('❌ No Holbox tour found in database')
        } else {
            console.log(`✅ Found ${holbox.length} Holbox tour(s):\n`)
            holbox.forEach((tour, idx) => {
                console.log(`\n--- Tour ${idx + 1} ---`)
                console.log(`ID: ${tour.id}`)
                console.log(`Name: ${tour.product_name}`)
                console.log(`Provider: ${tour.supplier}`)
                
                if (tour.pricing) {
                    console.log(`\nECONOMICS - SHARED:`)
                    console.log(`  Net Rate: $${tour.pricing.net_rate_adult}`)
                    console.log(`  Factor Shared: ${tour.pricing.shared_factor}`)
                    console.log(`  Calculated Public: $${Number(tour.pricing.net_rate_adult) * Number(tour.pricing.shared_factor)}`)
                    
                    console.log(`\nECONOMICS - CHILD:`)
                    console.log(`  Net Child: $${tour.pricing.net_rate_child}`)
                    
                    console.log(`\nECONOMICS - PRIVATE:`)
                    console.log(`  Net Private: $${tour.pricing.net_rate_private}`)
                    console.log(`  Factor Private: ${tour.pricing.private_factor}`)
                    
                    console.log(`\nOPERATIONAL:`)
                    console.log(`  Min Pax Shared: ${tour.pricing.shared_min_pax}`)
                    console.log(`  Min Pax Private: ${tour.pricing.private_min_pax}`)
                    console.log(`  Infant Age: ${tour.pricing.infant_age_threshold}`)
                } else {
                    console.log('\n❌ No Pricing Data Linked')
                }
            })
        }
    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkHolbox()
