import { normalize } from "@/shared/helpers";
import React, { createContext, useContext, useState } from "react";
import { View, Modal, ActivityIndicator, Platform, Text } from "react-native";
// @ts-ignore
import ProgressDialog from "react-native-progress-dialog";
import Typography from "@/shared/component/typography"; // Android

// Define the type for the loading context
interface LoadingContextType {
    showLoading: (text?: string) => void;
    hideLoading: () => void;
}

// Create Context with an initial undefined value
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("Loading...");

    // Function to show loading
    const showLoading = (text: string = "Loading...") => {
        setLoadingText(text);
        setLoading(true);
    };

    // Function to hide loading
    const hideLoading = () => {
        setLoading(false);
    };

    return (
        <LoadingContext.Provider value={{ showLoading, hideLoading }}>
            {children}

            {/* Native Loading Dialog */}
            {Platform.OS === "android" ? (
                <Modal transparent={true} visible={loading}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <View style={{ padding: normalize(20), backgroundColor: "#fff", borderRadius: 10 }}>
                            <ActivityIndicator size="large" color="#007AFF" />
                            <Typography onPress={() => hideLoading()} style={{ marginTop: normalize(10) }}>{loadingText}</Typography>
                        </View>
                    </View>
                </Modal>
            ) : (
                <Modal transparent={true} visible={loading}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <View style={{ padding: normalize(20), backgroundColor: "#fff", borderRadius: 10 }}>
                            <ActivityIndicator size="large" color="#007AFF" />
                            <Typography onPress={() => hideLoading()} style={{ marginTop: normalize(10) }}>{loadingText}</Typography>
                        </View>
                    </View>
                </Modal>
            )}
        </LoadingContext.Provider>
    );
};

// Custom Hook for easy access (with TypeScript safety)
export const useLoading = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
};
