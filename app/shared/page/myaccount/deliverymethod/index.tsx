
import useDarkMode from '../../../hooks/useDarkMode';
import React, { useCallback, useState } from "react";
import { _styles } from "./styles";
import { ScrollView, TouchableOpacity, View } from "react-native";
import HeaderWithIcon from "../../../component/headerBack";
import Icon from "@/shared/component/icon";
import { palette, semantic } from "@/shared/constants/colors";
import { add, close, creditCardPlus } from "@/assets/icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import ListCard, { OptionCardOptions } from "@/shared/component/ListCard";
import ButtonSheet from "@/shared/component/buttonSheet";
import { normalize, truncateString } from "@/shared/helpers";
import Typography from "@/shared/component/typography";
import { Button, ButtonOutline } from "@/shared/component/buttons";
import Toasts from "@/shared/utils/Toast.tsx";
import DeliveryMethodService from "@/service/account/deliverymethod/DeliveryMethodService.tsx";


const DeliveryMethodList = function () {
    const [deliveryMethodLists, setDeliveryMethodLists] = useState<OptionCardOptions[]>([]);
    const [deliveryMethodSelected, setDeliveryMethodSelected] = useState<OptionCardOptions>();
    const [isLoading, setIsLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const [isDefaultDeliveryMethodChanged, setIsDeliveryMethodChanged] = useState(false);


    const { isDarkMode } = useDarkMode();
    const styles = _styles(isDarkMode);


    useFocusEffect(
        useCallback(() => {
            // This will run whenever the screen comes into focus
            listDeliveryMethods();
        }, [])
    );


    function listDeliveryMethods() {
        setIsLoading(true)
        new DeliveryMethodService().listDeliveryMethod().then(response => {
            if (response.data.status === true) {
                let deliveryMethodAddress = [];
                for (let key in response.data.data) {
                    deliveryMethodAddress.push({
                        id: response.data.data[key].id,
                        icon: creditCardPlus,
                        title: response.data.data[key].name,
                        description: truncateString(response.data.data[key].description, 120),
                        active: response.data.data[key].isDefault,
                    });
                }
                setDeliveryMethodLists(deliveryMethodAddress);
                setIsLoading(false);
            }
        });
    }

    function onSelectDeliveryMethod(option: OptionCardOptions) {
        setDeliveryMethodSelected(option);
        setOpenDialog(true);
    }


    function setAddressSelectedAsDefault() {
        setIsDeliveryMethodChanged(true);
        // @ts-ignore
        new DeliveryMethodService().setDeliveryAsDefault(deliveryMethodSelected?.id).then(response => {
            if (response.data.status === true) {
                Toasts('Default Delivery Method has been changed successfully!')
            }
            setOpenDialog(false);
            listDeliveryMethods();
            setIsDeliveryMethodChanged(false)
        })
    }

    return (
        <WrapperNoScroll loading={isLoading}>
            <HeaderWithIcon title="Delivery Method" />
            <View style={styles.container}>
                {
                    isLoading ? <></>
                        :
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <ListCard
                                value={deliveryMethodSelected}
                                onChange={onSelectDeliveryMethod}
                                options={deliveryMethodLists}
                            />
                        </ScrollView>
                }
            </View>
            <ButtonSheet onClose={() => setOpenDialog(false)} dispatch={openDialog} height={normalize(280)}>
                <View style={{ padding: normalize(24) }}>
                    <TouchableOpacity onPress={() => setOpenDialog(false)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography style={{ fontSize: normalize(18), marginBottom: normalize(10) }}>{"MY ADDRESS"}</Typography>
                        <Icon icon={close} height={normalize(30)} customStyles={{ marginTop: normalize(-15) }} tintColor={palette.main.p100} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.containerAddressDialog}>
                        <View style={styles.containerInfo}>
                            <View style={styles.containerIcon}>
                                <Icon customStyles={styles.icon} icon={creditCardPlus} />
                            </View>
                            <View style={{ flex: 0.9 }}>
                                <Typography style={styles.title}>{deliveryMethodSelected?.title}</Typography>
                                <Typography style={styles.address}>{deliveryMethodSelected?.description}</Typography>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.footerButtonSheet}>
                        <View style={{ flex: 1 }}>
                            <Button title="SET AS DEFAULT" loading={isDefaultDeliveryMethodChanged} disabled={isDefaultDeliveryMethodChanged} onPress={setAddressSelectedAsDefault} />
                        </View>
                    </View>
                    <View style={{ height: normalize(24) }}></View>

                </View>
            </ButtonSheet>
        </WrapperNoScroll>
    )
}


export default DeliveryMethodList;
