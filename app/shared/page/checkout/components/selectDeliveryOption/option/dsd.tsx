import React, { useCallback, useState } from "react";
import ListItemOption, { ListOptions } from "@/shared/component/ListItemOption";
import ButtonSheet from "@/shared/component/buttonSheet";
import { ScrollView, TouchableOpacity, View, StyleSheet } from "react-native";
import { normalize } from "@/shared/helpers";
import Typography from "@/shared/component/typography";
import Icon from "@/shared/component/icon";
import { close } from "@/assets/icons";
import { palette, semantic } from "@/shared/constants/colors.ts";
import { Button } from "@/shared/component/buttons";
import WrapperNoScrollNoDialogNoSafeArea from "@/shared/component/wrapperNoScrollNoDialogNoSafeArea";
import CheckoutService from "@/service/checkout/CheckoutService.tsx";
import { useFocusEffect } from "@react-navigation/native";
import { currencyType } from "@/shared/constants/global.ts";
import { FONT } from "@/shared/constants/fonts";
import useDarkMode from "@/shared/hooks/useDarkMode";


// @ts-ignore
export default function Dsd({ callback, deliveryMethod = "", showDialog = false, extra = [] }) {
    const { isDarkMode } = useDarkMode();
    const [dialogShow, setDialogShow] = useState<boolean>(showDialog);
    const [loading, setLoading] = useState<boolean>(false);
    const [dsd, setDsd] = useState<any>([]);

    function confirmDsd() {
        callback({
            deliveryMethod: deliveryMethod,
            template_settings: {},
            template_settings_value: []
        });
        setDialogShow(false);
    }

    useFocusEffect(
        useCallback(() => {
            loadDoorStepDelivery();
        }, [])
    );

    function loadDoorStepDelivery() {
        setLoading(true);
        new CheckoutService().getDoorStepDelivery().then((response) => {
            setLoading(false);
            if (response.data.status === true) {
                setDsd(response.data.data);
            }
        });
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
        infoRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: normalize(24),
            paddingHorizontal: normalize(4),
        },
        infoLabel: {
            fontSize: normalize(16),
            fontFamily: FONT.MEDIUM,
            color: '#64748B',
        },
        infoValue: {
            fontSize: normalize(16),
            fontFamily: FONT.BOLD,
            color: isDarkMode ? '#FFF' : '#1A1D1E',
        },
        totalCard: {
            backgroundColor: isDarkMode ? semantic.fill.f03 : '#F1F5F9',
            paddingVertical: normalize(20),
            paddingHorizontal: normalize(24),
            borderRadius: normalize(16),
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: normalize(32),
            borderWidth: 1,
            borderColor: isDarkMode ? semantic.fill.f04 : '#E2E8F0',
        },
        totalLabel: {
            fontSize: normalize(12),
            fontFamily: FONT.BOLD,
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: normalize(4),
        },
        totalValue: {
            fontSize: normalize(28),
            fontFamily: FONT.BOLD,
            color: semantic.alert.danger.d500,
        },
    });

    return (
        <ButtonSheet dispatch={dialogShow} height={normalize(400)}>
            <WrapperNoScrollNoDialogNoSafeArea loading={loading}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Typography style={styles.title}>Door Step Delivery</Typography>
                        <TouchableOpacity onPress={() => setDialogShow(false)}>
                            <Icon icon={close} height={normalize(24)} tintColor={isDarkMode ? '#FFF' : '#000'} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.infoRow}>
                        <Typography style={styles.infoLabel}>Delivery Date</Typography>
                        <Typography style={styles.infoValue}>
                            {
                                // @ts-ignore
                                dsd?.delivery_date || 'TBD'
                            }
                        </Typography>
                    </View>

                    <View style={styles.totalCard}>
                        <Typography style={styles.totalLabel}>Delivery Total</Typography>
                        <Typography style={styles.totalValue}>
                            {
                                // @ts-ignore
                                currencyType + " " + (dsd?.total || '0')
                            }
                        </Typography>
                    </View>

                    <Button title="Confirm Delivery" onPress={confirmDsd} />
                </View>
            </WrapperNoScrollNoDialogNoSafeArea>
        </ButtonSheet>
    )
}
