import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, User, LogOut, Menu, X, Bot } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Interview History", path: "/history", icon: FileText },
    { name: "Profile", path: "/profile", icon: User },
];

function Brand({ compact = false }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                <Bot size={21} />
            </div>
            <div className="leading-tight">
                <p className="text-lg font-extrabold tracking-tight text-slate-900">InterviewIQ</p>
                {!compact && (
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
                        AI Career Platform
                    </p>
                )}
            </div>
        </div>
    );
}

export default function AppLayout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const current = NAV_ITEMS.find((item) => location.pathname.startsWith(item.path));
    const displayName = user?.full_name || "Candidate";
    const initial = displayName.trim().charAt(0).toUpperCase() || "C";

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-dvh bg-slate-50">
            {/* MOBILE TOP BAR */}
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:hidden">
                <Brand compact />
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Open menu"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                    <Menu size={21} />
                </button>
            </header>

            {open && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* SIDEBAR (fixed on desktop, drawer on mobile) */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:w-64 lg:translate-x-0 ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between px-5 pb-2 pt-6">
                    <Brand />
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        aria-label="Close menu"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="mt-6 flex-1 space-y-1 px-3">
                    {NAV_ITEMS.map(({ name, path, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`
                            }
                        >
                            <Icon size={19} />
                            {name}
                        </NavLink>
                    ))}
                </nav>

                <div className="border-t border-slate-100 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                            {initial}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-slate-800">{displayName}</p>
                            <p className="text-xs text-slate-500">Candidate</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-red-600"
                        >
                            <LogOut size={16} />
                            Sign out
                        </button>
                    </div>
                </div>
            </aside>

            {/* CONTENT */}
            <div className="lg:pl-64">
                <div className="hidden px-10 pt-6 text-sm font-medium text-slate-500 lg:block">
                    {current?.name || "Dashboard"}
                </div>
                <main className="min-w-0">{children}</main>
            </div>
        </div>
    );
}
