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

    const outerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const calculate = () => {
            const outer = outerRef.current;
            const inner = innerRef.current;
            if (!outer || !inner) return;

            // Temporarily reset scale to measure real content size
            inner.style.transform = "scale(1)";
            inner.style.transformOrigin = "top left";

            const containerH = outer.clientHeight;
            const containerW = outer.clientWidth;
            const contentH = inner.scrollHeight;
            const contentW = inner.scrollWidth;

            const scaleX = containerW / contentW;
            const scaleY = containerH / contentH;
            const newScale = Math.min(1, scaleX, scaleY); // never scale up, only down

            setScale(newScale);
            inner.style.transform = `scale(${newScale})`;
        };

        calculate();

        // Re-calculate whenever content changes size
        const observer = new ResizeObserver(calculate);
        if (innerRef.current) observer.observe(innerRef.current);
        return () => observer.disconnect();
    }, [data]); // re-run whenever resume data changes

    const fitPercent = Math.round(scale * 100);

    return (
        <div ref={outerRef} className="w-full h-full bg-white overflow-hidden relative">
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
                    width: scale < 1 ? `${100 / scale}%` : "100%",
                    height: scale < 1 ? `${100 / scale}%` : "100%",
                }}
                className="bg-white flex flex-col"
            >
                <div className="flex-1 flex flex-col">
                    <ActiveTemplate data={data} />
                </div>
            </div>
        </div>
    );
}
