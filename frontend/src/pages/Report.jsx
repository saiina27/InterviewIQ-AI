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
        const res = await api.get(`/interview/report/${interviewId}`);
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

  const recommendationColor =
    report.hiring_recommendation === "Recommended"
      ? "bg-green-100 text-green-700"
      : report.hiring_recommendation === "Consider"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

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
                `http://127.0.0.1:8000/interview/report/${interviewId}/pdf`,
                "_blank"
              )
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-300 hover:scale-105"
          >
            ⬇️ Download PDF Report
          </button>

        </div>

        {/* Analytics */}

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

          <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <p className="text-gray-500">ATS Score</p>

            <h2 className="text-5xl font-bold text-blue-600 mt-4">
              {report.candidate?.ats_score}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <p className="text-gray-500">Overall Score</p>

            <h2 className="text-5xl font-bold text-green-600 mt-4">
              {report.statistics?.overall_score}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <p className="text-gray-500">Performance</p>

            <h2 className="text-2xl font-bold text-indigo-600 mt-4">
              {report.statistics?.performance}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <p className="text-gray-500">Integrity</p>

            <h2 className="text-5xl font-bold text-purple-600 mt-4">
              {report.integrity?.integrity_score}%
            </h2>
          </div>

        </div>

        {/* Candidate + Interview */}

        <div className="grid lg:grid-cols-2 gap-6 mt-8">

          <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

            <h2 className="text-2xl font-bold mb-6">
              Candidate Information
            </h2>

            <div className="space-y-4">

              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-semibold">
                  {report.candidate?.name}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-semibold break-all">
                  {report.candidate?.email}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-semibold">
                  {report.candidate?.phone || "Not Available"}
                </p>
              </div>

            </div>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

            <h2 className="text-2xl font-bold mb-6">
              Interview Details
            </h2>

            <div className="space-y-4">

              <div>
                <p className="text-gray-500">Role</p>
                <p className="font-semibold">
                  {report.interview?.role}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Difficulty</p>
                <p className="font-semibold">
                  {report.interview?.difficulty}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Status</p>

                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                  {report.interview?.status}
                </span>

              </div>

              <div>
                <p className="text-gray-500">
                  Hiring Recommendation
                </p>

                <span className={`${recommendationColor} px-4 py-2 rounded-full font-bold`}>
                  {report.hiring_recommendation}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Statistics */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

          <h2 className="text-2xl font-bold mb-6">
            Interview Statistics
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-slate-50 rounded-xl p-5 transition-all duration-300 hover:shadow-md">
              <p className="text-gray-500">Total Questions</p>
              <h3 className="text-3xl font-bold mt-2">
                {report.statistics?.total_questions}
              </h3>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 transition-all duration-300 hover:shadow-md">
              <p className="text-gray-500">Answered</p>
              <h3 className="text-3xl font-bold text-green-600 mt-2">
                {report.statistics?.answered_questions}
              </h3>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 transition-all duration-300 hover:shadow-md">
              <p className="text-gray-500">Unanswered</p>
              <h3 className="text-3xl font-bold text-red-600 mt-2">
                {report.statistics?.unanswered_questions}
              </h3>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 transition-all duration-300 hover:shadow-md">
              <p className="text-gray-500">Average Score</p>
              <h3 className="text-3xl font-bold mt-2">
                {report.statistics?.average_score}
              </h3>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 transition-all duration-300 hover:shadow-md">
              <p className="text-gray-500">Highest Score</p>
              <h3 className="text-3xl font-bold mt-2">
                {report.statistics?.max_score}
              </h3>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 transition-all duration-300 hover:shadow-md">
              <p className="text-gray-500">Lowest Score</p>
              <h3 className="text-3xl font-bold mt-2">
                {report.statistics?.min_score}
              </h3>
            </div>

          </div>

        </div>

        {/* Executive Summary */}

        <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

          <h2 className="text-2xl font-bold mb-5">
            Executive Summary
          </h2>

          <p className="text-gray-700 leading-8">
            {report.executive_summary}
          </p>

        </div>

        {/* Skills */}

        <div className="grid lg:grid-cols-3 gap-6 mt-8">

          <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

            <h2 className="text-xl font-bold text-green-600 mb-5">
              Strong Skills
            </h2>

            {(report.strong_skills?.length ?? 0) > 0 ? (
              <ul className="space-y-3">
                {report.strong_skills.map((skill, index) => (
                  <li key={index}>✅ {skill}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                No strong skills identified.
              </p>
            )}

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <h2 className="text-xl font-bold text-yellow-600 mb-5">
              Medium Skills
            </h2>

            {(report.medium_skills?.length ?? 0) > 0 ? (
              <ul className="space-y-3">
                {report.medium_skills.map((skill, index) => (
                  <li key={index}>⭐ {skill}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                No medium skills identified.
              </p>
            )}

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <h2 className="text-xl font-bold text-red-600 mb-5">
              Weak Skills
            </h2>

            {(report.weak_skills?.length ?? 0) > 0 ? (
              <ul className="space-y-3">
                {report.weak_skills.map((skill, index) => (
                  <li key={index}>❌ {skill}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                No weak skills identified.
              </p>
            )}

          </div>

        </div>

        {/* AI Feedback */}

        <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

          <h2 className="text-2xl font-bold mb-5">
            AI Feedback
          </h2>

          <ul className="space-y-3">

            {(report.overall_feedback || []).map((item, index) => (

              <li
                key={index}
                className="flex gap-3"
              >
                <span>💡</span>

                <span>{item}</span>

              </li>

            ))}

          </ul>

        </div>

        {/* Integrity */}

        <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <h2 className="text-2xl font-bold mb-5">
            Integrity Report
          </h2>

          {(report.integrity?.events?.length ?? 0) > 0 ? (

            <div className="space-y-4">

              {report.integrity.events.map((event, index) => (

                <div
                  key={index}
                  className="border rounded-xl p-4 flex justify-between items-center"
                >

                  <div>

                    <p className="font-semibold">
                      {event.type}
                    </p>

                    <p className="text-sm text-gray-500">
                      {event.time}
                    </p>

                  </div>

                  <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">
                    {event.status}
                  </span>

                </div>

              ))}

            </div>

          ) : (

            <p className="text-green-600 font-semibold">
              ✅ No suspicious activity detected.
            </p>

          )}

        </div>

      </div>

    </div>
    );
}
