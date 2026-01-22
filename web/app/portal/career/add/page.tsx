"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth-context";
import { apiClient } from "@/lib/api";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function AddApplicationPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        company: "",
        position: "",
        status: "Applied",
        salary_range: "",
        notes: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Check authentication
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await apiClient.post("/career/applications", formData);
            router.push("/portal/career");
        } catch (err) {
            alert("Failed to save application");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-start">
            <div className="card bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <header className="flex items-center gap-4 mb-8">
                    <Link href="/portal/career" className="hover:bg-gray-100 p-2 rounded-full">
                        <ArrowLeft className="text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Track Job</h1>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Company Name</label>
                        <input
                            className="form-input"
                            value={formData.company}
                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                            required
                            aria-label="Company Name"
                            title="Company Name"
                            placeholder="e.g. Google"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Position / Title</label>
                        <input
                            className="form-input"
                            value={formData.position}
                            onChange={e => setFormData({ ...formData, position: e.target.value })}
                            required
                            aria-label="Position"
                            title="Position"
                            placeholder="e.g. Software Engineer"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <select
                            className="form-input"
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                            aria-label="Application Status"
                            title="Application Status"
                        >
                            <option value="Applied">Applied</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Salary Range (Optional)</label>
                        <input
                            className="form-input"
                            value={formData.salary_range}
                            onChange={e => setFormData({ ...formData, salary_range: e.target.value })}
                            placeholder="e.g. $80k - $100k"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
                    >
                        <Save size={20} />
                        <span>{isSubmitting ? "Saving..." : "Save Application"}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
