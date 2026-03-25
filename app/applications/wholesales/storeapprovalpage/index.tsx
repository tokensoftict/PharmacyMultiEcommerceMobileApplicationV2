import React, { useState } from "react";
import { View, Image, TouchableOpacity} from "react-native";
import {styles} from './styles';
import Typography from "@/shared/component/typography";

const StoreApproved = ({ navigation } : any) => {
    return (
        <View style={styles.container}>
            {/* Success Illustration */}
            <Image source={require("@/assets/images/store-approved.jpg")} style={styles.image} />

            {/* Success Message */}
            <Typography style={styles.title}>🎉 Your Business as been Approved!</Typography>
            <Typography style={styles.subtitle}>
                Congratulations! Your Business has been successfully approved. You can now start selling and enjoy wholesale benefits.
            </Typography>

            {/* Proceed Button */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("wholesales")}>
                <Typography style={styles.buttonText}>Start Buying at Wholesale Prices</Typography>
            </TouchableOpacity>
        </View>
    );
};
