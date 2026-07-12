import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

function Interview() {
    const location = useLocation();
    const navigate = useNavigate();

    const interviewId = location.state?.interview_id;

    const videoRef = useRef(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [faceStatus, setFaceStatus] = useState("Checking...");
    const [recording, setRecording] = useState(false);
    const recognitionRef = useRef(null);
    // Cheating Detection
    const [tabWarnings, setTabWarnings] = useState(0);

    // ----------------------------
    // webcam setup
    // ----------------------------
    useEffect(() => {
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera access denied:", err);
            alert("Please allow camera access for the interview.");
        }
    };

    startCamera();

    return () => {
        if (videoRef.current?.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
        }
    };
}, []);

// ----------------------------
// Face Detection Every 3 Seconds
// ----------------------------
useEffect(() => {

    if (!interviewId) return;

    const interval = setInterval(() => {

        captureAndSendFrame();

    }, 3000);

    return () => clearInterval(interval);

}, [interviewId]);

    // ----------------------------
    // Load Questions
    // ----------------------------
    useEffect(() => {
    if (!interviewId) {
        alert("Interview not found.");
        navigate("/");
        return;
    }

    fetchQuestions();
}, [interviewId, navigate]);

    // ----------------------------
    // Tab Switching Detection
    // ----------------------------
    useEffect(() => {

        const handleVisibilityChange = async () => {

            if (document.hidden) {

                setTabWarnings((prev) => {
                    const newWarnings = prev + 1;

                    if (newWarnings >= 3) {
                        terminateInterview();
                    }

                    return newWarnings;
                });

                try {

                    await axios.post(
                        `${import.meta.env.VITE_API_URL}/interview/cheating`,
                        {
                            interview_id: interviewId,
                            event_type: "Tab Switch",
                            status: "Warning",
                        }
                    );

                } catch (err) {

                    console.error("Failed to record cheating event", err);

                }
            }
        };

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };

    }, [interviewId]);

    // ----------------------------
    // Fetch Questions
    // ----------------------------
    const fetchQuestions = async () => {

        try {

            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/interview/${interviewId}/questions`
            );

            setQuestions(res.data.questions || []);

        } catch (err) {

            console.error(err);

            alert("Unable to load interview questions.");

        } finally {

            setLoading(false);

        }
    };

    // ----------------------------
    // webcam frame capture and send for face detection
    // ----------------------------

    const captureAndSendFrame = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
        videoRef.current,
        0,
        0,
        canvas.width,
        canvas.height
    );

    canvas.toBlob(async (blob) => {

        if (!blob) return;

        const formData = new FormData();

        formData.append("image", blob, "frame.jpg");

        try {

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/interview/detect-face?interview_id=${interviewId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setFaceStatus(res.data.status);

        } catch (err) {

            console.error("Face Detection Error:", err);

        }

    }, "image/jpeg");
};

// ----------------------------
// interview terminate
// ----------------------------
    const terminateInterview = async () => {

    alert("Interview terminated due to multiple tab switches.");

    try {

        await axios.post(
            `${import.meta.env.VITE_API_URL}/interview/cheating`,
            {
                interview_id: interviewId,
                event_type: "INTERVIEW_TERMINATED",
                status: "CHEATING",
            }
        );

    } catch (err) {
        console.error(err);
    }

    navigate(`/report/${interviewId}`);
};

// ----------------------------
// voice to text setup
// ----------------------------
    const toggleRecording = () => {

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Speech Recognition is not supported in this browser.");
        return;
    }

    if (!recognitionRef.current) {

        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {

            let transcript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
        if(event.results[i].isFinal){
            transcript += event.results[i][0].transcript;
        }
    }

    if(transcript){
        setAnswer((prev) => prev + " " + transcript);
    }

};

        recognition.onerror = (event) => {
            console.error(event.error);
        };

        recognition.onend = () => {
            setRecording(false);
        };

        recognitionRef.current = recognition;
    }

    if (!recording) {

        recognitionRef.current.start();
        setRecording(true);

    } else {

        recognitionRef.current.stop();
        setRecording(false);

    }

};
    // ----------------------------
    // Submit Answer
    // ----------------------------
    const handleSubmit = async () => {

        if (submitting) return;

        if (answer.trim() === "") {
            alert("Please write your answer.");
            return;
        }

        const currentQuestion = questions[currentIndex];

        if (!currentQuestion) return;

        setSubmitting(true);

        try {

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/interview/answer`,
                {
                    interview_id: interviewId,
                    question_id: currentQuestion.id,
                    answer: answer.trim(),
                }
            );

            // Interview Completed
            if (res.data.interview_completed) {

                alert("Interview Completed Successfully!");

                navigate("/dashboard", {
                    state: {
                        interviewId: interviewId
                    }
                });

                return;
            }

            // Next Question
            setAnswer("");

            setCurrentIndex((prev) => prev + 1);

        } catch (err) {

            console.error(err);

            if (err.response?.status === 409) {
                alert("Answer already submitted.");
                return;
            }

            alert(
                err.response?.data?.detail ||
                "Failed to submit answer."
            );

        } finally {

            setSubmitting(false);

        }
    };

    if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
                <h2 className="text-3xl font-bold text-blue-600">
                    Loading Interview...
                </h2>

                <p className="mt-3 text-gray-500">
                    Preparing AI Questions...
                </p>
            </div>
        </div>
    );
}

