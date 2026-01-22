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
            // Validate token with the backend
            const baseUrl = typeof window !== 'undefined' ?
                `http://${window.location.hostname}:8000` :
                'http://localhost:8000';
            
            fetch(`${baseUrl}/auth/me`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    }
                    throw new Error("Token validation failed");
                })
                .then(userData => {
                    setUser(userData);
                })
                .catch(err => {
                    console.error("Token validation failed:", err);
                    localStorage.removeItem("cbx_token");
                    setUser(null);
                });
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem("cbx_token", token);
        // Fetch actual user data to validate token
        const baseUrl = typeof window !== 'undefined' ?
            `http://${window.location.hostname}:8000` :
            'http://localhost:8000';
        
        fetch(`${baseUrl}/auth/me`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(userData => {
                setUser(userData);
                router.push("/portal");
            })
            .catch(err => {
                console.error("Failed to fetch user data:", err);
                // Fallback: at least set something
                setUser({ email: token.split('.')[0] });
                router.push("/portal");
            });
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
