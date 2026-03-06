"use client";

import { useFormContext } from "react-hook-form";
import { ResumeData } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, GripVertical } from "lucide-react";

const defaultSectionLabels: Record<string, string> = {
    summary: "Professional Summary",
    experience: "Experience",
    education: "Education",
    projects: "Projects",
    skills: "Skills",
};

export default function LayoutForm() {
    const { control, watch, setValue } = useFormContext<ResumeData>();

    const sectionOrder = watch("sectionOrder") || [];

    const summaryHeading = watch("summary.heading");

    const move = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= sectionOrder.length) return;
        const newOrder = [...sectionOrder];
        const [movedItem] = newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, movedItem);
        setValue("sectionOrder", newOrder, { shouldDirty: true, shouldValidate: true });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h3 className="text-lg font-medium">Reorder Sections</h3>
                <p className="text-sm text-muted-foreground">
                    Change the order of the sections in your generated resume by moving them up or down.
                </p>
            </div>

            <div className="space-y-3">
                {sectionOrder.map((sectionId, index) => {
                    let label = defaultSectionLabels[sectionId] || sectionId;
                    if (sectionId === "summary" && summaryHeading) {
                        label = summaryHeading;
                    }

                    return (
                        <div
                            key={sectionId}
                            className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm transition-all hover:border-slate-300"
                        >
                            <div className="flex items-center gap-3">
                                <GripVertical className="h-5 w-5 text-slate-400 cursor-grab active:cursor-grabbing hidden sm:block" />
                                <span className="font-medium text-slate-800">{label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 text-slate-600 hover:text-slate-900"
                                    onClick={() => move(index, index - 1)}
                                    disabled={index === 0}
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 text-slate-600 hover:text-slate-900"
                                    onClick={() => move(index, index + 1)}
                                    disabled={index === sectionOrder.length - 1}
                                >
                                    <ArrowDown className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
