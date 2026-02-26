import asyncio
from playwright.async_api import async_playwright
import os

async def get_cookies():
    profile_dir = r"C:\Users\diego\.gemini\antigravity-browser-profile"
    async with async_playwright() as p:
        # Launch with the persistent context
        browser = await p.chromium.launch_persistent_context(
            user_data_dir=profile_dir,
            headless=True
        )
        
        # Navigate to a Google domain to ensure we get the right cookies
        page = await browser.new_page()
        await page.goto("https://notebooklm.google.com/")
        
        # Get cookies
        cookies = await browser.cookies("https://notebooklm.google.com/")
        
        cookie_parts = []
        for c in cookies:
            cookie_parts.append(f"{c['name']}={c['value']}")
            
        print("; ".join(cookie_parts))
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(get_cookies())
