"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth-context";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { Plus, Briefcase, MapPin, Building, Edit2, Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

interface JobApplication {
    id: number;
    company: string;
    position: string;
    status: string;
    salary_range?: string;
    applied_date: string;
}

export default function CareerPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        const fetchApps = async () => {
            try {
                const data = await apiClient.get("/career/applications");
                setApplications(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, [isAuthenticated, router]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'applied': return 'bg-blue-100 text-blue-700';
            case 'interviewing': return 'bg-purple-100 text-purple-700';
            case 'offer': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-gray-100 text-gray-600';
            default: return 'bg-gray-100 text-gray-600';
        }
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
                            <h1 className="text-3xl font-bold text-gray-800">Job Hunter</h1>
                        </div>
                        <p className="text-gray-500">Manage your applications</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/portal/career/profile" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                            <Edit2 size={18} />
                            <span>Edit Profile</span>
                        </Link>
                        <Link href="/portal/career/add" className="btn-primary flex items-center gap-2" style={{ width: 'auto' }}>
                            <Plus size={20} />
                            <span>Track Job</span>
                        </Link>
                    </div>
                </header>

                {loading ? (
                    <div>Loading...</div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-700">No applications tracked</h3>
                        <p className="text-gray-500 mb-6">Start tracking your job search journey.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {applications.map(app => (
                            <div key={app.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                        <Building size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">{app.position}</h3>
                                        <p className="text-gray-600">{app.company}</p>
                                        <div className="flex gap-4 mt-2 text-sm text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {new Date(app.applied_date).toLocaleDateString()}
                                            </span>
                                            {app.salary_range && (
                                                <span>{app.salary_range}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
