"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function AddSupplyItemPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        category: "General",
        quantity: "",
        status: "TO_BUY"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await apiClient.post("/supply/items", formData);
            router.push("/portal/supply");
        } catch (err) {
            alert("Failed to add item");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-start">
            <div className="card bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <header className="flex items-center gap-4 mb-8">
                    <Link href="/portal/supply" className="hover:bg-gray-100 p-2 rounded-full">
                        <ArrowLeft className="text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Add Item</h1>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Item Name</label>
                        <input
                            className="form-input"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                            autoFocus
                            placeholder="e.g. Milk, Batteries"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="form-group flex-1">
                            <label className="form-label">Quantity</label>
                            <input
                                className="form-input"
                                value={formData.quantity}
                                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                placeholder="e.g. 1L, 2 packs"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                            className="form-input"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            aria-label="Category"
                            title="Category"
                        >
                            <option value="General">General</option>
                            <option value="Food">Food / Grocery</option>
                            <option value="Hygiene">Hygiene / Bathroom</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Tools">Tools</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Initial Status</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                className={`flex-1 py-2 rounded-lg border text-sm font-medium ${formData.status === 'TO_BUY' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                                onClick={() => setFormData({ ...formData, status: 'TO_BUY' })}
                            >
                                Need to Buy
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-2 rounded-lg border text-sm font-medium ${formData.status === 'IN_STOCK' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                                onClick={() => setFormData({ ...formData, status: 'IN_STOCK' })}
                            >
                                In Stock
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
                    >
                        <Save size={20} />
                        <span>{isSubmitting ? "Adding..." : "Add to List"}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
