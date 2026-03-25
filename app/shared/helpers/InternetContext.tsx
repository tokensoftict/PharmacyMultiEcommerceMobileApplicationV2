// InternetProvider.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import NetInfo from "@react-native-community/netinfo";
import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
import Typography from "@/shared/component/typography";
import { normalize } from "@/shared/helpers/index.ts";
import { setInternetContext } from "@/network/internet/internetContextBridge.ts";


interface InternetContextType {
    isConnected: boolean;
    showDialog: () => void;
    hideDialog: () => void;
    showErrorDialog: (options: { title: string; message: string; onRetry?: () => void }) => void;
    hideErrorDialog: () => void;
}

export const InternetContext = createContext<InternetContextType>({
    isConnected: true,
    showDialog: () => { },
    hideDialog: () => { },
    showErrorDialog: () => { },
    hideErrorDialog: () => { },
});

export const useInternet = () => useContext(InternetContext);

const NoInternetDialog = ({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) => {
    if (!visible) return null;

    return (
        <Modal transparent animationType="fade" visible={visible} statusBarTranslucent>
            <View style={styles.overlay}>
                <View style={styles.dialog}>
                    <Typography style={styles.title}>Connection Issue</Typography>
                    <Typography style={styles.message}>
                        We're having trouble connecting. Please check your network and try again.
                    </Typography>
                    <TouchableOpacity onPress={onDismiss} style={styles.button}>
                        <Typography style={styles.buttonText}>Okay</Typography>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const GenericErrorDialog = ({ visible, title, message, onRetry, onDismiss }: { visible: boolean; title: string, message: string, onRetry?: () => void, onDismiss: () => void }) => {
    if (!visible) return null;

    return (
        <Modal transparent animationType="fade" visible={visible} statusBarTranslucent>
            <View style={styles.overlay}>
                <View style={styles.dialog}>
                    <Typography style={styles.title}>{title}</Typography>
                    <Typography style={styles.message}>{message}</Typography>
                    <View style={{ flexDirection: 'row', gap: normalize(10) }}>
                        {onRetry && (
                            <TouchableOpacity onPress={() => { onRetry(); onDismiss(); }} style={[styles.button, { backgroundColor: '#5cb85c' }]}>
                                <Typography style={styles.buttonText}>Try Again</Typography>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={onDismiss} style={styles.button}>
                            <Typography style={styles.buttonText}>Close</Typography>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export const InternetProvider = ({ children }: { children: React.ReactNode }) => {
    const [isConnected, setIsConnected] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [errorDialogVisible, setErrorDialogVisible] = useState(false);
    const [errorOptions, setErrorOptions] = useState<{ title: string; message: string; onRetry?: () => void }>({
        title: "Error",
        message: "An unexpected error occurred."
    });

    useEffect(() => {
        // First fetch actual connection state
        NetInfo.fetch().then(state => {
            if (state.isConnected && state.isInternetReachable !== false) {
                setIsConnected(true);
            } else {
                setIsConnected(false);
                setDialogVisible(true);
            }
        });

        // Listen for changes
        const unsubscribe = NetInfo.addEventListener(state => {
            const connected = state.isConnected && state.isInternetReachable !== false;
            setIsConnected(!!connected);

            if (!connected) {
                setDialogVisible(true);
            } else {
                setDialogVisible(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const showDialog = useCallback(() => setDialogVisible(true), []);
    const hideDialog = useCallback(() => setDialogVisible(false), []);

    const showErrorDialog = useCallback((options: { title: string; message: string; onRetry?: () => void }) => {
        setErrorOptions(options);
        setErrorDialogVisible(true);
    }, []);

    const hideErrorDialog = useCallback(() => setErrorDialogVisible(false), []);

    // 👇 give axios access to this context
    useEffect(() => {
        setInternetContext({ isConnected, showDialog, hideDialog, showErrorDialog, hideErrorDialog });
    }, [isConnected, showDialog, hideDialog, showErrorDialog, hideErrorDialog]);

    return (
        <InternetContext.Provider value={{ isConnected, showDialog, hideDialog, showErrorDialog, hideErrorDialog }}>
            {children}
            <NoInternetDialog visible={dialogVisible} onDismiss={hideDialog} />
            <GenericErrorDialog
                visible={errorDialogVisible}
                title={errorOptions.title}
                message={errorOptions.message}
                onRetry={errorOptions.onRetry}
                onDismiss={hideErrorDialog}
            />
        </InternetContext.Provider>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    dialog: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: normalize(10),
        padding: normalize(20),
        elevation: normalize(5),
        alignItems: "center",
    },
    title: {
        fontSize: normalize(18),

        marginBottom: normalize(10),
        textAlign: "center",
    },
    message: {
        fontSize: normalize(15),
        textAlign: "center",
        marginBottom: normalize(20),
    },
    button: {
        backgroundColor: "#d9534f",
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(25),
        borderRadius: normalize(5),
    },
    buttonText: {
        color: "#fff",

    },
});
