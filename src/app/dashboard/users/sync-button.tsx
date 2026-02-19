"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { syncUsersFromClerk } from "./actions";
import { useRouter } from "next/navigation";

export function SyncUsersButton() {
    const [isSyncing, setIsSyncing] = useState(false);
    const router = useRouter();

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await syncUsersFromClerk();
            router.refresh();
            // Optionally show toast
        } catch (error) {
            console.error(error);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <Button
            onClick={handleSync}
            disabled={isSyncing}
            variant="outline"
            size="sm"
            className="gap-2 border-teal-500/20 text-teal-400 hover:text-teal-300 hover:bg-teal-500/10"
        >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Sincronizando..." : "Sincronizar Usuarios"}
        </Button>
    );
}
