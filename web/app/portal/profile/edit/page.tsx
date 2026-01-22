"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/auth-context";
import { apiClient } from "@/lib/api";
import { ArrowLeft, Save } from "lucide-react";

interface UserInfo {
    id: number;
    email?: string;
    phone?: string;
    full_name?: string;
}

interface FormData {
    full_name: string;
    phone: string;
}

export default function EditProfilePage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        full_name: "",
        phone: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchUserInfo = async () => {
            try {
                setLoading(true);
                const userData = await apiClient.get("/auth/me");
                setFormData({
                    full_name: userData.full_name || "",
                    phone: userData.phone || "",
                });
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            // Validate inputs
            if (!formData.full_name.trim()) {
                setError("Full name is required");
                setSaving(false);
                return;
            }

            if (formData.phone && !/^[\d+\-\s()]*$/.test(formData.phone)) {
                setError("Phone number format is invalid");
                setSaving(false);
                return;
            }

            // Send update request
            await apiClient.patch("/auth/me", {
                full_name: formData.full_name.trim(),
                phone: formData.phone.trim() || null,
            });

            setSuccess("Profile updated successfully!");
            
            // Redirect to profile page after a short delay
            setTimeout(() => {
                router.push("/portal/profile");
            }, 1500);
        } catch (err: any) {
            setError(err.message || "Failed to update profile");
            console.error("Error updating profile:", err);
        } finally {
            setSaving(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="p-8 max-w-md mx-auto text-center">
                <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
                <p className="text-gray-600 mb-6">Please log in to edit your profile.</p>
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

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <header className="mb-8 flex items-center gap-4">
                <Link href="/portal/profile" className="p-2 hover:bg-gray-200 rounded-full">
                    <ArrowLeft size={24} className="text-secondary" />
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">Edit Profile</h1>
            </header>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
                            {success}
                        </div>
                    )}

                    {/* Full Name Field */}
                    <div>
                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                            disabled={saving}
                        />
                        <p className="text-xs text-gray-500 mt-1">Your display name in the system</p>
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number <span className="text-gray-400">(Optional)</span>
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 (555) 123-4567"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={saving}
                        />
                        <p className="text-xs text-gray-500 mt-1">We may use this for account recovery or notifications</p>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 flex items-center justify-center gap-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={20} />
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <Link href="/portal/profile" className="flex-1 btn-secondary text-center">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-blue-700 text-sm">
                <p><strong>Note:</strong> Your email address cannot be changed. If you need to change your email, please contact support.</p>
            </div>
        </div>
    );
}
