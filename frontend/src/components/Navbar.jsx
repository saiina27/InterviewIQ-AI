import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, UserCircle } from "lucide-react";

import { useAuth } from "../context/AuthContext";



export default function Navbar() {


    const { user, logout } = useAuth();

    const navigate = useNavigate();


    const [open,setOpen] = useState(false);





    const handleLogout = ()=>{


        logout();

        navigate("/login");


    };





    const navLinks = [


        {
            name:"Dashboard",
            path:"/dashboard"
        },

        {
            name:"History",
            path:"/history"
        },

        {
            name:"Profile",
            path:"/profile"
        }


    ];







    return (

        <nav className="
            sticky
            top-0
            z-50
            bg-white/90
            backdrop-blur-md
            shadow-md
            border-b
        ">


            <div className="
                max-w-7xl
                mx-auto
                px-6
                py-4
                flex
                justify-between
                items-center
            ">



                {/* LOGO */}


                <Link

                    to="/dashboard"

                    className="
                        text-2xl
                        font-bold
                        text-indigo-600
                    "

                >

                    🤖 InterviewIQ AI


                </Link>







                {/* DESKTOP MENU */}


                <div className="
                    hidden
                    md:flex
                    items-center
                    gap-8
                ">



                    {
                        navLinks.map((link)=>(


                            <NavLink

                                key={link.path}

                                to={link.path}

                                className={({isActive})=>

                                    `
                                    font-medium
                                    transition
                                    ${
                                        isActive

                                        ?

                                        "text-indigo-600 border-b-2 border-indigo-600 pb-1"

                                        :

                                        "text-gray-600 hover:text-indigo-600"

                                    }
                                    `

                                }

                            >

                                {link.name}


                            </NavLink>


                        ))
                    }







                    <div className="
                        flex
                        items-center
                        gap-3
                    ">


                        <UserCircle
                            className="
                                text-indigo-600
                            "
                        />



                        <span className="
                            font-semibold
                            text-gray-700
                        ">

                            {
                                user?.full_name ||
                                "Candidate"
                            }


                        </span>


                    </div>







                    <button

                        onClick={handleLogout}

                        className="
                            flex
                            items-center
                            gap-2
                            bg-red-600
                            hover:bg-red-700
                            text-white
                            px-4
                            py-2
                            rounded-lg
                            transition
                        "

                    >

                        <LogOut size={18}/>

                        Logout


                    </button>



                </div>









                {/* MOBILE BUTTON */}


                <button

                    onClick={()=>
                        setOpen(!open)
                    }

                    className="
                        md:hidden
                        text-gray-700
                    "

                >

                    {
                        open

                        ?

                        <X size={28}/>

                        :

                        <Menu size={28}/>

                    }


                </button>




            </div>









            {/* MOBILE MENU */}


            {
                open && (


                    <div className="
                        md:hidden
                        px-6
                        pb-6
                        space-y-4
                    ">



                        {
                            navLinks.map((link)=>(


                                <NavLink

                                    key={link.path}

                                    to={link.path}

                                    onClick={()=>
                                        setOpen(false)
                                    }

                                    className="
                                        block
                                        text-gray-700
                                        font-medium
                                        hover:text-indigo-600
                                    "

                                >

                                    {link.name}


                                </NavLink>


                            ))
                        }






                        <div className="
                            flex
                            items-center
                            gap-3
                            pt-3
                            border-t
                        ">


                            <UserCircle
                                className="text-indigo-600"
                            />


                            <span className="font-semibold">

                                {
                                    user?.full_name ||
                                    "Candidate"
                                }

                            </span>


                        </div>







                        <button

                            onClick={handleLogout}

                            className="
                                w-full
                                flex
                                justify-center
                                items-center
                                gap-2
                                bg-red-600
                                text-white
                                py-3
                                rounded-xl
                            "

                        >

                            <LogOut size={18}/>

                            Logout


                        </button>




                    </div>


                )
            }



        </nav>


    );


}