import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function Report() {

  const { interviewId } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    (async () => {

      try {

        const res = await api.get(
          `/interview/report/${interviewId}`
        );

        setReport(res.data.report);

      } catch (err) {

        console.error(err);
        alert("Unable to load report.");

      } finally {

        setLoading(false);

      }

    })();

  }, [interviewId]);



  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

          <h1 className="text-3xl font-bold text-blue-600">
            Loading Report...
          </h1>

          <p className="text-gray-500 mt-3">
            Preparing Interview Analytics
          </p>

        </div>

      </div>

    );

  }



  if (!report) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <h1 className="text-3xl font-bold text-red-600">
          No Report Found
        </h1>

      </div>

    );

  }



  const events =
    report.integrity?.events || [];



  const recommendationColor =
    report.hiring_recommendation === "Recommended"
      ? "bg-green-100 text-green-700"
      :
      report.hiring_recommendation === "Consider"
      ? "bg-yellow-100 text-yellow-700"
      :
      "bg-red-100 text-red-700";



  return (

<div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-8">

<div className="max-w-7xl mx-auto">


{/* HEADER */}

<div className="flex justify-between items-center mb-8">


<div>

<h1 className="text-5xl font-bold text-slate-800">
Interview Report
</h1>


<p className="text-gray-500 mt-2">
Complete AI Interview Performance Analysis
</p>


</div>


<button

onClick={() =>
window.open(
`${import.meta.env.VITE_API_URL}/interview/report/${interviewId}/pdf`,
"_blank"
)
}

className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition"

>

⬇️ Download PDF Report

</button>


</div>





{/* SCORE CARDS */}

<div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">



<div className="bg-white rounded-2xl shadow-lg p-6">

<p className="text-gray-500">
Resume Match
</p>


<h2 className="text-5xl font-bold text-blue-600 mt-4">

{report.candidate?.ats_score}%

</h2>


<p className="text-green-600 font-semibold mt-2">
Excellent ATS Score
</p>

</div>





<div className="bg-white rounded-2xl shadow-lg p-6">

<p className="text-gray-500">
Interview Performance
</p>


<h2 className="text-5xl font-bold text-green-600 mt-4">

{report.statistics?.overall_score}%

</h2>


<p className="text-indigo-600 font-semibold mt-2">
{report.statistics?.performance}
</p>

</div>





<div className="bg-white rounded-2xl shadow-lg p-6">

<p className="text-gray-500">
Interview Status
</p>


<h2 className="text-2xl font-bold text-indigo-600 mt-5">

{report.interview?.status}

</h2>


<p className="text-gray-500 mt-2">
{report.statistics?.total_questions} Questions
</p>

</div>





<div className="bg-white rounded-2xl shadow-lg p-6">

<p className="text-gray-500">
Integrity Status
</p>


<h2 className="text-4xl font-bold text-purple-600 mt-4">

{events.length === 0
? "100%"
: "Review"}

</h2>


<p className="text-gray-500 mt-2">

{events.length === 0
? "No issues detected"
: `${events.length} warnings`}

</p>


</div>



</div>
{/* CANDIDATE + INTERVIEW DETAILS */}

<div className="grid lg:grid-cols-2 gap-6 mt-8">


<div className="bg-white rounded-2xl shadow-lg p-8">


<h2 className="text-2xl font-bold mb-6">
Candidate Information
</h2>


<div className="space-y-4">


<div>
<p className="text-gray-500">
Name
</p>

<p className="font-semibold">
{report.candidate?.name}
</p>
</div>



<div>
<p className="text-gray-500">
Email
</p>

<p className="font-semibold break-all">
{report.candidate?.email}
</p>

</div>



<div>

<p className="text-gray-500">
Phone
</p>

<p className="font-semibold">
{report.candidate?.phone || "Not Available"}
</p>

</div>


</div>

</div>





<div className="bg-white rounded-2xl shadow-lg p-8">


<h2 className="text-2xl font-bold mb-6">
Interview Details
</h2>



<div className="space-y-5">


<div>
<p className="text-gray-500">
Role
</p>

<p className="font-semibold">
{report.interview?.role}
</p>

</div>



<div>

<p className="text-gray-500">
Difficulty
</p>

<p className="font-semibold">
{report.interview?.difficulty}
</p>

</div>




<div>

<p className="text-gray-500">
Status
</p>


<span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold inline-block mt-2">

{report.interview?.status}

</span>


</div>





<div>

<p className="text-gray-500">
Hiring Recommendation
</p>


<span
className={`${recommendationColor} px-4 py-2 rounded-full font-bold inline-block mt-2`}
>

{report.hiring_recommendation}

</span>


</div>


</div>


</div>


</div>





{/* STATISTICS */}


<div className="bg-white rounded-2xl shadow-lg p-8 mt-8">


<h2 className="text-2xl font-bold mb-6">
Interview Statistics
</h2>



<div className="grid md:grid-cols-3 gap-6">


{
[
["Total Questions", report.statistics?.total_questions],
["Answered", report.statistics?.answered_questions],
["Unanswered", report.statistics?.unanswered_questions],
["Average Score", report.statistics?.average_score],
["Highest Score", report.statistics?.max_score],
["Lowest Score", report.statistics?.min_score]

].map((item,index)=>(


<div
key={index}
className="bg-slate-50 rounded-xl p-5"
>


<p className="text-gray-500">
{item[0]}
</p>


<h3 className="text-3xl font-bold mt-2">
{item[1]}
</h3>


</div>


))

}


</div>


</div>





{/* EXECUTIVE SUMMARY */}


<div className="bg-white rounded-2xl shadow-lg p-8 mt-8">


<h2 className="text-2xl font-bold mb-5">
Executive Summary
</h2>


<p className="text-gray-700 leading-8">

{report.executive_summary}

</p>


</div>





{/* SKILLS */}


<div className="grid lg:grid-cols-3 gap-6 mt-8">



<div className="bg-white rounded-2xl shadow-lg p-8">

<h2 className="text-xl font-bold text-green-600 mb-5">
Interview Strengths
</h2>


{
report.strong_skills?.length
?
report.strong_skills.map((skill,index)=>(

<p key={index}>
✅ {skill}
</p>

))
:

<p className="text-gray-500">
No strong skills identified.
</p>

}


</div>





<div className="bg-white rounded-2xl shadow-lg p-8">


<h2 className="text-xl font-bold text-yellow-600 mb-5">
Average Performance
</h2>


{
report.medium_skills?.length
?
report.medium_skills.map((skill,index)=>(

<p key={index}>
⭐ {skill}
</p>

))
:

<p className="text-gray-500">
No medium skills identified.
</p>

}


</div>





<div className="bg-white rounded-2xl shadow-lg p-8">


<h2 className="text-xl font-bold text-red-600 mb-5">
Needs Improvement
</h2>


{
report.weak_skills?.length
?
report.weak_skills.map((skill,index)=>(

<p key={index}>
❌ {skill}
</p>

))
:

<p className="text-gray-500">
No improvement areas identified.
</p>

}


</div>


</div>
{/* AI FEEDBACK */}

<div className="bg-white rounded-2xl shadow-lg p-8 mt-8">


<h2 className="text-2xl font-bold mb-6">
AI Feedback
</h2>


<div className="space-y-5">


{
(report.overall_feedback || []).map((item,index)=>(


<div
key={index}
className="bg-slate-50 rounded-xl p-5 border"
>


<div className="flex gap-3">


<span className="text-xl">
💡
</span>


<p className="text-gray-700 leading-7">
{item}
</p>


</div>


</div>


))

}


{
(report.overall_feedback || []).length === 0 && (

<p className="text-gray-500">
No AI feedback available.
</p>

)

}


</div>


</div>





{/* INTEGRITY REPORT */}

<div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

<h2 className="text-2xl font-bold mb-6">
Integrity Report
</h2>


{events.length > 0 ? (

  <div>

    <div className="bg-red-50 rounded-xl p-6 mb-6">

      <h3 className="text-xl font-bold text-red-600">
        ⚠ Attention Required
      </h3>

      <p className="text-gray-700 mt-3">
        {events.length} suspicious activities detected during interview.
      </p>

    </div>


    <div className="grid md:grid-cols-2 gap-4">

      <div className="bg-slate-50 rounded-xl p-5">

        <p className="text-gray-500">
          Total Events
        </p>

        <h3 className="text-3xl font-bold mt-2">
          {events.length}
        </h3>

      </div>


      <div className="bg-slate-50 rounded-xl p-5">

        <p className="text-gray-500">
          Status
        </p>

        <h3 className="text-xl font-bold text-red-600 mt-2">
          Needs Review
        </h3>

      </div>

    </div>

  </div>


) : (

  <div className="bg-green-50 rounded-xl p-6">

    <h3 className="text-xl font-bold text-green-600">
      ✅ No Suspicious Activity
    </h3>

    <p className="text-gray-700 mt-2">
      Candidate maintained interview integrity.
    </p>

  </div>

)}

</div>

</div>

</div>

  );

}