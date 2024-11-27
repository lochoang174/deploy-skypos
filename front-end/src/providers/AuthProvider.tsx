import { createContext, ReactNode, useState, useEffect } from "react";
import { IAuth } from "../types";

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export interface AuthContextProps {
    auth: IAuth | null;
    setAuth: (auth: IAuth | null) => void;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [auth, setAuth] = useState<IAuth | null>(null);

    // Load auth data from localStorage on initialization
    useEffect(() => {
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth) {
            setAuth(JSON.parse(storedAuth));
        }
    }, []);

    // Save auth data to localStorage whenever it changes
    const handleSetAuth = (auth: IAuth | null) => {
        setAuth(auth);
        if (auth) {
            localStorage.setItem("auth", JSON.stringify(auth));
        } else {
            localStorage.removeItem("auth");
        }
    };

    return <AuthContext.Provider value={{ auth, setAuth: handleSetAuth }}>{children}</AuthContext.Provider>;
};
