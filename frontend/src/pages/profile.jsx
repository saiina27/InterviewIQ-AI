import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Profile() {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    const [formData, setFormData] = useState({
        full_name: "",
        bio: "",
        profile_image: "",
    });

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const res = await api.get("/auth/me");

                setProfile(res.data);

                setFormData({
                    full_name: res.data.full_name || "",
                    bio: res.data.bio || "",
                    profile_image: res.data.profile_image || "",
                });

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }

        };

        fetchProfile();

    }, []);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSave = async () => {

        try {

            const res = await api.put("/auth/me", formData);

            setProfile(res.data);

            setEditing(false);

            alert("✅ Profile Updated Successfully!");

        } catch (err) {

            console.error(err);

            alert("Failed to update profile.");

        }

    };

    if (loading) {

        return (

            <>
                <Navbar />

                <div className="min-h-screen flex items-center justify-center">

                    <h2 className="text-2xl font-semibold">
                        Loading Profile...
                    </h2>

                </div>

            </>

        );

    }

    return (

        <>

            <Navbar />

            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 py-10 px-6">

                <div className="max-w-5xl mx-auto">

                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

                        {/* Header */}

                        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 h-40"></div>

                        <div className="px-10 pb-10">

                            <div className="-mt-16 flex flex-col md:flex-row md:items-center md:justify-between">

                                <div className="flex items-center gap-6">

                                    <img
                                        src={
                                            editing
                                                ? formData.profile_image ||
                                                  "https://ui-avatars.com/api/?name=User&background=6366f1&color=fff"
                                                : profile?.profile_image ||
                                                  "https://ui-avatars.com/api/?name=User&background=6366f1&color=fff"
                                        }
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                                    />

                                    <div>

                                        {editing ? (

                                            <input
                                                type="text"
                                                name="full_name"
                                                value={formData.full_name}
                                                onChange={handleChange}
                                                className="border rounded-lg px-4 py-2 text-2xl font-bold w-full"
                                            />

                                        ) : (

                                            <h1 className="text-4xl font-bold text-slate-800">
                                                {profile?.full_name}
                                            </h1>

                                        )}

                                        <p className="text-gray-500 mt-2">
                                            {profile?.email}
                                        </p>

                                    </div>

                                </div>

                                <div className="mt-6 md:mt-0">

                                    {!editing ? (

                                        <button
                                            onClick={() => setEditing(true)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold"
                                        >
                                            ✏️ Edit Profile
                                        </button>

                                    ) : (

                                        <div className="flex gap-3">

                                            <button
                                                onClick={handleSave}
                                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
                                            >
                                                💾 Save
                                            </button>

                                            <button
                                                onClick={() => setEditing(false)}
                                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold"
                                            >
                                                Cancel
                                            </button>

                                        </div>

                                    )}

                                </div>

                            </div>

                            {/* About */}

                            <div className="mt-10">

                                <h2 className="text-2xl font-bold mb-4">
                                    About Me
                                </h2>

                                {editing ? (

                                    <textarea
                                        rows={5}
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="w-full border rounded-xl p-4"
                                    />

                                ) : (

                                    <p className="text-gray-700 leading-8">
                                        {profile?.bio || "No bio added yet."}
                                    </p>

                                )}

                            </div>

                            {/* Profile Image */}

                            {editing && (

                                <div className="mt-8">

                                    <label className="font-semibold block mb-2">
                                        Profile Image URL
                                    </label>

                                    <input
                                        type="text"
                                        name="profile_image"
                                        value={formData.profile_image}
                                        onChange={handleChange}
                                        className="w-full border rounded-xl p-3"
                                        placeholder="https://example.com/profile.jpg"
                                    />

                                </div>

                            )}

                            {/* Account Info */}

                            <div className="grid md:grid-cols-2 gap-6 mt-10">

                                <div className="bg-indigo-50 rounded-2xl p-6">

                                    <p className="text-gray-500">
                                        Full Name
                                    </p>

                                    <h3 className="text-xl font-bold mt-2">
                                        {profile?.full_name}
                                    </h3>

                                </div>

                                <div className="bg-blue-50 rounded-2xl p-6">

                                    <p className="text-gray-500">
                                        Email Address
                                    </p>

                                    <h3 className="text-xl font-bold mt-2 break-all">
                                        {profile?.email}
                                    </h3>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </>

    );

}