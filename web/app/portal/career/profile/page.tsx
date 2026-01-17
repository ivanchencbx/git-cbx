"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface Experience {
    company: string;
    role: string;
    duration: string;
}

interface Profile {
    headline: string;
    skills: string[];
    experience: Experience[];
    education: any[];
}

export default function EditProfilePage() {
    const router = useRouter();
    const [headline, setHeadline] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [experience, setExperience] = useState<Experience[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newSkill, setNewSkill] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await apiClient.get("/career/profile");
                setHeadline(data.headline || "");
                setSkills(data.skills || []);
                setExperience(data.experience || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            await apiClient.put("/career/profile", {
                headline,
                skills,
                experience,
                education: [] // Simplified for now
            });
            router.push("/portal/career");
        } catch (err) {
            alert("Failed to save profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    const addSkill = () => {
        if (newSkill.trim()) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill("");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/portal/career" className="p-2 hover:bg-gray-200 rounded-full">
                            <ArrowLeft size={24} color="var(--secondary)" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="btn-primary flex items-center gap-2 w-auto"
                    >
                        <Save size={20} />
                        <span>Save Changes</span>
                    </button>
                </header>

                <div className="space-y-6">
                    <div className="card bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="form-group">
                            <label className="form-label">Professional Headline</label>
                            <input
                                className="form-input"
                                value={headline}
                                onChange={e => setHeadline(e.target.value)}
                                placeholder="e.g. Senior Software Engineer"
                            />
                        </div>
                    </div>

                    <div className="card bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <label className="form-label mb-4">Skills</label>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {skills.map((skill, idx) => (
                                <span key={idx} className="px-3 py-1 bg-purple-50 text-primary rounded-full text-sm font-medium flex items-center gap-2">
                                    {skill}
                                    <button onClick={() => setSkills(skills.filter((_, i) => i !== idx))} className="hover:text-red-500" title="Remove Skill">
                                        <Trash2 size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                className="form-input flex-1"
                                value={newSkill}
                                onChange={e => setNewSkill(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addSkill()}
                                placeholder="Add a skill..."
                            />
                            <button onClick={addSkill} className="px-4 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
