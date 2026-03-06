"use client";

import { useAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, LogOut, User as UserIcon, Clock } from "lucide-react";
import { useState } from "react";

interface ProfileHeaderProps {
    onOpenHistory?: () => void;
}

export function ProfileHeader({ onOpenHistory }: ProfileHeaderProps) {
    const { user, loading, signInWithGoogle, logout } = useAuth();
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleLogin = async () => {
        try {
            setIsLoggingIn(true);
            await signInWithGoogle();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoggingIn(false);
        }
    };

    if (loading) {
        return (
            <div className="h-10 w-10 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!user) {
        return (
            <Button
                variant="outline"
                size="sm"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="gap-2"
            >
                {isLoggingIn ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <UserIcon className="h-4 w-4" />
                )}
                Sign In
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-slate-200">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                        <AvatarFallback className="bg-slate-900 text-white">
                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {onOpenHistory && (
                    <>
                        <DropdownMenuItem onClick={onOpenHistory} className="cursor-pointer">
                            <Clock className="mr-2 h-4 w-4" />
                            <span>Previous Work</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
