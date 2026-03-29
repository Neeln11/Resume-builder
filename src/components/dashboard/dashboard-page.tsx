"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ResumeData } from "@/lib/schema";
import { FileText, Plus, Clock, Trash2, Pencil, Loader2, LogOut, LayoutDashboard } from "lucide-react";

interface SavedResume {
    id: string;
    data: ResumeData;
    updatedAt: string;
    title: string;
    name: string;
}

const TEMPLATE_LABELS: Record<string, string> = {
    default: "Professional",
    minimal: "Minimalist",
    creative: "Creative",
};

function formatDate(dateStr?: string) {
    if (!dateStr) return "Unknown date";
    try {
        return new Intl.DateTimeFormat("en-US", {
            month: "short", day: "numeric", year: "numeric",
        }).format(new Date(dateStr));
    } catch { return "Invalid date"; }
}

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [resumes, setResumes] = useState<SavedResume[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchResumes = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const q = query(
                collection(db, "users", user.uid, "resumes"),
                orderBy("updatedAt", "desc")
            );
            const snapshot = await getDocs(q);
            const items: SavedResume[] = [];
            snapshot.forEach((d) => {
                const data = d.data() as ResumeData & { updatedAt: string };
                const role = data.experience?.[0]?.role || "Untitled Resume";
                const company = data.experience?.[0]?.company ? ` at ${data.experience[0].company}` : "";
                items.push({
                    id: d.id,
                    data,
                    updatedAt: data.updatedAt,
                    title: `${role}${company}`,
                    name: data.personalDetails?.fullName || "Unknown",
                });
            });
            setResumes(items);
        } catch (e) {
            console.error("Failed to fetch resumes:", e);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => { fetchResumes(); }, [fetchResumes]);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user || !window.confirm("Delete this resume? This cannot be undone.")) return;
        setDeletingId(id);
        try {
            await deleteDoc(doc(db, "users", user.uid, "resumes", id));
            setResumes((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (resume: SavedResume) => {
        // Store in sessionStorage for builder to pick up
        sessionStorage.setItem("editResumeId", resume.id);
        sessionStorage.setItem("editResumeData", JSON.stringify(resume.data));
        router.push("/builder");
    };

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Topbar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                            RB
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">
                            Resume<span className="text-slate-400 font-medium">Builder</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Dashboard</span>
                        </div>
                        {user?.photoURL && (
                            <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full border border-slate-200" />
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Sign Out</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                {/* Welcome Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Welcome back, {user?.displayName?.split(" ")[0]} 👋
                        </h1>
                        <p className="text-slate-500 mt-1">
                            {resumes.length > 0
                                ? `You have ${resumes.length} saved resume${resumes.length > 1 ? "s" : ""}.`
                                : "Start building your first resume today!"}
                        </p>
                    </div>
                    <Link
                        href="/builder"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all hover:-translate-y-0.5 shadow-md shrink-0"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Resume
                    </Link>
                </div>

                {/* Resume Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
                        <Loader2 className="w-10 h-10 animate-spin" />
                        <p>Loading your resumes...</p>
                    </div>
                ) : resumes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                            <FileText className="w-12 h-12 text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">No resumes yet</h2>
                        <p className="text-slate-500 mb-8 max-w-sm">
                            Create your first resume and click &quot;Download&quot; to save it here automatically.
                        </p>
                        <Link
                            href="/builder"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Build My First Resume
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.map((resume) => (
                            <div
                                key={resume.id}
                                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer group flex flex-col gap-4"
                                onClick={() => handleEdit(resume)}
                            >
                                {/* Card Header */}
                                <div className="flex items-start justify-between gap-2">
                                    <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shrink-0">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                                        {TEMPLATE_LABELS[resume.data.template || "default"]}
                                    </span>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-900 text-lg leading-tight break-words group-hover:text-indigo-600 transition-colors">
                                        {resume.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-1">{resume.name}</p>
                                </div>

                                {/* Date */}
                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <Clock className="w-3.5 h-3.5 shrink-0" />
                                    <span>Last edited {formatDate(resume.updatedAt)}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2 border-t border-slate-100">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleEdit(resume); }}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(resume.id, e)}
                                        disabled={deletingId === resume.id}
                                        className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {deletingId === resume.id ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-3.5 h-3.5" />
                                        )}
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
