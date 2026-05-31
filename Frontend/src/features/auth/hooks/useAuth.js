import { useEffect } from "react";
import { useAuthContext } from "../auth.context";
import { login, register, logout, getMe }  from "../services/auth.api";


export const useAuth = () =>{

    const {user,setUser,loading,setLoading} = useAuthContext()


    const handleLogin = async({email,password}) =>{
        setLoading(true)
        try{
        const data = await login({ email, password })
        setUser(data.user)
        }
        catch{

        }
        finally {
                setLoading(false)
            }


    }

    const handleRegister = async ({ username, email, password }) =>{
        setLoading(true)
        try{
        const data = await register({ username, email, password})
        setUser(data.user)
        }

        catch(err){

        }

        finally {
        setLoading(false)
        }
    }

    const handleLogout = async () =>{
        setLoading(true)
        try{
        const data = await logout()
        setUser(null)
        }
        catch(err){

        }
        finally{
        setLoading(false)
        }
    }

    return {user,loading,handleRegister,handleLogin,handleLogout}

}