import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api.js";
import toast from "react-hot-toast"

const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);

    const login = async (email, password) => {
        try {
            setLoading(true)
            const res = await api.post("/auth/login", {email, password})
            const {token : userToken, ...userData} = res.data

            localStorage.setItem("token", userToken)
            setToken(userToken)
            setUser(userData)
            toast.success(`Welcome back ${userData.name}`)
            return true
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message)
            return false
        }finally{
            setLoading(false)
        }
    };

    const register = async (name, email, password, phone, role) => {
        try {
            setLoading(true)
            const res = await api.post("/auth/register", {name, email, password, phone, role})
            const {token : userToken, ...userData} = res.data

            localStorage.setItem("token", userToken)
            setToken(userToken)
            setUser(userData)
            toast.success(`Welcome to DineNow`)
            return true
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message)
            return false
        }finally{
            setLoading(false)
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        window.location.href = "/"; //set the current url to /, basically reloading the page and go to home page
    };

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const res = await api.get('/auth/me')
                    setUser(res.data)
                } catch (error) {
                    toast.error(error?.response?.data?.message || error?.message)
                    logout()
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAuthModalOpen,
        setAuthModalOpen,
        login,
        register,
        logout,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within AppContextProvider");
    }
    return context;
};