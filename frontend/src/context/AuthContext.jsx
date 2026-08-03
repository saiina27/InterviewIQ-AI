import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";


const AuthContext = createContext();



export function AuthProvider({ children }) {


    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);



    useEffect(() => {


        const loadUser = async () => {


            const token = localStorage.getItem("token");


            if(!token){

                setLoading(false);
                return;

            }



            try{


                const res = await api.get("/auth/me");

                setUser(res.data);


            }
            catch(error){


                console.error(
                    "Auth Error:",
                    error
                );


                localStorage.removeItem("token");

                setUser(null);


            }
            finally{

                setLoading(false);

            }


        };


        loadUser();


    }, []);





    const login = async ({
        email,
        password
    }) => {


        const formData =
            new URLSearchParams();


        formData.append(
            "username",
            email
        );


        formData.append(
            "password",
            password
        );



        const response =
            await api.post(
                "/auth/login",
                formData,
                {
                    headers:{
                        "Content-Type":
                        "application/x-www-form-urlencoded"
                    }
                }
            );



        const token =
            response.data.access_token;



        localStorage.setItem(
            "token",
            token
        );



        const userResponse =
            await api.get("/auth/me");



        setUser(
            userResponse.data
        );


        return userResponse.data;


    };





    const signup = async ({
        full_name,
        email,
        password
    }) => {


        const response =
            await api.post(
                "/auth/signup",
                {
                    full_name,
                    email,
                    password
                }
            );


        return response.data;


    };





    const updateUser = (updatedUser)=>{

        setUser(updatedUser);

    };





    const logout = ()=>{


        localStorage.removeItem(
            "token"
        );


        setUser(null);


    };





    return (

        <AuthContext.Provider

            value={{
                user,
                setUser,
                updateUser,
                login,
                signup,
                logout,
                loading
            }}

        >

            {children}

        </AuthContext.Provider>


    );


}






export function useAuth(){

    return useContext(AuthContext);

}