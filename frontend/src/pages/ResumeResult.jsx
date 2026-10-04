import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  User,
  Mail,
  Briefcase,
  Award,
  CheckCircle,
  AlertTriangle,
  Star,
  Sparkles,
  ArrowRight,
  Lightbulb,
  Target,
  TrendingUp,
} from "lucide-react";

import CircularProgress from "../components/CircularProgress";


function ResumeResult() {

  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;


  if (!data) {

    return (

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">

        <div className="bg-white border border-slate-200 p-10 rounded-3xl shadow-xl text-center max-w-md">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center mb-5">

            <AlertTriangle
              size={30}
              className="text-red-500"
            />

          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            No Resume Data Found
          </h2>

          <p className="text-slate-500 mt-3">
            Please upload your resume again to generate your analysis.
          </p>

        </div>

      </div>

    );

  }


  const candidate = data.candidate;

  const ats = data.ats_result;

  const review = data.ai_resume_review;

  const suggestions =
    review?.resume_suggestions ||
    data.resume_suggestions ||
    [];


  const matchedSkills = ats?.matched_skills || [];

  const missingSkills = ats?.missing_skills || [];

  const atsScore = ats?.ats_score || 0;


  const handleStartInterview = async () => {

    try {

      const payload = {

        candidate_id: candidate.id,

        role:
          data.role_prediction?.predicted_role,

        difficulty: "Intermediate",

        skills:
          ats.matched_skills,

        experience: "Fresher",

        count: 10,

      };


      const response = await api.post(
        "/interview/start",
        payload
      );


      navigate("/interview", {

        state: {
          interview_id:
            response.data.interview_id
        }

      });


    } catch(error) {

      console.error(error);

      alert(
        "Failed to start interview."
      );

    }

  };


  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-10 space-y-7">


        {/* PAGE HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">

          <div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-3">

              <Sparkles size={15} />

              AI Resume Intelligence

            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">

              Your Resume Analysis

            </h1>

            <p className="text-slate-500 mt-2">

              A detailed AI-powered review of your resume, skills and role readiness.

            </p>

          </div>

        </div>


        {/* PROFILE HERO */}

        <div className="relative overflow-hidden bg-white rounded-[2rem] border border-slate-200 shadow-sm">

          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-100/60 rounded-full blur-3xl" />

          <div className="absolute -bottom-24 left-1/3 w-56 h-56 bg-blue-100/50 rounded-full blur-3xl" />


          <div className="relative p-6 sm:p-8 lg:p-10">

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">


              <div className="flex items-center gap-5">

                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">

                  <User
                    size={40}
                    className="text-white"
                  />

                </div>


                <div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">

                    {candidate?.full_name || "Candidate"}

                  </h2>


                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-sm text-slate-500">

                    <span className="flex items-center gap-2">

                      <Mail size={16} />

                      {candidate?.email}

                    </span>


                    <span className="flex items-center gap-2 text-indigo-600 font-semibold">

                      <Briefcase size={16} />

                      {data.role_prediction?.predicted_role || "Role not detected"}

                    </span>

                  </div>

                </div>

              </div>


              <div className="flex items-center justify-center lg:justify-end">

                <CircularProgress
                  score={atsScore}
                />

              </div>


            </div>

          </div>

        </div>


        {/* TOP INSIGHTS */}

        <div className="grid lg:grid-cols-3 gap-5">


          {/* ATS */}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">

                  <Award
                    size={22}
                    className="text-blue-600"
                  />

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    ATS Compatibility
                  </p>

                  <h3 className="text-xl font-bold text-slate-900">
                    {atsScore}%
                  </h3>

                </div>

              </div>

              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                atsScore >= 85
                  ? "bg-emerald-50 text-emerald-700"
                  : atsScore >= 70
                  ? "bg-blue-50 text-blue-700"
                  : "bg-amber-50 text-amber-700"
              }`}>

                {atsScore >= 85
                  ? "Excellent"
                  : atsScore >= 70
                  ? "Good"
                  : "Needs Work"}

              </span>

            </div>


            <div className="mt-5 h-2.5 bg-slate-100 rounded-full overflow-hidden">

              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all"
                style={{ width: `${Math.min(atsScore, 100)}%` }}
              />

            </div>


            <p className="text-sm text-slate-500 mt-3">

              Resume compatibility based on skills, keywords and role alignment.

            </p>

          </div>


          {/* MATCHED */}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center">

                  <CheckCircle
                    size={22}
                    className="text-emerald-600"
                  />

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Matched Skills
                  </p>

                  <h3 className="text-xl font-bold text-slate-900">
                    {matchedSkills.length}
                  </h3>

                </div>

              </div>

              <TrendingUp
                size={20}
                className="text-emerald-500"
              />

            </div>


            <p className="text-sm text-slate-500 mt-5">

              Skills from your resume that align with the detected role.

            </p>

          </div>


          {/* ROLE */}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center">

                <Target
                  size={22}
                  className="text-indigo-600"
                />

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Predicted Role
                </p>

                <h3 className="text-lg font-bold text-slate-900">
                  {data.role_prediction?.predicted_role || "Not Available"}
                </h3>

              </div>

            </div>


            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">

              <Sparkles size={13} />

              AI detected

            </div>

          </div>


        </div>


        {/* SKILLS SECTION */}

        <div className="grid lg:grid-cols-2 gap-6">


          {/* MATCHED SKILLS */}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7">

            <div className="flex items-center justify-between mb-6">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">

                  <CheckCircle
                    size={20}
                    className="text-emerald-600"
                  />

                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Matched Skills
                  </h2>

                  <p className="text-sm text-slate-500">
                    Skills aligned with your profile
                  </p>

                </div>

              </div>


              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold">

                {matchedSkills.length}

              </span>

            </div>


            <div className="flex flex-wrap gap-2.5">

              {matchedSkills.length ? (

                matchedSkills.map((skill, index) => (

                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-medium"
                  >

                    <CheckCircle size={14} />

                    {skill}

                  </span>

                ))

              ) : (

                <p className="text-sm text-slate-500">
                  No matched skills identified.
                </p>

              )}

            </div>

          </div>


          {/* MISSING SKILLS */}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7">

            <div className="flex items-center justify-between mb-6">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">

                  <AlertTriangle
                    size={20}
                    className="text-amber-600"
                  />

                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Areas to Strengthen
                  </h2>

                  <p className="text-sm text-slate-500">
                    Capabilities worth improving
                  </p>

                </div>

              </div>


              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-bold">

                {missingSkills.length}

              </span>

            </div>


            <div className="flex flex-wrap gap-2.5">

              {missingSkills.length ? (

                missingSkills.map((skill, index) => (

                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 text-sm font-medium"
                  >

                    <AlertTriangle size={14} />

                    {skill}

                  </span>

                ))

              ) : (

                <p className="text-sm text-slate-500">
                  No major skill gaps identified.
                </p>

              )}

            </div>

          </div>


        </div>


        {/* AI REVIEW */}

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">


          <div className="px-7 sm:px-9 py-7 border-b border-slate-100">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center">

                  <Sparkles
                    size={22}
                    className="text-purple-600"
                  />

                </div>

                <div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    AI Hiring Manager Review
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    How your resume may be perceived by a recruiter
                  </p>

                </div>

              </div>


              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-100">

                <Star
                  size={21}
                  className="text-amber-500"
                  fill="currentColor"
                />

                <div>

                  <p className="text-xs text-amber-700 font-semibold">
                    Resume Rating
                  </p>

                  <p className="text-lg font-bold text-slate-900">
                    {review?.rating ?? 0}
                    <span className="text-sm text-slate-500">
                      /10
                    </span>
                  </p>

                </div>

              </div>

            </div>

          </div>


          <div className="p-7 sm:p-9">


            {review?.summary && (

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">

                <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">
                  Executive Summary
                </p>

                <p className="text-slate-700 leading-7">
                  {review.summary}
                </p>

              </div>

            )}


            <div className="grid md:grid-cols-2 gap-6 mt-6">


              <div className="rounded-2xl bg-emerald-50/70 border border-emerald-100 p-6">

                <div className="flex items-center gap-2 mb-4">

                  <CheckCircle
                    size={19}
                    className="text-emerald-600"
                  />

                  <h3 className="font-bold text-emerald-800">
                    Strengths
                  </h3>

                </div>


                <div className="space-y-3">

                  {review?.strengths?.map((item, index) => (

                    <div
                      key={index}
                      className="flex gap-3 text-sm text-slate-700"
                    >

                      <CheckCircle
                        size={16}
                        className="text-emerald-500 mt-0.5 shrink-0"
                      />

                      <span>
                        {item}
                      </span>

                    </div>

                  ))}

                </div>

              </div>


              <div className="rounded-2xl bg-red-50/70 border border-red-100 p-6">

                <div className="flex items-center gap-2 mb-4">

                  <AlertTriangle
                    size={19}
                    className="text-red-500"
                  />

                  <h3 className="font-bold text-red-700">
                    Areas to Improve
                  </h3>

                </div>


                <div className="space-y-3">

                  {review?.weaknesses?.map((item, index) => (

                    <div
                      key={index}
                      className="flex gap-3 text-sm text-slate-700"
                    >

                      <AlertTriangle
                        size={16}
                        className="text-red-500 mt-0.5 shrink-0"
                      />

                      <span>
                        {item}
                      </span>

                    </div>

                  ))}

                </div>

              </div>


            </div>


            {review?.recommendation && (

              <div className="mt-6 rounded-2xl bg-blue-50 border border-blue-100 p-6">

                <p className="text-xs uppercase tracking-wider font-bold text-blue-500 mb-2">
                  Hiring Manager Take
                </p>

                <p className="text-slate-700 leading-7">
                  {review.recommendation}
                </p>

              </div>

            )}


          </div>

        </div>


        {/* SUGGESTIONS */}

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-7 sm:p-9">

          <div className="flex items-center gap-3 mb-7">

            <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">

              <Lightbulb
                size={22}
                className="text-blue-600"
              />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Resume Improvement Plan
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Actionable changes that can make your resume stronger
              </p>

            </div>

          </div>


          <div className="space-y-3">

            {suggestions.length ? (

              suggestions.map((item, index) => (

                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition"
                >

                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <p className="text-sm sm:text-base text-slate-700 leading-6 pt-1">
                    {item}
                  </p>

                </div>

              ))

            ) : (

              <p className="text-sm text-slate-500">
                No improvement suggestions available.
              </p>

            )}

          </div>

        </div>


        {/* CTA */}

        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl shadow-blue-200">

          <div className="absolute -top-20 -right-20 w-52 h-52 rounded-full bg-white/10 blur-2xl" />

          <div className="absolute -bottom-24 left-10 w-64 h-64 rounded-full bg-indigo-300/20 blur-3xl" />


          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-7 sm:p-9">

            <div className="text-center md:text-left">

              <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider">
                Ready for the next step?
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Put your skills to the test.
              </h2>

              <p className="text-blue-100 mt-2 max-w-xl">
                Start a personalized AI interview based on your resume and detected role.
              </p>

            </div>


            <button
              onClick={handleStartInterview}
              className="group shrink-0 inline-flex items-center gap-3 bg-white text-blue-700 px-7 sm:px-9 py-4 rounded-2xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
            >

              Start AI Interview

              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition"
              />

            </button>

          </div>

        </div>


        <div className="text-center text-xs text-slate-400 pb-3">

          AI-generated analysis • Review suggestions before making changes to your resume.

        </div>


      </div>

    </div>

  );

}


export default ResumeResult;
