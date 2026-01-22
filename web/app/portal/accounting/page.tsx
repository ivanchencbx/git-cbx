"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Plus,
    ArrowUpRight,
    ArrowDownLeft,
    Coffee,
    Car,
    Home,
    Banknote,
    Film,
    Zap,
    ShoppingBag,
    Heart,
    MoreHorizontal,
    Edit2,
    Trash2,
    ArrowLeft
} from "lucide-react";

interface Transaction {
    id: number;
    amount: number; // in cents
    description: string;
    date: string;
    is_income: boolean;
    category_id: number;
}

interface Summary {
    income: number;
    expense: number;
    balance: number;
}

export default function AccountingPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<Summary>({ income: 0, expense: 0, balance: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [txRes, sumRes] = await Promise.all([
                    apiClient.get("/accounting/expenses"),
                    apiClient.get("/accounting/summary")
                ]);
                setTransactions(txRes);
                setSummary(sumRes);
            } catch (err) {
                console.error("Failed to load accounting data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatMoney = (amount: number) => {
        // Amount is in dollars (float) from summary, but cents (int) from transactions
        // The backend sends summary as float dollars, but transaction list amount as cents
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getCategoryIcon = (id: number) => {
        // Mapping purely for visual demo, ideally fetched from DB category icon field
        // We'll just cycle through a few or use generic
        return <Banknote size={20} />;
    };

    return (
        <div className="portal-layout">
            <div className="p-8 w-full max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <Link href="/portal" className="p-2 hover:bg-gray-200 rounded-full" title="Back to Portal">
                                <ArrowLeft size={24} color="var(--secondary)" />
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-800">Accounting</h1>
                        </div>
                        <p className="text-gray-500">Track your income and expenses</p>
                    </div>
                    <Link href="/portal/accounting/add" className="btn-primary flex items-center gap-2" style={{ width: 'auto' }}>
                        <Plus size={20} />
                        <span>Add Transaction</span>
                    </Link>
                </header>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-100 rounded-lg text-primary">
                                <Wallet size={24} />
                            </div>
                            <span className="text-sm text-gray-400">Total Balance</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">{formatMoney(summary.balance)}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-green-100 rounded-lg text-green-600">
                                <TrendingUp size={24} />
                            </div>
                            <span className="text-sm text-gray-400">Income</span>
                        </div>
                        <h3 className="text-2xl font-bold text-green-600">+{formatMoney(summary.income)}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-red-100 rounded-lg text-red-600">
                                <TrendingDown size={24} />
                            </div>
                            <span className="text-sm text-gray-400">Expense</span>
                        </div>
                        <h3 className="text-2xl font-bold text-red-600">-{formatMoney(summary.expense)}</h3>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : transactions.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <Wallet size={48} className="mx-auto text-gray-300 mb-4" />
                            <p>No transactions found.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {transactions.map(tx => (
                                <div key={tx.id} className="p-4 hover:bg-gray-50 flex items-center justify-between transition-colors group">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`p-3 rounded-full ${tx.is_income ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {tx.is_income ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{tx.description}</p>
                                            <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`font-bold ${tx.is_income ? 'text-green-600' : 'text-gray-800'}`}>
                                            {tx.is_income ? '+' : '-'}{formatMoney(tx.amount / 100)}
                                        </span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/portal/accounting/edit/${tx.id}`}
                                                className="p-2 hover:bg-blue-100 rounded text-blue-600 transition"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
