"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertTriangle, Search, Sparkles, Check, ChevronRight, CheckCircle } from "lucide-react";
import { analyzeResumeATS } from "@/actions/ats";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ATSSuggestion {
    section: string;
    index: number;
    issue: string;
    improvedText: string;
    fieldToUpdate: string;
}

interface ATSResult {
    overallScore: number;
    generalFeedback: string;
    suggestions: ATSSuggestion[];
}

interface ATSModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ATSModal({ isOpen, onOpenChange }: ATSModalProps) {
    const { getValues, setValue } = useFormContext();
    const [targetRole, setTargetRole] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ATSResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [implementedSet, setImplementedSet] = useState<Set<number>>(new Set());

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        setImplementedSet(new Set());

        try {
            const currentData = getValues();
            // Pass the clean form data
            const dataString = JSON.stringify(currentData);
            
            const req = await analyzeResumeATS(dataString, targetRole);
            
            if (req.error) {
                setError(req.error);
            } else if (req.data) {
                setResult(req.data as ATSResult);
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImplement = (sug: ATSSuggestion, idx: number) => {
        // Construct the correct path for react-hook-form
        let path = "";
        if (["summary", "personalDetails"].includes(sug.section)) {
            path = `${sug.section}.${sug.fieldToUpdate}`;
        } else {
            path = `${sug.section}.${sug.index}.${sug.fieldToUpdate}`;
        }

        setValue(path, sug.improvedText, { shouldDirty: true, shouldValidate: true });
        
        // Mark as implemented
        setImplementedSet(prev => new Set(prev).add(idx));
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-500";
        if (score >= 60) return "text-amber-500";
        return "text-rose-500";
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return "bg-emerald-50";
        if (score >= 60) return "bg-amber-50";
        return "bg-rose-50";
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col overflow-hidden p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-white shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                        AI ATS Score Checker
                    </DialogTitle>
                    <DialogDescription>
                        Analyze your resume against Applicant Tracking System algorithms. Provide a target role to get tailored keywords.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto bg-slate-50/50">
                    <div className="p-6 space-y-6">
                        {/* Target Role Input */}
                        {!result && !isLoading && (
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 block mb-1">Target Job Title (Optional)</label>
                                    <Input 
                                        placeholder="e.g. Senior Frontend Engineer" 
                                        value={targetRole}
                                        onChange={(e) => setTargetRole(e.target.value)}
                                        className="max-w-md"
                                    />
                                    <p className="text-xs text-slate-500 mt-2">
                                        Providing a target role helps the AI check for required keywords, impact metrics, and stylistic matches.
                                    </p>
                                </div>
                                <Button onClick={handleAnalyze} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    <Search className="w-4 h-4 mr-2" /> Start Analysis
                                </Button>
                            </div>
                        )}

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600 relative z-10" />
                                </div>
                                <p className="text-sm font-medium text-slate-600 animate-pulse">Scanning resume architecture...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !isLoading && (
                            <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-semibold text-rose-800">Scan Failed</h4>
                                    <p className="text-sm text-rose-600 mt-1">{error}</p>
                                    <Button variant="outline" onClick={handleAnalyze} className="mt-3 bg-white">Try Again</Button>
                                </div>
                            </div>
                        )}

                        {/* Results State */}
                        {result && !isLoading && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                
                                {/* Score Header */}
                                <div className={`flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl border border-slate-100 shadow-sm bg-white`}>
                                    <div className={`relative flex items-center justify-center w-32 h-32 rounded-full border-8 ${getScoreBg(result.overallScore)} ${getScoreColor(result.overallScore).replace('text-', 'border-')}`}>
                                        <div className="text-center">
                                            <span className={`text-4xl font-extrabold ${getScoreColor(result.overallScore)}`}>{result.overallScore}</span>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mt-1">/ 100</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-2 text-center md:text-left">
                                        <h3 className="text-lg font-bold text-slate-900">ATS Competency Score</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            {result.generalFeedback}
                                        </p>
                                        <Button variant="link" onClick={() => setResult(null)} className="h-auto p-0 text-indigo-600 font-medium text-xs">
                                            Scan against a different role
                                        </Button>
                                    </div>
                                </div>

                                {/* Suggestions List */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-slate-900 border-b pb-2">Actionable Improvements</h4>
                                    {result.suggestions.map((sug, i) => (
                                        <div key={i} className={`p-5 rounded-xl border transition-all ${implementedSet.has(i) ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-200 shadow-sm'}`}>
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-3 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="uppercase tracking-wider text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                                            {sug.section}
                                                        </span>
                                                        <span className="text-sm font-semibold text-rose-600 flex items-center">
                                                            <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Issue Detected
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-700 leading-relaxed">{sug.issue}</p>
                                                    
                                                    <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Suggested Replacement</p>
                                                        <p className="text-sm text-slate-900">{sug.improvedText}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="shrink-0 pt-1">
                                                    {implementedSet.has(i) ? (
                                                        <Button disabled variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">
                                                            <Check className="w-4 h-4 mr-2" /> Applied
                                                        </Button>
                                                    ) : (
                                                        <Button onClick={() => handleImplement(sug, i)} className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm">
                                                            Implement Fix 
                                                            <ChevronRight className="w-4 h-4 ml-1" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {result.suggestions.length === 0 && (
                                        <div className="text-center py-8 bg-white border border-slate-200 rounded-xl">
                                            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                            <p className="font-medium text-slate-900">Your resume is perfectly optimized!</p>
                                            <p className="text-sm text-slate-500">No major ATS issues detected.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
