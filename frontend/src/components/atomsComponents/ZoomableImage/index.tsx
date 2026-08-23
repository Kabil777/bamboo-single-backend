"use client"

import Image from "next/image";
import { useCallback, useState } from "react";
/* ── Zoomable Image Component ── */
export function ZoomableImage({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const minScale = 1;
    const maxScale = 5;

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        setScale(prev => {
            const next = Math.min(maxScale, Math.max(minScale, prev + delta));
            if (next <= 1) setPosition({ x: 0, y: 0 });
            return next;
        });
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (scale <= 1) return;
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }, [scale, position]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return;
        setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }, [isDragging, dragStart]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleDoubleClick = useCallback(() => {
        if (scale > 1) {
            setScale(1);
            setPosition({ x: 0, y: 0 });
        } else {
            setScale(2);
        }
    }, [scale]);

    const zoomIn = () => setScale(prev => Math.min(maxScale, prev + 0.5));
    const zoomOut = () => {
        setScale(prev => {
            const next = Math.max(minScale, prev - 0.5);
            if (next <= 1) setPosition({ x: 0, y: 0 });
            return next;
        });
    };
    const resetZoom = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    return (
        <div className="relative flex flex-col">
            {/* Image container */}
            <div
                className="relative overflow-hidden flex items-center justify-center bg-black/5 dark:bg-white/5"
                style={{ height: 'calc(100vh - 10rem)', cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDoubleClick={handleDoubleClick}
            >
                <Image
                    width={width}
                    height={height}
                    src={src}
                    alt={alt}
                    className="select-none pointer-events-none max-w-full max-h-full object-contain"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                    }}
                    draggable={false}
                />
            </div>

            {/* Zoom controls */}
            <div className="flex items-center justify-center gap-1 py-2 px-4 border-t border-border/40 bg-background">
                <button
                    onClick={zoomOut}
                    disabled={scale <= minScale}
                    className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-foreground"
                    aria-label="Zoom out"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M5 12h14" /></svg>
                </button>
                <button
                    onClick={resetZoom}
                    className="px-2.5 py-1 rounded-lg hover:bg-muted transition-colors text-xs font-medium text-muted-foreground min-w-[3.5rem] tabular-nums"
                >
                    {Math.round(scale * 100)}%
                </button>
                <button
                    onClick={zoomIn}
                    disabled={scale >= maxScale}
                    className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-foreground"
                    aria-label="Zoom in"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M12 5v14M5 12h14" /></svg>
                </button>
            </div>
        </div>
    );
}
