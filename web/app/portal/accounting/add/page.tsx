"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface Category {
    id: number;
    name: string;
    icon: string;
}

export default function AddTransactionPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [type, setType] = useState<"expense" | "income">("expense");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const data = await apiClient.get("/accounting/categories");
                setCategories(data);
                if (data.length > 0) setCategoryId(data[0].id.toString());
            } catch (err) {
                console.error(err);
            }
        };
        fetchCats();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await apiClient.post("/accounting/expenses", {
                amount: parseFloat(amount),
                description,
                category_id: parseInt(categoryId),
                is_income: type === "income",
                date: new Date().toISOString()
            });
            router.push("/portal/accounting");
        } catch (err) {
            alert("Failed to save transaction");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-start">
            <div className="card bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <header className="flex items-center gap-4 mb-8">
                    <Link href="/portal/accounting" className="hover:bg-gray-100 p-2 rounded-full">
                        <ArrowLeft className="text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Add Transaction</h1>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
                        <button
                            type="button"
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${type === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setType('expense')}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${type === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setType('income')}
                        >
                            Income
                        </button>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Amount ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-input text-2xl font-bold"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="0.00"
                            autoFocus
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <input
                            type="text"
                            className="form-input"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="e.g. Lunch, Taxi, Salary"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                            className="form-input"
                            value={categoryId}
                            onChange={e => setCategoryId(e.target.value)}
                            aria-label="Category"
                            title="Category"
                        >
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`btn-primary w-full flex items-center justify-center gap-2 mt-4 ${type === 'income' && '!bg-green-600 !from-green-600 !to-green-700'}`}
                    >
                        <Save size={20} />
                        <span>{isSubmitting ? "Saving..." : "Save Transaction"}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
