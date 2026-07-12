import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function ResumeResult() {
    const location = useLocation();
    const navigate = useNavigate();

    const data = location.state;

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
                    <h2 className="text-3xl font-bold text-red-600">
                        No Resume Data Found
                    </h2>

                    <p className="text-gray-500 mt-3">
                        Please upload your resume again.
                    </p>
                </div>
            </div>
    );
    }

    const handleStartInterview = async () => {
        try {
            const payload = {
                candidate_id: data.candidate.id,
                role: data.role_prediction.predicted_role,
                difficulty: "Intermediate",
                skills: data.ats_result.matched_skills,
                experience: "Fresher",
                count: 10,
            };

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/interview/start`,
                payload
            );

            console.log(response.data);

            navigate("/interview", {
                state: {
                   interview_id: response.data.interview_id
                }
            });

        } catch (error) {
            console.error(error);
            alert("Failed to start interview.");
        }
    };

    return (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-8">
    <div className="max-w-7xl mx-auto">

      <div className="mb-8">
        <h1 className="text-5xl font-bold text-slate-800">
          Resume Analysis
        </h1>

        <p className="text-gray-500 mt-2">
          Your resume has been analyzed successfully.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <p className="text-gray-500">ATS Score</p>

          <h1 className="text-6xl font-bold text-blue-600 mt-3">
            {data?.ats_result?.ats_score}%
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <p className="text-gray-500">
            Predicted Role
          </p>

          <h2 className="text-3xl font-bold mt-4">
            {data?.role_prediction?.predicted_role}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <p className="text-gray-500">
            Candidate
          </p>

          <h2 className="text-2xl font-bold mt-4">
            {data?.candidate?.name || "Candidate"}
          </h2>

          <p className="text-gray-500">
            {data?.candidate?.email || "Not Available"}
          </p>
        </div>

      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

        <h2 className="text-2xl font-bold mb-6">
          ATS Breakdown
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

          {Object.entries(data?.ats_result?.breakdown || {}).map(
            ([key, value]) => (

              <div
                key={key}
                className="bg-slate-50 rounded-xl p-5 border"
              >

                <h3 className="uppercase font-semibold text-gray-600">
                  {key}
                </h3>

                <p className="text-3xl font-bold text-blue-600 mt-3">
                  {value}
                </p>

              </div>

            )
          )}

        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-5">
            Matched Skills
          </h2>

          <div className="flex flex-wrap gap-3">

            {(data?.ats_result?.matched_skills || []).map((skill, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold"
              >
                {skill}
              </span>

            ))}

          </div>

        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-5">
            Missing Skills
          </h2>

          <div className="flex flex-wrap gap-3">

            {(data?.ats_result?.missing_skills || []).map((skill, index) => (
              <span  
                key={index}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-semibold"
              >
                {skill}
              </span>

            ))}

          </div>

        </div>

      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

        <h2 className="text-2xl font-bold mb-5">
          AI Resume Review
        </h2>

        <p className="whitespace-pre-line leading-8 text-gray-700">
            {typeof data?.ai_resume_review === "string"
              ? data.ai_resume_review
              : data?.ai_resume_review?.error ||
                "AI resume review is currently unavailable."}
        </p>

      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

        <h2 className="text-2xl font-bold mb-5">
          Resume Suggestions
        </h2>

        <ul className="space-y-3">

          {(data?.resume_suggestions || []).map((item, index) => (

            <li
              key={index}
              className="flex gap-3"
            >
              <span>✅</span>

              <span>{item}</span>

            </li>

          ))}

        </ul>

      </div>

      <div className="flex justify-center mt-10">

        <button
          onClick={handleStartInterview}
          className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-xl text-xl font-bold shadow-lg transition-all duration-300 hover:scale-105"
        >
          Start AI Interview →
        </button>
        <button
onClick={() =>
navigate("/dashboard", {
state:{
resumeData:data
}
})
}
className="bg-indigo-600 text-white px-12 py-4 rounded-xl text-xl font-bold shadow-lg mt-5"
>
Open Dashboard →
</button>

      </div>

    </div>
  </div>
);
}

export default ResumeResult;