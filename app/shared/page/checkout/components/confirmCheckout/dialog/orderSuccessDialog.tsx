import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Vibration, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import SoundPlayer from 'react-native-sound-player'
import ModalComponent from "react-native-modal";
import Typography from "@/shared/component/typography";
import { normalize } from "@/shared/helpers";
import { FONT } from "@/shared/constants/fonts";
import { semantic } from "@/shared/constants/colors";

// @ts-ignore
const OrderSuccessDialog = ({ visible, onClose, onViewOrder }) => {

    const animationRef = useRef(null);

    useEffect(() => {
        if (visible) {
            // @ts-ignore
            animationRef.current?.play()

            // Play success sound
            try {
                SoundPlayer.playAsset(require("@/assets/success.mp3"))
            } catch (e) {

            }

            // Vibrate the phone
            Vibration.vibrate(500); // Standard vibration
        }
    }, [visible]);

    return (
        <ModalComponent isVisible={visible} animationIn="zoomIn" animationOut="zoomOut">
            <View style={styles.container}>

                <LottieView
                    ref={animationRef}
                    source={require("@/assets/confetti.json")}
                    autoPlay
                    loop={true}
                    style={styles.animation}
                />


                <Typography style={styles.emoji}>🎉😊</Typography>


                <Typography style={styles.text}>Order Placed!</Typography>
                <Typography style={styles.subText}>Your order has been received and is being processed by our team.</Typography>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.viewOrderButton} onPress={onViewOrder}>
                        <Typography style={styles.viewOrderText}>View Order Details</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Typography style={styles.closeText}>Back to Home</Typography>
                    </TouchableOpacity>
                </View>
            </View>
        </ModalComponent>
    );

};

const styles = StyleSheet.create({
    container: {
        width: "90%",
        backgroundColor: "white",
        padding: normalize(24),
        borderRadius: normalize(24),
        alignItems: "center",
        alignSelf: "center",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    animation: {
        width: normalize(240),
        height: normalize(240),
    },
    emoji: {
        fontSize: normalize(40),
        marginBottom: normalize(16),
    },
    text: {
        fontSize: normalize(22),
        fontFamily: FONT.BOLD,
        color: '#1A1D1E',
        textAlign: 'center',
        marginBottom: normalize(8),
    },
    subText: {
        fontSize: normalize(14),
        fontFamily: FONT.MEDIUM,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: normalize(32),
    },
    buttonContainer: {
        width: '100%',
        gap: normalize(12),
    },
    viewOrderButton: {
        backgroundColor: semantic.alert.danger.d500,
        paddingVertical: normalize(16),
        width: '100%',
        borderRadius: normalize(16),
        alignItems: 'center',
        shadowColor: semantic.alert.danger.d500,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    closeButton: {
        backgroundColor: 'transparent',
        paddingVertical: normalize(16),
        width: '100%',
        borderRadius: normalize(16),
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    viewOrderText: {
        color: "white",
        fontSize: normalize(16),
        fontFamily: FONT.BOLD,
    },
    closeText: {
        color: "#475569",
        fontSize: normalize(16),
        fontFamily: FONT.BOLD,
    },
});

export default OrderSuccessDialog;
