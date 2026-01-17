"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { Plus, ShoppingCart, Check, Trash2, Package } from "lucide-react";

interface SupplyItem {
    id: number;
    name: string;
    category: string;
    status: string; // TO_BUY, IN_STOCK
    quantity: string;
}

export default function SupplyPage() {
    const [items, setItems] = useState<SupplyItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const data = await apiClient.get("/supply/items");
            setItems(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (item: SupplyItem) => {
        const newStatus = item.status === "TO_BUY" ? "IN_STOCK" : "TO_BUY";
        try {
            // Backend expects PATCH with status query param as defined in router?
            // Wait, router was defined as: update_item_status(item_id, status, ...)
            // FastAPI takes query params by default for simple types unless Body() is used.
            // So we call: /supply/items/{id}?status=newStatus using empty body patch?
            await apiClient.patch(`/supply/items/${item.id}?status=${newStatus}`, {});
            fetchItems();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const deleteItem = async (id: number) => {
        if (!confirm("Remove this item?")) return;
        try {
            await apiClient.delete(`/supply/items/${id}`);
            fetchItems();
        } catch (err) {
            alert("Failed to delete item");
        }
    };

    const toBuyList = items.filter(i => i.status === "TO_BUY");
    const inStockList = items.filter(i => i.status === "IN_STOCK");

    return (
        <div className="portal-layout">
            <div className="p-8 w-full max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">SupplyStar</h1>
                        <p className="text-gray-500">Inventory & Shopping List</p>
                    </div>
                    <Link href="/portal/supply/add" className="btn-primary flex items-center gap-2" style={{ width: 'auto' }}>
                        <Plus size={20} />
                        <span>Add Item</span>
                    </Link>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* To Buy List */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                                <ShoppingCart size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">To Buy ({toBuyList.length})</h2>
                        </div>

                        <div className="space-y-3">
                            {toBuyList.length === 0 && <p className="text-gray-400 text-sm">Nothing to buy yet.</p>}
                            {toBuyList.map(item => (
                                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg group">
                                    <div>
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.quantity} • {item.category}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => toggleStatus(item)}
                                            className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                                            title="Mark as Bought"
                                            aria-label="Mark as Bought"
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteItem(item.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 rounded-full"
                                            title="Delete Item"
                                            aria-label="Delete Item"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* In Stock List */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit opacity-80">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <Package size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">In Stock ({inStockList.length})</h2>
                        </div>

                        <div className="space-y-3">
                            {inStockList.length === 0 && <p className="text-gray-400 text-sm">Inventory is empty.</p>}
                            {inStockList.map(item => (
                                <div key={item.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg group">
                                    <div>
                                        <p className="font-medium text-gray-800 line-through text-gray-400">{item.name}</p>
                                        <p className="text-xs text-gray-400">{item.quantity} • {item.category}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => toggleStatus(item)}
                                            className="p-2 bg-yellow-50 text-yellow-600 rounded-full hover:bg-yellow-100"
                                            title="Mark as Need to Buy"
                                            aria-label="Mark as Need to Buy"
                                        >
                                            <ShoppingCart size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteItem(item.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 rounded-full"
                                            title="Delete Item"
                                            aria-label="Delete Item"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
