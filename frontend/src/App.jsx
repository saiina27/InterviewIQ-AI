import { BrowserRouter, Routes, Route } from "react-router-dom";

import UploadResume from "./pages/UploadResume";
import ResumeResult from "./pages/ResumeResult";
import Interview from "./pages/Interview";
import Report from "./pages/Report";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<UploadResume />}
                />

                <Route
                    path="/resume-result"
                    element={<ResumeResult />}
                />

                <Route
                    path="/interview"
                    element={<Interview />}
                />

                <Route
                    path="/report/:interviewId"
                    element={<Report />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;