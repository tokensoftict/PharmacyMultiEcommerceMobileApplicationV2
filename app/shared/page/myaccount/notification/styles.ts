import { StyleSheet } from "react-native";
import { normalize } from "@/shared/helpers";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: normalize(24),
    },
    title: {

        fontSize: normalize(16)
    },
    body: {
        marginTop: normalize(5)
    },
    zeroContainer: {
        flex: 1,
        paddingHorizontal: normalize(15),
        justifyContent: 'center',
    },
})
