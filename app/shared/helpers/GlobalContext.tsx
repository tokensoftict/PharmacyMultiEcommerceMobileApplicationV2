import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of your global data
interface GlobalState {
    checkoutButton: boolean;
    setCheckoutButton: (checkoutButton: boolean) => void;
    cartCount: number;
    setCartCount: (count: number) => void;
    cartTotal: string;
    setCartTotal: (total: string) => void;
    currentRoute: string | null;
    setCurrentRoute: (route: string | null) => void;
    isWholesalesFloatingCartEnabled: boolean;
    setWholesalesFloatingCartEnabled: (enabled: boolean) => void;
    isSupermarketFloatingCartEnabled: boolean;
    setSupermarketFloatingCartEnabled: (enabled: boolean) => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [checkoutButton, setCheckoutButton] = useState<boolean>(false);
    const [cartCount, setCartCount] = useState<number>(0);
    const [cartTotal, setCartTotal] = useState<string>("0.00");
    const [currentRoute, setCurrentRoute] = useState<string | null>(null);
    const [isWholesalesFloatingCartEnabled, setWholesalesFloatingCartEnabledState] = useState<boolean>(false);
    const [isSupermarketFloatingCartEnabled, setSupermarketFloatingCartEnabledState] = useState<boolean>(false);

    useEffect(() => {
        // Load settings from storage
        const loadSettings = async () => {
            try {
                const wholesalesEnabled = await AsyncStorage.getItem('wholesalesFloatingCart');
                const supermarketEnabled = await AsyncStorage.getItem('supermarketFloatingCart');
                
                if (wholesalesEnabled !== null) setWholesalesFloatingCartEnabledState(JSON.parse(wholesalesEnabled));
                if (supermarketEnabled !== null) setSupermarketFloatingCartEnabledState(JSON.parse(supermarketEnabled));
            } catch (e) {
                console.error("Failed to load floating cart settings", e);
            }
        };
        loadSettings();
    }, []);

    const setWholesalesFloatingCartEnabled = async (enabled: boolean) => {
        setWholesalesFloatingCartEnabledState(enabled);
        await AsyncStorage.setItem('wholesalesFloatingCart', JSON.stringify(enabled));
    };

    const setSupermarketFloatingCartEnabled = async (enabled: boolean) => {
        setSupermarketFloatingCartEnabledState(enabled);
        await AsyncStorage.setItem('supermarketFloatingCart', JSON.stringify(enabled));
    };


    return (
        // @ts-ignore
        <GlobalContext.Provider value={{ 
            checkoutButton, setCheckoutButton, 
            cartCount, setCartCount, 
            cartTotal, setCartTotal, 
            currentRoute, setCurrentRoute,
            isWholesalesFloatingCartEnabled, setWholesalesFloatingCartEnabled,
            isSupermarketFloatingCartEnabled, setSupermarketFloatingCartEnabled
        }}>
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
