import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (

        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md border-b">

            <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

                <Link
                    to="/dashboard"
                    className="text-2xl font-bold text-indigo-600"
                >
                    🤖 InterviewIQ AI
                </Link>

                <div className="flex items-center gap-8">

                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `font-medium transition-colors duration-200 ${
                                isActive
                                    ? "text-indigo-600 border-b-2 border-indigo-600 pb-1"
                                    : "text-gray-600 hover:text-indigo-600"
                            }`
                        }
                    >
                        Dashboard
                    </NavLink>

                    <Link
                        to="/history"
                        className="hover:text-indigo-600 font-medium"
                    >
                        History
                    </Link>

                    <Link
                        to="/profile"
                        className="hover:text-indigo-600 font-medium"
                    >
                        Profile
                    </Link>

                    <span className="font-semibold">
                        {user?.full_name}
                    </span>

                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </nav>

    );
}