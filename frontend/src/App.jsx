import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";


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

import { useAuth } from "./context/AuthContext";




// Redirect logged in users away from login/signup

function PublicRoute({children}) {

    const {user, loading} = useAuth();


    if(loading){

        return (
            <div className="
                min-h-screen
                flex
                items-center
                justify-center
            ">
                Loading...
            </div>
        );

    }


    return user
        ? <Navigate to="/dashboard" replace />
        : children;

}




function App() {


    return (

        <BrowserRouter>

            <Routes>


                {/* Default */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />



                {/* Public Routes */}


                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login/>
                        </PublicRoute>
                    }
                />


                <Route
                    path="/signup"
                    element={
                        <PublicRoute>
                            <Signup/>
                        </PublicRoute>
                    }
                />




                {/* Protected Routes */}


                <Route
                    path="/upload"
                    element={
                        <ProtectedRoute>
                            <UploadResume/>
                        </ProtectedRoute>
                    }
                />



                <Route
                    path="/resume-result"
                    element={
                        <ProtectedRoute>
                            <ResumeResult/>
                        </ProtectedRoute>
                    }
                />



                <Route
                    path="/interview"
                    element={
                        <ProtectedRoute>
                            <Interview/>
                        </ProtectedRoute>
                    }
                />



                <Route
                    path="/report/:interviewId"
                    element={
                        <ProtectedRoute>
                            <Report/>
                        </ProtectedRoute>
                    }
                />



                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard/>
                        </ProtectedRoute>
                    }
                />



                <Route
                    path="/history"
                    element={
                        <ProtectedRoute>
                            <InterviewHistory/>
                        </ProtectedRoute>
                    }
                />



                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile/>
                        </ProtectedRoute>
                    }
                />



                {/* 404 */}

                <Route
                    path="*"
                    element={<NotFound/>}
                />


            </Routes>


        </BrowserRouter>

    );

}


export default App;