import { StyleSheet } from "react-native";
import { normalize } from "@/shared/helpers";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: normalize(20),
    },
    image: {
        width: normalize(150),
        height: normalize(150),
        resizeMode: "contain",
        marginBottom: normalize(20),
    },
    title: {
        fontSize: normalize(22),

        color: "#333",
        textAlign: "center",
        marginBottom: normalize(10),
    },
    description: {
        fontSize: normalize(16),
        color: "#555",
        textAlign: "center",
        marginBottom: normalize(20),
        paddingHorizontal: normalize(15),
    },
    loader: {
        width: normalize(150),
        height: normalize(150),
    },
    button: {
        marginTop: normalize(20),
        backgroundColor: "#FF6347",
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(30),
        borderRadius: normalize(30),
        shadowColor: "#FF6347",
        shadowOffset: { width: normalize(0), height: normalize(3) },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonText: {
        color: "#FFF",
        fontSize: normalize(16),

    },
});
