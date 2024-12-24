import { createContext, useContext, useEffect, useState } from "react";

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export default function AppProvider({ children }) {
    const [isNavActive, setIsNavActive] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userLocal = localStorage.getItem("token");
        if(userLocal != null) {
            setUser(userLocal);
        }
    }, []);

    return (
        <AppContext.Provider value={{isNavActive, setIsNavActive, user, setUser}}>
            {children}
        </AppContext.Provider>
    );
}