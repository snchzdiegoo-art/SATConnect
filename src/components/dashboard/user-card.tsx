import { currentUser } from "@clerk/nextjs/server";
import { UserCardClient } from "./user-card-client";

export async function UserCard() {
    const user = await currentUser();
    if (!user) return null;

    const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Usuario";
    const imageUrl = user.imageUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.firstName}`;
    const role = (user.publicMetadata?.role as string) ?? "Mission Cmdr";

    return <UserCardClient name={name} imageUrl={imageUrl} role={role} />;
}