if (questions.length === 0) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <h2 className="text-3xl font-bold text-red-500">
                No Questions Found
            </h2>
        </div>
    );
}

    return (
<div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-8">

<div className="max-w-7xl mx-auto">

<div className="flex justify-between items-center mb-8">

<div>

<h1 className="text-5xl font-bold text-slate-800">
AI Interview
</h1>

<p className="text-gray-500 mt-2">
Answer confidently and avoid switching tabs.
</p>

</div>

<div className="bg-white rounded-xl shadow-lg px-6 py-4">

<p className="text-gray-500">
Question
</p>

<h2 className="text-3xl font-bold text-blue-600">
{currentIndex+1}/{questions.length}
</h2>

</div>

</div>

<div className="w-full bg-gray-200 rounded-full h-4 mb-8">

<div
className="bg-blue-600 h-4 rounded-full transition-all duration-500"
style={{
width: `${questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0}%`
}}
/>

</div>

<div className="grid lg:grid-cols-3 gap-8">

<div className="lg:col-span-2">

<div className="bg-white rounded-2xl shadow-lg p-8">

<h2 className="text-2xl font-bold text-slate-700 mb-6">
Question {currentIndex+1}
</h2>

<p className="text-xl leading-9">
{questions[currentIndex]?.question || "Loading question..."}
</p>

<textarea
    value={answer}
    onChange={(e) => setAnswer(e.target.value)}
    rows={10}
    disabled={submitting}
    placeholder="Type your answer here..."
    className="w-full mt-8 border border-gray-300 rounded-xl p-5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none disabled:bg-gray-100"
/>

<div className="flex justify-end mt-8">

<button

onClick={handleSubmit}

disabled={submitting}

className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
>

{submitting

?

"Submitting..."

:

currentIndex===questions.length-1

?

"Finish Interview"

:

"Submit & Next"}

</button>

</div>

</div>

</div>

<div>

<div className="bg-white rounded-2xl shadow-lg p-6">

<h2 className="text-xl font-bold">
Interview Status
</h2>

<div className="mt-5">

<p className="text-gray-500">
Progress
</p>

<p className="font-bold text-blue-600 text-xl">
{currentIndex+1} / {questions.length}
</p>

</div>

<div className="mt-6">

<p className="text-gray-500">
Tab Warnings
</p>

<p className={`text-2xl font-bold ${tabWarnings>0?"text-red-600":"text-green-600"}`}>

{tabWarnings}

</p>

</div>

</div>

{tabWarnings>0 &&(

<div className="bg-red-100 border border-red-300 rounded-2xl p-5 mt-6">

<h3 className="font-bold text-red-700">

⚠ Warning

</h3>

<p className="mt-2 text-red-600">

You switched tabs {tabWarnings} time(s).

Please stay focused during the interview.

</p>

</div>

)}

<div className="bg-white rounded-2xl shadow-lg p-6 mt-6">

<h2 className="font-bold text-xl">
Webcam
</h2>

<div className="mt-4 overflow-hidden rounded-xl border">

    <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-56 object-cover"
    />

</div>
<div className="mt-4">

    <p className="text-gray-500">
        Face Status
    </p>

    <p
        className={`font-bold text-lg ${
            faceStatus === "OK"
                ? "text-green-600"
                : "text-red-600"
        }`}
    >
        {faceStatus}
    </p>

</div>

</div>

<div className="bg-white rounded-2xl shadow-lg p-6 mt-6">

<h2 className="font-bold text-xl">
Voice Answer
</h2>

<button
    onClick={toggleRecording}
    disabled={submitting}
    className={`mt-5 w-full py-3 rounded-xl text-white font-bold transition ${
    submitting
        ? "bg-gray-400 cursor-not-allowed"
        : recording
        ? "bg-red-600 hover:bg-red-700"
        : "bg-purple-600 hover:bg-purple-700"
}`}
>
    {recording
        ? "🛑 Stop Recording"
        : "🎤 Start Recording"}
</button>

</div>

</div>

</div>

</div>

</div>
);
}

export default Interview;