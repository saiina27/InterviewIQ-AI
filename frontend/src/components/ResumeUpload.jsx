import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ResumeUpload() {

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

            console.log("========== BACKEND RESPONSE ==========");
            console.log(res.data);
            console.log("======================================");

            navigate("/resume-result", {
                state: res.data,
            });

        } catch (error) {

            console.error("UPLOAD ERROR");
            console.error(error);

            if (error.response) {
                console.log("Status:", error.response.status);
                console.log("Data:", error.response.data);
            }

            alert("Upload failed. Check browser console.");

        } finally {

            setLoading(false);

        }

    };

    return (
        <div>

            <h2>Upload Resume</h2>

            <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <br />
            <br />

            <button
                onClick={handleUpload}
                disabled={loading}
            >
                {loading ? "Uploading..." : "Upload Resume"}
            </button>

        </div>
    );
}

export default ResumeUpload;