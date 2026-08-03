import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";


export default function Profile() {


    const { updateUser } = useAuth();



    const [profile,setProfile] = useState(null);

    const [loading,setLoading] = useState(true);

    const [saving,setSaving] = useState(false);

    const [editing,setEditing] = useState(false);

    const [message,setMessage] = useState("");




    const [formData,setFormData] = useState({

        full_name:"",
        bio:"",
        profile_image:"",

    });






    useEffect(()=>{


        fetchProfile();


    },[]);






    const fetchProfile = async()=>{


        try{


            const res =
                await api.get("/auth/me");



            setProfile(
                res.data
            );



            setFormData({

                full_name:
                    res.data.full_name || "",


                bio:
                    res.data.bio || "",


                profile_image:
                    res.data.profile_image || "",

            });



        }
        catch(error){


            console.error(
                "Profile Error:",
                error
            );


        }
        finally{


            setLoading(false);


        }


    };








    const handleChange=(e)=>{


        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value,

        });


    };








    const handleSave=async()=>{


        try{


            setSaving(true);

            setMessage("");



            const res =
                await api.put(
                    "/auth/me",
                    formData
                );



            setProfile(
                res.data
            );



            updateUser(
                res.data
            );



            setEditing(false);



            setMessage(
                "Profile updated successfully ✅"
            );



        }
        catch(error){


            console.error(
                "Update Error:",
                error
            );


            setMessage(
                "Failed to update profile ❌"
            );


        }
        finally{


            setSaving(false);


        }


    };








    if(loading){


        return (

            <>

                <Navbar />


                <div className="
                    min-h-screen
                    flex
                    items-center
                    justify-center
                ">

                    <h2 className="
                        text-2xl
                        font-semibold
                    ">

                        Loading Profile...

                    </h2>


                </div>


            </>


        );


    }









    return (

        <>


            <Navbar />



            <div className="
                min-h-screen
                bg-gradient-to-br
                from-slate-100
                via-blue-50
                to-indigo-100
                py-10
                px-6
            ">




                <div className="
                    max-w-5xl
                    mx-auto
                ">




                    <div className="
                        bg-white
                        rounded-3xl
                        shadow-xl
                        overflow-hidden
                    ">




                        <div className="
                            bg-gradient-to-r
                            from-indigo-600
                            to-blue-600
                            h-40
                        " />






                        <div className="
                            px-10
                            pb-10
                        ">



                            <div className="
                                -mt-16
                                flex
                                flex-col
                                md:flex-row
                                justify-between
                                items-center
                            ">





                                <div className="
                                    flex
                                    items-center
                                    gap-6
                                ">



                                    <img

                                        src={
                                            formData.profile_image ||
                                            "https://ui-avatars.com/api/?name=User"
                                        }

                                        className="
                                            w-32
                                            h-32
                                            rounded-full
                                            border-4
                                            border-white
                                            shadow-lg
                                            object-cover
                                        "

                                        alt="profile"

                                    />






                                    <div>


                                        {
                                            editing ?


                                            <input

                                                name="full_name"

                                                value={
                                                    formData.full_name
                                                }

                                                onChange={
                                                    handleChange
                                                }

                                                className="
                                                    border
                                                    rounded-lg
                                                    px-4
                                                    py-2
                                                    text-2xl
                                                    font-bold
                                                "

                                            />


                                            :


                                            <h1 className="
                                                text-4xl
                                                font-bold
                                                text-slate-800
                                            ">

                                                {profile?.full_name}

                                            </h1>


                                        }



                                        <p className="
                                            text-gray-500
                                            mt-2
                                        ">

                                            {profile?.email}

                                        </p>


                                    </div>


                                </div>








                                <div className="mt-6 md:mt-0">


                                    {
                                        !editing ?


                                        <button

                                            onClick={()=>
                                                setEditing(true)
                                            }

                                            className="
                                                bg-indigo-600
                                                text-white
                                                px-6
                                                py-3
                                                rounded-xl
                                                font-semibold
                                            "

                                        >

                                            ✏️ Edit Profile

                                        </button>



                                        :



                                        <div className="
                                            flex
                                            gap-3
                                        ">


                                            <button

                                                onClick={handleSave}

                                                disabled={saving}

                                                className="
                                                    bg-green-600
                                                    text-white
                                                    px-6
                                                    py-3
                                                    rounded-xl
                                                "

                                            >

                                                {
                                                    saving
                                                    ?
                                                    "Saving..."
                                                    :
                                                    "💾 Save"
                                                }


                                            </button>



                                            <button

                                                onClick={()=>
                                                    setEditing(false)
                                                }

                                                className="
                                                    bg-gray-500
                                                    text-white
                                                    px-6
                                                    py-3
                                                    rounded-xl
                                                "

                                            >

                                                Cancel

                                            </button>


                                        </div>


                                    }


                                </div>




                            </div>









                            {
                                message && (

                                    <div className="
                                        mt-6
                                        bg-indigo-50
                                        p-4
                                        rounded-xl
                                        text-indigo-700
                                    ">

                                        {message}

                                    </div>

                                )
                            }









                            <div className="mt-10">


                                <h2 className="
                                    text-2xl
                                    font-bold
                                    mb-4
                                ">

                                    About Me

                                </h2>




                                {
                                    editing ?


                                    <textarea

                                        name="bio"

                                        rows="5"

                                        value={
                                            formData.bio
                                        }

                                        onChange={
                                            handleChange
                                        }

                                        className="
                                            w-full
                                            border
                                            rounded-xl
                                            p-4
                                        "

                                    />

                                    :


                                    <p className="
                                        text-gray-700
                                        leading-8
                                    ">

                                        {
                                            profile?.bio ||
                                            "No bio added yet."
                                        }

                                    </p>


                                }



                            </div>








                            {
                                editing && (


                                    <div className="mt-8">


                                        <label className="
                                            font-semibold
                                            block
                                            mb-2
                                        ">

                                            Profile Image URL

                                        </label>



                                        <input

                                            name="profile_image"

                                            value={
                                                formData.profile_image
                                            }

                                            onChange={
                                                handleChange
                                            }

                                            className="
                                                w-full
                                                border
                                                rounded-xl
                                                p-3
                                            "

                                        />


                                    </div>


                                )
                            }







                        </div>




                    </div>




                </div>



            </div>



        </>


    );


}