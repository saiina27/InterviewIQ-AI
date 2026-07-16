import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function AuthInput({
    icon: Icon,
    type = "text",
    placeholder,
    value,
    onChange,
    name,
}) {

    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";


    return (

        <div className="relative">


            <Icon
                size={20}
                className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                "
            />



            <input

                name={name}

                type={
                    isPassword && showPassword
                    ? "text"
                    : type
                }

                placeholder={placeholder}

                value={value}

                onChange={onChange}

                className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    py-3
                    pl-12
                    pr-12
                    text-gray-800
                    outline-none
                    transition
                    focus:border-indigo-500
                    focus:ring-2
                    focus:ring-indigo-200
                "

            />



            {
                isPassword && (

                    <button

                        type="button"

                        onClick={() =>
                            setShowPassword(!showPassword)
                        }

                        className="
                            absolute
                            right-4
                            top-1/2
                            -translate-y-1/2
                            text-gray-400
                        "

                    >

                        {
                            showPassword
                            ?
                            <EyeOff size={20}/>
                            :
                            <Eye size={20}/>
                        }

                    </button>

                )
            }


        </div>

    );
}


export default AuthInput;