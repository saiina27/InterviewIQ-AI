import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function UploadResume() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a resume PDF.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);

        try {
            const res = await api.post(
                "/candidates/upload-resume/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            navigate("/resume-result", {
                state: res.data,
            });

        } catch (error) {
            console.error(error);
            alert("Upload failed.");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-xl">

                <h1 className="text-4xl font-bold text-center text-blue-700 mb-3">
                    InterviewIQ AI
                </h1>

                <p className="text-center text-gray-500 mb-8">
                    Upload your resume and get ATS Score, AI Review and Mock Interview.
                </p>

                <label className="border-2 border-dashed border-blue-300 rounded-2xl h-56 flex flex-col justify-center items-center cursor-pointer hover:border-blue-500 transition">

                    <div className="text-6xl mb-4">
                        📄
                    </div>

                    <p className="font-semibold">
                        Choose Resume PDF
                    </p>

                    <p className="text-gray-500 text-sm mt-2">
                        PDF Only
                    </p>

                    <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files[0])}
                    />

                </label>

                {file && (
                    <div className="mt-5 text-green-600 font-semibold text-center">
                        {file.name}
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="mt-8 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold text-lg transition"
                >
                    {loading ? "Uploading..." : "Analyze Resume"}
                </button>

            </div>
        </div>
    );
}

export default UploadResume;