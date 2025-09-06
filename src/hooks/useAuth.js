import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { loginService } from "../Service/AuthenticationServices/auth"
const AuthContext = createContext();

export const AuthProvider = ({ children, userData }) => {
    const [user, setUser] = useLocalStorage("user", userData);
    const navigate = useNavigate();
    // eslint-disable-next-line
    const login = async (data) => {
        var result = await loginService(data);
        if (result.status) {
            setUser(result.response.user);
            localStorage.setItem("token", result.response.token);

            setTimeout(() => {
                console.log("NAVIGATION TRIGGER - Redirecting to /home");
                window.location.reload();
            }, 100);
        } else {
            return result;
        }
        // if (result.status) {
        //     setUser(result.response.user)
        //     localStorage.setItem('token', result.response.token)
            
        //     setTimeout(() => {
        //         console.log("NAVIGATION TRIGGER")
        //         navigate("/", { replace: true });
        //     }, 100);
        // }
        // else {
        //     return result;
        // }
    };
    // eslint-disable-next-line
    const logout = async () => {
        setUser(null);
        localStorage.clear();
        navigate("/", { replace: true });
    };
    // eslint-disable-next-line
    const value = useMemo(
        () => ({
            user,
            login,
            logout
        }), // eslint-disable-next-line
        [user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
