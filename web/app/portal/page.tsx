"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth-context";
import { apiClient } from "@/lib/api";
import Link from "next/link";
import {
    Users,
    PieChart,
    Briefcase,
    ShoppingBasket,
    LogOut,
    Home,
    Menu,
    X
} from "lucide-react";

interface ModuleStat {
    id: string;
    name: string;
    status: string;
    notifications: number;
}

interface PortalData {
    greeting: string;
    modules: ModuleStat[];
}

export default function PortalPage() {
    const { user, logout, isAuthenticated } = useAuth();
    const router = useRouter();
    const [data, setData] = useState<PortalData | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        // Basic protection
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const res = await apiClient.get("/portal/stats");
                setData(res);
            } catch (err) {
                console.error("Failed to load portal data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, router]);

    if (!isAuthenticated || loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-primary text-xl font-medium">Loading cbx.life...</div>
        </div>
    );

    const getModuleIcon = (id: string) => {
        switch (id) {
            case 'survey': return <Users size={24} />;
            case 'accounting': return <PieChart size={24} />;
            case 'career': return <Briefcase size={24} />;
            case 'supply': return <ShoppingBasket size={24} />;
            default: return <Home size={24} />;
        }
    };

    return (
        <div className="portal-layout">
            {/* Mobile Header */}
            <div className="mobile-header md:hidden">
                <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? <X /> : <Menu />}
                </button>
                <span className="font-bold text-lg">cbx.life</span>
                <div className="w-6"></div> {/* Spacer */}
            </div>

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    cbx.life
                </div>

                <nav className="sidebar-nav">
                    <Link href="/portal" className="nav-item active">
                        <Home size={20} />
                        <span>Overview</span>
                    </Link>
                    <Link href="/portal/survey" className="nav-item">
                        <Users size={20} />
                        <span>SurveyStar</span>
                    </Link>
                    <Link href="/portal/accounting" className="nav-item">
                        <PieChart size={20} />
                        <span>Accounting</span>
                    </Link>
                    <Link href="/portal/career" className="nav-item">
                        <Briefcase size={20} />
                        <span>CareerDev</span>
                    </Link>
                    <Link href="/portal/supply" className="nav-item">
                        <ShoppingBasket size={20} />
                        <span>SupplyStar</span>
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        {user?.email}
                    </div>
                    <button onClick={logout} className="logout-btn">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="portal-content">
                <header className="content-header">
                    <h1>{data?.greeting}</h1>
                    <p className="subtitle">Welcome back to your unified platform.</p>
                </header>

                <div className="modules-grid">
                    {data?.modules.map((mod) => (
                        <div key={mod.id} className="module-card">
                            <div className="module-icon">
                                {getModuleIcon(mod.id)}
                            </div>
                            <div className="module-info">
                                <h3>{mod.name}</h3>
                                <span className={`status-badge ${mod.status}`}>{mod.status}</span>
                            </div>
                            {mod.notifications > 0 && (
                                <div className="notification-badge">
                                    {mod.notifications}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div className="sidebar-overlay md:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}
        </div>
    );
}
