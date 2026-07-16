import { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import { useAuth } from "../context/AuthContext";


function Signup() {

    const navigate = useNavigate();

    const { signup } = useAuth();


    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });


    const [loading, setLoading] = useState(false);



    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };



    const handleSubmit = async (e) => {

        e.preventDefault();


        if(formData.password !== formData.confirmPassword){
            alert("Passwords do not match");
            return;
        }


        try {

            setLoading(true);


            await signup({
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password,
            });


            navigate("/login");


        } catch(error){

            console.log(error);

        }
        finally{

            setLoading(false);

        }

    };



    return (

        <AuthLayout
            title="Create Account 🚀"
            subtitle="Start your AI interview preparation journey"
        >


            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >


                <AuthInput
                    icon={User}
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={handleChange}
                    name="full_name"
                />


                <AuthInput
                    icon={Mail}
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                />



                <AuthInput
                    icon={Lock}
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    name="password"
                />



                <AuthInput
                    icon={Lock}
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    name="confirmPassword"
                />



                <label className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-gray-600
                ">

                    <input
                        type="checkbox"
                        required
                    />

                    I agree to Terms & Conditions

                </label>




                <button
                    disabled={loading}
                    className="
                        w-full
                        rounded-xl
                        bg-indigo-600
                        py-3
                        text-white
                        font-semibold
                        hover:bg-indigo-700
                        transition
                        disabled:opacity-50
                    "
                >

                    {
                        loading
                        ? "Creating Account..."
                        : "Create Account"
                    }

                </button>



                <p className="
                    text-center
                    text-sm
                    text-gray-600
                ">

                    Already have an account?

                    <Link
                        to="/login"
                        className="
                            ml-1
                            text-indigo-600
                            font-semibold
                        "
                    >
                        Login
                    </Link>

                </p>



            </form>


        </AuthLayout>

    );
}


export default Signup;