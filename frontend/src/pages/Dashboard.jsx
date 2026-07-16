import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Dashboard() {

    const location = useLocation();
    const navigate = useNavigate();

    const { user } = useAuth();

    const locationResume = location.state?.resumeData;
    const locationInterviewId = location.state?.interviewId;

    const [resumeData, setResumeData] = useState(locationResume);
    const [interviewId, setInterviewId] = useState(locationInterviewId);
    const [loading, setLoading] = useState(true);

    const [analytics, setAnalytics] = useState(null);

    const atsScore =
        resumeData?.ats_result?.ats_score || 0;

    const matchedSkills =
        resumeData?.ats_result?.matched_skills || [];

    const missingSkills =
        resumeData?.ats_result?.missing_skills || [];

    const candidate =
        resumeData?.candidate || {};

    const role =
        resumeData?.role_prediction?.predicted_role ||
        resumeData?.candidate?.predicted_role ||
        "Not Available";
        
    useEffect(() => {

    const fetchCandidate = async () => {

    if (locationResume) {
        setLoading(false);
        return;
    }

    try {

        const res = await api.get("/candidates/me");

        console.log("Candidate API Response:", res.data);

        if (res.data.candidate) {

            setResumeData({
                candidate: res.data.candidate,

             ats_result: {
                ats_score: res.data.candidate.ats_score,
                matched_skills: res.data.candidate.matched_skills,
                missing_skills: res.data.candidate.missing_skills,
            },

            role_prediction: {
                predicted_role: res.data.candidate.predicted_role,
            },

            resume_suggestions: res.data.candidate.resume_suggestions,

            ai_resume_review: res.data.candidate.ai_resume_review,
        });

            const historyRes = await api.get("/interview/history");

            if (historyRes.data.history.length > 0) {
                setInterviewId(historyRes.data.history[0].id);
            }

        }

    } catch (err) {

        console.error(err);

    } finally {

        setLoading(false);

    }

};
    fetchCandidate();

}, []);

    useEffect(() => {

        if (!interviewId) return;

        const fetchAnalytics = async () => {

            try {

                const res = await api.get(
                    `/interview/analytics/${interviewId}`
                );

                setAnalytics(res.data.analysis);

            } catch (err) {

                console.error("Analytics Error:", err);

            }

        };

        fetchAnalytics();

    }, [interviewId]);

    // ---------------------------------
    // FIRST LOGIN (NO RESUME)
    // ---------------------------------
if (loading) {

    return (

        <>
            <Navbar />

            <div className="min-h-screen flex items-center justify-center">

                <h2 className="text-2xl font-semibold">
                    Loading Dashboard...
                </h2>

            </div>

        </>

    );

}
    if (!resumeData && !interviewId) {

        return (

            <>

                <Navbar />

                <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center px-6">

                    <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-10 text-center">

                        <h1 className="text-5xl font-bold text-slate-800">
                            Welcome {user?.full_name || "Candidate"} 👋
                        </h1>

                        <p className="mt-5 text-lg text-gray-600">
                            Welcome to
                            <span className="font-semibold text-indigo-600">
                                {" "}InterviewIQ AI
                            </span>.
                            Upload your resume to unlock ATS analysis,
                            AI resume review,
                            role prediction,
                            mock interviews,
                            interview reports
                            and detailed analytics.
                        </p>

                        <button
                            onClick={() => navigate("/upload")}
                            className="mt-10 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-105"
                        >
                            🚀 Upload Resume
                        </button>

                        <div className="grid md:grid-cols-2 gap-6 mt-12">

                            <div className="bg-indigo-50 rounded-2xl p-6">

                                <h3 className="text-xl font-bold text-indigo-700">
                                    📄 ATS Resume Analysis
                                </h3>

                                <p className="text-gray-600 mt-2">
                                    Get ATS score, matched skills
                                    and missing skills instantly.
                                </p>

                            </div>

                            <div className="bg-green-50 rounded-2xl p-6">

                                <h3 className="text-xl font-bold text-green-700">
                                    🤖 AI Resume Review
                                </h3>

                                <p className="text-gray-600 mt-2">
                                    Receive AI suggestions to improve
                                    your resume.
                                </p>

                            </div>

                            <div className="bg-blue-50 rounded-2xl p-6">

                                <h3 className="text-xl font-bold text-blue-700">
                                    🎤 AI Mock Interview
                                </h3>

                                <p className="text-gray-600 mt-2">
                                    Practice role-based interview
                                    questions with AI.
                                </p>

                            </div>

                            <div className="bg-purple-50 rounded-2xl p-6">

                                <h3 className="text-xl font-bold text-purple-700">
                                    📊 Performance Analytics
                                </h3>

                                <p className="text-gray-600 mt-2">
                                    Track interview performance
                                    and monitor improvement.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </>

        );

    }

    // ---------------------------------
    // DASHBOARD AFTER RESUME UPLOAD
    // ---------------------------------

    return (

        <>

            <Navbar />

            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-8">

                <div className="max-w-7xl mx-auto">
                    <div className="mb-10">

    <h1 className="text-5xl font-bold text-slate-800">
       Welcome {user?.full_name || candidate.full_name || "Candidate"} 🚀
    </h1>

    <p className="text-gray-500 mt-3">
        AI powered resume analysis and interview intelligence dashboard
    </p>

</div>

{/* Top Cards */}

<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

    <div className="bg-white rounded-2xl shadow-lg p-6">
        <p className="text-gray-500">ATS Score</p>
        <h2 className="text-5xl font-bold text-blue-600 mt-3">
            {atsScore}%
        </h2>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-6">
        <p className="text-gray-500">Predicted Role</p>
        <h2 className="text-2xl font-bold text-green-600 mt-5">
            {role}
        </h2>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-6">
        <p className="text-gray-500">Skills Matched</p>
        <h2 className="text-5xl font-bold text-purple-600 mt-3">
            {matchedSkills.length}
        </h2>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-6">
        <p className="text-gray-500">Interview Status</p>
        <h2 className="text-2xl font-bold text-indigo-600 mt-5">
            {interviewId ? "Completed" : "Not Started"}
        </h2>
    </div>

</div>

{/* Skills */}

<div className="grid lg:grid-cols-2 gap-6 mt-8">

    <div className="bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-bold mb-5">
            Matched Skills
        </h2>

        <div className="flex flex-wrap gap-3">

            {matchedSkills.length > 0 ? (

                matchedSkills.map((skill, index) => (

                    <span
                        key={index}
                        className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold"
                    >
                        {skill}
                    </span>

                ))

            ) : (

                <p>No skills found.</p>

            )}

        </div>

    </div>

    <div className="bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-bold mb-5">
            Missing Skills
        </h2>

        <div className="flex flex-wrap gap-3">

            {missingSkills.length > 0 ? (

                missingSkills.map((skill, index) => (

                    <span
                        key={index}
                        className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-semibold"
                    >
                        {skill}
                    </span>

                ))

            ) : (

                <p>No missing skills.</p>

            )}

        </div>

    </div>

</div>

{/* Interview Analytics */}

<div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

    <h2 className="text-2xl font-bold mb-5">
        Interview Performance
    </h2>

    <div className="grid md:grid-cols-3 gap-5">

        <div className="bg-slate-50 rounded-xl p-5">
            <p>Total Questions</p>

            <h3 className="text-3xl font-bold mt-2">
                {analytics?.total_questions ?? "-"}
            </h3>
        </div>

        <div className="bg-green-50 rounded-xl p-5">
            <p>Average Score</p>

            <h3 className="text-3xl font-bold text-green-600 mt-2">
                {analytics?.average_score ?? "-"}
            </h3>
        </div>

        <div className="bg-blue-50 rounded-xl p-5">
            <p>Percentage</p>

            <h3 className="text-3xl font-bold text-blue-600 mt-2">
                {analytics ? `${analytics.percentage}%` : "-"}
            </h3>
        </div>

    </div>

</div>

{/* AI Resume Review */}

<div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

    <h2 className="text-2xl font-bold mb-5">
        AI Resume Review
    </h2>

    <p className="text-gray-700 leading-8 whitespace-pre-line">
    {
        resumeData?.ai_resume_review ||
        resumeData?.candidate?.ai_resume_review ||
        "AI review not available"
    }
</p>

</div>

{/* Resume Suggestions */}

<div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

    <h2 className="text-2xl font-bold mb-5">
        Resume Suggestions
    </h2>

    <div className="space-y-3">

        {(resumeData?.resume_suggestions ||
  resumeData?.candidate?.resume_suggestions) ? (

    (resumeData.resume_suggestions ||
     resumeData.candidate.resume_suggestions)
        .split("\n")
                .map((item, index) => (

                    <p
                        key={index}
                        className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded"
                    >
                        ✅ {item}
                    </p>

                ))

        ) : (

            <p>No suggestions available.</p>

        )}

    </div>

</div>

{/* Buttons */}

<div className="flex flex-wrap gap-5 mt-10">

    <button
        onClick={() => navigate("/upload")}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold"
    >
        🚀 Start New Interview
    </button>

    <button
        onClick={() => navigate("/history")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold"
    >
        📜 Interview History
    </button>

</div>

                </div>
            </div>

        </>

    );

}