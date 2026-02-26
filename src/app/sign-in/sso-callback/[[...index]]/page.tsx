import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

/**
 * SSO Callback handler for Clerk OAuth (Google, etc.)
 * Must be at /sign-in/sso-callback to receive the OAuth redirect.
 */
export default function SSOCallbackPage() {
    return (
        <AuthenticateWithRedirectCallback
            signInForceRedirectUrl="/dashboard"
            signUpForceRedirectUrl="/dashboard"
        />
    );
}
