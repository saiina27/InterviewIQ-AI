import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function UploadResume() {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();


    const handleFileChange = (e) => {

        const selectedFile = e.target.files[0];

        setError("");

        if (!selectedFile) {
            return;
        }


        // PDF validation

        if (selectedFile.type !== "application/pdf") {

            setError(
                "Only PDF files are allowed."
            );

            setFile(null);
            return;

        }



        // Size validation (5MB)

        if (selectedFile.size > 5 * 1024 * 1024) {

            setError(
                "File size must be less than 5MB."
            );

            setFile(null);
            return;

        }


        setFile(selectedFile);

    };





    const handleUpload = async () => {


        if (!file) {

            setError(
                "Please select your resume PDF."
            );

            return;

        }



        const formData = new FormData();

        formData.append(
            "file",
            file
        );



        try {


            setLoading(true);

            setError("");



            const res = await api.post(

                "/candidates/upload-resume/",

                formData,

                {
                    headers:{
                        "Content-Type":
                        "multipart/form-data",
                    },
                    timeout: 60000,
                }

            );



            navigate(
                "/resume-result",
                {
                    state: res.data,
                }
            );



        }

        catch(error){

            console.error(
                "Upload Error:",
                error
            );


            setError(
                "Resume upload failed. Please try again."
            );


        }


        finally{

            setLoading(false);

        }


    };





    return (

        <>

            <Navbar />


            <div className="
                min-h-screen
                bg-gradient-to-br
                from-blue-50
                via-white
                to-purple-100
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
                    w-full
                    max-w-xl
                ">


                    <h1 className="
                        text-4xl
                        font-bold
                        text-center
                        text-indigo-700
                    ">

                        InterviewIQ AI 🤖

                    </h1>



                    <p className="
                        text-center
                        text-gray-500
                        mt-3
                        mb-8
                    ">

                        Upload your resume and get ATS Score,
                        AI Review and Mock Interview.

                    </p>





                    <label className="

                        border-2
                        border-dashed
                        border-indigo-300
                        rounded-2xl
                        h-60
                        flex
                        flex-col
                        justify-center
                        items-center
                        cursor-pointer
                        hover:border-indigo-600
                        hover:bg-indigo-50
                        transition

                    ">



                        <div className="
                            text-6xl
                            mb-4
                        ">

                            📄

                        </div>



                        <p className="
                            font-bold
                            text-lg
                        ">

                            Choose Resume PDF

                        </p>



                        <p className="
                            text-gray-500
                            text-sm
                            mt-2
                        ">

                            PDF only • Max 5MB

                        </p>




                        <input

                            type="file"

                            accept=".pdf"

                            className="hidden"

                            onChange={handleFileChange}

                        />



                    </label>





                    {
                        file && (

                            <div className="
                                mt-5
                                bg-green-50
                                border
                                border-green-200
                                rounded-xl
                                p-4
                                text-center
                            ">


                                <p className="
                                    text-green-700
                                    font-semibold
                                ">

                                    ✅ Resume Selected

                                </p>


                                <p className="
                                    text-sm
                                    text-gray-600
                                    mt-1
                                    break-all
                                ">

                                    {file.name}

                                </p>


                            </div>


                        )
                    }





                    {
                        error && (

                            <div className="
                                mt-5
                                bg-red-50
                                text-red-600
                                p-4
                                rounded-xl
                                text-center
                                font-semibold
                            ">

                                ⚠ {error}

                            </div>

                        )
                    }






                    <button

                        onClick={handleUpload}

                        disabled={loading}

                        className="

                            mt-8
                            w-full
                            bg-indigo-600
                            hover:bg-indigo-700
                            disabled:bg-gray-400
                            text-white
                            py-4
                            rounded-xl
                            font-bold
                            text-lg
                            transition
                            hover:scale-[1.02]

                        "

                    >


                        {

                            loading

                            ?

                            "🤖 Analyzing Resume..."

                            :

                            "🚀 Analyze Resume"

                        }


                    </button>





                </div>


            </div>


        </>

    );

}


export default UploadResume;