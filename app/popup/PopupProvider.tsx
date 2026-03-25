// PopupProvider.tsx
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { Modal, View, TouchableOpacity, Image, StyleSheet, Animated, Easing } from "react-native";
import Typography from "@/shared/component/typography";
import { normalize } from "@/shared/helpers";
import PopupService from "@/popup/PopupService.ts";
import Environment from "@/shared/utils/Environment.tsx";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";

interface PopupData {
    id: number;
    type: string;
    title: string;
    message: string;
    image?: string | null;
    cta: string;
    link: link;
    application: string;
    show: boolean
}

interface link {
    page: string;
    extraData: any;
}


interface PopupContextType {
    startPopups: () => void;
}

const PopupContext = createContext<PopupContextType>({ startPopups: () => { } });
export const usePopup = () => useContext(PopupContext);

export const PopupProvider = ({ children }: { children: React.ReactNode }) => {
    const [remainingPopups, setRemainingPopups] = useState<PopupData[]>([]);
    const [currentPopup, setCurrentPopup] = useState<PopupData | null>(null);
    const [visible, setVisible] = useState(false);
    const popUpService = new PopupService();
    const navigation = useNavigation<NavigationProps>();

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // animation
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const animateIn = () => {
        Animated.parallel([
            Animated.timing(scaleAnim, { toValue: 1, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true })
        ]).start();
    };

    const animateOut = (cb?: () => void) => {
        Animated.parallel([
            Animated.timing(scaleAnim, { toValue: 0.8, duration: 200, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true })
        ]).start(() => cb?.());
    };

    const fetchPopups = async () => {
        const res = await popUpService.getPopups();
        if (res.data.status === true) {
            // @ts-ignore
            const data = res.data.data.filter((item) => item.application === Environment.getEnvironment())
            setRemainingPopups(data);
            return data; // return fetched popups
        } else {
            setRemainingPopups([]);
            return [];
        }
    };

    const showRandomPopup = useCallback(() => {
        // filter only not-shown popups
        const notShownPopups = remainingPopups.filter((item) => !item.show);

        if (notShownPopups.length === 0) return;

        const randomIndex = Math.floor(Math.random() * notShownPopups.length);
        const selected = notShownPopups[randomIndex];

        // mark selected popup as shown
        setRemainingPopups((prev) =>
            prev.map((p) =>
                p.id === selected.id ? { ...p, show: true } : p
            )
        );


        setCurrentPopup(selected);
        setVisible(true);
        animateIn();
    }, [remainingPopups]);

    const scheduleNextPopup = () => {
        if (timerRef.current) clearTimeout(timerRef.current);

        if (remainingPopups.length === 0) return;

        // random delay between 10s – 30s
        const delay = Math.floor(Math.random() * (30000 - 10000 + 1)) + 10000;

        timerRef.current = setTimeout(() => {
            showRandomPopup();
        }, delay);
    };

    const handleInteraction = () => {
        if (!currentPopup) return;

        animateOut(() => {
            setVisible(false);

            // remove popup from list
            setRemainingPopups(prev => prev.filter(p => p.id !== currentPopup.id));

            // reset current
            setCurrentPopup(null);

            // schedule next popup
            scheduleNextPopup();
        });
    };

    const startPopups = useCallback(() => {

        if (timerRef.current) clearTimeout(timerRef.current);

        fetchPopups().then((fetched) => {
            if (fetched.length === 0) return;

            // wait 5s before first popup
            timerRef.current = setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * fetched.length);
                const selected = fetched[randomIndex];
                setCurrentPopup(selected);
                setRemainingPopups((prev) =>
                    prev.map((p) =>
                        p.id === selected.id ? { ...p, show: true } : p
                    )
                );
                setVisible(true);
                animateIn();
            }, 5000);
        });
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const handleCTAClick = () => {
        if (!currentPopup) return;

        handleInteraction();

        // @ts-ignore
        navigation.navigate(currentPopup.link.page, currentPopup.link.extraData)
    }

    return (
        <PopupContext.Provider value={{ startPopups }}>
            {children}

            <Modal transparent animationType="none" visible={visible} onRequestClose={handleInteraction}>
                <View style={styles.overlay}>
                    <Animated.View style={[styles.popup, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
                        <TouchableOpacity style={styles.closeButton} onPress={handleInteraction}>
                            <Typography style={styles.closeButtonText}>×</Typography>
                        </TouchableOpacity>

                        {currentPopup?.image && (
                            <Image source={{ uri: currentPopup.image }} style={styles.image} resizeMode="contain" />
                        )}
                        <Typography style={styles.title}>{currentPopup?.title}</Typography>
                        <Typography style={styles.message}>{currentPopup?.message}</Typography>
                        <TouchableOpacity style={styles.button} onPress={handleCTAClick}>
                            <Typography style={styles.buttonText}>{currentPopup?.cta || "Close"}</Typography>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>
        </PopupContext.Provider>
    );
};

const styles = StyleSheet.create({
    closeButton: {
        position: "absolute",
        top: normalize(10),
        right: normalize(10),
        zIndex: 10,
        width: normalize(28),
        height: normalize(28),
        borderRadius: normalize(14),
        backgroundColor: "rgba(0,0,0,0.1)",
        justifyContent: "center",
        alignItems: "center",
    },
    closeButtonText: {
        fontSize: normalize(20),
        color: "#333",
        marginTop: -2,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    popup: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: normalize(12),
        padding: normalize(20),
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },
    image: {
        width: "100%",
        height: normalize(180),
        marginBottom: normalize(15),
    },
    title: {
        fontSize: normalize(18),
        marginBottom: normalize(8),
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
        borderRadius: normalize(6),
    },
    buttonText: {
        color: "#fff",

    },
});
