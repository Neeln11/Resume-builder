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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { SectionColorPicker } from "./section-color-picker";

export default function ProjectsForm() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "projects",
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionColorPicker name="projects" label="Projects Section Color" />
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
                            name={`projects.${index}.name`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Name*</FormLabel>
                                    <FormControl>
                                        <Input placeholder="E-commerce Platform" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`projects.${index}.technologies`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Technologies Used*</FormLabel>
                                    <FormControl>
                                        <Input placeholder="React, Node.js, PostgreSQL" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="md:col-span-2">
                            <FormField
                                control={control}
                                name={`projects.${index}.link`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Link (Optional)</FormLabel>
                                        <FormControl>
                                            <Input type="url" placeholder="https://github.com/..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <FormField
                                control={control}
                                name={`projects.${index}.description`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description / Key Features*</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the project, your role, and key features..."
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
                onClick={() => append({ name: "", description: "", technologies: "", link: "" })}
                className="w-full"
            >
                <Plus className="h-4 w-4 mr-2" /> Add Project
            </Button>
        </div>
    );
}
