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
import { Plus, X, Trash2 } from "lucide-react";

function SkillCategory({ categoryIndex, control, categoryRemove }: { categoryIndex: number, control: any, categoryRemove: any }) {
    const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
        control,
        name: `skills.${categoryIndex}.skills`,
    });

    return (
        <div className="pt-5 pb-5 border rounded-lg p-5 bg-slate-50 relative">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 text-muted-foreground hover:bg-slate-200 hover:text-destructive transition-colors"
                onClick={() => categoryRemove(categoryIndex)}
                title="Remove Category"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
            
            <div className="mb-5 pr-10">
                <FormField
                    control={control}
                    name={`skills.${categoryIndex}.title`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input 
                                    placeholder="Category (e.g. Frontend, Tools)" 
                                    className="w-full sm:w-64 font-semibold text-slate-800 bg-white shadow-sm" 
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            <div className="flex flex-wrap gap-2.5">
                {skillFields.map((field, index) => (
                    <div key={field.id} className="relative group flex items-center">
                        <FormField
                            control={control}
                            name={`skills.${categoryIndex}.skills.${index}.name`}
                            render={({ field }) => (
                                <FormItem className="mb-0">
                                    <FormControl>
                                        <div className="relative flex items-center">
                                            <Input
                                                placeholder="e.g. React"
                                                className="pr-8 w-32 sm:w-40 bg-white shadow-sm"
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 h-full px-2 py-0 text-muted-foreground hover:text-destructive opacity-40 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeSkill(index)}
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

            <div className="pt-5">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendSkill({ name: "" })}
                    className="bg-white hover:bg-slate-100 text-slate-700"
                >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Skill
                </Button>
            </div>
        </div>
    );
}

export default function SkillsForm() {
    const { control } = useFormContext();
    const { fields: categoryFields, append: appendCategory, remove: removeCategory } = useFieldArray({
        control,
        name: "skills",
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="space-y-4">
                {categoryFields.map((field, index) => (
                    <SkillCategory
                        key={field.id}
                        categoryIndex={index}
                        control={control}
                        categoryRemove={removeCategory}
                    />
                ))}
            </div>

            <div className="pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendCategory({ title: "", skills: [] })}
                    className="w-full border-dashed border-2 hover:bg-slate-50 py-6 text-slate-600 font-medium"
                >
                    <Plus className="h-5 w-5 mr-2" /> Add Skill Category
                </Button>
            </div>
        </div>
    );
}
