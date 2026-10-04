import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, UserCircle, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navLinks = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "History", path: "/history" },
        { name: "Profile", path: "/profile" },
    ];

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-5 sm:px-6">
                <div className="h-[76px] flex items-center justify-between">

                    {/* BRAND */}
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-3 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                            <span className="text-xl">🤖</span>
                        </div>

                        <div className="hidden sm:block">
                            <div className="text-lg font-extrabold tracking-tight text-slate-900 leading-none">
                                InterviewIQ
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600 mt-1">
                                AI Career Platform
                            </div>
                        </div>
                    </Link>

                    {/* DESKTOP NAV */}
                    <div className="hidden md:flex items-center gap-2">

                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-2xl p-1.5">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `
                                        px-4 py-2.5
                                        rounded-xl
                                        text-sm
                                        font-semibold
                                        transition-all
                                        ${
                                            isActive
                                                ? "bg-white text-indigo-600 shadow-sm border border-slate-200"
                                                : "text-slate-600 hover:text-indigo-600 hover:bg-white/70"
                                        }
                                        `
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>

                        {/* USER */}
                        <div className="ml-4 flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 border border-indigo-200 flex items-center justify-center">
                                <UserCircle className="w-5 h-5 text-indigo-600" />
                            </div>

                            <div className="hidden lg:block max-w-[150px]">
                                <p className="text-sm font-bold text-slate-800 truncate">
                                    {user?.full_name || "Candidate"}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                    Candidate
                                </p>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="
                                    ml-1
                                    w-10 h-10
                                    flex items-center justify-center
                                    rounded-xl
                                    border border-red-100
                                    bg-red-50
                                    text-red-600
                                    hover:bg-red-100
                                    transition
                                "
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>

                    {/* MOBILE BUTTON */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="
                            md:hidden
                            w-11 h-11
                            flex items-center justify-center
                            rounded-xl
                            border border-slate-200
                            bg-slate-50
                            text-slate-700
                            hover:bg-slate-100
                            transition
                        "
                        aria-label="Toggle menu"
                    >
                        {open ? <X size={23} /> : <Menu size={23} />}
                    </button>
                </div>

                {/* MOBILE MENU */}
                {open && (
                    <div className="md:hidden pb-5">
                        <div className="border-t border-slate-200 pt-4 space-y-2">

                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setOpen(false)}
                                    className={({ isActive }) =>
                                        `
                                        flex items-center justify-between
                                        px-4 py-3.5
                                        rounded-xl
                                        font-semibold
                                        transition
                                        ${
                                            isActive
                                                ? "bg-indigo-50 text-indigo-600"
                                                : "text-slate-700 hover:bg-slate-50"
                                        }
                                        `
                                    }
                                >
                                    <span>{link.name}</span>
                                    <ChevronRight size={17} />
                                </NavLink>
                            ))}

                            <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <UserCircle className="w-5 h-5 text-indigo-600" />
                                </div>

                                <div className="min-w-0">
                                    <p className="font-bold text-slate-800 truncate">
                                        {user?.full_name || "Candidate"}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Candidate
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="
                                    w-full
                                    flex items-center justify-center gap-2
                                    mt-2
                                    px-4 py-3
                                    rounded-xl
                                    bg-red-50
                                    border border-red-100
                                    text-red-600
                                    font-semibold
                                    hover:bg-red-100
                                    transition
                                "
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
