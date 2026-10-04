import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
    User,
    Mail,
    FileText,
    Image as ImageIcon,
    Pencil,
    Save,
    X,
    CheckCircle2,
    ShieldCheck,
} from "lucide-react";

export default function Profile() {
    const { updateUser } = useAuth();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        full_name: "",
        bio: "",
        profile_image: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get("/auth/me");

            setProfile(res.data);

            setFormData({
                full_name: res.data.full_name || "",
                bio: res.data.bio || "",
                profile_image: res.data.profile_image || "",
            });
        } catch (error) {
            console.error("Profile Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setMessage("");

            const res = await api.put("/auth/me", formData);

            setProfile(res.data);
            updateUser(res.data);
            setEditing(false);
            setMessage("Profile updated successfully ✅");
        } catch (error) {
            console.error("Update Error:", error);
            setMessage("Failed to update profile ❌");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-indigo-100 flex items-center justify-center animate-pulse">
                            <User className="text-indigo-600" />
                        </div>

                        <h2 className="text-lg font-bold text-slate-800">
                            Loading profile...
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Getting your account information
                        </p>
                    </div>
                </div>
            </>
        );
    }

    const displayName = profile?.full_name || "Candidate";

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/60 to-indigo-100/70 py-8 sm:py-10 px-4 sm:px-6">

                <div className="max-w-5xl mx-auto">

                    {/* PAGE INTRO */}
                    <div className="mb-7">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600 mb-2">
                            Account
                        </p>

                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                            Your Profile
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Manage your personal information and candidate profile.
                        </p>
                    </div>

                    {/* PROFILE CARD */}
                    <section className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">

                        {/* COVER */}
                        <div className="relative h-36 sm:h-44 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 overflow-hidden">
                            <div className="absolute -top-20 -right-10 w-64 h-64 rounded-full bg-white/10" />
                            <div className="absolute -bottom-28 left-20 w-72 h-72 rounded-full bg-white/10" />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

                            <div className="absolute top-5 right-5">
                                <div className="px-3 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-md text-white text-xs font-semibold">
                                    Candidate Profile
                                </div>
                            </div>
                        </div>

                        <div className="px-5 sm:px-8 lg:px-10 pb-9">

                            {/* PROFILE HEADER */}
                            <div className="-mt-14 sm:-mt-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

                                <div className="flex flex-col sm:flex-row sm:items-end gap-5">

                                    {/* AVATAR */}
                                    <div className="relative shrink-0">
                                        <img
                                            src={
                                                formData.profile_image ||
                                                "https://ui-avatars.com/api/?name=User"
                                            }
                                            alt="Profile"
                                            className="
                                                w-28 h-28
                                                sm:w-32 sm:h-32
                                                rounded-2xl
                                                border-4 border-white
                                                shadow-xl
                                                object-cover
                                                bg-slate-100
                                            "
                                        />

                                        <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-emerald-500 border-4 border-white flex items-center justify-center shadow-md">
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </div>
                                    </div>

                                    {/* NAME */}
                                    <div className="pb-1">
                                        {editing ? (
                                            <div>
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Full Name
                                                </label>

                                                <input
                                                    name="full_name"
                                                    value={formData.full_name}
                                                    onChange={handleChange}
                                                    className="
                                                        mt-1.5
                                                        w-full sm:w-[320px]
                                                        px-4 py-2.5
                                                        rounded-xl
                                                        border border-slate-300
                                                        bg-white
                                                        text-xl font-bold text-slate-900
                                                        outline-none
                                                        focus:border-indigo-500
                                                        focus:ring-4 focus:ring-indigo-100
                                                    "
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                                    {displayName}
                                                </h2>

                                                <div className="flex items-center gap-2 mt-2 text-slate-500">
                                                    <Mail size={15} />
                                                    <span className="text-sm">
                                                        {profile?.email}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* ACTIONS */}
                                <div className="flex gap-3 lg:pb-1">

                                    {!editing ? (
                                        <button
                                            onClick={() => {
                                                setMessage("");
                                                setEditing(true);
                                            }}
                                            className="
                                                flex items-center justify-center gap-2
                                                px-5 py-3
                                                rounded-xl
                                                bg-indigo-600
                                                hover:bg-indigo-700
                                                text-white
                                                font-bold
                                                shadow-lg shadow-indigo-200
                                                transition
                                            "
                                        >
                                            <Pencil size={17} />
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="
                                                    flex items-center justify-center gap-2
                                                    px-5 py-3
                                                    rounded-xl
                                                    bg-emerald-600
                                                    hover:bg-emerald-700
                                                    disabled:opacity-60
                                                    disabled:cursor-not-allowed
                                                    text-white
                                                    font-bold
                                                    shadow-lg shadow-emerald-200
                                                    transition
                                                "
                                            >
                                                <Save size={17} />
                                                {saving ? "Saving..." : "Save Changes"}
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setEditing(false);
                                                    setMessage("");
                                                    setFormData({
                                                        full_name: profile?.full_name || "",
                                                        bio: profile?.bio || "",
                                                        profile_image: profile?.profile_image || "",
                                                    });
                                                }}
                                                className="
                                                    flex items-center justify-center gap-2
                                                    px-5 py-3
                                                    rounded-xl
                                                    bg-slate-100
                                                    hover:bg-slate-200
                                                    text-slate-700
                                                    font-bold
                                                    transition
                                                "
                                            >
                                                <X size={17} />
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* MESSAGE */}
                            {message && (
                                <div className="mt-7 flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700">
                                    <CheckCircle2 size={18} />
                                    {message}
                                </div>
                            )}

                            {/* CONTENT GRID */}
                            <div className="mt-9 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">

                                {/* ABOUT */}
                                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">

                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-indigo-600" />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-slate-900">
                                                About Me
                                            </h3>

                                            <p className="text-xs text-slate-500">
                                                Tell recruiters about yourself
                                            </p>
                                        </div>
                                    </div>

                                    {editing ? (
                                        <textarea
                                            name="bio"
                                            rows="6"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            placeholder="Write a short introduction about yourself..."
                                            className="
                                                w-full
                                                resize-none
                                                rounded-xl
                                                border border-slate-300
                                                bg-white
                                                p-4
                                                text-slate-700
                                                outline-none
                                                focus:border-indigo-500
                                                focus:ring-4 focus:ring-indigo-100
                                            "
                                        />
                                    ) : (
                                        <p className="text-slate-600 leading-7 whitespace-pre-line">
                                            {profile?.bio || "No bio added yet."}
                                        </p>
                                    )}
                                </div>

                                {/* ACCOUNT INFO */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-6">

                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                            <ShieldCheck className="w-5 h-5 text-blue-600" />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-slate-900">
                                                Account
                                            </h3>

                                            <p className="text-xs text-slate-500">
                                                Profile information
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">

                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                                Email
                                            </p>

                                            <div className="flex items-center gap-2 mt-1.5 text-slate-700">
                                                <Mail size={15} className="text-indigo-500" />
                                                <span className="text-sm font-medium break-all">
                                                    {profile?.email}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="h-px bg-slate-100" />

                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                                Profile Status
                                            </p>

                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                                <span className="text-sm font-semibold text-emerald-700">
                                                    Active
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* IMAGE URL */}
                            {editing && (
                                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-6">

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                                            <ImageIcon className="w-5 h-5 text-violet-600" />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-slate-900">
                                                Profile Image
                                            </h3>

                                            <p className="text-xs text-slate-500">
                                                Add an image URL for your profile
                                            </p>
                                        </div>
                                    </div>

                                    <input
                                        name="profile_image"
                                        value={formData.profile_image}
                                        onChange={handleChange}
                                        placeholder="https://example.com/profile.jpg"
                                        className="
                                            w-full
                                            px-4 py-3
                                            rounded-xl
                                            border border-slate-300
                                            bg-white
                                            text-slate-700
                                            outline-none
                                            focus:border-indigo-500
                                            focus:ring-4 focus:ring-indigo-100
                                        "
                                    />
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
