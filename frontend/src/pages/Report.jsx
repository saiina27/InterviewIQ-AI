import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import ReportLoader from "../components/ReportLoader";

// The loader stays on screen at least this long so it never just flashes
const MIN_LOADER_MS = 2200;

export default function Report() {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const startedAt = Date.now();
      try {
        const res = await api.get(`/interview/report/${interviewId}`);
        setReport(res.data.report);
      } catch (err) {
        console.error(err);
        alert("Unable to load report.");
      } finally {
        const wait = Math.max(0, MIN_LOADER_MS - (Date.now() - startedAt));
        setTimeout(() => setLoading(false), wait);
      }
    })();
  }, [interviewId]);

  if (loading) return <ReportLoader />;

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600">
            No Report Found
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const events = report.integrity?.events || [];
  const statistics = report.statistics || {};

  const recommendationColor =
    report.hiring_recommendation === "Recommended"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : report.hiring_recommendation === "Consider"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-red-50 text-red-700 border-red-200";

  const score = Number(statistics.overall_score || 0);

  const scoreLabel =
    score >= 75
      ? "Excellent"
      : score >= 60
      ? "Good"
      : score >= 40
      ? "Needs Improvement"
      : "Needs Improvement";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/60 to-indigo-100/70">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
              <span>✦</span>
              AI Interview Intelligence
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
              Interview Report
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-slate-500">
              <span>{report.interview?.role || "Interview"}</span>
              <span>•</span>
              <span>{report.interview?.difficulty || "Intermediate"}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {report.interview?.status || "Completed"}
              </span>
            </div>
          </div>

          <button
            onClick={() =>
              window.open(
                `${import.meta.env.VITE_API_URL}/interview/report/${interviewId}/pdf`,
                "_blank"
              )
            }
            className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-slate-200 transition"
          >
            <span>↓</span>
            Download PDF
          </button>
        </div>

        {/* HERO SCORE */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-2xl shadow-blue-200 mb-8">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative p-7 sm:p-9">
            <p className="text-blue-100 font-semibold">
              Overall Interview Performance
            </p>

            <div className="flex items-end gap-3 mt-2">
              <span className="text-6xl sm:text-7xl font-black">
                {statistics.overall_score ?? 0}%
              </span>
              <span className="mb-3 text-blue-100 font-medium">
                {scoreLabel}
              </span>
            </div>

            <p className="text-blue-100 mt-3 max-w-2xl leading-7">
              Your interview performance is evaluated across answer quality,
              technical understanding, and role-specific skills.
            </p>
          </div>
        </div>

        {/* SCORE CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            ["Resume Match", `${report.candidate?.ats_score ?? 0}%`],
            ["Average Score", `${statistics.average_score ?? 0}/10`],
            ["Highest Score", `${statistics.max_score ?? 0}/10`],
            ["Questions", statistics.total_questions ?? 0],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm"
            >
              <p className="text-slate-500 text-sm font-medium">
                {label}
              </p>
              <p className="text-2xl font-black text-slate-900 mt-2">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* HIRING VERDICT + SUMMARY */}
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-6 mb-8">

          <div className="bg-white rounded-[1.75rem] shadow-sm border border-slate-200 p-7">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Hiring Decision
            </p>

            <div className="mt-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">
                {report.hiring_recommendation === "Recommended"
                  ? "✓"
                  : report.hiring_recommendation === "Consider"
                  ? "!"
                  : "×"}
              </div>

              <div>
                <span
                  className={`inline-flex px-4 py-2 rounded-full border font-bold ${recommendationColor}`}
                >
                  {report.hiring_recommendation || "Not Available"}
                </span>
                <p className="text-sm text-slate-500 mt-2">
                  Based on your overall interview performance
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[1.75rem] shadow-sm border border-slate-200 p-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                ✦
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Executive Summary
              </h2>
            </div>

            <p className="text-slate-600 leading-7">
              {report.executive_summary ||
                "No executive summary is available for this interview."}
            </p>
          </div>

        </div>

        {/* CANDIDATE + INTERVIEW */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">

          <div className="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                👤
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Candidate
                </p>
                <h2 className="text-xl font-bold text-slate-900">
                  Candidate Information
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              {[
                ["Name", report.candidate?.name],
                ["Email", report.candidate?.email],
                ["Phone", report.candidate?.phone || "Not Available"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-5 py-3 border-b border-slate-100 last:border-0"
                >
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-800 text-right break-all">
                    {value || "Not Available"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                🎯
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Interview
                </p>
                <h2 className="text-xl font-bold text-slate-900">
                  Interview Details
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              {[
                ["Role", report.interview?.role],
                ["Difficulty", report.interview?.difficulty],
                ["Status", report.interview?.status],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-5 py-3 border-b border-slate-100"
                >
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-800">
                    {value || "Not Available"}
                  </span>
                </div>
              ))}

              <div className="flex justify-between items-center gap-5 pt-3">
                <span className="text-slate-500">Hiring Recommendation</span>
                <span
                  className={`px-3 py-1.5 rounded-full border text-sm font-bold ${recommendationColor}`}
                >
                  {report.hiring_recommendation || "Not Available"}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* STATISTICS */}
        <div className="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-7 mb-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-blue-600">
                Performance
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Interview Statistics
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              ["Total Questions", statistics.total_questions, "📋"],
              ["Answered", statistics.answered_questions, "✓"],
              ["Unanswered", statistics.unanswered_questions, "○"],
              ["Average Score", statistics.average_score, "★"],
              ["Highest Score", statistics.max_score, "↑"],
              ["Lowest Score", statistics.min_score, "↓"],
            ].map(([label, value, icon]) => (
              <div
                key={label}
                className="rounded-2xl bg-slate-50 border border-slate-100 p-5"
              >
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
                  {icon}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {label}
                </p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {value ?? 0}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SKILL ANALYSIS */}
        <div className="mb-8">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-wider font-bold text-blue-600">
              AI Skill Analysis
            </p>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Performance by Skill
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">

            <div className="bg-white rounded-[1.5rem] border border-emerald-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Strengths</h3>
                  <p className="text-xs text-slate-400">Strong performance</p>
                </div>
              </div>

              {report.strong_skills?.length ? (
                <div className="flex flex-wrap gap-2">
                  {report.strong_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">
                  No strong skills identified.
                </p>
              )}
            </div>

            <div className="bg-white rounded-[1.5rem] border border-amber-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  ★
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Average</h3>
                  <p className="text-xs text-slate-400">Room to grow</p>
                </div>
              </div>

              {report.medium_skills?.length ? (
                <div className="flex flex-wrap gap-2">
                  {report.medium_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 rounded-xl bg-amber-50 text-amber-700 text-sm font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">
                  No medium skills identified.
                </p>
              )}
            </div>

            <div className="bg-white rounded-[1.5rem] border border-red-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  !
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Needs Improvement</h3>
                  <p className="text-xs text-slate-400">Focus areas</p>
                </div>
              </div>

              {report.weak_skills?.length ? (
                <div className="flex flex-wrap gap-2">
                  {report.weak_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 rounded-xl bg-red-50 text-red-700 text-sm font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">
                  No improvement areas identified.
                </p>
              )}
            </div>

          </div>
        </div>

        {/* AI FEEDBACK */}
        <div className="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-7 mb-8">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center">
              ✦
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-blue-600">
                AI Coach
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                Personalized Feedback
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {(report.overall_feedback || []).map((item, index) => (
              <div
                key={index}
                className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div className="shrink-0 w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-sm font-black text-blue-600">
                  {index + 1}
                </div>
                <p className="text-slate-600 leading-7 pt-1">
                  {item}
                </p>
              </div>
            ))}

            {(report.overall_feedback || []).length === 0 && (
              <p className="text-slate-400">
                No AI feedback available.
              </p>
            )}
          </div>
        </div>

        {/* INTEGRITY */}
        <div className="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-7 mb-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-slate-400">
                Interview Integrity
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Integrity Review
              </h2>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                events.length > 0
                  ? "bg-amber-50 text-amber-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {events.length > 0 ? "Review Required" : "Clear"}
            </span>
          </div>

          {events.length > 0 ? (
            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-6">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-white flex items-center justify-center text-xl">
                  ⚠
                </div>
                <div>
                  <h3 className="font-bold text-amber-800">
                    {events.length} events require review
                  </h3>
                  <p className="text-amber-700 text-sm leading-6 mt-1">
                    The interview integrity system detected activity that may
                    require review. This information is shown separately from
                    your technical performance score.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-amber-200/70 flex items-center justify-between">
                <span className="text-sm text-amber-700">
                  Total detected events
                </span>
                <span className="text-2xl font-black text-amber-800">
                  {events.length}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-6">
              <h3 className="font-bold text-emerald-700">
                ✓ No suspicious activity detected
              </h3>
              <p className="text-emerald-700/80 text-sm mt-1">
                Candidate maintained interview integrity throughout the session.
              </p>
            </div>
          )}
        </div>

        {/* FINAL CTA */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl shadow-blue-200">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-2xl" />

          <div className="relative p-8 sm:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-white">
            <div>
              <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider">
                Keep improving
              </p>
              <h2 className="text-2xl sm:text-3xl font-black mt-1">
                Ready for your next interview?
              </h2>
              <p className="text-blue-100 mt-2">
                Practice again and turn these insights into stronger answers.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-3 rounded-xl bg-white text-blue-700 font-bold hover:bg-blue-50 transition"
              >
                Back to Dashboard
              </button>

              <button
                onClick={() => window.history.back()}
                className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition"
              >
                Practice Again
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
