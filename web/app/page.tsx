"use client";

import Link from "next/link";
import { useAuth } from "./auth-context";
import { ArrowRight, LayoutDashboard } from "lucide-react";

export default function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <main className="main-container bg-gradient-to-br from-indigo-50 to-white min-h-screen flex flex-col items-center justify-center p-4">
            <div className="hero text-center max-w-2xl mx-auto">
                <h1 className="logo-text text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                    cbx.life
                </h1>
                <h2 className="text-2xl font-bold text-gray-700 mb-2 font-serif">慈贝瑆</h2>
                <p className="subtitle text-xl text-gray-500 mb-12">Your personal AI-powered life management platform.</p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {isAuthenticated ? (
                        <Link href="/portal" className="btn-primary flex items-center gap-2 px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                            <LayoutDashboard size={24} />
                            Go to Portal
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="btn-primary px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 w-full sm:w-auto">
                                Log In
                            </Link>
                            <Link href="/register" className="px-8 py-3 text-lg font-medium text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all w-full sm:w-auto">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm text-gray-400">
                    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                        <span className="block font-bold text-gray-600 mb-1">SurveyStar</span>
                        Insights
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                        <span className="block font-bold text-gray-600 mb-1">Accounting</span>
                        Finance
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                        <span className="block font-bold text-gray-600 mb-1">CareerDev</span>
                        Growth
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                        <span className="block font-bold text-gray-600 mb-1">SupplyStar</span>
                        Inventory
                    </div>
                </div>
            </div>
        </main>
    );
}
