"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
    email?: string;
    phone?: string;
    full_name?: string;
}

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Check for token in localStorage on mount
        const token = localStorage.getItem("cbx_token");
        if (token) {
            // In a real app, we would validate the token with /auth/me here
            // For now, just simulate a logged-in state
            setUser({ email: "user@example.com" });
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem("cbx_token", token);
        setUser({ email: "user@example.com" }); // Placeholder
        router.push("/portal");
    };

    const logout = () => {
        localStorage.removeItem("cbx_token");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
