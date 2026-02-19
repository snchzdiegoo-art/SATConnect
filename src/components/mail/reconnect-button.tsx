"use client"

import { Button } from "@/components/ui/button"
import { useSignIn, useClerk } from "@clerk/nextjs"
import { LogIn } from "lucide-react"

interface ReconnectGmailButtonProps {
    redirectTo?: string
}

export function ReconnectGmailButton({ redirectTo = "/dashboard/mail" }: ReconnectGmailButtonProps) {
    const { signIn, isLoaded } = useSignIn()
    const { signOut } = useClerk()

    const handleReconnect = async () => {
        if (!isLoaded) return

        await signOut()

        if (signIn) {
            await signIn.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: redirectTo,
                redirectUrlComplete: redirectTo,
            })
        }
    }

    return (
        <Button
            onClick={handleReconnect}
            variant="outline"
            className="border-amber-500 text-amber-500 hover:bg-amber-500/10"
        >
            <LogIn className="mr-2 h-4 w-4" />
            Reconectar Google
        </Button>
    )
}
