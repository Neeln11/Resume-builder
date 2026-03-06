"use client";

import { useFormContext } from "react-hook-form";
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
    const { control } = useFormContext();

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
                        <FormLabel>Professional Summary</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Write a brief summary of your professional background, skills, and goals..."
                                className="min-h-[200px]"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
