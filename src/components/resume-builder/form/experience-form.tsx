"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { HybridDateInput } from "./hybrid-date-input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { SectionColorPicker } from "./section-color-picker";

export default function ExperienceForm() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "experience",
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionColorPicker name="experience" label="Experience Section Color" />
            {fields.map((field, index) => (
                <Card key={field.id} className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 text-destructive hover:text-destructive"
                        onClick={() => remove(index)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={control}
                            name={`experience.${index}.role`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job Title/Role*</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Software Engineer" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`experience.${index}.company`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company/Organization*</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Acme Corp" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`experience.${index}.startDate`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Date*</FormLabel>
                                    <FormControl>
                                        <HybridDateInput placeholder="e.g., Aug 2021" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`experience.${index}.endDate`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Date (Leave empty if present)</FormLabel>
                                    <FormControl>
                                        <HybridDateInput placeholder="e.g., May 2025" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="md:col-span-2">
                            <FormField
                                control={control}
                                name={`experience.${index}.description`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description / Responsibilities / Achievements</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your responsibilities and achievements..."
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Button
                type="button"
                variant="outline"
                onClick={() => append({ role: "", company: "", startDate: "", endDate: "", description: "" })}
                className="w-full"
            >
                <Plus className="h-4 w-4 mr-2" /> Add Experience
            </Button>
        </div>
    );
}
