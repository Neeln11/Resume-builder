"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Clock } from "lucide-react";
import { ResumeData } from "@/lib/schema";

interface HistoryModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (id: string, data: ResumeData) => void;
}

interface SavedResume {
    id: string;
    data: ResumeData;
    updatedAt: string;
    title: string;
}

export function HistoryModal({ isOpen, onOpenChange, onSelect }: HistoryModalProps) {
    const { user } = useAuth();
    const [resumes, setResumes] = useState<SavedResume[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            fetchHistory();
        }
    }, [isOpen, user]);

    const fetchHistory = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const resumesRef = collection(db, "users", user.uid, "resumes");
            // Order by updatedAt descending (newest first)
            const q = query(resumesRef, orderBy("updatedAt", "desc"));
            const snapshot = await getDocs(q);

            const fetchedResumes: SavedResume[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data() as ResumeData & { updatedAt: string };
                // Generate a friendly title based on the role or the ID
                const jobTitle = data.experience?.[0]?.role || "Untitled Resume";
                const company = data.experience?.[0]?.company ? ` at ${data.experience[0].company}` : "";

                fetchedResumes.push({
                    id: doc.id,
                    data: data,
                    updatedAt: data.updatedAt,
                    title: `${jobTitle}${company}`
                });
            });

            setResumes(fetchedResumes);
        } catch (error) {
            console.error("Error fetching resume history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Unknown Date";
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            }).format(date);
        } catch (e) {
            return "Invalid Date";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <FileText className="h-6 w-6 text-slate-700" />
                        Previous Work
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-2 min-h-[300px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-4 text-slate-500">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <p>Loading your history...</p>
                        </div>
                    ) : resumes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-4 text-slate-500 text-center px-4">
                            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                                <FileText className="h-8 w-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">No resumes found</h3>
                            <p>You haven't saved any resumes yet. Build one and click Download to save it to your history!</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 mt-4">
                            {resumes.map((resume) => (
                                <div
                                    key={resume.id}
                                    className="p-5 border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all cursor-pointer bg-white group"
                                    onClick={() => {
                                        onSelect(resume.id, resume.data);
                                        onOpenChange(false);
                                    }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg text-slate-900 group-hover:text-amber-600 transition-colors">
                                                {resume.title}
                                            </h3>
                                            <div className="flex items-center text-sm text-slate-500 mt-2 gap-1.5">
                                                <Clock className="h-3.5 w-3.5" />
                                                Last edited: {formatDate(resume.updatedAt)}
                                            </div>
                                        </div>
                                        <Button variant="secondary" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            Load Resume
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
