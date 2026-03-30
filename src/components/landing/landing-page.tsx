"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context";
import { Sparkles, FileText, Download, Palette, ArrowRight, CheckCircle, Loader2 } from "lucide-react";

export default function LandingPage() {
    const { user, loading, signInWithGoogle } = useAuth();
    const [isSigningIn, setIsSigningIn] = useState(false);

    const handleSignIn = async () => {
        try {
            setIsSigningIn(true);
            await signInWithGoogle();
        } catch (e) {
            console.error(e);
        } finally {
            setIsSigningIn(false);
        }
    };

    const features = [
        {
            icon: <Sparkles className="w-6 h-6" />,
            title: "AI-Powered Writing",
            description: "Generate professional summaries, bullet points, and descriptions with one click using Gemini AI.",
            color: "from-purple-500 to-indigo-500",
            bg: "bg-purple-50",
            iconColor: "text-purple-600",
        },
        {
            icon: <Palette className="w-6 h-6" />,
            title: "Beautiful Templates",
            description: "Choose from 3 stunning resume layouts — Professional Standard, Clean Minimalist, and Modern Creative.",
            color: "from-blue-500 to-cyan-500",
            bg: "bg-blue-50",
            iconColor: "text-blue-600",
        },
        {
            icon: <Download className="w-6 h-6" />,
            title: "PDF Export",
            description: "Download your finished resume as a perfectly formatted PDF ready to send to employers.",
            color: "from-emerald-500 to-teal-500",
            bg: "bg-emerald-50",
            iconColor: "text-emerald-600",
        },
    ];

    const benefits = [
        "No sign-up required to start",
        "Save unlimited resumes to the cloud",
        "Real-time live preview",
        "Customizable color themes",
    ];

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            RB
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">
                            Resume<span className="text-slate-400 font-medium">Builder</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                        ) : user ? (
                            <>
                                <span className="text-sm text-slate-600 hidden sm:block">Welcome, {user.displayName?.split(" ")[0]}!</span>
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
                                >
                                    Dashboard →
                                </Link>
                            </>
                        ) : (
                            <button
                                onClick={handleSignIn}
                                disabled={isSigningIn}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-60"
                            >
                                {isSigningIn ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                Sign in with Google
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-28 pb-20 px-4 sm:px-6 text-center relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50 rounded-full blur-3xl opacity-60" />
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-medium rounded-full mb-8">
                        <Sparkles className="w-4 h-4" />
                        Powered by Gemini AI
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                        Build a resume that{" "}
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            gets you hired
                        </span>
                    </h1>

                    <p className="text-base sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Create a professional, ATS-friendly resume in minutes — not hours. Our AI writes the content, you take the credit.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link
                            href="/builder"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white font-semibold text-lg rounded-xl hover:bg-slate-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Start Building Free
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        {user && (
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold text-lg rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5"
                            >
                                <FileText className="w-5 h-5" />
                                View My Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Social Proof Row */}
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                        {benefits.map((b, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-slate-500">
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                {b}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-4">Everything you need to land the job</h2>
                        <p className="text-lg text-slate-500 max-w-xl mx-auto">
                            From content generation to export — we have built all the tools right in.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                            >
                                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-5 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-900 text-white text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl sm:text-4xl font-bold mb-4">Your next job starts here</h2>
                    <p className="text-slate-400 text-lg mb-10">
                        Join thousands of job seekers who have built standout resumes with ResumeBuilder.
                    </p>
                    <Link
                        href="/builder"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold text-lg rounded-xl hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Build My Resume — It&apos;s Free
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Minimal footer */}
            <footer className="py-6 px-6 border-t border-slate-100 text-center text-sm text-slate-400">
                © 2026 ResumeBuilder — Built with ❤️ and Gemini AI
            </footer>
        </div>
    );
}
