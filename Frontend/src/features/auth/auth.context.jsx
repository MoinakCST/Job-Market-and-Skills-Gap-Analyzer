import { createContext, useState, useEffect, useContext } from "react";
import { getMe } from "./services/auth.api";  

const AuthContext = createContext()

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within AuthProvider");
    }
    return context;
};

export const AuthProvider = ({children}) => {
     
    const[user,setUser] = useState(null)
    const[loading,setLoading] = useState(true)  // on production it's value is true ,we have to hydrate the user


    useEffect(()=>{
        const getAndSetUser =  async()=>{
            const data = await getMe()
            if(data&&data.user){
            setUser(data.user)
            }
            setLoading(false)
        }

            getAndSetUser()
    },[])

    return (
        <AuthContext.Provider value = {{user,setUser,loading,setLoading}} >
            {children}
        </AuthContext.Provider>
    )

}