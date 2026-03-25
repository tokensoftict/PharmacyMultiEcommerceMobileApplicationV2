import ButtonSheet from "@/shared/component/buttonSheet";
import { normalize } from "@/shared/helpers";
import { ScrollView, TouchableOpacity, View, StyleSheet } from "react-native";
import Typography from "@/shared/component/typography";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/shared/component/buttons";
import ListItemOption, { ListOptions } from "@/shared/component/ListItemOption";
import useEffectOnce from "@/shared/hooks/useEffectOnce";
import Icon from "@/shared/component/icon";
import { close } from "@/assets/icons";
import { palette, semantic } from "@/shared/constants/colors.ts";
import { FONT } from "@/shared/constants/fonts";
import useDarkMode from "@/shared/hooks/useDarkMode";
import Toastss from "@/shared/utils/Toast.tsx";

//onValidate: (validateFn: () => Promise<boolean>) => void
// @ts-ignore
export default function Dwi({ callback, showDialog = false, extra = [], deliveryMethod = "" }: any) {
    const [dialogShow, setDialogShow] = useState<boolean>(showDialog);
    const [dwilocations, setDwilocations] = useState<ListOptions[]>([]);
    const [dwilocation, setDwilocation] = useState<ListOptions>();

    useEffectOnce(() => {
        let myLocationLists = [];
        for (let key in extra) {
            // @ts-ignore
            myLocationLists.push({
                // @ts-ignore
                id: extra[key].SN,
                // @ts-ignore
                title: extra[key].name,
                // @ts-ignore
                price: extra[key].amount,
                active: false
            })
        }
        setDwilocations(myLocationLists);
    }, [])

    const { isDarkMode } = useDarkMode();

    function onSelectDwi(option: ListOptions) {
        setDwilocation(option);
    }

    function confirmDwi() {
        if (!dwilocation?.id) {
            Toastss("Please select your location");
            return;
        }
        callback({
            deliveryMethod: deliveryMethod,
            template_settings: dwilocation,
            template_settings_value: []
        });
        setDialogShow(false);
    }

    const styles = StyleSheet.create({
        content: {
            padding: normalize(24),
            paddingBottom: normalize(32),
            flex: 1,
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
        listContainer: {
            flex: 1,
            marginBottom: normalize(24),
        },
    });

    return (
        <ButtonSheet dispatch={dialogShow} height={normalize(550)}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Typography style={styles.title}>Select Location</Typography>
                    <TouchableOpacity onPress={() => setDialogShow(false)}>
                        <Icon icon={close} height={normalize(24)} tintColor={isDarkMode ? '#FFF' : '#000'} />
                    </TouchableOpacity>
                </View>

                <View style={styles.listContainer}>
                    {dwilocations.length > 0 ? (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <ListItemOption
                                key="dwilocation"
                                value={dwilocation}
                                options={dwilocations}
                                onChange={onSelectDwi}
                            />
                        </ScrollView>
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Typography style={{ color: '#64748B' }}>No locations available.</Typography>
                        </View>
                    )}
                </View>

                <Button title="Confirm Location" onPress={confirmDwi} />
            </View>
        </ButtonSheet>
    )
}
