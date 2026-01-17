"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { Plus, FileText, Calendar } from "lucide-react";

interface Survey {
    id: number;
    title: string;
    description: string;
    is_active: boolean;
    created_at: string;
}

export default function SurveyListPage() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const data = await apiClient.get("/surveys/");
                setSurveys(data);
            } catch (err) {
                console.error("Failed to load surveys", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSurveys();
    }, []);

    return (
        <div className="portal-layout">
            {/* We would reuse the sidebar component here or use a Layout wrapper, 
            but for simplicity in this file-by-file gen, I'll assume Layout wrapper or just content */}
            <div className="p-8 w-full max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">My Surveys</h1>
                        <p className="text-gray-500">Manage your questionnaires</p>
                    </div>
                    <Link href="/portal/survey/create" className="btn-primary flex items-center gap-2" style={{ width: 'auto' }}>
                        <Plus size={20} />
                        <span>Create New</span>
                    </Link>
                </header>

                {loading ? (
                    <div>Loading...</div>
                ) : surveys.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-700">No surveys yet</h3>
                        <p className="text-gray-500 mb-6">Create your first survey to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {surveys.map(survey => (
                            <div key={survey.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                                <h3 className="text-xl font-bold text-primary mb-2">{survey.title}</h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">{survey.description || "No description"}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <span className={`px-2 py-1 rounded-full text-xs ${survey.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {survey.is_active ? 'Active' : 'Draft'}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        {new Date(survey.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                    <Link href={`/survey/${survey.id}`} className="text-primary hover:underline text-sm font-medium">
                                        View Live
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
