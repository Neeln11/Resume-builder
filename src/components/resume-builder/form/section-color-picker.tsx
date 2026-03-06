"use client";

import { useFormContext } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SectionColorPickerProps {
    name: string;
    label?: string;
}

export function SectionColorPicker({ name, label = "Section Color" }: SectionColorPickerProps) {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={`themeConfig.${name}`}
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <FormLabel className="text-base">{label}</FormLabel>
                        <p className="text-sm text-muted-foreground">
                            Customize the heading color for this section.
                        </p>
                    </div>
                    <FormControl>
                        <div className="flex items-center gap-2">
                            <Input
                                type="color"
                                className="w-14 h-10 p-1 cursor-pointer"
                                {...field}
                                value={field.value || "#1e293b"}
                            />
                            <span className="text-xs font-mono text-muted-foreground uppercase">
                                {field.value || "#1e293b"}
                            </span>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
