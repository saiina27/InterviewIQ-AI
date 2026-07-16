import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();


export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        async function loadUser() {

            const token = localStorage.getItem("token");


            if (!token) {
                setLoading(false);
                return;
            }


            try {

                const res = await api.get("/auth/me");

                setUser(res.data);


            } catch (err) {

                localStorage.removeItem("token");

                setUser(null);


            } finally {

                setLoading(false);

            }

        }


        loadUser();

    }, []);



    const login = async ({ email, password }) => {


        const formData = new URLSearchParams();


        formData.append(
            "username",
            email
        );


        formData.append(
            "password",
            password
        );



        const res = await api.post(
            "/auth/login",
            formData,
            {
                headers: {
                    "Content-Type":
                    "application/x-www-form-urlencoded",
                },
            }
        );



        localStorage.setItem(
            "token",
            res.data.access_token
        );



        const userRes = await api.get(
            "/auth/me"
        );


        setUser(userRes.data);

    };




    const signup = async ({
        full_name,
        email,
        password
    }) => {


        const res = await api.post(
            "/auth/signup",
            {
                full_name,
                email,
                password,
            }
        );


        return res.data;

    };





    const logout = () => {

        localStorage.removeItem("token");

        setUser(null);

    };




    return (

        <AuthContext.Provider

            value={{
                user,
                setUser,
                login,
                signup,
                logout,
                loading,
            }}

        >

            {children}

        </AuthContext.Provider>

    );

}




export function useAuth() {

    return useContext(AuthContext);

}