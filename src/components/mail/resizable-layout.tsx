"use client";

import { useRef, useCallback, useState, useEffect, ReactNode } from "react";

// ── Shared drag-handle component ────────────────────────────────────────────
function DragHandle({ onMouseDown }: { onMouseDown: () => void }) {
    return (
        <div
            onMouseDown={onMouseDown}
            className="w-1 shrink-0 cursor-col-resize group relative hover:bg-teal-500/40 transition-colors bg-white/5"
            title="Arrastrar para redimensionar"
        >
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className="w-1 h-1 rounded-full bg-teal-400" />
                ))}
            </div>
        </div>
    );
}

// ── 2-panel layout (mail) ────────────────────────────────────────────────────
export interface ResizableMailLayoutProps {
    left: ReactNode;
    right: ReactNode;
    defaultLeftWidth?: number;
    minLeft?: number;
    maxLeft?: number;
    storageKey?: string;
}

export function ResizableMailLayout({
    left,
    right,
    defaultLeftWidth = 280,
    minLeft = 200,
    maxLeft = 560,
    storageKey = "mail-panel-width",
}: ResizableMailLayoutProps) {
    const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
    const isDragging = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) setLeftWidth(Math.min(maxLeft, Math.max(minLeft, parseInt(saved, 10))));
    }, [minLeft, maxLeft, storageKey]);

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging.current || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const newWidth = Math.min(maxLeft, Math.max(minLeft, e.clientX - rect.left));
            setLeftWidth(newWidth);
            localStorage.setItem(storageKey, String(newWidth));
        },
        [minLeft, maxLeft, storageKey]
    );

    const onMouseUp = useCallback(() => {
        isDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [onMouseMove, onMouseUp]);

    const startDrag = () => {
        isDragging.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    };

    return (
        <div ref={containerRef} className="flex flex-1 gap-0 overflow-hidden rounded-xl">
            <div className="flex flex-col glass-panel rounded-l-xl overflow-hidden shrink-0" style={{ width: leftWidth }}>
                {left}
            </div>
            <DragHandle onMouseDown={startDrag} />
            <div className="flex flex-col flex-1 glass-panel rounded-r-xl overflow-hidden">
                {right}
            </div>
        </div>
    );
}

// ── 3-panel layout (calendar: sidebar | grid | detail?) ─────────────────────
export interface ResizableThreePanelLayoutProps {
    left: ReactNode;
    center: ReactNode;
    right?: ReactNode; // optional third panel (shown when provided)
    defaultLeftWidth?: number;
    defaultRightWidth?: number;
    minLeft?: number;
    maxLeft?: number;
    minRight?: number;
    maxRight?: number;
    storageKeyLeft?: string;
    storageKeyRight?: string;
}

export function ResizableThreePanelLayout({
    left,
    center,
    right,
    defaultLeftWidth = 208,
    defaultRightWidth = 288,
    minLeft = 140,
    maxLeft = 400,
    minRight = 220,
    maxRight = 480,
    storageKeyLeft = "cal-left-width",
    storageKeyRight = "cal-right-width",
}: ResizableThreePanelLayoutProps) {
    const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
    const [rightWidth, setRightWidth] = useState(defaultRightWidth);
    const isDraggingLeft = useRef(false);
    const isDraggingRight = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Restore from localStorage
    useEffect(() => {
        const l = localStorage.getItem(storageKeyLeft);
        const r = localStorage.getItem(storageKeyRight);
        if (l) setLeftWidth(Math.min(maxLeft, Math.max(minLeft, parseInt(l, 10))));
        if (r) setRightWidth(Math.min(maxRight, Math.max(minRight, parseInt(r, 10))));
    }, [minLeft, maxLeft, minRight, maxRight, storageKeyLeft, storageKeyRight]);

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            if (isDraggingLeft.current) {
                const newW = Math.min(maxLeft, Math.max(minLeft, e.clientX - rect.left));
                setLeftWidth(newW);
                localStorage.setItem(storageKeyLeft, String(newW));
            }
            if (isDraggingRight.current) {
                const newW = Math.min(maxRight, Math.max(minRight, rect.right - e.clientX));
                setRightWidth(newW);
                localStorage.setItem(storageKeyRight, String(newW));
            }
        },
        [minLeft, maxLeft, minRight, maxRight, storageKeyLeft, storageKeyRight]
    );

    const onMouseUp = useCallback(() => {
        isDraggingLeft.current = false;
        isDraggingRight.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [onMouseMove, onMouseUp]);

    const startLeftDrag = () => {
        isDraggingLeft.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    };

    const startRightDrag = () => {
        isDraggingRight.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    };

    return (
        <div ref={containerRef} className="flex flex-1 gap-0 overflow-hidden rounded-xl min-h-0">
            {/* Left panel */}
            <div className="flex flex-col glass-panel rounded-l-xl overflow-hidden shrink-0" style={{ width: leftWidth }}>
                {left}
            </div>

            <DragHandle onMouseDown={startLeftDrag} />

            {/* Center panel */}
            <div className={`flex flex-col flex-1 glass-panel overflow-hidden min-w-0 ${right ? "" : "rounded-r-xl"}`}>
                {center}
            </div>

            {/* Right panel (optional, only rendered when provided) */}
            {right && (
                <>
                    <DragHandle onMouseDown={startRightDrag} />
                    <div className="flex flex-col glass-panel rounded-r-xl overflow-hidden shrink-0" style={{ width: rightWidth }}>
                        {right}
                    </div>
                </>
            )}
        </div>
    );
}
