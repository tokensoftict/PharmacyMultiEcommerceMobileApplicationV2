import ButtonSheet from "@/shared/component/buttonSheet";
import { normalize } from "@/shared/helpers";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import Typography from "@/shared/component/typography";
import React, { useState } from "react";
import { Button } from "@/shared/component/buttons";
import Icon from "@/shared/component/icon";
import { close } from "@/assets/icons";
import { palette, semantic } from "@/shared/constants/colors.ts";
import { FONT } from "@/shared/constants/fonts";
import useDarkMode from "@/shared/hooks/useDarkMode";


export default function PickUpAtStore({ callback, deliveryMethod = "", showDialog = false, extra = { address: "" } }: any) {
    const { isDarkMode } = useDarkMode();
    const [dialogShow, setDialogShow] = useState<boolean>(showDialog);

    function confirmAddress() {
        callback({
            "deliveryMethod": deliveryMethod,
            "template_settings": {},
            "template_settings_value": {}
        });
        setDialogShow(false);
    }

    const styles = StyleSheet.create({
        content: {
            padding: normalize(24),
            paddingBottom: normalize(32),
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: normalize(24),
        },
        title: {
            fontSize: normalize(18),
            fontFamily: FONT.BOLD,
            color: isDarkMode ? '#FFF' : '#1A1D1E',
        },
        addressCard: {
            backgroundColor: isDarkMode ? semantic.fill.f03 : '#F8FAFC',
            borderRadius: normalize(16),
            padding: normalize(20),
            marginBottom: normalize(32),
            borderWidth: 1,
            borderColor: isDarkMode ? semantic.fill.f04 : '#E2E8F0',
        },
        addressText: {
            fontSize: normalize(15),
            fontFamily: FONT.MEDIUM,
            color: isDarkMode ? '#CBD5E1' : '#475569',
            lineHeight: normalize(22),
        },
    });

    return (
        <ButtonSheet dispatch={dialogShow} height={normalize(320)}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Typography style={styles.title}>Store Address</Typography>
                    <TouchableOpacity onPress={() => setDialogShow(false)}>
                        <Icon icon={close} height={normalize(24)} tintColor={isDarkMode ? '#FFF' : '#000'} />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.addressCard}>
                    <Typography style={styles.addressText}>{extra?.address}</Typography>
                </View>

                <Button title="Confirm Store Address" onPress={confirmAddress} />
            </View>
        </ButtonSheet>
    )
}
