import { createContext,useState } from "react";  


export const AuthContext = createContext()


export const AuthProvider = ({children}) => {
     
    const[user,setUser] = useState(null)
    const[loading,setLoading] = useState(false)  // on production it's value is true ,we have to hydrate the user

    return (
        <AuthContext.Provider value = {{user,setUser,loading,setLoading}} >
            {children}
        </AuthContext.Provider>
    )


}