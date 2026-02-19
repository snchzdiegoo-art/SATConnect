"use client";

import { useEffect, useRef } from "react";

interface EmailBodyProps {
    html: string;
}

export function EmailBody({ html }: EmailBodyProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <style>
                    body {
                        margin: 0;
                        padding: 16px;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: #ffffff;
                        color: #1a1a1a;
                        font-size: 14px;
                        line-height: 1.6;
                    }
                    img { max-width: 100%; height: auto; }
                    a { color: #1a73e8; }
                    * { box-sizing: border-box; }
                </style>
            </head>
            <body>${html}</body>
            </html>
        `);
        doc.close();

        // Auto-resize iframe to fit content
        const resizeObserver = new ResizeObserver(() => {
            if (iframe.contentDocument?.body) {
                iframe.style.height = iframe.contentDocument.body.scrollHeight + "px";
            }
        });

        // Give the iframe a moment to render, then resize
        setTimeout(() => {
            if (iframe.contentDocument?.body) {
                iframe.style.height = iframe.contentDocument.body.scrollHeight + "px";
                resizeObserver.observe(iframe.contentDocument.body);
            }
        }, 100);

        return () => resizeObserver.disconnect();
    }, [html]);

    return (
        <div className="rounded-lg border border-white/10 overflow-hidden bg-white">
            <iframe
                ref={iframeRef}
                title="Email Content"
                sandbox="allow-same-origin allow-popups"
                className="w-full min-h-[200px] border-0"
                style={{ display: "block" }}
            />
        </div>
    );
}
