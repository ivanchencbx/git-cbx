"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../auth-context";
import { apiClient } from "@/lib/api";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const formData = new URLSearchParams();
            formData.append("username", username);
            formData.append("password", password);

            // Using fetch here because apiClient is JSON-centric, but we can refactor later
            // For now, let's fix the URL to be dynamic
            const baseUrl = typeof window !== 'undefined' ?
                `http://${window.location.hostname}:8000` :
                'http://localhost:8000';

            const res = await fetch(`${baseUrl}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Invalid credentials");
            }

            const data = await res.json();
            login(data.access_token);
        } catch (err) {
            setError("Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="main-container">
            <div className="card">
                <h2 className="logo-text text-4xl mb-8">Log In</h2>

                <form onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

                    <div className="form-group">
                        <label className="form-label" htmlFor="username">Email or Phone</label>
                        <input
                            id="username"
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Log In"}
                    </button>
                </form>

                <div className="auth-link">
                    Don't have an account? <Link href="/register">Sign Up</Link>
                </div>
            </div>
        </main>
    );
}
