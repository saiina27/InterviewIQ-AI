import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {

    const location = useLocation();
    const navigate = useNavigate();

    const resumeData = location.state?.resumeData;
    const interviewId = location.state?.interviewId;

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
        resumeData?.role_prediction?.predicted_role || "Not Available";


    useEffect(() => {

        if (!interviewId) return;


        const fetchAnalytics = async () => {

            try {

                const res = await api.get(
                    `/interview/analytics/${interviewId}`
                );

                setAnalytics(res.data.analysis);

            }
            catch (err) {

                console.error(
                    "Analytics Error",
                    err
                );

            }

        };


        fetchAnalytics();


    }, [interviewId]);



    return (

<div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-8">

<div className="max-w-7xl mx-auto">


<div className="mb-10">

<h1 className="text-5xl font-bold text-slate-800">
Welcome {candidate.name || "Candidate"} 🚀
</h1>

<p className="text-gray-500 mt-3">
AI powered resume analysis and interview intelligence dashboard
</p>

</div>



<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">


<div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
<p className="text-gray-500">ATS Score</p>

<h2 className="text-5xl font-bold text-blue-600 mt-3">
{atsScore}%
</h2>

</div>



<div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
<p className="text-gray-500">Predicted Role</p>

<h2 className="text-2xl font-bold text-green-600 mt-5">
{role}
</h2>

</div>



<div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
<p className="text-gray-500">Skills Matched</p>

<h2 className="text-5xl font-bold text-purple-600 mt-3">
{matchedSkills.length}
</h2>

</div>



<div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
<p className="text-gray-500">Interview Status</p>

<h2 className="text-2xl font-bold text-indigo-600 mt-5">
{interviewId ? "Completed" : "Not Started"}
</h2>

</div>


</div>




<div className="grid lg:grid-cols-2 gap-6 mt-8">


<div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

<h2 className="text-2xl font-bold mb-5">
Matched Skills
</h2>


<div className="flex flex-wrap gap-3">

{
matchedSkills.length > 0 ?

matchedSkills.map((skill,index)=>(

<span
key={index}
className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold"
>
{skill}
</span>

))

:

<p>No skills found</p>

}

</div>

</div>




<div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

<h2 className="text-2xl font-bold mb-5">
Missing Skills
</h2>


<div className="flex flex-wrap gap-3">

{
missingSkills.length > 0 ?

missingSkills.map((skill,index)=>(

<span
key={index}
className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-semibold"
>
{skill}
</span>

))

:

<p>No missing skills</p>

}

</div>

</div>


</div>





<div className="bg-white rounded-2xl shadow-lg p-8 mt-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

<h2 className="text-2xl font-bold mb-5">
Interview Performance
</h2>


<div className="grid md:grid-cols-3 gap-5">


<div className="bg-slate-50 rounded-xl p-5">

<p>Total Questions</p>

<h3 className="text-3xl font-bold mt-2">
{analytics ? analytics.total_questions : "Loading..."}
</h3>

</div>



<div className="bg-green-50 rounded-xl p-5">

<p>Average Score</p>

<h3 className="text-3xl font-bold text-green-600 mt-2">
{analytics ? analytics.average_score : "Loading..."}
</h3>

</div>



<div className="bg-blue-50 rounded-xl p-5">

<p>Percentage</p>

<h3 className="text-3xl font-bold text-blue-600 mt-2">
{analytics ? `${analytics.percentage}%` : "Loading..."}
</h3>

</div>


</div>


</div>





<div className="bg-white rounded-2xl shadow-lg p-8 mt-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
<h2 className="text-2xl font-bold mb-5">
AI Resume Review
</h2>


<p className="text-gray-700 leading-8 whitespace-pre-line">

{resumeData?.ai_resume_review ||
"AI review not available"}

</p>


</div>




<div className="flex gap-5 mt-10">


<button

onClick={() =>
navigate(`/report/${interviewId}`)
}

className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105"

>

View Report

</button>



<button

onClick={() =>
navigate("/")
}

className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105"

>

Start New Interview

</button>


</div>



</div>

</div>

    );

}
