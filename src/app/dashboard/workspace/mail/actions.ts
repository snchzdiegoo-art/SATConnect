"use server";

import { auth } from "@clerk/nextjs/server";
import { getGmailClient } from "@/lib/gmail";

export async function getRecentThreads(limit = 20) {
    const { userId } = await auth();
    if (!userId) {
        return { error: "Not authenticated" };
    }

    try {
        const gmail = await getGmailClient(userId);
        const response = await gmail.users.threads.list({
            userId: 'me',
            maxResults: limit,
        });

        const threads = response.data.threads || [];

        // Fetch details for each thread to display snippet/subject
        // This might be slow if we do it serially. For MVP, we'll fetch details for top 5.
        // Or we rely on the list response + get batch later.
        // Actually, `list` only returns ID and Snippet. We need headers for Subject/From.
        // Let's implement a batch fetch or just loop parallel.

        // Minimal detail fetch for list view
        const detailedThreads = await Promise.all(
            threads.map(async (thread) => {
                try {
                    const details = await gmail.users.threads.get({
                        userId: 'me',
                        id: thread.id!,
                        format: 'metadata',
                        metadataHeaders: ['Subject', 'From', 'Date'],
                    });
                    return details.data;
                } catch (e) {
                    console.error(`Failed to fetch thread ${thread.id}`, e);
                    return null;
                }
            })
        );

        return { threads: detailedThreads.filter(Boolean) };

    } catch (error: any) {
        console.error("Gmail Error:", error);
        if (error.message.includes("No Google OAuth token")) {
            return { error: "No Google OAuth token found", code: "NO_TOKEN" };
        }
        return { error: "Failed to fetch emails" };
    }
}
