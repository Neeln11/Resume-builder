"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { SectionColorPicker } from "./section-color-picker";

export default function SkillsForm() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "skills",
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionColorPicker name="skills" label="Skills Section Color" />
            <div className="flex flex-wrap gap-3">
                {fields.map((field, index) => (
                    <div key={field.id} className="relative group flex items-center">
                        <FormField
                            control={control}
                            name={`skills.${index}.name`}
                            render={({ field }) => (
                                <FormItem className="mb-0">
                                    <FormControl>
                                        <div className="relative flex items-center">
                                            <Input
                                                placeholder="e.g. React"
                                                className="pr-8 w-40 sm:w-48"
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 h-full px-2 py-0 text-muted-foreground hover:text-destructive opacity-50 group-hover:opacity-100 transition-opacity"
                                                onClick={() => remove(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="absolute -bottom-5 text-xs whitespace-nowrap" />
                                </FormItem>
                            )}
                        />
                    </div>
                ))}
            </div>

            <div className="pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ name: "" })}
                    className="w-full sm:w-auto"
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Skill
                </Button>
            </div>
        </div>
    );
}
