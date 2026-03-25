import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Animated, Easing, StyleSheet, Dimensions } from "react-native";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import Typography from "@/shared/component/typography";
import { normalize } from "@/shared/helpers";

const { width } = Dimensions.get("window");


const appImages: Record<string, any> = {
    "wholesales": require("@/assets/images/wholesales.jpg"),
    "supermarket": require("@/assets/images/supermarket.jpg"),
    "sales representative": require("@/assets/images/sales_representative.jpg"),
};

// @ts-ignore
const StoreSelectionScreen = ({ navigation }) => {
    const userProfile = (new AuthSessionService().getAuthSession()).data;
    const userApps = userProfile.apps.map(function (app: any) {
        return {
            id: app.name,
            name: app.name,
            image: app.name,
            status: app.info.status,
        };

    });
    const animations = useRef(userApps.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        const animatedSequences = animations.map((anim: any, index: any) =>
            Animated.timing(anim, {
                toValue: 1,
                duration: 800,
                delay: index * 200,
                easing: Easing.bounce,
                useNativeDriver: true,
            })
        );
        Animated.stagger(150, animatedSequences).start();
    }, []);

    function selectStore(store: string, status: boolean) {
        new AuthSessionService().setEnvironment(store)
        if (store === "wholesales" && !status) {
            navigation.navigate("storePendingApproval");
        } else {
            navigation.replace(store)
        }
    }

    return (
        <View style={styles.container}>
            <Image source={require("@/assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
            <Typography style={styles.title}>Explore & Enter Your Marketplace</Typography>
            <View style={styles.storeContainer}>
                {userApps.map((store: any, index: any) => (
                    <Animated.View
                        key={store.id}
                        style={{
                            ...styles.animatedView,
                            opacity: animations[index],
                            transform: [
                                {
                                    translateY: animations[index].interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-50, 0],
                                    }),
                                },
                            ],
                        }}
                    >

                        <TouchableOpacity onPress={() => selectStore(store.id, store.status)} style={styles.storeButton}>
                            <Image source={appImages[store.name]} style={styles.storeImage} resizeMode="contain" />
                            <Typography style={styles.storeText}>{store.name}</Typography>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        padding: normalize(16),
    },
    logo: {
        width: normalize(100),
        height: normalize(100),
        marginBottom: normalize(16),
    },
    title: {
        color: "#d32f2f",
        fontSize: normalize(24),

        marginBottom: normalize(20),
        textTransform: "uppercase",
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: normalize(2), height: normalize(2) },
        textShadowRadius: 4,
        textAlign: "center",
    },
    storeContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 16,
    },
    animatedView: {
        alignItems: "center",
    },
    storeButton: {
        width: width * 0.4,
        height: width * 0.4,
        backgroundColor: "#fff",
        borderRadius: 16,
        shadowColor: "#d32f2f",
        shadowOffset: { width: normalize(0), height: normalize(6) },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 8,
        justifyContent: "center",
        alignItems: "center",
        padding: normalize(12),
        borderWidth: 2,
        borderColor: "#d32f2f",
    },
    storeImage: {
        width: "70%",
        height: "70%",
        marginBottom: normalize(10),
    },
    storeText: {
        color: "#d32f2f",
        fontSize: normalize(16),

        textAlign: "center",
        textTransform: "uppercase",
    },
});

export default StoreSelectionScreen;
