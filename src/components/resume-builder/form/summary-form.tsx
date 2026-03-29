"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateSummaryAction } from "@/actions/gemini";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SectionColorPicker } from "./section-color-picker";

export default function SummaryForm() {
    const { control, getValues, setValue } = useFormContext();
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        try {
            setIsGenerating(true);
            setError("");
            
            // Gather context from other parts of the form
            const details = getValues("personalDetails");
            const exp = getValues("experience")?.[0]; // Get most recent job
            const currentSummary = getValues("summary.summary") || "";
            
            let context = `Name: ${details?.fullName || 'Not provided'}.`;
            if (exp?.role && exp?.company) {
                context += ` Current/Recent Role: ${exp.role} at ${exp.company}.`;
            }
            
            const response = await generateSummaryAction(context, currentSummary);
            if (response.error) throw new Error(response.error);
            if (response.content) {
                setValue("summary.summary", response.content, { shouldValidate: true });
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionColorPicker name="summary" label="Summary Section Color" />
            <FormField
                control={control}
                name="summary.heading"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Custom Section Title (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., About Me, Profile" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="summary.summary"
                render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center justify-between">
                            <FormLabel>Professional Summary</FormLabel>
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="h-8 shadow-sm bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 transition-all border-purple-200"
                            >
                                {isGenerating ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin text-purple-600" />
                                ) : (
                                    <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                                )}
                                <span className={isGenerating ? "text-purple-700" : "text-purple-700 font-medium"}>
                                    {isGenerating ? "Generating..." : "Generate AI Summary"}
                                </span>
                            </Button>
                        </div>
                        <FormControl>
                            <Textarea
                                placeholder="Write a brief summary of your professional background, skills, and goals..."
                                className="min-h-[200px]"
                                {...field}
                            />
                        </FormControl>
                        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
