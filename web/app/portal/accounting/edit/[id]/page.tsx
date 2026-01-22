"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/auth-context";
import { apiClient } from "@/lib/api";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

interface Category {
    id: number;
    name: string;
    type: "income" | "expense";
}

interface Expense {
    id: number;
    description: string;
    amount: number; // in cents
    category_id: number;
    date: string;
}

interface FormData {
    description: string;
    amount: string;
    category_id: number;
    date: string;
}

export default function EditExpensePage() {
    const router = useRouter();
    const params = useParams();
    const { isAuthenticated } = useAuth();
    const expenseId = params.id as string;

    const [formData, setFormData] = useState<FormData>({
        description: "",
        amount: "",
        category_id: 0,
        date: new Date().toISOString().split("T")[0],
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch categories
                const categoriesData = await apiClient.get("/accounting/categories");
                setCategories(categoriesData);

                // Fetch expense details
                const expense = await apiClient.get(`/accounting/expenses?id=${expenseId}`);
                if (expense && expense.length > 0) {
                    const exp = expense[0];
                    setFormData({
                        description: exp.description || "",
                        amount: (exp.amount / 100).toString(), // Convert from cents
                        category_id: exp.category_id || (categoriesData[0]?.id || 0),
                        date: exp.date || new Date().toISOString().split("T")[0],
                    });
                } else {
                    setError("Expense not found");
                }

                setError(null);
            } catch (err: any) {
                setError(err.message || "Failed to load expense");
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, expenseId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "category_id" ? parseInt(value) : value,
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
            if (!formData.description.trim()) {
                setError("Description is required");
                setSaving(false);
                return;
            }

            if (!formData.amount || parseFloat(formData.amount) <= 0) {
                setError("Amount must be greater than 0");
                setSaving(false);
                return;
            }

            if (!formData.category_id) {
                setError("Category is required");
                setSaving(false);
                return;
            }

            // Convert amount to cents
            const amountInCents = Math.round(parseFloat(formData.amount) * 100);

            // Send update request
            await apiClient.patch(`/accounting/expenses/${expenseId}`, {
                description: formData.description.trim(),
                amount: amountInCents,
                category_id: formData.category_id,
                date: formData.date,
            });

            setSuccess("Expense updated successfully!");

            // Redirect to accounting page after a short delay
            setTimeout(() => {
                router.push("/portal/accounting");
            }, 1500);
        } catch (err: any) {
            setError(err.message || "Failed to update expense");
            console.error("Error updating expense:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        setError(null);

        try {
            await apiClient.delete(`/accounting/expenses/${expenseId}`);
            setSuccess("Expense deleted successfully!");

            // Redirect to accounting page
            setTimeout(() => {
                router.push("/portal/accounting");
            }, 1000);
        } catch (err: any) {
            setError(err.message || "Failed to delete expense");
            console.error("Error deleting expense:", err);
            setShowDeleteConfirm(false);
        } finally {
            setDeleting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="p-8 max-w-md mx-auto text-center">
                <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
                <p className="text-gray-600 mb-6">Please log in to edit expenses.</p>
                <Link href="/login" className="btn-primary">
                    Go to Login
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-8 max-w-2xl mx-auto text-center">
                <div className="text-lg text-gray-600">Loading expense...</div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <header className="mb-8 flex items-center gap-4">
                <Link href="/portal/accounting" className="p-2 hover:bg-gray-200 rounded-full">
                    <ArrowLeft size={24} className="text-secondary" />
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">Edit Expense</h1>
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

                    {/* Description Field */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="e.g., Grocery shopping"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                            disabled={saving || deleting}
                        />
                    </div>

                    {/* Amount Field */}
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                            Amount <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-2.5 text-gray-500">$</span>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                                disabled={saving || deleting}
                            />
                        </div>
                    </div>

                    {/* Category Field */}
                    <div>
                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                            disabled={saving || deleting}
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name} ({cat.type})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date Field */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                            Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                            disabled={saving || deleting}
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={saving || deleting}
                            className="flex-1 flex items-center justify-center gap-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={20} />
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <Link href="/portal/accounting" className="flex-1 btn-secondary text-center">
                            Cancel
                        </Link>
                    </div>
                </form>

                {/* Delete Section */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Danger Zone</h3>
                    {showDeleteConfirm ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-4">
                            <p className="text-red-700 font-medium">
                                Are you sure you want to delete this expense? This action cannot be undone.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Trash2 size={20} />
                                    {deleting ? "Deleting..." : "Confirm Delete"}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium px-4 py-2 rounded-lg transition"
                        >
                            <Trash2 size={20} />
                            Delete This Expense
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
