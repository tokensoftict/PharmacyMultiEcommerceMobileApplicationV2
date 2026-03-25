import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of your global data
interface GlobalState {
    checkoutButton: boolean;
    setCheckoutButton: (checkoutButton: boolean) => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [checkoutButton, setCheckoutButton] = useState<boolean>(false);


    return (
        // @ts-ignore
        <GlobalContext.Provider value={{ checkoutButton, setCheckoutButton }}>
            {children}
        </GlobalContext.Provider>
    );
};

// Custom hook for easy access
export const useGlobal = () => {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("useGlobal must be used within a GlobalProvider");
    return context;
};
