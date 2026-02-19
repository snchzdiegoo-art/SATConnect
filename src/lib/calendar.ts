import { clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis";

export async function getCalendarClient(userId: string) {
    const client = await clerkClient();
    const response = await client.users.getUserOauthAccessToken(userId, "oauth_google");

    if (!response.data || response.data.length === 0) {
        throw new Error("No Google OAuth token found. Please sign in with Google.");
    }

    const accessToken = response.data[0].token;
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    return google.calendar({ version: "v3", auth });
}
