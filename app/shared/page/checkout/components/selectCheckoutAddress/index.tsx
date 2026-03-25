import React, {useCallback, useEffect, useState} from "react";
import {ActivityIndicator, ScrollView, TouchableOpacity, View} from "react-native";
import {location, shoppingBag} from "@/assets/icons";
import ListOptionCard, {OptionCardOptions} from "@/shared/component/ListOptionCard";
import useDarkMode from "@/shared/hooks/useDarkMode.tsx";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {palette, semantic} from "@/shared/constants/colors.ts";
import {normalize} from "@/shared/helpers";
import Toastss from "@/shared/utils/Toast";
import {useLoading} from "@/shared/utils/LoadingProvider";
import CheckoutService from "@/service/checkout/CheckoutService";
import SubHeader from "@/shared/component/subHeader";
import addressList from "@/shared/page/myaccount/address/addressList";
import Typography from "@/shared/component/typography";
import {Button} from "@/shared/component/buttons";
import {NavigationProps} from "@/shared/routes/stack.tsx";

export default function SelectCheckoutAddress({ onValidate }: { onValidate: (validateFn: () => Promise<boolean>) => void })  {
    const [addressSelected, setAddressSelected] = useState<OptionCardOptions>();
    const [checkOutAddress, setCheckOutAddress] = useState<OptionCardOptions[]>([]);
    const [isCheckOutAddressLoading, setIsCheckOutAddressLoading] = useState(false);
    const checkOutService = new CheckoutService();
    const { showLoading, hideLoading } = useLoading();
    const navigation = useNavigation<NavigationProps>();
    const { isDarkMode } = useDarkMode();

    useFocusEffect(
        useCallback(() => {
            // This will run whenever the screen comes into focus
            getCheckOutAddress();
        }, [])
    );

    useEffect(() => {
        onValidate(async function validateAddress(){
            if (!addressSelected?.id) {
                Toastss("Please select your address");
                return false;
            }

            showLoading("Saving address...");
            const response = await checkOutService.saveCheckoutAddress(addressSelected.id);
            if(response.data.status !== true) {
                Toastss(response.data.message);
                return false;
            }
            hideLoading();

            return true;
        }); // Validation passes if an address is selected
    }, [addressSelected]);

    function getCheckOutAddress() {
        setIsCheckOutAddressLoading(true);
        checkOutService.getCheckoutAddress().then((response) => {
            setCheckOutAddress([])
            if(response.data.status === true) {
                let myAddressLists = [];
                for(let key in response.data.data) {
                    myAddressLists.push({
                        id : response.data.data[key].id,
                        icon : location,
                        title : response.data.data[key].name,
                        description : response.data.data[key].address_1+", "
                            +response.data.data[key].address_2+", "
                            +response.data.data[key].town+", "
                            +response.data.data[key].state+", "
                            +response.data.data[key].country,
                        active : response.data.data[key].isDefault,
                    });

                    if(response.data.data[key].isDefault) {
                        setAddressSelected(response.data.data[key]);
                    }
                }
                setCheckOutAddress(myAddressLists)
            }
            setIsCheckOutAddressLoading(false);
        });
    }

    function onSelectAddress(option: OptionCardOptions) {
        setAddressSelected(option)
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: isDarkMode ? semantic.fill.f01 : '#F8FAFC',
        }}>
            <SubHeader icon={location} title="Delivery Address" />

            {isCheckOutAddressLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={semantic.alert.danger.d500} />
                </View>
            ) : checkOutAddress.length > 0 ? (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: normalize(16) }}>
                    <ListOptionCard
                        value={addressSelected}
                        onChange={onSelectAddress}
                        options={checkOutAddress}
                    />
                    <View style={{ height: normalize(140) }} />
                </ScrollView>
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: normalize(40) }}>
                    <Typography style={{ textAlign: 'center', fontSize: normalize(16), color: '#64748B', marginBottom: normalize(24) }}>
                        You don’t have any saved addresses yet.
                    </Typography>
                    <View style={{ width: '100%' }}>
                        <Button title="+ Add New Address" onPress={() => navigation.navigate('newAddress')} />
                    </View>
                </View>
            )}
        </View>
    )
}
