import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native"; // Install it if you haven't: npm install lottie-react-native
import {styles} from './styles';
import Typography from "@/shared/component/typography";

const StorePendingApproval = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Image source={require("@/assets/images/store-waiting.jpg")} style={styles.image} />

            <Typography style={styles.title}>Your Business is Under Review! 🚀</Typography>

            <Typography style={styles.description}>
                Our team is currently reviewing your Business. Once approved, you’ll receive a notification and can start purchasing goods at wholesale prices.
            </Typography>

            {/* Animated Loader */}
            <LottieView
                source={require("@/assets/pending.json")}
                autoPlay
                loop
                style={styles.loader}
            />

            {/* Go Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
                <Typography style={styles.buttonText}>🔙 Go Back</Typography>
            </TouchableOpacity>
        </View>
    );
};

export default StorePendingApproval;
