"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/auth-context";
import { apiClient } from "@/lib/api";
import { ArrowLeft, Edit2, Mail, Phone, User } from "lucide-react";

interface UserInfo {
    id: number;
    email?: string;
    phone?: string;
    full_name?: string;
    is_active: boolean;
    created_at: string;
}

export default function ProfilePage() {
    const { isAuthenticated } = useAuth();
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchUserInfo = async () => {
            try {
                setLoading(true);
                const userData = await apiClient.get("/auth/me");
                setUser(userData);
                setError(null);
            } catch (err: any) {
                setError(err.message || "Failed to load profile");
                console.error("Error fetching user info:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="p-8 max-w-md mx-auto text-center">
                <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
                <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
                <Link href="/login" className="btn-primary">
                    Go to Login
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-8 max-w-2xl mx-auto text-center">
                <div className="text-lg text-gray-600">Loading profile...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 max-w-2xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    Error: {error}
                </div>
                <Link href="/portal" className="mt-4 inline-block btn-secondary">
                    Back to Portal
                </Link>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-8 max-w-2xl mx-auto text-center">
                <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
                <Link href="/portal" className="btn-primary">
                    Back to Portal
                </Link>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <header className="mb-8 flex items-center gap-4">
                <Link href="/portal" className="p-2 hover:bg-gray-200 rounded-full">
                    <ArrowLeft size={24} className="text-secondary" />
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            </header>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 space-y-6">
                {/* User Avatar and Basic Info */}
                <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                    <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold">
                        {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {user.full_name || "User"}
                        </h2>
                        <p className="text-gray-600">{user.email || "No email"}</p>
                    </div>
                    <Link
                        href="/portal/profile/edit"
                        className="p-2 hover:bg-primary hover:text-white rounded-full transition"
                        title="Edit Profile"
                    >
                        <Edit2 size={24} />
                    </Link>
                </div>

                {/* Profile Information */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <Mail size={20} className="text-primary flex-shrink-0" />
                        <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="text-lg font-medium text-gray-800">
                                {user.email || "Not provided"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <Phone size={20} className="text-primary flex-shrink-0" />
                        <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="text-lg font-medium text-gray-800">
                                {user.phone || "Not provided"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <User size={20} className="text-primary flex-shrink-0" />
                        <div>
                            <p className="text-sm text-gray-600">Full Name</p>
                            <p className="text-lg font-medium text-gray-800">
                                {user.full_name || "Not provided"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Account Status */}
                <div className="pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <p className="text-lg font-medium">
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                    user.is_active
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}>
                                    {user.is_active ? "Active" : "Inactive"}
                                </span>
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Member Since</p>
                            <p className="text-lg font-medium">
                                {new Date(user.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                    <Link href="/portal/profile/edit" className="flex-1 btn-primary text-center">
                        Edit Profile
                    </Link>
                    <Link href="/portal" className="flex-1 btn-secondary text-center">
                        Back to Portal
                    </Link>
                </div>
            </div>
        </div>
    );
}
