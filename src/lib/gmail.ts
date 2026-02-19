import { clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis";

export async function getGmailClient(userId: string) {
    const client = await clerkClient();

    // Get the OAuth token for Google from Clerk
    // Note: 'oauth_google' is the strategy name for Google in Clerk
    const response = await client.users.getUserOauthAccessToken(userId, 'oauth_google');

    if (!response.data || response.data.length === 0) {
        throw new Error("No Google OAuth token found. Please sign in with Google.");
    }

    const token = response.data[0].token;

    // Initialize the OAuth2 client
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: token });

    // Return the Gmail API client
    return google.gmail({ version: 'v1', auth });
}

export async function listThreads(userId: string, limit = 10) {
    const gmail = await getGmailClient(userId);
    const response = await gmail.users.threads.list({
        userId: 'me',
        maxResults: limit,
    });
    return response.data.threads || [];
}

export async function getThread(userId: string, threadId: string) {
    const gmail = await getGmailClient(userId);
    const response = await gmail.users.threads.get({
        userId: 'me',
        id: threadId,
        format: 'metadata', // Get minimal info first, headers will allow us to parse subject/from
        metadataHeaders: ['Subject', 'From', 'Date'],
    });
    return response.data;
}

export async function getThreadFull(userId: string, threadId: string) {
    const gmail = await getGmailClient(userId);
    const response = await gmail.users.threads.get({
        userId: 'me',
        id: threadId,
        format: 'full',
    });
    return response.data;
}
