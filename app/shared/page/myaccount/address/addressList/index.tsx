import useDarkMode from '../../../../hooks/useDarkMode';
import React, { useCallback, useState } from "react";
import { _styles } from "./styles";
import { ScrollView, TouchableOpacity, View } from "react-native";
import HeaderWithIcon from "../../../../component/headerBack";
import Icon from "@/shared/component/icon";
import { palette, semantic } from "@/shared/constants/colors";
import { add, location, close, shoppingBag, white_shopping_cart, trash, add_circle } from "@/assets/icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";
import AddressService from "@/service/account/address/AddressService.tsx";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import ListCard, { OptionCardOptions } from "@/shared/component/ListCard";
import ButtonSheet from "@/shared/component/buttonSheet";
import { normalize } from "@/shared/helpers";
import Typography from "@/shared/component/typography";
import { Button, ButtonOutline } from "@/shared/component/buttons";
import Toasts from "@/shared/utils/Toast.tsx";
import { IconButton } from "react-native-paper";


const AddressList = function () {
    const navigation = useNavigation<NavigationProps>();

    const [addressLists, setAddressLists] = useState<OptionCardOptions[]>([]);
    const [addressSelected, setAddressSelected] = useState<OptionCardOptions>();
    const [isLoading, setIsLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const [isDefaultAddressChanged, setIsDefaultAddressChanged] = useState(false);


    const { isDarkMode } = useDarkMode();
    const styles = _styles(isDarkMode);


    useFocusEffect(
        useCallback(() => {
            // This will run whenever the screen comes into focus
            listAddress();
        }, [])
    );


    function listAddress() {
        setIsLoading(true)
        new AddressService().listAddresses().then(response => {
            if (response.data.status === true) {
                let myAddressLists = [];
                for (let key in response.data.data) {
                    myAddressLists.push({
                        id: response.data.data[key].id,
                        icon: location,
                        title: response.data.data[key].name,
                        description: response.data.data[key].address_1 + ", "
                            + response.data.data[key].address_2 + ", "
                            + response.data.data[key].town + ", "
                            + response.data.data[key].state + ", "
                            + response.data.data[key].country,
                        active: response.data.data[key].isDefault,
                    });
                }
                setAddressLists(myAddressLists);
            }
            setIsLoading(false);
        });
    }

    function onSelectAddress(option: OptionCardOptions) {
        setAddressSelected(option);
        setOpenDialog(true);
    }


    function setAddressSelectedAsDefault() {
        setIsDefaultAddressChanged(true);
        // @ts-ignore
        new AddressService().setAddressHasDefault(addressSelected?.id).then(response => {
            if (response.data.status === true) {
                Toasts('Default Address has been changed successfully!')
            }
            setOpenDialog(false);
            listAddress();
            setIsDefaultAddressChanged(false)
        })
    }

    return (
        <WrapperNoScroll loading={isLoading}>
            <View style={styles.container}>
                <HeaderWithIcon
                    title="MY ADDRESS"
                    rightComponent={<IconButton style={{ alignItems: 'flex-end' }} size={normalize(35)} iconColor={'#FFF'} icon={add_circle} onPress={() => { navigation.navigate('newAddress') }} />}
                />
                {
                    isLoading
                        ?
                        <></>
                        :
                        (
                            addressLists.length > 0 ?
                                <ScrollView style={{ paddingHorizontal: normalize(20) }} showsVerticalScrollIndicator={false}>
                                    <ListCard
                                        value={addressSelected}
                                        onChange={onSelectAddress}
                                        options={addressLists}
                                    />
                                </ScrollView>
                                :
                                <View style={{
                                    flex: 1,
                                    paddingHorizontal: normalize(15),
                                    justifyContent: 'center',
                                }}>
                                    <Typography style={{ textAlign: 'center', alignSelf: 'center', fontSize: normalize(16) }}>You don’t have any saved addresses yet 🙂 Click below to add a new one.</Typography>
                                    <View style={{ paddingHorizontal: normalize(120), marginTop: normalize(10) }}>
                                        <Button title="New Address" onPress={() => navigation.navigate('newAddress')} />
                                    </View>
                                </View>
                        )
                }
            </View>
            <ButtonSheet onClose={() => setOpenDialog(false)} dispatch={openDialog} height={normalize(300)}>
                <View style={{ padding: normalize(24) }}>
                    <TouchableOpacity onPress={() => setOpenDialog(false)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography style={{ fontSize: normalize(18), marginBottom: normalize(10) }}>{"MY ADDRESS"}</Typography>
                        <Icon icon={close} height={normalize(30)} customStyles={{ marginTop: normalize(-15) }} tintColor={palette.main.p100} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.containerAddressDialog}>
                        <View style={styles.containerInfo}>
                            <View style={styles.containerIcon}>
                                <Icon customStyles={styles.icon} icon={location} />
                            </View>
                            <View style={{ flex: 0.9 }}>
                                <Typography style={styles.title}>{addressSelected?.title}</Typography>
                                <Typography style={styles.address}>{addressSelected?.description}</Typography>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.footerButtonSheet}>
                        <View style={{ flex: 1 }}>
                            <Button title="SET AS DEFAULT" loading={isDefaultAddressChanged} disabled={isDefaultAddressChanged} onPress={setAddressSelectedAsDefault} />
                        </View>
                        <View style={{ width: normalize(10) }} />
                        <View style={{ flex: 1 }}>
                            <ButtonOutline onPress={() => {
                                setOpenDialog(false);
                                // @ts-ignore
                                navigation.navigate('newAddress', { addressId: addressSelected?.id })
                            }} title="EDIT ADDRESS" />
                        </View>
                    </View>
                    <View style={{ height: normalize(24) }}></View>

                </View>
            </ButtonSheet>
        </WrapperNoScroll>
    )
}


export default AddressList;
