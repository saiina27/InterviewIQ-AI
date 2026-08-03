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
  Sparkles
} from "lucide-react";

import CircularProgress from "../components/CircularProgress";


function ResumeResult() {

  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;


  if (!data) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="bg-white p-10 rounded-3xl shadow-xl text-center">

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


  const candidate = data.candidate;

  const ats = data.ats_result;

  const review = data.ai_resume_review;

  const suggestions =
    review?.resume_suggestions ||
    data.resume_suggestions ||
    [];



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

    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-8">


      <div className="max-w-7xl mx-auto space-y-8">


        {/* PROFILE HEADER */}

        <div className="bg-white rounded-3xl shadow-xl p-8">


          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">


            <div className="flex items-center gap-6">


              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">

                <User
                  size={45}
                  className="text-blue-600"
                />

              </div>



              <div>


                <h1 className="text-4xl font-bold">

                  {candidate?.full_name}

                </h1>


                <div className="flex items-center gap-2 text-gray-500 mt-3">

                  <Mail size={18}/>

                  {candidate?.email}

                </div>



                <div className="flex items-center gap-2 text-blue-600 font-semibold mt-3">

                  <Briefcase size={18}/>

                  {
                    data.role_prediction
                    ?.predicted_role
                  }

                </div>


              </div>


            </div>



            <CircularProgress
              score={ats?.ats_score || 0}
            />


          </div>


        </div>





        {/* ATS + SKILLS */}

        <div className="grid md:grid-cols-2 gap-8">



          <div className="bg-white rounded-3xl shadow-xl p-8">


            <div className="flex items-center gap-3 mb-5">

              <Award className="text-blue-600"/>

              <h2 className="text-2xl font-bold">
                ATS Analysis
              </h2>

            </div>



            <p className="text-gray-600">

              Resume compatibility score based on
              skills, keywords and role matching.

            </p>


          </div>





          <div className="bg-white rounded-3xl shadow-xl p-8">


            <h2 className="text-2xl font-bold mb-5">
              Skills Match
            </h2>



            <div className="flex flex-wrap gap-3">


              {
                ats?.matched_skills?.map(
                  (skill,index)=>(

                    <span
                      key={index}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold"
                    >

                      {skill}

                    </span>

                  )
                )
              }


            </div>



            <h3 className="font-bold mt-8 mb-3 flex items-center gap-2">

              <AlertTriangle
                size={18}
                className="text-orange-500"
              />

              Missing Skills

            </h3>



            <div className="flex flex-wrap gap-3">


              {
                ats?.missing_skills?.map(
                  (skill,index)=>(

                    <span
                      key={index}
                      className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-semibold"
                    >

                      {skill}

                    </span>

                  )
                )
              }


            </div>


          </div>


        </div>






        {/* AI REVIEW */}

        <div className="bg-white rounded-3xl shadow-xl p-8">


          <div className="flex items-center gap-3 mb-6">


            <Sparkles
              className="text-purple-600"
            />


            <h2 className="text-3xl font-bold">
              AI Hiring Manager Review
            </h2>


          </div>




          <p className="text-gray-700 mb-6">

            {review?.summary}

          </p>





          <div className="grid md:grid-cols-2 gap-6">


            <div>

              <h3 className="font-bold text-green-600 mb-3">
                Strengths
              </h3>


              {
                review?.strengths?.map(
                  (item,index)=>(

                    <p
                      key={index}
                      className="flex gap-2 mb-2"
                    >

                      <CheckCircle
                        size={18}
                        className="text-green-500"
                      />

                      {item}

                    </p>

                  )
                )
              }


            </div>





            <div>


              <h3 className="font-bold text-red-600 mb-3">

                Weaknesses

              </h3>



              {
                review?.weaknesses?.map(
                  (item,index)=>(

                    <p
                      key={index}
                      className="flex gap-2 mb-2"
                    >

                      <AlertTriangle
                        size={18}
                        className="text-red-500"
                      />

                      {item}

                    </p>

                  )
                )
              }


            </div>


          </div>





          <div className="mt-8 bg-blue-50 rounded-2xl p-5">


            <h3 className="font-bold mb-2">
              Recruiter Recommendation
            </h3>


            <p>
              {review?.recommendation}
            </p>



            <div className="flex items-center gap-2 mt-4">

              <Star
                className="text-yellow-500"
                fill="currentColor"
              />

              Rating:

              <b>
                {review?.rating}/10
              </b>


            </div>


          </div>



        </div>






        {/* SUGGESTIONS */}

        <div className="bg-white rounded-3xl shadow-xl p-8">


          <h2 className="text-3xl font-bold mb-6">

            Resume Improvement Suggestions

          </h2>



          {

            suggestions.map(
              (item,index)=>(

                <div
                  key={index}
                  className="flex gap-4 mb-4"
                >

                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">

                    {index+1}

                  </div>


                  <p className="text-gray-700">
                    {item}
                  </p>


                </div>

              )

            )

          }


        </div>





        {/* CTA */}

        <div className="flex justify-center">


          <button

            onClick={handleStartInterview}

            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-2xl font-bold text-lg transition hover:scale-105 shadow-lg"

          >

            Start AI Interview 🚀

          </button>


        </div>



      </div>


    </div>

  );

}


export default ResumeResult;