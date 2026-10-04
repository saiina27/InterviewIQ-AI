import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";


export default function Dashboard() {

    const location = useLocation();
    const navigate = useNavigate();

    const { user } = useAuth();


    const [resumeData, setResumeData] = useState(
        location.state?.resumeData || null
    );

    const [interviewId, setInterviewId] = useState(
        location.state?.interviewId || null
    );

    const [analytics, setAnalytics] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");



    // -----------------------------
    // SAFE JSON PARSER
    // -----------------------------

    const parseJSON = (data) => {

        if (!data) return null;

        if (typeof data === "object") {
            return data;
        }

        try {

            return JSON.parse(data);

        } catch {

            return null;

        }

    };





    // -----------------------------
    // FETCH USER RESUME DATA
    // -----------------------------

    useEffect(() => {


        const fetchDashboardData = async () => {


            if (resumeData) {

                setLoading(false);
                return;

            }



            try {


                const candidateResponse =
                    await api.get("/candidates/me");



                const candidate =
                    candidateResponse.data.candidate;



                if (candidate) {


                    setResumeData({

                        candidate,


                        ats_result: {

                            ats_score:
                                candidate.ats_score || 0,


                            matched_skills:
                                candidate.matched_skills || [],


                            missing_skills:
                                candidate.missing_skills || []

                        },


                        role_prediction: {

                            predicted_role:
                                candidate.predicted_role ||
                                "Not Available"

                        },


                        resume_suggestions:
                            Array.isArray(candidate.resume_suggestions)
                                ? candidate.resume_suggestions
                                : (
                                    parseJSON(candidate.resume_suggestions) ||
                                    parseJSON(candidate.ai_resume_review)?.resume_suggestions ||
                                    []
                                ),



                        ai_resume_review:
                            parseJSON(
                                candidate.ai_resume_review
                            )


                    });



                }




                const historyResponse =
                    await api.get("/interview/history");



                if (
                    historyResponse.data.history &&
                    historyResponse.data.history.length > 0
                ) {


                    setInterviewId(
                        historyResponse.data.history[0].id
                    );


                }




            }

            catch(err) {


                console.error(
                    "Dashboard Error:",
                    err
                );


                setError(
                    "Unable to load dashboard data."
                );


            }

            finally {


                setLoading(false);


            }



        };



        fetchDashboardData();



    }, []);







    // -----------------------------
    // FETCH INTERVIEW ANALYTICS
    // -----------------------------


    useEffect(() => {


        if (!interviewId)
            return;



        const fetchAnalytics = async () => {


            try {


                const response =
                    await api.get(
                        `/interview/analytics/${interviewId}`
                    );


                setAnalytics(
                    response.data.analysis
                );



            }

            catch(err) {


                console.error(
                    "Analytics Error:",
                    err
                );


            }


        };



        fetchAnalytics();



    }, [interviewId]);







    // -----------------------------
    // DATA VARIABLES
    // -----------------------------


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
        candidate?.predicted_role ||
        "Not Available";







    // -----------------------------
    // LOADING
    // -----------------------------


    if (loading) {


        return (

            <>

                <Navbar />


                <div className="
                    min-h-screen
                    flex
                    items-center
                    justify-center
                    bg-slate-100
                ">


                    <h2 className="
                        text-3xl
                        font-bold
                        text-indigo-600
                    ">

                        Loading InterviewIQ AI...

                    </h2>


                </div>


            </>

        );


    }





    // -----------------------------
    // ERROR
    // -----------------------------


    if (error) {


        return (

            <>

                <Navbar />


                <div className="
                    min-h-screen
                    flex
                    items-center
                    justify-center
                ">


                    <div className="
                        bg-white
                        shadow-xl
                        rounded-3xl
                        p-10
                        text-center
                    ">


                        <h2 className="
                            text-2xl
                            font-bold
                            text-red-600
                        ">

                            {error}

                        </h2>



                        <button

                            onClick={() =>
                                navigate("/upload")
                            }

                            className="
                                mt-6
                                bg-indigo-600
                                text-white
                                px-8
                                py-3
                                rounded-xl
                                font-bold
                            "

                        >

                            Upload Resume

                        </button>


                    </div>


                </div>


            </>

        );


    }







    // -----------------------------
    // FIRST LOGIN EMPTY STATE
    // -----------------------------


    if (!resumeData && !interviewId) {
        return (
            <>
                <Navbar />

                <main className="
                    relative min-h-[calc(100vh-64px)] overflow-hidden
                    bg-gradient-to-br from-white via-indigo-50/60 to-blue-50
                    px-5 py-8 sm:px-8 lg:px-12
                ">

                    <div className="
                        pointer-events-none absolute -left-40 top-20
                        h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl
                    " />

                    <div className="
                        pointer-events-none absolute -right-40 bottom-0
                        h-[28rem] w-[28rem] rounded-full bg-blue-200/30 blur-3xl
                    " />

                    <div className="relative mx-auto max-w-7xl">

                        {/* HEADER */}
                        <div className="
                            flex flex-col gap-6
                            lg:flex-row lg:items-center lg:justify-between
                        ">

                            <div>

                                <div className="
                                    mb-4 inline-flex items-center gap-2
                                    rounded-full border border-indigo-100
                                    bg-white/80 px-4 py-2 text-xs font-bold
                                    tracking-[0.18em] text-indigo-600 shadow-sm
                                ">
                                    ✦ AI INTERVIEW PREPARATION
                                </div>

                                <h1 className="
                                    text-4xl font-black tracking-tight text-slate-900
                                    sm:text-5xl lg:text-6xl
                                ">
                                    Welcome back,{" "}
                                    <span className="
                                        bg-gradient-to-r from-indigo-600
                                        via-blue-600 to-purple-600
                                        bg-clip-text text-transparent
                                    ">
                                        {(user?.full_name || "Sameer")
                                            .split(" ")
                                            .map(
                                                (name) =>
                                                    name.charAt(0).toUpperCase() +
                                                    name.slice(1).toLowerCase()
                                            )
                                            .join(" ")}
                                    </span>{" "}
                                    👋
                                </h1>

                                <p className="
                                    mt-4 text-base leading-7 text-slate-500 sm:text-lg
                                ">
                                    Let's turn your resume into interview confidence —
                                    one step at a time.
                                </p>

                            </div>

                            <button
                                onClick={() => navigate("/upload")}
                                className="
                                    self-start rounded-2xl
                                    bg-gradient-to-r from-indigo-600 to-blue-600
                                    px-7 py-3.5 font-extrabold text-white
                                    shadow-lg shadow-indigo-200 transition duration-300
                                    hover:-translate-y-0.5 hover:shadow-xl
                                    hover:shadow-indigo-300 active:scale-[0.98]
                                    lg:self-center
                                "
                            >
                                🚀 Upload Resume
                            </button>

                        </div>


                        {/* MAIN HERO */}
                        <section className="
                            relative mt-10 overflow-hidden rounded-[2rem]
                            border border-indigo-100 bg-white/80
                            shadow-[0_25px_80px_rgba(79,70,229,0.12)]
                            backdrop-blur-xl
                        ">

                            <div className="
                                absolute inset-0
                                bg-gradient-to-br from-indigo-50/50
                                via-transparent to-blue-50/60
                            " />

                            <div className="
                                relative z-10 grid items-center gap-8
                                p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10
                            ">

                                {/* LEFT SIDE */}
                                <div>

                                    <p className="
                                        text-xs font-bold uppercase
                                        tracking-[0.22em] text-indigo-500
                                    ">
                                        Your interview journey
                                    </p>

                                    <h2 className="
                                        mt-3 text-3xl font-black leading-tight
                                        text-slate-900 sm:text-4xl
                                    ">
                                        From Resume → Interview Ready
                                    </h2>

                                    <p className="
                                        mt-4 whitespace-nowrap text-sm
                                        leading-6 text-slate-500
                                    ">
                                        InterviewIQ analyzes your profile, identifies your gaps and helps you practice before the real interview.
                                    </p>


                                    {/* WORKFLOW */}
                                    <div className="relative mt-10">

                                        <div className="
                                            pointer-events-none absolute left-8 right-8
                                            top-7 hidden h-[2px]
                                            bg-gradient-to-r from-indigo-200
                                            via-blue-300 to-purple-200 md:block
                                        " />

                                        <div className="
                                            relative grid gap-4 sm:grid-cols-2 xl:grid-cols-4
                                        ">

                                            {/* 01 */}
                                            <div className="
                                                relative rounded-2xl border border-slate-100
                                                bg-white p-4 shadow-sm transition duration-300
                                                hover:-translate-y-1 hover:shadow-lg
                                            ">
                                                <div className="
                                                    relative z-10 flex h-14 w-14
                                                    items-center justify-center rounded-2xl
                                                    bg-indigo-50 text-2xl
                                                ">
                                                    📄
                                                </div>

                                                <span className="
                                                    absolute right-4 top-4 text-xs
                                                    font-black text-slate-300
                                                ">
                                                    01
                                                </span>

                                                <h3 className="mt-4 font-extrabold text-slate-800">
                                                    Upload Resume
                                                </h3>

                                                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                                                    Add your experience and skills.
                                                </p>
                                            </div>


                                            {/* 02 */}
                                            <div className="
                                                relative rounded-2xl border border-slate-100
                                                bg-white p-4 shadow-sm transition duration-300
                                                hover:-translate-y-1 hover:shadow-lg
                                            ">
                                                <div className="
                                                    relative z-10 flex h-14 w-14
                                                    items-center justify-center rounded-2xl
                                                    bg-blue-50 text-2xl
                                                ">
                                                    🎯
                                                </div>

                                                <span className="
                                                    absolute right-4 top-4 text-xs
                                                    font-black text-slate-300
                                                ">
                                                    02
                                                </span>

                                                <h3 className="mt-4 font-extrabold text-slate-800">
                                                    AI Analysis
                                                </h3>

                                                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                                                    Discover your strengths and gaps.
                                                </p>
                                            </div>


                                            {/* 03 */}
                                            <div className="
                                                relative rounded-2xl border border-slate-100
                                                bg-white p-4 shadow-sm transition duration-300
                                                hover:-translate-y-1 hover:shadow-lg
                                            ">
                                                <div className="
                                                    relative z-10 flex h-14 w-14
                                                    items-center justify-center rounded-2xl
                                                    bg-purple-50 text-2xl
                                                ">
                                                    🤖
                                                </div>

                                                <span className="
                                                    absolute right-4 top-4 text-xs
                                                    font-black text-slate-300
                                                ">
                                                    03
                                                </span>

                                                <h3 className="mt-4 font-extrabold text-slate-800">
                                                    AI Coaching
                                                </h3>

                                                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                                                    Improve weak areas with AI guidance.
                                                </p>
                                            </div>


                                            {/* 04 */}
                                            <div className="
                                                relative rounded-2xl border border-slate-100
                                                bg-white p-4 shadow-sm transition duration-300
                                                hover:-translate-y-1 hover:shadow-lg
                                            ">
                                                <div className="
                                                    relative z-10 flex h-14 w-14
                                                    items-center justify-center rounded-2xl
                                                    bg-pink-50 text-2xl
                                                ">
                                                    🎤
                                                </div>

                                                <span className="
                                                    absolute right-4 top-4 text-xs
                                                    font-black text-slate-300
                                                ">
                                                    04
                                                </span>

                                                <h3 className="mt-4 font-extrabold text-slate-800">
                                                    Mock Interview
                                                </h3>

                                                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                                                    Practice with your AI interviewer.
                                                </p>
                                            </div>

                                        </div>
                                    </div>

                                </div>


                                {/* INTERVIEW GIF */}
                                <div className="
                                    relative flex min-h-[330px] items-center
                                    justify-center overflow-hidden rounded-[1.75rem]
                                    border border-indigo-100
                                    bg-gradient-to-br from-indigo-50 via-white to-blue-50
                                ">

                                    <div className="
                                        absolute -right-10 -top-10 h-32 w-32
                                        rounded-full bg-indigo-200/40 blur-2xl
                                    " />

                                    <div className="
                                        absolute -bottom-10 -left-10 h-32 w-32
                                        rounded-full bg-blue-200/40 blur-2xl
                                    " />

                                    <div className="relative text-center">

                                        <div className="
                                            mb-4 inline-flex items-center gap-2
                                            rounded-full bg-white px-4 py-2
                                            text-xs font-bold text-indigo-600 shadow-md
                                        ">
                                            🎤 LIVE INTERVIEW MODE
                                        </div>

                                        <img
                                            src="/ai-coach.gif"
                                            alt="AI interviewer"
                                            className="
                                                mx-auto h-56 w-72 object-contain
                                                drop-shadow-xl sm:h-64 sm:w-80
                                            "
                                        />

                                        <div className="
                                            mt-3 font-black text-slate-800
                                        ">
                                            Your AI interviewer is warming up...
                                        </div>

                                        <p className="
                                            mt-1 text-xs text-slate-500
                                        ">
                                            Upload your resume to start the conversation.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* CTA */}
                            <div className="
                                relative z-10 mx-6 mb-6 flex flex-col
                                items-center justify-between gap-5 rounded-3xl
                                border border-indigo-100
                                bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50
                                p-5 sm:mx-8 sm:mb-8 sm:flex-row sm:p-6
                                lg:mx-10 lg:mb-10
                            ">

                                <div className="flex items-center gap-4">

                                    <div className="
                                        flex h-12 w-12 shrink-0 items-center
                                        justify-center rounded-2xl bg-white
                                        text-xl shadow-sm
                                    ">
                                        ✨
                                    </div>

                                    <div>

                                        <p className="font-extrabold text-slate-800">
                                            Ready for your first interview?
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Upload your resume and let InterviewIQ take it from here.
                                        </p>

                                    </div>

                                </div>

                                <button
                                    onClick={() => navigate("/upload")}
                                    className="
                                        w-full rounded-2xl
                                        bg-gradient-to-r from-indigo-600 to-blue-600
                                        px-8 py-4 font-black text-white
                                        shadow-lg shadow-indigo-200 transition duration-300
                                        hover:-translate-y-1 hover:shadow-xl
                                        active:scale-[0.98] sm:w-auto
                                    "
                                >
                                    🚀 Start My Journey
                                </button>

                            </div>

                        </section>


                        <div className="
                            mt-5 flex flex-wrap justify-center gap-x-8 gap-y-2
                            text-xs font-medium text-slate-400
                        ">
                            <span>✦ Personalized analysis</span>
                            <span>✦ AI-powered coaching</span>
                            <span>✦ Interview performance insights</span>
                        </div>

                    </div>

                </main>
            </>
        );
    }



    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                    {/* HERO */}
                    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 p-7 text-white shadow-2xl sm:p-10">
                        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
                        <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

                        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-3xl">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                                    <span>🤖</span>
                                    AI Career Dashboard
                                </div>

                                <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                                    Welcome back,{" "}
                                    {user?.full_name ||
                                        candidate.full_name ||
                                        "Candidate"}{" "}
                                    🚀
                                </h1>

                                <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
                                    Your resume is analyzed, your interview is complete,
                                    and your AI career insights are ready.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
                                <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                                    Predicted Role
                                </p>
                                <p className="mt-1 text-xl font-black">
                                    {role || "Not available"}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* QUICK STATUS */}
                    <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-500">
                                    ATS Score
                                </span>
                                <span className="rounded-xl bg-blue-50 p-2 text-lg">
                                    📊
                                </span>
                            </div>

                            <div className="mt-4 flex items-end gap-2">
                                <span className="text-4xl font-black text-slate-900">
                                    {atsScore}%
                                </span>
                                <span className="mb-1 text-sm font-semibold text-blue-600">
                                    {atsScore >= 85
                                        ? "Excellent"
                                        : atsScore >= 70
                                        ? "Good"
                                        : "Improve"}
                                </span>
                            </div>

                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                    style={{ width: `${atsScore}%` }}
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-500">
                                    Predicted Role
                                </span>
                                <span className="rounded-xl bg-emerald-50 p-2 text-lg">
                                    💼
                                </span>
                            </div>

                            <p className="mt-5 text-xl font-black text-slate-900">
                                {role}
                            </p>

                            <p className="mt-2 text-sm text-emerald-600">
                                ✓ Strong role match
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-500">
                                    Matched Skills
                                </span>
                                <span className="rounded-xl bg-violet-50 p-2 text-lg">
                                    ⚡
                                </span>
                            </div>

                            <p className="mt-5 text-4xl font-black text-slate-900">
                                {matchedSkills.length}
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Skills aligned with your profile
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-500">
                                    Interview
                                </span>
                                <span className="rounded-xl bg-indigo-50 p-2 text-lg">
                                    🎤
                                </span>
                            </div>

                            <p className="mt-5 text-xl font-black text-indigo-600">
                                {interviewId ? "Completed" : "Not Started"}
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                {interviewId
                                    ? "Your AI report is ready"
                                    : "Start your AI mock interview"}
                            </p>

                            {interviewId && (
                                <button
                                    onClick={() =>
                                        navigate(`/report/${interviewId}`)
                                    }
                                    className="mt-4 text-sm font-bold text-indigo-600 transition hover:text-indigo-800"
                                >
                                    View Report →
                                </button>
                            )}
                        </div>
                    </section>

                    {/* SKILLS */}
                    <section className="mt-8 grid gap-6 lg:grid-cols-2">

                        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                                        Strengths
                                    </p>
                                    <h2 className="mt-1 text-2xl font-black text-slate-900">
                                        Matched Skills
                                    </h2>
                                </div>

                                <span className="rounded-2xl bg-emerald-50 px-4 py-3 text-xl">
                                    ✓
                                </span>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2">
                                {matchedSkills.length ? (
                                    matchedSkills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"
                                        >
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500">
                                        No matched skills available.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm sm:p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">
                                        Growth Areas
                                    </p>
                                    <h2 className="mt-1 text-2xl font-black text-slate-900">
                                        Missing Skills
                                    </h2>
                                </div>

                                <span className="rounded-2xl bg-amber-50 px-4 py-3 text-xl">
                                    ⚠
                                </span>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2">
                                {missingSkills.length ? (
                                    missingSkills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="rounded-full border border-amber-100 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700"
                                        >
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500">
                                        No missing skills identified.
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* INTERVIEW ANALYTICS */}
                    <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 p-6 sm:p-8">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                                        Interview Insights
                                    </p>
                                    <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                                        Interview Performance
                                    </h2>
                                </div>

                                {analytics && (
                                    <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700">
                                        {analytics.percentage}% overall
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                            <div className="p-6 sm:p-8">
                                <p className="text-sm font-medium text-slate-500">
                                    Total Questions
                                </p>
                                <p className="mt-3 text-4xl font-black text-slate-900">
                                    {analytics?.total_questions ?? "-"}
                                </p>
                            </div>

                            <div className="p-6 sm:p-8">
                                <p className="text-sm font-medium text-slate-500">
                                    Average Score
                                </p>
                                <p className="mt-3 text-4xl font-black text-slate-900">
                                    {analytics?.average_score ?? "-"}
                                    <span className="ml-1 text-base font-semibold text-slate-400">
                                        /10
                                    </span>
                                </p>
                            </div>

                            <div className="p-6 sm:p-8">
                                <p className="text-sm font-medium text-slate-500">
                                    Performance
                                </p>
                                <p className="mt-3 text-4xl font-black text-indigo-600">
                                    {analytics
                                        ? `${analytics.percentage}%`
                                        : "-"}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* AI RESUME REVIEW */}
                    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                    AI Analysis
                                </p>
                                <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                                    AI Resume Review
                                </h2>
                            </div>

                            <span className="rounded-2xl bg-blue-50 px-4 py-3 text-xl">
                                🤖
                            </span>
                        </div>

                        {resumeData?.ai_resume_review ? (
                            <>
                                <p className="mt-6 max-w-4xl leading-8 text-slate-600">
                                    {resumeData.ai_resume_review.summary}
                                </p>

                                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
                                        <h3 className="font-bold text-emerald-800">
                                            ✓ Strengths
                                        </h3>

                                        <div className="mt-4 space-y-3">
                                            {resumeData.ai_resume_review.strengths?.map(
                                                (item, index) => (
                                                    <p
                                                        key={index}
                                                        className="text-sm leading-6 text-slate-700"
                                                    >
                                                        <span className="mr-2 font-bold text-emerald-600">
                                                            •
                                                        </span>
                                                        {item}
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-6">
                                        <h3 className="font-bold text-rose-800">
                                            ⚠ Areas to Improve
                                        </h3>

                                        <div className="mt-4 space-y-3">
                                            {resumeData.ai_resume_review.weaknesses?.map(
                                                (item, index) => (
                                                    <p
                                                        key={index}
                                                        className="text-sm leading-6 text-slate-700"
                                                    >
                                                        <span className="mr-2 font-bold text-rose-600">
                                                            •
                                                        </span>
                                                        {item}
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto]">
                                    <div className="rounded-2xl bg-slate-50 p-6">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Hiring Manager Recommendation
                                        </p>
                                        <p className="mt-3 font-semibold leading-7 text-slate-800">
                                            {
                                                resumeData.ai_resume_review
                                                    .recommendation
                                            }
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">
                                        <p className="text-xs font-bold uppercase tracking-wider text-blue-100">
                                            AI Rating
                                        </p>
                                        <p className="mt-2 text-4xl font-black">
                                            {
                                                resumeData.ai_resume_review
                                                    .rating
                                            }
                                            <span className="text-base font-semibold text-blue-100">
                                                /10
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="mt-6 text-slate-500">
                                AI review not available.
                            </p>
                        )}
                    </section>

                    {/* SUGGESTIONS */}
                    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">
                                Next Steps
                            </p>
                            <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                                Resume Suggestions
                            </h2>
                        </div>

                        <div className="mt-6 space-y-3">
                            {Array.isArray(resumeData?.resume_suggestions) ? (
                                resumeData.resume_suggestions.map(
                                    (item, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-4 rounded-2xl border border-amber-100 bg-amber-50/60 p-4"
                                        >
                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-black text-amber-700">
                                                {index + 1}
                                            </span>
                                            <p className="leading-7 text-slate-700">
                                                {item}
                                            </p>
                                        </div>
                                    )
                                )
                            ) : (
                                <p className="text-slate-500">
                                    No suggestions available.
                                </p>
                            )}
                        </div>
                    </section>

                    {/* ACTIONS */}
                    <section className="mt-8 flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 p-6 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
                        <div>
                            <p className="text-xl font-black">
                                Ready for the next step?
                            </p>
                            <p className="mt-1 text-sm text-blue-200">
                                Improve your resume and take another interview.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                onClick={() => navigate("/upload")}
                                className="rounded-xl bg-white px-6 py-3 font-bold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                🚀 New Analysis
                            </button>

                            <button
                                onClick={() => navigate("/history")}
                                className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur transition hover:bg-white/20"
                            >
                                📜 History
                            </button>
                        </div>
                    </section>

                    <div className="pb-8 pt-6 text-center text-xs font-medium text-slate-400">
                        ✦ Personalized analysis&nbsp;&nbsp; • &nbsp;&nbsp;
                        ✦ AI-powered coaching&nbsp;&nbsp; • &nbsp;&nbsp;
                        ✦ Interview performance insights
                    </div>
                </div>
            </main>
        </>
    );

}


// -----------------------------
// SMALL COMPONENTS
// -----------------------------


function SkillCard({title, skills}) {


    return (

        <div className="
            bg-white
            rounded-3xl
            shadow-lg
            p-8
        ">


            <h2 className="
                text-2xl
                font-bold
                mb-5
            ">

                {title}

            </h2>



            <div className="
                flex
                flex-wrap
                gap-3
            ">


                {

                    skills.length

                    ?

                    skills.map(
                        (skill,index)=>(

                            <span
                                key={index}
                                className="
                                    bg-indigo-100
                                    text-indigo-700
                                    px-4
                                    py-2
                                    rounded-full
                                    font-semibold
                                "
                            >

                                {skill}

                            </span>

                        )
                    )


                    :

                    <p className="text-gray-500">
                        None
                    </p>


                }


            </div>


        </div>


    );

}






function AnalyticsCard({title,value}) {


    return (

        <div className="
            bg-slate-50
            rounded-2xl
            p-6
        ">


            <p className="text-gray-500">
                {title}
            </p>


            <h3 className="
                text-4xl
                font-bold
                mt-3
            ">

                {value}

            </h3>


        </div>

    );

}    