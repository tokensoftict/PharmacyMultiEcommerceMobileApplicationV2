import { StyleSheet } from "react-native";
import { normalize } from "@/shared/helpers";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9F9F9",
        justifyContent: "center",
        alignItems: "center",
        padding: normalize(20),
    },
    image: {
        width: normalize(180),
        height: normalize(180),
        marginBottom: normalize(20),
    },
    title: {
        fontSize: normalize(24),

        color: "#333",
        textAlign: "center",
    },
    subtitle: {
        fontSize: normalize(16),
        color: "#666",
        textAlign: "center",
        marginVertical: normalize(10),
    },
    button: {
        marginTop: normalize(20),
        backgroundColor: "#007BFF",
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(20),
        borderRadius: normalize(8),
    },
    buttonText: {
        color: "#FFF",
        fontSize: normalize(16),

    },
})
