import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";

import { useAuth } from "../context/AuthContext";


function Login() {


    const navigate = useNavigate();

    const { login } = useAuth();



    const [email,setEmail] = useState("");

    const [password,setPassword] = useState("");

    const [loading,setLoading] = useState(false);

    const [error,setError] = useState("");





    const handleSubmit = async(e)=>{


        e.preventDefault();


        setError("");



        if(!email || !password){

            setError(
                "Please enter email and password."
            );

            return;

        }




        try{


            setLoading(true);



            await login({

                email,
                password

            });



            navigate("/dashboard");



        }
        catch(err){


            console.error(
                "Login Error:",
                err
            );


            setError(

                err.response?.data?.detail ||
                "Invalid email or password."

            );


        }
        finally{


            setLoading(false);


        }


    };





    return (

        <AuthLayout

            title="Welcome Back 👋"

            subtitle="Login to continue your AI interview journey"

        >



            <form

                onSubmit={handleSubmit}

                className="space-y-5"

            >



                {
                    error && (

                        <div className="
                            bg-red-50
                            text-red-600
                            p-3
                            rounded-xl
                            text-sm
                            font-medium
                        ">

                            ⚠️ {error}

                        </div>

                    )
                }




                <AuthInput

                    icon={Mail}

                    type="email"

                    placeholder="Email address"

                    value={email}

                    onChange={(e)=>
                        setEmail(e.target.value)
                    }

                />




                <AuthInput

                    icon={Lock}

                    type="password"

                    placeholder="Password"

                    value={password}

                    onChange={(e)=>
                        setPassword(e.target.value)
                    }

                />





                <div className="
                    flex
                    justify-between
                    items-center
                    text-sm
                ">


                    <label className="
                        flex
                        gap-2
                        items-center
                        text-gray-600
                    ">


                        <input
                            type="checkbox"
                            className="rounded"
                        />


                        Remember me


                    </label>




                    <button

                        type="button"

                        className="
                            text-indigo-600
                            hover:underline
                        "

                    >

                        Forgot Password?

                    </button>



                </div>





                <button

                    disabled={loading}

                    className="
                        w-full
                        rounded-xl
                        bg-indigo-600
                        py-3
                        text-white
                        font-semibold
                        transition
                        hover:bg-indigo-700
                        disabled:opacity-50
                    "

                >


                    {
                        loading

                        ?

                        "Logging in..."

                        :

                        "Login"

                    }



                </button>





                <p className="
                    text-center
                    text-gray-600
                    text-sm
                ">


                    Don't have an account?


                    <Link

                        to="/signup"

                        className="
                            ml-1
                            text-indigo-600
                            font-semibold
                        "

                    >

                        Sign up

                    </Link>



                </p>




            </form>



        </AuthLayout>


    );


}


export default Login;