// PopupProvider.tsx
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { Modal, View, TouchableOpacity, Image, StyleSheet, Animated, Easing, ActivityIndicator } from "react-native";
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
    const [allPopups, setAllPopups] = useState<PopupData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visible, setVisible] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const currentPopup = allPopups[currentIndex];
    const popUpService = new PopupService();
    const navigation = useNavigation<NavigationProps>();

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (imageLoading) {
            // Fallback: forcefully hide spinner after 3 seconds if RN fails to fire onLoadEnd
            timeout = setTimeout(() => setImageLoading(false), 3000);
        }
        return () => clearTimeout(timeout);
    }, [imageLoading]);

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
            setAllPopups(data);
            return data; // return fetched popups
        } else {
            setAllPopups([]);
            return [];
        }
    };

    const handleInteraction = () => {
        animateOut(() => {
            setVisible(false);
        });
    };

    const handleNext = () => {
        if (currentIndex < allPopups.length - 1) {
            setImageLoading(true);
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setImageLoading(true);
            setCurrentIndex(prev => prev - 1);
        }
    };

    const startPopups = useCallback(() => {

        if (timerRef.current) clearTimeout(timerRef.current);

        fetchPopups().then((fetched) => {
            if (fetched.length === 0) return;

            // wait 5s before first popup
            timerRef.current = setTimeout(() => {
                setCurrentIndex(0);
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

        if (currentPopup.link && currentPopup.link.page) {
            // @ts-ignore
            navigation.navigate(currentPopup.link.page, currentPopup.link.extraData);
        }
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
                            <View style={styles.imageContainer}>
                                {imageLoading && (
                                    <ActivityIndicator size="large" color="#d9534f" style={styles.loader} />
                                )}
                                <Image
                                    key={currentIndex}
                                    source={{ uri: currentPopup.image }}
                                    style={[styles.image, { opacity: imageLoading ? 0 : 1 }]}
                                    resizeMode="contain"
                                    onLoadStart={() => setImageLoading(true)}
                                    onLoad={() => setImageLoading(false)}
                                    onLoadEnd={() => setImageLoading(false)}
                                    onError={() => setImageLoading(false)}
                                />
                            </View>
                        )}
                        <Typography style={styles.title}>{currentPopup?.title}</Typography>
                        <Typography style={styles.message}>{currentPopup?.message}</Typography>
                        <TouchableOpacity style={styles.button} onPress={handleCTAClick}>
                            <Typography style={styles.buttonText}>{currentPopup?.cta || "Close"}</Typography>
                        </TouchableOpacity>

                        {allPopups.length > 1 && (
                            <View style={styles.navContainer}>
                                <TouchableOpacity
                                    style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
                                    onPress={handlePrev}
                                    disabled={currentIndex === 0}
                                >
                                    <Typography style={styles.navButtonText}>{"< Prev"}</Typography>
                                </TouchableOpacity>

                                <Typography style={styles.pageText}>
                                    {currentIndex + 1} / {allPopups.length}
                                </Typography>

                                <TouchableOpacity
                                    style={[styles.navButton, currentIndex === allPopups.length - 1 && styles.navButtonDisabled]}
                                    onPress={handleNext}
                                    disabled={currentIndex === allPopups.length - 1}
                                >
                                    <Typography style={styles.navButtonText}>{"Next >"}</Typography>
                                </TouchableOpacity>
                            </View>
                        )}
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
    imageContainer: {
        width: "100%",
        height: normalize(180),
        marginBottom: normalize(15),
        justifyContent: "center",
        alignItems: "center",
    },
    loader: {
        position: "absolute",
        zIndex: 1,
    },
    image: {
        width: "100%",
        height: "100%",
        zIndex: 2,
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
        fontWeight: "bold",
    },
    navContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginTop: normalize(20),
        paddingTop: normalize(15),
        borderTopWidth: 1,
        borderTopColor: "#EEE",
    },
    navButton: {
        backgroundColor: "#F0F0F0",
        paddingVertical: normalize(8),
        paddingHorizontal: normalize(15),
        borderRadius: normalize(20),
    },
    navButtonDisabled: {
        opacity: 0.5,
    },
    navButtonText: {
        color: "#333",
        fontSize: normalize(13),
        fontWeight: "bold",
    },
    pageText: {
        color: "#888",
        fontSize: normalize(12),
        fontWeight: "500",
    },
});
