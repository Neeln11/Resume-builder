"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    browserLocalPersistence,
    setPersistence,
    User,
    getRedirectResult,
    onAuthStateChanged,
    signInWithRedirect,
    signOut as firebaseSignOut
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    authError: string | null;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    authError: null,
    signInWithGoogle: async () => { },
    logout: async () => { },
});

function mapFirebaseAuthError(error: unknown): string {
    const code = (error as { code?: string })?.code;

    switch (code) {
        case "auth/unauthorized-domain":
            return "This domain is not authorized in Firebase Auth. Add it under Firebase Console -> Authentication -> Settings -> Authorized domains.";
        case "auth/operation-not-allowed":
            return "Google sign-in is not enabled for this Firebase project. Enable it in Firebase Console -> Authentication -> Sign-in method.";
        case "auth/popup-blocked":
            return "Browser blocked the sign-in window. Please allow popups for this site and try again.";
        case "auth/cancelled-popup-request":
            return "Another sign-in request interrupted this one. Please try again.";
        default:
            return "Google sign-in failed. Please try again.";
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        getRedirectResult(auth)
            .then((result) => {
                if (result?.user) {
                    setUser(result.user);
                    setAuthError(null);
                }
            })
            .catch((error) => {
                console.error("Error completing Google sign-in redirect:", error);
                setAuthError(mapFirebaseAuthError(error));
            });

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                setAuthError(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            setAuthError(null);
            await setPersistence(auth, browserLocalPersistence);
            await signInWithRedirect(auth, googleProvider);
        } catch (error) {
            console.error("Error signing in with Google:", error);
            setAuthError(mapFirebaseAuthError(error));
            throw error;
        }
    };

    const logout = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, authError, signInWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
