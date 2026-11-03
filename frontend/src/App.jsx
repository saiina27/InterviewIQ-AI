
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Home from "./pages/Home";
import UploadResume from "./pages/UploadResume";
import ResumeResult from "./pages/ResumeResult";
import Interview from "./pages/Interview";
import Report from "./pages/Report";
import Dashboard from "./pages/Dashboard";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import InterviewHistory from "./pages/InterviewHistory";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import SEO from "./components/SEO";

import { useAuth } from "./context/AuthContext";


// Redirect logged-in users away from login/signup

function PublicRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return user
        ? <Navigate to="/dashboard" replace />
        : children;
}


// Add noindex metadata to private pages

function PrivatePage({ children, title }) {
    return (
        <>
            <SEO
                title={`${title} | InterviewIQ AI`}
                description="Private InterviewIQ AI account page."
                noIndex={true}
            />

            <ProtectedRoute>
                {children}
            </ProtectedRoute>
        </>
    );
}


function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Homepage */}

                <Route
                    path="/"
                    element={<Home />}
                />


                {/* Authentication Routes */}

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/signup"
                    element={
                        <PublicRoute>
                            <Signup />
                        </PublicRoute>
                    }
                />


                {/* Protected Routes */}

                <Route
                    path="/upload"
                    element={
                        <PrivatePage title="Upload Resume">
                            <UploadResume />
                        </PrivatePage>
                    }
                />

                <Route
                    path="/resume-result"
                    element={
                        <PrivatePage title="Resume Results">
                            <ResumeResult />
                        </PrivatePage>
                    }
                />

                <Route
                    path="/interview"
                    element={
                        <PrivatePage title="Mock Interview">
                            <Interview />
                        </PrivatePage>
                    }
                />

                <Route
                    path="/report/:interviewId"
                    element={
                        <PrivatePage title="Interview Report">
                            <Report />
                        </PrivatePage>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <PrivatePage title="Dashboard">
                            <Dashboard />
                        </PrivatePage>
                    }
                />

                <Route
                    path="/history"
                    element={
                        <PrivatePage title="Interview History">
                            <InterviewHistory />
                        </PrivatePage>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <PrivatePage title="Profile">
                            <Profile />
                        </PrivatePage>
                    }
                />


                {/* 404 Page */}

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
