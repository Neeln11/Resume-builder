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

export default function EducationForm() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "education",
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionColorPicker name="education" label="Education Section Color" />
            {fields.map((field, index) => (
                <Card key={field.id} className="relative">
                    <Button
                        type="button"
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
                            name={`education.${index}.institution`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Institution*</FormLabel>
                                    <FormControl>
                                        <Input placeholder="University Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`education.${index}.degree`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Degree/Course*</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Bachelor of Science in Computer Science" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`education.${index}.startDate`}
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
                            name={`education.${index}.endDate`}
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
                                name={`education.${index}.description`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description / Grade / Achievements</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="GPA, honors, relevant coursework..." {...field} />
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
                onClick={() => append({ institution: "", degree: "", startDate: "", endDate: "", description: "" })}
                className="w-full"
            >
                <Plus className="h-4 w-4 mr-2" /> Add Education
            </Button>
        </div>
    );
}
