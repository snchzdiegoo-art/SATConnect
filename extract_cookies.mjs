import { chromium } from "playwright";

async function run() {
    const profileDir = "C:\\Users\\diego\\.gemini\\antigravity-browser-profile";
    const browser = await chromium.launchPersistentContext(profileDir, {
        headless: true
    });

    const page = await browser.newPage();
    await page.goto("https://notebooklm.google.com/");

    // Get all cookies from the entire context
    const cookies = await browser.cookies();

    let cookieString = "";
    for (const c of cookies) {
        if (c.domain.includes("google.com")) {
            cookieString += `${c.name}=${c.value}; `;
        }
    }

    console.log("----COOKIE_START----");
    console.log(cookieString);
    console.log("----COOKIE_END----");

    await browser.close();
}

run().catch(console.error);
