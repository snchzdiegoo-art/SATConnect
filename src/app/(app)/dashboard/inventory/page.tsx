/**
 * SAT Connect - Inventory Redirect
 * Redirects /dashboard/inventory to /thrive
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InventoryRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/thrive');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Redirecting to T.H.R.I.V.E. Engine...</h2>
                <p className="text-gray-600">Please wait</p>
            </div>
        </div>
    );
}
