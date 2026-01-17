"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { generateUUID } from "@/lib/utils";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Question {
    id: string;
    type: string;
    label: string;
    options?: string[];
    required: boolean;
}

export default function CreateSurveyPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addQuestion = (type: string) => {
        const newQ: Question = {
            id: generateUUID(),
            type,
            label: "",
            required: false,
            options: type === "multiple_choice" ? ["Option 1"] : undefined,
        };
        setQuestions([...questions, newQ]);
    };

    const updateQuestion = (id: string, field: keyof Question, value: any) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const removeQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const saveSurvey = async () => {
        if (!title) return alert("Please enter a title");
        setIsSubmitting(true);
        try {
            await apiClient.post("/surveys/", {
                title,
                description,
                questions
            });
            router.push("/portal/survey");
        } catch (err) {
            alert("Failed to save survey");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/portal/survey" className="p-2 hover:bg-gray-200 rounded-full">
                            <ArrowLeft size={24} color="var(--secondary)" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">Create New Survey</h1>
                    </div>
                    <button
                        onClick={saveSurvey}
                        disabled={isSubmitting}
                        className="btn-primary flex items-center gap-2 w-auto"
                    >
                        <Save size={20} />
                        <span>{isSubmitting ? "Saving..." : "Save Survey"}</span>
                    </button>
                </header>

                <div className="space-y-6">
                    {/* General Info Card */}
                    <div className="card bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="form-group">
                            <label className="form-label">Survey Title</label>
                            <input
                                className="form-input"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="e.g., Customer Satisfaction Survey"
                            />
                        </div>
                        <div className="form-group mb-0">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-input"
                                rows={3}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Briefly describe the purpose..."
                            />
                        </div>
                    </div>

                    {/* Questions List */}
                    {questions.map((q, idx) => (
                        <div key={q.id} className="card bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => removeQuestion(q.id)} className="text-red-500 hover:text-red-700 p-1" title="Remove Question">
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <div className="flex gap-4 mb-4">
                                <span className="font-bold text-gray-400 pt-3">Q{idx + 1}</span>
                                <div className="flex-1">
                                    <input
                                        className="form-input text-lg font-medium border-none bg-transparent focus:ring-0 px-0"
                                        value={q.label}
                                        onChange={e => updateQuestion(q.id, "label", e.target.value)}
                                        placeholder="Enter your question here..."
                                    />
                                </div>
                                <div className="w-40">
                                    <select
                                        className="form-input text-sm"
                                        value={q.type}
                                        onChange={e => updateQuestion(q.id, "type", e.target.value)}
                                        aria-label="Question Type"
                                        title="Question Type"
                                    >
                                        <option value="text">Short Text</option>
                                        <option value="long_text">Long Text</option>
                                        <option value="multiple_choice">Multiple Choice</option>
                                        <option value="rating">Rating</option>
                                    </select>
                                </div>
                            </div>

                            {/* Options Editor for Multiple Choice */}
                            {q.type === 'multiple_choice' && (
                                <div className="ml-8 space-y-2">
                                    {q.options?.map((opt, optIdx) => (
                                        <div key={optIdx} className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                                            <input
                                                className="flex-1 border-b border-gray-200 focus:border-primary outline-none py-1 bg-transparent"
                                                value={opt}
                                                onChange={e => {
                                                    const newOptions = [...(q.options || [])];
                                                    newOptions[optIdx] = e.target.value;
                                                    updateQuestion(q.id, "options", newOptions);
                                                }}
                                                aria-label={`Option ${optIdx + 1}`}
                                                placeholder={`Option ${optIdx + 1}`}
                                            />
                                        </div>
                                    ))}
                                    <button
                                        className="text-primary text-sm font-medium mt-2 hover:underline"
                                        onClick={() => updateQuestion(q.id, "options", [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`])}
                                    >
                                        + Add Option
                                    </button>
                                </div>
                            )}

                            <div className="ml-8 mt-4 pt-4 border-t border-gray-50 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id={`req-${q.id}`}
                                    checked={q.required}
                                    onChange={e => updateQuestion(q.id, "required", e.target.checked)}
                                    className="w-4 h-4 text-primary rounded"
                                />
                                <label htmlFor={`req-${q.id}`} className="text-sm text-gray-500">Required</label>
                            </div>
                        </div>
                    ))}

                    {/* Add Question Buttons */}
                    <div className="flex justify-center gap-4 py-8 border-2 border-dashed border-gray-200 rounded-xl">
                        <button onClick={() => addQuestion("text")} className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-primary hover:text-primary transition-colors">
                            + Text Question
                        </button>
                        <button onClick={() => addQuestion("multiple_choice")} className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-primary hover:text-primary transition-colors">
                            + Multiple Choice
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
