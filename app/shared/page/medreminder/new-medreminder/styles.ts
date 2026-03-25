import { StyleSheet } from "react-native";
import { normalize } from "@/shared/helpers";
import { semantic } from "@/shared/constants/colors.ts";

export const styles = StyleSheet.create({

    label: {
        fontSize: normalize(16),

        marginBottom: normalize(10),
        color: '#333',
    },
    timeSlot: {
        borderRadius: normalize(8),
        borderWidth: normalize(1),
        borderColor: '#d32f2f',
        marginBottom: normalize(10),
        alignItems: 'center',
        width: '50%'
    },
    selectedTimeSlot: {
        backgroundColor: '#d32f2f',
    },
    timeSlotText: {
        fontSize: normalize(13),
        color: '#d32f2f',
    },
    item: {
        fontSize: normalize(18),
        borderStyle: 'solid',
        paddingVertical: normalize(7),
    },
})
