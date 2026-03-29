"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import LandingPage from "@/components/landing/landing-page";
import { Loader2 } from "lucide-react";

export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Once auth resolves, if user is logged in → go to dashboard
        if (!loading && user) {
            router.replace("/dashboard");
        }
    }, [user, loading, router]);

    // Still loading auth state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
            </div>
        );
    }

    // Logged out → show the landing page
    if (!user) {
        return <LandingPage />;
    }

    // Logged in → null while redirect fires
    return null;
}
