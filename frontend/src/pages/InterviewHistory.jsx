import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function InterviewHistory() {
    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await api.get("/interview/history");
            setHistory(res.data.history || []);
        } catch (err) {
            console.error("History Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-8">

                <div className="max-w-7xl mx-auto">

                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-slate-800">
                            📜 Interview History
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Review all your previous AI interviews.
                        </p>
                    </div>

                    {loading ? (

                        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
                            <p className="text-gray-500 text-lg">
                                Loading interview history...
                            </p>
                        </div>

                    ) : history.length === 0 ? (

                        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

                            <h2 className="text-2xl font-bold text-gray-700">
                                No Interviews Yet
                            </h2>

                            <p className="text-gray-500 mt-3">
                                Start your first AI interview to see your history.
                            </p>

                            <button
                                onClick={() => navigate("/upload")}
                                className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition hover:scale-105"
                            >
                                🚀 Start Interview
                            </button>

                        </div>

                    ) : (

                        <div className="grid gap-6">

                            {history.map((item) => (

                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
                                >

                                    <div className="flex justify-between items-center">

                                        <div>

                                            <h2 className="text-2xl font-bold text-slate-800">
                                                {item.role}
                                            </h2>

                                            <p className="text-gray-500">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </p>

                                        </div>

                                        <span
                                            className={`px-4 py-2 rounded-full font-semibold ${
                                                item.status === "Completed"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {item.status}
                                        </span>

                                    </div>

                                    <div className="grid md:grid-cols-4 gap-4 mt-6">

                                        <div className="bg-slate-50 rounded-xl p-4">
                                            <p className="text-gray-500">
                                                Percentage
                                            </p>

                                            <h3 className="text-3xl font-bold text-blue-600">
                                                {item.percentage}%
                                            </h3>
                                        </div>

                                        <div className="bg-slate-50 rounded-xl p-4">
                                            <p className="text-gray-500">
                                                Average Score
                                            </p>

                                            <h3 className="text-3xl font-bold text-green-600">
                                                {item.average_score}
                                            </h3>
                                        </div>

                                        <div className="bg-slate-50 rounded-xl p-4">
                                            <p className="text-gray-500">
                                                Questions
                                            </p>

                                            <h3 className="text-3xl font-bold text-indigo-600">
                                                {item.answered_questions}/{item.total_questions}
                                            </h3>
                                        </div>

                                        <div className="bg-slate-50 rounded-xl p-4">
                                            <p className="text-gray-500">
                                                Cheating Events
                                            </p>

                                            <h3 className="text-3xl font-bold text-red-600">
                                                {item.cheating_events}
                                            </h3>
                                        </div>

                                    </div>

                                    <div className="mt-6 flex flex-wrap gap-4">

                                        <button
                                            onClick={() =>
                                                navigate(`/report/${item.id}`)
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition hover:scale-105"
                                        >
                                            📄 View Report
                                        </button>

                                        <button
                                            onClick={() =>
                                                window.open(
                                                    `${import.meta.env.VITE_API_BASE_URL}/interview/report/${item.id}/pdf`,
                                                    "_blank"
                                                )
                                            }
                                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition hover:scale-105"
                                        >
                                            ⬇ Download PDF
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>
        </>
    );
}