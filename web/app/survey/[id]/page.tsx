"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";
import Link from "next/link";

interface Question {
    id: string;
    type: string;
    label: string;
    options?: string[];
    required: boolean;
}

interface Survey {
    id: number;
    title: string;
    description: string;
    is_active: boolean;
    created_at: string;
    questions: Question[];
}

interface Answer {
    question_id: string;
    value: string | string[];
}

export default function SurveyViewPage() {
    const params = useParams();
    const router = useRouter();
    const surveyId = params.id as string;

    const [survey, setSurvey] = useState<Survey | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                setLoading(true);
                const data = await apiClient.get(`/surveys/${surveyId}`);
                setSurvey(data);
                // Initialize empty answers
                const initialAnswers: Record<string, string | string[]> = {};
                data.questions?.forEach((q: Question) => {
                    initialAnswers[q.id] = q.type === "multiple_choice" ? [] : "";
                });
                setAnswers(initialAnswers);
            } catch (err: any) {
                console.error("Failed to load survey", err);
                setError(err.message || "Failed to load survey");
            } finally {
                setLoading(false);
            }
        };

        if (surveyId) {
            fetchSurvey();
        }
    }, [surveyId]);

    const handleAnswerChange = (questionId: string, value: string | string[]) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Convert answers to format expected by backend: { question_id: value }
            const formattedAnswers = Object.entries(answers).reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {} as Record<string, string | string[]>);

            await apiClient.post(`/surveys/${surveyId}/responses`, {
                answers: formattedAnswers
            });
            setSubmitted(true);
        } catch (err: any) {
            const errorMsg = err.message || "Failed to submit survey response";
            setError(errorMsg);
            console.error("Submit error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-lg text-gray-600">Loading survey...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link href="/portal/survey" className="btn-primary">
                        Back to Surveys
                    </Link>
                </div>
            </div>
        );
    }

    if (!survey) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Survey Not Found</h1>
                    <p className="text-gray-600 mb-6">The survey you're looking for doesn't exist or has been deleted.</p>
                    <Link href="/portal/survey" className="btn-primary">
                        Back to Surveys
                    </Link>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md bg-white p-8 rounded-xl shadow-lg">
                    <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h1>
                    <p className="text-gray-600 mb-6">Your response has been recorded successfully.</p>
                    <Link href="/portal/survey" className="btn-primary">
                        Back to Surveys
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto">
                <header className="mb-8 flex items-center gap-4">
                    <Link href="/portal/survey" className="p-2 hover:bg-gray-200 rounded-full">
                        <ArrowLeft size={24} className="text-secondary" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-800">{survey.title}</h1>
                        {survey.description && (
                            <p className="text-gray-600 mt-2">{survey.description}</p>
                        )}
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {survey.questions && survey.questions.length > 0 ? (
                        survey.questions.map((question, index) => (
                            <div key={question.id} className="bg-white p-6 rounded-xl border border-gray-200">
                                <div className="mb-4">
                                    <label className="block text-lg font-semibold text-gray-800 mb-2">
                                        Q{index + 1}. {question.label}
                                        {question.required && <span className="text-red-500 ml-1">*</span>}
                                    </label>
                                </div>

                                {question.type === "text" && (
                                    <input
                                        type="text"
                                        className="form-input w-full"
                                        value={answers[question.id] as string || ""}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        required={question.required}
                                        placeholder="Enter your answer..."
                                    />
                                )}

                                {question.type === "long_text" && (
                                    <textarea
                                        className="form-input w-full"
                                        rows={4}
                                        value={answers[question.id] as string || ""}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        required={question.required}
                                        placeholder="Enter your answer..."
                                    />
                                )}

                                {question.type === "multiple_choice" && (
                                    <div className="space-y-3">
                                        {question.options?.map((option, optIndex) => (
                                            <label key={optIndex} className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={question.id}
                                                    value={option}
                                                    checked={(answers[question.id] as string) === option}
                                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                    className="w-4 h-4 cursor-pointer"
                                                />
                                                <span className="text-gray-700">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {question.type === "rating" && (
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => handleAnswerChange(question.id, star.toString())}
                                                className={`w-10 h-10 rounded-full border-2 font-semibold transition ${
                                                    (answers[question.id] as string) === star.toString()
                                                        ? "bg-primary text-white border-primary"
                                                        : "bg-white text-gray-600 border-gray-300 hover:border-primary"
                                                }`}
                                            >
                                                {star}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="bg-white p-6 rounded-xl border border-gray-200 text-center text-gray-500">
                            This survey has no questions yet.
                        </div>
                    )}

                    <div className="flex gap-4 pt-6">
                        <Link href="/portal/survey" className="btn-secondary flex-1 text-center">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting || !survey.questions || survey.questions.length === 0}
                            className="btn-primary flex-1 flex items-center justify-center gap-2"
                        >
                            <Send size={20} />
                            <span>{isSubmitting ? "Submitting..." : "Submit Survey"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
