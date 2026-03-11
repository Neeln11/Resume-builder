"use client";

import { useFormContext } from "react-hook-form";
import { ResumeData } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, GripVertical, Palette } from "lucide-react";

const defaultSectionLabels: Record<string, string> = {
    summary: "Professional Summary",
    experience: "Experience",
    education: "Education",
    projects: "Projects",
    skills: "Skills",
};

export default function LayoutForm() {
    const { watch, setValue } = useFormContext<ResumeData>();

    const sectionOrder = watch("sectionOrder") || [];

    const summaryHeading = watch("summary.heading");

    const move = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= sectionOrder.length) return;
        const newOrder = [...sectionOrder];
        const [movedItem] = newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, movedItem);
        setValue("sectionOrder", newOrder, { shouldDirty: true, shouldValidate: true });
    };

    const presetColors = [
        { name: "Slate", value: "#1e293b" },
        { name: "Ocean", value: "#0ea5e9" },
        { name: "Emerald", value: "#10b981" },
        { name: "Indigo", value: "#4f46e5" },
        { name: "Rose", value: "#e11d48" },
        { name: "Amber", value: "#d97706" }
    ];

    const currentThemeColor = watch("themeConfig.personalDetails") || "#1e293b";

    const handleColorSelect = (colorValue: string) => {
        setValue("themeConfig", {
            personalDetails: colorValue,
            summary: colorValue,
            education: colorValue,
            experience: colorValue,
            projects: colorValue,
            skills: colorValue,
        }, { shouldDirty: true });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Theme Customization Section */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <Palette className="w-5 h-5 text-indigo-500" />
                        Color Theme
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Select an accent color to personalize your resume's design.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    {presetColors.map((color) => (
                        <button
                            key={color.value}
                            type="button"
                            onClick={() => handleColorSelect(color.value)}
                            className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                                currentThemeColor === color.value 
                                    ? "border-slate-900 scale-110 shadow-md ring-2 ring-slate-900/20 ring-offset-2" 
                                    : "border-transparent hover:scale-105 shadow-sm"
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                            aria-label={`Select ${color.name} theme`}
                        />
                    ))}
                </div>
            </div>

            <hr className="border-slate-200" />

            {/* Reorder Section */}
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
