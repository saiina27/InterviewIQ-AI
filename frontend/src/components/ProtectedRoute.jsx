import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function ProtectedRoute({ children }) {


    const { user, loading } = useAuth();

    const location = useLocation();



    if (loading) {


        return (

            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-slate-100
            ">


                <div className="
                    bg-white
                    shadow-xl
                    rounded-3xl
                    p-8
                    text-center
                ">


                    <h2 className="
                        text-2xl
                        font-bold
                        text-indigo-600
                    ">

                        Loading InterviewIQ AI...

                    </h2>


                </div>


            </div>

        );


    }




    if (!user) {


        return (

            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname
                }}
            />

        );


    }



    return children;


}


export default ProtectedRoute;