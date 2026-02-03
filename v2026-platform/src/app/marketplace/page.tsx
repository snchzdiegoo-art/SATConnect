import { HeroMarketplace } from "@/components/hero-marketplace";

export default function Marketplace() {
    return (
        <main>
            <HeroMarketplace />
            <div className="py-20 text-center container mx-auto">
                <h2 className="text-2xl font-bold mb-4">Marketplace Preview</h2>
                <p className="text-gray-500">
                    Migrated Hero section above. Full product grid to be ported in next step.
                </p>
            </div>
        </main>
    );
}
