"use client";

import { useRef, useState, useEffect } from "react";
import { ResumeData } from "@/lib/schema";
import { templates } from "./template-registry";

interface ResumePreviewProps {
    data: ResumeData;
}

export default function ResumePreview({ data }: ResumePreviewProps) {
    const templateId = data.template || "default";
    const ActiveTemplate = templates[templateId]?.component || templates["default"].component;

    const viewportRef = useRef<HTMLDivElement>(null);
    const outerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [viewportScale, setViewportScale] = useState(1);

    // 1. Scale the hardcoded 794x1123 A4 frame to fit the user's actual screen/container
    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        
        const observer = new ResizeObserver((entries) => {
            if (!entries[0]) return;
            // The container width determines the scale ratio to A4 paper
            const w = entries[0].contentRect.width;
            setViewportScale(w / 794);
        });
        
        observer.observe(viewport);
        return () => observer.disconnect();
    }, []);

    // 2. The original scaling algorithm that perfectly squishes text to fit 1 page
    useEffect(() => {
        const calculate = () => {
            const outer = outerRef.current;
            const inner = innerRef.current;
            if (!outer || !inner) return;

            // Temporarily reset scale to measure actual content
            inner.style.transform = "scale(1)";
            inner.style.transformOrigin = "top left";
            inner.style.width = "100%";
            inner.style.height = "100%";

            const containerH = outer.clientHeight; // This will always be 1123
            const containerW = outer.clientWidth;  // This will always be 794
            const contentH = inner.scrollHeight;
            const contentW = inner.scrollWidth;

            const scaleX = containerW / contentW;
            const scaleY = containerH / contentH;
            const newScale = Math.min(1, scaleX, scaleY); // never scale up, only down

            setScale(newScale);
            inner.style.transform = `scale(${newScale})`;
            
            // Expand virtual width and height so they perfectly bound the container again
            // This is the genius of the old algorithm, making text dynamically re-wrap.
            // We use explicit pixels instead of percentages because html-to-image struggles
            // with percentage heights inside scaled SVG foreignObjects, which causes clipping.
            inner.style.width = newScale < 1 ? `${794 / newScale}px` : "794px";
            inner.style.height = newScale < 1 ? `${1123 / newScale}px` : "1123px";
        };

        calculate();

        const observer = new ResizeObserver(calculate);
        if (innerRef.current) observer.observe(innerRef.current);
        return () => observer.disconnect();
    }, [data]);

    const fitPercent = Math.round(scale * 100);

    return (
        <div ref={viewportRef} className="w-full h-full bg-slate-50 overflow-hidden flex items-start justify-start">
            {/* The absolute fixed-size A4 frame. Scaled down by viewport context to fit screen. */}
            <div 
                style={{
                    width: '794px',
                    height: '1123px',
                    transform: `scale(${viewportScale})`,
                    transformOrigin: 'top left'
                }}
            >
                <div ref={outerRef} className="w-full h-full bg-white relative shadow-sm">
                    {/* Scale indicator badge */}
                    {scale < 0.99 ? (
                        <div data-pdf-ignore="true" className="absolute bottom-2 right-2 z-10 bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-semibold px-2 py-1 rounded-full print:hidden">
                            Auto-scaled to {fitPercent}% to fit 1 page
                        </div>
                    ) : (
                        <div data-pdf-ignore="true" className="absolute bottom-2 right-2 z-10 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold px-2 py-1 rounded-full print:hidden">
                            ✓ Fits on 1 page
                        </div>
                    )}
                    <div
                        id="resume-preview-container"
                        ref={innerRef}
                        style={{
                            transformOrigin: "top left",
                            transform: `scale(${scale})`,
                            width: scale < 1 ? `${794 / scale}px` : "794px",
                            height: scale < 1 ? `${1123 / scale}px` : "1123px",
                        }}
                        className="bg-white flex flex-col"
                    >
                        <div className="flex-1 flex flex-col">
                            <ActiveTemplate data={data} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
