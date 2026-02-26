import { NextResponse } from "next/server";
import { syncBokunCatalog, BokunConfig } from "@/lib/bokun";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Bókun Catalog Sync API
 * Endpoint: /api/bokun/sync
 * 
 * Securely triggers a catalog synchronization from Bókun into Sat Connect.
 */
export async function POST() {
    try {
        const user = await currentUser();
        if (!user || (user.publicMetadata?.role !== "super_admin")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const config: BokunConfig = {
            accessKey: process.env.BOKUN_ACCESS_KEY || "BK-MOCK-ACCESS-KEY",
            secretKey: process.env.BOKUN_SECRET_KEY || "BK-MOCK-SECRET-KEY",
        };

        const result = await syncBokunCatalog(config);

        return NextResponse.json({
            success: true,
            data: result
        }, { status: 200 });

    } catch (error) {
        console.error("[Bókun API Sync] Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
