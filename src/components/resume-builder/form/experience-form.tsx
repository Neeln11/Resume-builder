"use client";

import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Sparkles, Loader2 } from "lucide-react";
import { generateExperienceAction } from "@/actions/gemini";
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

export default function ExperienceForm() {
    const { control, getValues, setValue } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "experience",
    });

    const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);
    const [errorIndex, setErrorIndex] = useState<number | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    const handleGenerate = async (index: number) => {
        try {
            setGeneratingIndex(index);
            setErrorIndex(null);
            
            const exp = getValues(`experience.${index}`);
            const role = exp?.role || "Professional";
            const company = exp?.company || "Company";
            const currentDesc = exp?.description || "";
            
            const response = await generateExperienceAction(role, company, currentDesc);
            if (response.error) throw new Error(response.error);
            if (response.content) {
                setValue(`experience.${index}.description`, response.content, { shouldValidate: true });
            }
        } catch (err: any) {
            setErrorIndex(index);
            setErrorMsg(err.message || "Something went wrong.");
        } finally {
            setGeneratingIndex(null);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                                        <div className="flex items-center justify-between">
                                            <FormLabel>Description / Responsibilities / Achievements</FormLabel>
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => handleGenerate(index)}
                                                disabled={generatingIndex === index}
                                                className="h-8 shadow-sm bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 transition-all border-purple-200"
                                            >
                                                {generatingIndex === index ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin text-purple-600" />
                                                ) : (
                                                    <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                                                )}
                                                <span className={generatingIndex === index ? "text-purple-700" : "text-purple-700 font-medium"}>
                                                    {generatingIndex === index ? "Enhancing..." : "Enhance with AI"}
                                                </span>
                                            </Button>
                                        </div>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your responsibilities and achievements..."
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        {errorIndex === index && <p className="text-sm font-medium text-destructive">{errorMsg}</p>}
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
