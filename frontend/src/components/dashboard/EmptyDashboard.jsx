import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileUp, BarChart3, GraduationCap, Mic, Lock } from "lucide-react";
import api from "../../services/api";

const MAX_SIZE = 5 * 1024 * 1024;

const STEPS = [
    { icon: FileUp, title: "Upload Resume", text: "Add your experience and skills." },
    { icon: BarChart3, title: "AI Analysis", text: "Discover your strengths and gaps." },
    { icon: GraduationCap, title: "AI Coaching", text: "Build confidence with guidance." },
    { icon: Mic, title: "Mock Interview", text: "Practice before the real thing." },
];

function firstName(fullName) {
    const first = (fullName || "").trim().split(/\s+/)[0];
    if (!first) return "there";
    return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export default function EmptyDashboard({ user }) {
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    // Same endpoint + navigation as components/ResumeUpload.jsx
    const uploadFile = async (file) => {
        if (!file || uploading) return;

        const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
        if (!isPdf) {
            setError("Please upload your resume as a PDF file.");
            return;
        }
        if (file.size > MAX_SIZE) {
            setError("This file is larger than 5 MB. Please upload a smaller PDF.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setError("");
        setUploading(true);

        try {
            const res = await api.post("/candidates/upload-resume/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 120000,
            });
            navigate("/resume-result", { state: res.data });
        } catch (err) {
            console.error("Upload error:", err);
            setError(err.response?.data?.detail || "Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        uploadFile(e.dataTransfer.files?.[0]);
    };

    const onPick = (e) => {
        uploadFile(e.target.files?.[0]);
        e.target.value = "";
    };

    return (
        <div className="mx-auto max-w-6xl px-5 pb-12 pt-6 sm:px-8 lg:px-10 lg:pt-2">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Welcome back, <span className="text-indigo-600">{firstName(user?.full_name)}</span>
            </h1>
            <p className="mt-3 text-base text-slate-500 sm:text-lg">
                Let's turn your resume into interview confidence.
            </p>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_1fr]">
                {/* UPLOAD CARD */}
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-indigo-600">
                        Start here
                    </span>
                    <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        Your next opportunity starts here
                    </h2>
                    <p className="mt-2 text-slate-500">
                        Upload your resume to get personalized insights and interview practice.
                    </p>

                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragging(true);
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={onDrop}
                        className={`mt-6 flex flex-col items-center rounded-2xl border-2 border-dashed px-4 py-10 text-center transition ${
                            dragging ? "border-indigo-500 bg-indigo-50" : "border-indigo-200 bg-indigo-50/30"
                        }`}
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                            <FileUp size={28} />
                        </div>
                        <p className="mt-4 text-lg font-bold text-slate-900">Drop your resume here</p>
                        <p className="mt-1 text-sm text-slate-500">or choose a file from your computer</p>

                        <input
                            ref={inputRef}
                            type="file"
                            accept=".pdf,application/pdf"
                            className="hidden"
                            onChange={onPick}
                        />

                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            disabled={uploading}
                            className="mt-5 inline-flex min-w-48 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60"
                        >
                            {uploading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    Analyzing resume...
                                </>
                            ) : (
                                "Upload Resume"
                            )}
                        </button>

                        <p className="mt-3 text-xs text-slate-400">PDF only (max 5 MB)</p>
                    </div>

                    {error && (
                        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                            {error}
                        </p>
                    )}
                </section>

                {/* MOCK INTERVIEW CARD */}
                <section className="flex flex-col rounded-3xl border border-violet-100 bg-gradient-to-b from-violet-50/70 to-white p-6 shadow-sm sm:p-8">
                    <span className="inline-block self-start rounded-full bg-violet-100 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-violet-700">
                        AI mock interview
                    </span>

                    <div className="my-4 flex flex-1 items-center justify-center">
                        <img
                            src="/ai-coach.gif"
                            alt="AI interviewer"
                            className="h-44 w-auto max-w-full object-contain sm:h-52"
                        />
                    </div>

                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        Your practice partner is ready
                    </h2>
                    <p className="mt-2 text-slate-500">
                        Upload your resume to unlock a personalized mock interview.
                    </p>

                    <button
                        type="button"
                        disabled
                        className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-200/80 px-6 py-3.5 font-semibold text-slate-500"
                    >
                        <Lock size={17} />
                        Start Mock Interview
                    </button>
                    <p className="mt-3 text-center text-xs text-slate-400">Upload your resume to get started.</p>
                </section>
            </div>

            {/* JOURNEY */}
            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Your interview journey</h2>
                <p className="mt-1 text-slate-500">Four steps to feel more prepared.</p>

                <ol className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
                    {STEPS.map(({ icon: Icon, title, text }, i) => (
                        <li key={title}>
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                                        i === 0 ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-500"
                                    }`}
                                >
                                    <Icon size={22} />
                                </div>
                                <span
                                    className={`text-sm font-bold ${i === 0 ? "text-indigo-600" : "text-slate-400"}`}
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                {i < STEPS.length - 1 && (
                                    <span className="hidden h-px flex-1 border-t border-dashed border-slate-300 xl:block" />
                                )}
                            </div>
                            <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
                            <p className="mt-1 text-sm text-slate-500">{text}</p>
                        </li>
                    ))}
                </ol>
            </section>
        </div>
    );
}
