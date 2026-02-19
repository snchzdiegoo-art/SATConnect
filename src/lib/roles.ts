import { auth } from "@clerk/nextjs/server";

interface CustomSessionClaims {
    metadata: {
        role?: string;
    };
}

export const checkRole = async (role: string) => {
    const { sessionClaims } = await auth();
    return (sessionClaims as unknown as CustomSessionClaims)?.metadata?.role === role;
};

export const isSuperAdmin = async () => {
    const { sessionClaims } = await auth();
    return (sessionClaims as unknown as CustomSessionClaims)?.metadata?.role === 'super_admin';
};

export const isAdmin = async () => {
    const { sessionClaims } = await auth();
    const role = (sessionClaims as unknown as CustomSessionClaims)?.metadata?.role;
    return role === 'super_admin' || role === 'admin';
};
