import { Dimensions, StyleSheet } from "react-native";
import { normalize } from "@/shared/helpers";

const { width, height } = Dimensions.get("window");
export const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            paddingTop: normalize(50),
            paddingBottom: normalize(25),
            borderBottomLeftRadius: normalize(30),
            borderBottomRightRadius: normalize(30),
        },
        doseTime: {
            paddingVertical: normalize(5),
            flexDirection: "row",
            alignItems: "center",
        },
        timeText: {
            marginLeft: normalize(5),
            color: "#666",
            fontSize: normalize(14),
        },
        content: {
            flex: 1,
            padding: normalize(20),
            alignItems: "center",
        },
        iconContainer: {
            width: normalize(120),
            height: normalize(120),
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: normalize(60),
            justifyContent: "center",
            alignItems: "center",
            marginBottom: normalize(20),
        },
        title: {
            fontSize: normalize(26),

            color: "white",
            marginBottom: normalize(10),
            textShadowColor: "rgba(0, 0, 0, 0.2)",
            textShadowOffset: { width: normalize(1), height: normalize(1) },
            textShadowRadius: 3,
        },
        subtitle: {
            fontSize: 18,
            color: "rgba(255, 255, 255, 0.9)",
            marginBottom: normalize(40),
            textAlign: "center",
        },
        card: {
            backgroundColor: "white",
            borderRadius: normalize(20),
            padding: normalize(30),
            width: width - normalize(40),
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: normalize(0),
                height: normalize(2),
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: normalize(5),
        },
        welcomeText: {
            fontSize: normalize(20),

            color: "#333",
            textAlign: "center",
            marginBottom: normalize(10),
        },
        instructionText: {
            fontSize: normalize(16),
            color: "#666",
            textAlign: "center",
            marginBottom: normalize(10),
        },
        button: {
            backgroundColor: "#4CAF50",
            paddingVertical: normalize(15),
            paddingHorizontal: normalize(30),
            borderRadius: normalize(12),
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
        },
        buttonDisabled: {
            opacity: 0.7,
        },
        buttonIcon: {
            marginRight: normalize(10),
        },
        buttonText: {
            color: "white",
            fontSize: normalize(16),

        },
        errorContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: normalize(20),
            padding: normalize(10),
            backgroundColor: "#ffebee",
            borderRadius: 8,
        },
        errorText: {
            color: "#f44336",
            marginLeft: normalize(8),
            fontSize: normalize(14),
        },
        headerContent: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: normalize(15),
            paddingHorizontal: normalize(15),
            marginTop: normalize(10)
        },

        titleHeader: {
            fontSize: normalize(15),

            color: 'white',
            width: '80%',
            textAlign: 'center',
            justifyContent: "center",

        },
    }
);
