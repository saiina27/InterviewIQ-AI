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
                            candidate.resume_suggestions || [],



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


                <div className="
                    min-h-screen
                    bg-gradient-to-br
                    from-slate-100
                    via-blue-50
                    to-indigo-100
                    flex
                    items-center
                    justify-center
                    p-6
                ">


                    <div className="
                        bg-white
                        rounded-3xl
                        shadow-2xl
                        p-10
                        max-w-3xl
                        text-center
                    ">


                        <h1 className="
                            text-5xl
                            font-bold
                            text-slate-800
                        ">

                            Welcome {user?.full_name || "Candidate"} 👋

                        </h1>



                        <p className="
                            mt-5
                            text-gray-600
                            text-lg
                        ">


                            Upload your resume to unlock
                            ATS scoring, AI review,
                            role prediction and AI interviews.


                        </p>




                        <button

                            onClick={() =>
                                navigate("/upload")
                            }

                            className="
                                mt-8
                                bg-indigo-600
                                hover:bg-indigo-700
                                text-white
                                px-10
                                py-4
                                rounded-xl
                                font-bold
                            "

                        >

                            🚀 Upload Resume

                        </button>



                    </div>


                </div>


            </>

        );


    }

    return (

        <>

            <Navbar />


            <div className="
                min-h-screen
                bg-gradient-to-br
                from-slate-100
                via-blue-50
                to-indigo-100
                p-8
            ">


                <div className="
                    max-w-7xl
                    mx-auto
                ">



                    {/* HEADER */}

<div className="
    mb-10
    flex
    flex-col
    lg:flex-row
    justify-between
    gap-6
">


    <div>

        <h1 className="
            text-5xl
            font-bold
            text-slate-800
        ">

            Welcome back, {
                user?.full_name ||
                candidate.full_name ||
                "Candidate"
            } 🚀

        </h1>


        <p className="
            mt-3
            text-gray-500
            text-lg
        ">

            Your AI career assistant is ready.
            Analyze resumes, practice interviews,
            and track hiring performance.

        </p>


    </div>




    <div className="
        bg-white
        rounded-3xl
        shadow-lg
        p-6
        min-w-[280px]
    ">


        <h3 className="
            font-bold
            text-xl
            text-slate-800
        ">

            🤖 AI Career Assistant

        </h3>


        <div className="
            mt-4
            space-y-2
            text-sm
            text-gray-600
        ">


            <p>
                ✅ Resume Analyzed
            </p>


            <p>
                {
                    interviewId
                    ? "✅ Interview Completed"
                    : "⏳ Interview Pending"
                }
            </p>


            <p>
                🎯 Role: {role}
            </p>


        </div>


    </div>


</div>





                    {/* STATS */}


                    <div className="
                        grid
                        md:grid-cols-2
                        lg:grid-cols-4
                        gap-6
                    ">


                        <div className="
                            bg-white
                            rounded-3xl
                            shadow-lg
                            p-6
                        ">


                            <p className="text-gray-500">
                                📊 ATS Score
                            </p>


                            <h2 className="
                                text-5xl
                                font-bold
                                text-blue-600
                                mt-4
                            ">

                                {atsScore}%

                            </h2>
                            <div className="
    mt-4
    bg-gray-200
    rounded-full
    h-3
">

    <div
        className="
            bg-blue-600
            h-3
            rounded-full
        "
        style={{
            width:`${atsScore}%`
        }}
    >

    </div>

</div>


                            <p className="mt-2 text-sm text-gray-500">

                                {
                                    atsScore >= 85
                                    ? "Excellent Resume"
                                    : atsScore >= 70
                                    ? "Good Resume"
                                    : "Needs Improvement"
                                }

                            </p>


                        </div>





                        <div className="
                            bg-white
                            rounded-3xl
                            shadow-lg
                            p-6
                        ">


                            <p className="text-gray-500">
                                💼 Predicted Role
                            </p>


                            <h2 className="
                                text-2xl
                                font-bold
                                text-green-600
                                mt-5
                            ">

                                {role}

                            </h2>
                            <p className="
    mt-3
    text-sm
    text-gray-500
">

    🔥 Strong role match based on your resume

</p>


                        </div>





                        <div className="
                            bg-white
                            rounded-3xl
                            shadow-lg
                            p-6
                        ">


                            <p className="text-gray-500">
                                ⚡ Matched Skills
                            </p>


                            <h2 className="
                                text-5xl
                                font-bold
                                text-purple-600
                                mt-4
                            ">

                                {matchedSkills.length}

                            </h2>


                        </div>





                        <div className="
    bg-white
    rounded-3xl
    shadow-lg
    p-6
">


    <div className="flex justify-between items-center">

        <p className="text-gray-500">
            🎤 Interview
        </p>

        <span className="text-2xl">
            🚀
        </span>

    </div>


    <h2 className="
        text-2xl
        font-bold
        text-indigo-600
        mt-5
    ">

        {
            interviewId
            ? "Completed"
            : "Not Started"
        }

    </h2>


    <p className="text-sm text-gray-500 mt-2">

        {
            interviewId
            ? "AI interview report available"
            : "Start your AI mock interview"
        }

    </p>


    {
        interviewId && (

            <button

                onClick={() =>
                    navigate(`/report/${interviewId}`)
                }

                className="
                    mt-5
                    bg-indigo-600
                    hover:bg-indigo-700
                    text-white
                    px-5
                    py-2
                    rounded-xl
                    font-semibold
                    transition
                "

            >

                View Report 📊

            </button>

        )
    }


</div>



                    </div>







                    {/* SKILLS */}


                    <div className="
                        grid
                        lg:grid-cols-2
                        gap-8
                        mt-8
                    ">


                        <SkillCard
                            title="✅ Matched Skills"
                            skills={matchedSkills}
                            type="green"
                        />


                        <SkillCard
                            title="⚠ Missing Skills"
                            skills={missingSkills}
                            type="orange"
                        />


                    </div>









                    {/* ANALYTICS */}


                    <div className="
                        bg-white
                        rounded-3xl
                        shadow-lg
                        p-8
                        mt-8
                    ">


                        <h2 className="
                            text-3xl
                            font-bold
                            mb-6
                        ">

                            📊 Interview Performance

                        </h2>



                        <div className="
                            grid
                            md:grid-cols-3
                            gap-6
                        ">


                            <AnalyticsCard
                                title="Total Questions"
                                value={
                                    analytics?.total_questions ?? "-"
                                }
                            />


                            <AnalyticsCard
                                title="Average Score"
                                value={
                                    analytics?.average_score ?? "-"
                                }
                            />


                            <AnalyticsCard
                                title="Performance"
                                value={
                                    analytics
                                    ? `${analytics.percentage}%`
                                    : "-"
                                }
                            />


                        </div>


                    </div>








                    {/* AI REVIEW */}



                    <div className="
                        bg-white
                        rounded-3xl
                        shadow-lg
                        p-8
                        mt-8
                    ">


                        <h2 className="
                            text-3xl
                            font-bold
                            mb-6
                        ">

                            🤖 AI Resume Review

                        </h2>



                        {

                            resumeData?.ai_resume_review ?


                            <>


                                <p className="
                                    text-gray-700
                                    leading-8
                                ">

                                    {
                                        resumeData
                                        .ai_resume_review
                                        .summary
                                    }


                                </p>



                                <div className="
                                    grid
                                    md:grid-cols-2
                                    gap-6
                                    mt-8
                                ">


                                    <div className="
                                        bg-green-50
                                        rounded-2xl
                                        p-6
                                    ">


                                        <h3 className="
                                            font-bold
                                            text-green-700
                                        ">

                                            Strengths

                                        </h3>



                                        {
                                            resumeData
                                            .ai_resume_review
                                            .strengths
                                            ?.map(
                                                (item,index)=>(
                                                    <p
                                                        key={index}
                                                        className="mt-3"
                                                    >
                                                        ✓ {item}
                                                    </p>
                                                )
                                            )
                                        }



                                    </div>





                                    <div className="
                                        bg-red-50
                                        rounded-2xl
                                        p-6
                                    ">


                                        <h3 className="
                                            font-bold
                                            text-red-700
                                        ">

                                            Weaknesses

                                        </h3>



                                        {
                                            resumeData
                                            .ai_resume_review
                                            .weaknesses
                                            ?.map(
                                                (item,index)=>(
                                                    <p
                                                        key={index}
                                                        className="mt-3"
                                                    >
                                                        ⚠ {item}
                                                    </p>
                                                )
                                            )
                                        }



                                    </div>


                                </div>





                                <div className="
                                    mt-6
                                    bg-blue-50
                                    rounded-2xl
                                    p-6
                                ">


                                    <b>
                                        Recruiter Recommendation
                                    </b>


                                    <p className="mt-2">

                                        {
                                            resumeData
                                            .ai_resume_review
                                            .recommendation
                                        }

                                    </p>


                                    <p className="mt-3 font-bold">

                                        ⭐ Rating:
                                        {
                                            resumeData
                                            .ai_resume_review
                                            .rating
                                        }/10

                                    </p>


                                </div>


                            </>


                            :

                            <p>
                                AI review not available.
                            </p>


                        }


                    </div>








                    {/* SUGGESTIONS */}



                    <div className="
                        bg-white
                        rounded-3xl
                        shadow-lg
                        p-8
                        mt-8
                    ">


                        <h2 className="
                            text-3xl
                            font-bold
                            mb-6
                        ">

                            📝 Resume Suggestions

                        </h2>



                        {

                            Array.isArray(
                                resumeData?.resume_suggestions
                            )


                            ?

                            resumeData.resume_suggestions.map(
                                (item,index)=>(
                                    <p
                                        key={index}
                                        className="
                                            bg-yellow-50
                                            p-4
                                            rounded-xl
                                            mb-3
                                        "
                                    >

                                        ✅ {item}

                                    </p>
                                )
                            )


                            :

                            <p className="text-gray-500">

                                No suggestions available.

                            </p>


                        }



                    </div>









                    {/* ACTIONS */}



                    <div className="
                        flex
                        justify-center
                        gap-6
                        mt-10
                    ">


                        <button

                            onClick={() =>
                                navigate("/upload")
                            }

                            className="
                                bg-indigo-600
                                text-white
                                px-10
                                py-4
                                rounded-2xl
                                font-bold
                            "

                        >

                            🚀 New Analysis

                        </button>



                        <button

                            onClick={() =>
                                navigate("/history")
                            }

                            className="
                                border-2
                                border-blue-600
                                text-blue-600
                                px-10
                                py-4
                                rounded-2xl
                                font-bold
                            "

                        >

                            📜 History

                        </button>


                    </div>




                </div>


            </div>


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