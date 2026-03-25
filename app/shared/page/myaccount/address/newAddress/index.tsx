import { FlatList, Image, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

import HeaderWithIcon from '@/shared/component/headerBack';

import { Button } from '@/shared/component/buttons';
import { normalize } from '@/shared/helpers';
import Typography from '@/shared/component/typography';
import Input from '@/shared/component/input';
import { location } from '@/assets/icons';
import Icon from '@/shared/component/icon';
import CheckBox from '@/shared/component/checkbox';
import useDarkMode from '@/shared/hooks/useDarkMode';
import CustomStatusBar from '@/shared/component/customStatusBar';
import { _styles } from './styles';
import ButtonSheet from "@/shared/component/buttonSheet";
import AddressService from "@/service/account/address/AddressService";
import { nameOrId } from "@/service/General";
import OverlayLoader from "@/shared/component/overlayLoader";
import ErrorText from "@/shared/component/ErrorText";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import Toasts from "@/shared/utils/Toast.tsx";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";


const NewAddress = () => {
    const { isDarkMode } = useDarkMode();

    const [check, setCheck] = useState<boolean>(true);
    const styles = _styles(isDarkMode);

    const navigation = useNavigation<NavigationProps>();
    const [isLoading, setIsLoading] = useState(false);
    const [formTitle, setFormTitle] = useState<string>("NEW ADDRESS");

    const [states, setStates] = useState<nameOrId[]>();
    const [isStateLoading, setIsStateLoading] = useState(false);
    const [state, setState] = useState<nameOrId>();

    const [towns, setTowns] = useState<nameOrId[]>();
    const [isTownLoading, setIsTownLoading] = useState(false);
    const [town, setTown] = useState<nameOrId>();

    const [openStateDialog, setOpenStateDialog] = useState(false)
    const [openTownDialog, setOpenTownDialog] = useState(false)
    const [selectedStateError, setSelectedStateError] = useState<string>();
    const [selectedTownError, setSelectedTownError] = useState<string>();

    const [name, setName] = useState<string>("");
    const [addressLine1, setAddressLine1] = useState<string>("");
    const [addressLine2, setAddressLine2] = useState<string>("");


    const [nameError, setNameError] = useState<string>();
    const [addressLine1Error, setAddressLine1Error] = useState<string>();

    const route = useRoute();

    const [addressId, setAddressId] = useState<string | undefined>(undefined);

    const [isLoadingAddress, setIsLoadingAddress] = useState<boolean>(false);

    useEffectOnce(function () {
        // @ts-ignore
        const addressId = route.params?.addressId;
        setAddressId(addressId);
        if (addressId) {
            setFormTitle("UPDATE ADDRESS");
            setIsLoadingAddress(true);
            new AddressService().getAddress(addressId).then(response => {
                if (response.data.status == true) {
                    const myAddress = response.data.data;
                    setName(myAddress.name);
                    setAddressLine1(myAddress.address_1);
                    setAddressLine2(myAddress.address_2);
                    setState(myAddress.stateObject);
                    setTown(myAddress.townObject);
                    setCheck(myAddress.isDefault);
                    setIsLoadingAddress(false);
                } else {
                    navigation.goBack();
                }
            });
        }

    }, []);

    function fetchStates() {
        if (states?.length === 0 || states?.length === undefined) {
            setIsStateLoading(true);
            (new AddressService()).listStates().then((response) => {
                if (response.data.status === true) {
                    setStates(response.data.data);
                    setIsStateLoading(false);
                }
            })
        }
    }


    function fetchTown() {
        if (state?.id == undefined) {
            return;
        }
        setIsTownLoading(true);
        (new AddressService()).listTown(state?.id).then((response) => {
            if (response.data.status === true) {
                setTowns(response.data.data);
                setIsTownLoading(false);
            }
        })
    }

    function triggerStateDialog(status: boolean) {
        if (status) {
            fetchStates();
        }
        setOpenStateDialog(status);
    }

    function triggerTownDialog(status: boolean) {
        if (status && state?.id === undefined) {
            Toasts("Please select your state first");
            return;
        }
        if (status) {
            fetchTown();
        }
        setOpenTownDialog(status);
    }


    function saveAddress() {
        setNameError("");
        setAddressLine1Error("");
        setSelectedStateError("");
        setSelectedTownError("");
        if (name === '') {
            setNameError('Name is required');
        } else if (addressLine1 === '') {
            setAddressLine1Error('Address Line 1 field is required');
        } else if (state?.id === undefined) {
            setSelectedStateError('State field is required');
        } else if (town?.id === undefined) {
            setSelectedTownError('Town field is required');
        } else {

            const data = {
                "name": name,
                "address_1": addressLine1,
                "address_2": addressLine2,
                "country_id": "160",
                "state_id": state?.id,
                "town_id": town?.id,
                "setAsDefault": check ? "1" : "0"
            };
            setIsLoading(true);
            new AddressService().saveAddress(data, addressId).then((response) => {
                if (response.data.status === true) {
                    Toasts('Address has been saved successfully!');
                    navigation.goBack();
                }

                setIsLoading(false);
            })
        }
    }


    return (
        <WrapperNoScroll>
            <HeaderWithIcon title={formTitle} />
            {
                isLoadingAddress
                    ?
                    <OverlayLoader loading={isLoadingAddress} title={""} />
                    :
                    <ScrollView style={styles.formContainer}>
                        <View
                            style={{
                                padding: normalize(24),
                                flex: 1,
                            }}>
                            <View>
                                <View style={{ marginBottom: normalize(24) }}>
                                    <Input
                                        label="Name"
                                        placeholder="e.g Office or Home"
                                        value={name}
                                        onChangeText={(name) => setName(name)}
                                    />
                                    {nameError !== '' ? <ErrorText>{nameError}</ErrorText> : ''}
                                </View>
                                <View style={{ marginBottom: normalize(24) }}>
                                    <Input
                                        label="Address Line 1"
                                        placeholder="Address Line 1"
                                        rightIcon={<Icon icon={location} />}
                                        value={addressLine1}
                                        onChangeText={(addressLine1) => setAddressLine1(addressLine1)}
                                    />
                                    {addressLine1Error !== '' ? <ErrorText>{addressLine1Error}</ErrorText> : ''}
                                </View>
                                <View style={{ marginBottom: normalize(24) }}>
                                    <Input
                                        label="Address Line 2"
                                        placeholder="Address Line 2"
                                        rightIcon={<Icon icon={location} />}
                                        value={addressLine2}
                                        onChangeText={(addressLine2) => setAddressLine2(addressLine2)}
                                    />
                                </View>

                                <View style={{ marginBottom: normalize(0) }}>
                                    <Input
                                        label="State"
                                        placeholder="State"
                                        editable={false}
                                        value={state?.name}
                                        rightIcon={<Icon onPress={() => { triggerStateDialog(true) }} icon={location} />}
                                    />
                                    <View style={{ alignItems: "flex-end", marginTop: normalize(5) }}>
                                        <TouchableOpacity
                                            style={{ borderRadius: 5 }}
                                            onPress={() => { triggerStateDialog(true) }}
                                        >
                                            <Typography style={{ color: "red" }}>Select States</Typography>
                                        </TouchableOpacity>
                                    </View>
                                    {selectedStateError !== '' ? <ErrorText>{selectedStateError}</ErrorText> : ''}
                                </View>

                                <View style={{ marginBottom: normalize(0) }}>
                                    <Input
                                        label="Town"
                                        placeholder="Town"
                                        value={town?.name}
                                        editable={false}
                                        rightIcon={<Icon icon={location} onPress={() => { triggerTownDialog(true) }} />}
                                    />
                                    <View style={{ alignItems: "flex-end", marginTop: normalize(5) }}>
                                        <TouchableOpacity
                                            style={{ borderRadius: 5 }}
                                            onPress={() => { triggerTownDialog(true) }}
                                        >
                                            <Typography style={{ color: "red" }}>Select Town</Typography>
                                        </TouchableOpacity>
                                    </View>
                                    {selectedTownError !== '' ? <ErrorText>{selectedTownError}</ErrorText> : ''}
                                </View>

                                <View style={styles.checkboxContainer}>
                                    <CheckBox value={check} onChange={setCheck} />
                                    <Typography style={{ marginLeft: normalize(10) }}>
                                        Make this the default address
                                    </Typography>
                                </View>
                            </View>

                            <Button title="Save" loadingText="Save" loading={isLoading} disabled={isLoading} onPress={saveAddress} />
                        </View>
                    </ScrollView>
            }

            <ButtonSheet onClose={() => triggerStateDialog(false)} dispatch={openStateDialog} height={normalize(500)}>
                {
                    isStateLoading
                        ?
                        <OverlayLoader loading={true} title={""} height={normalize(500)} />
                        :
                        <View style={{ padding: normalize(24) }}>
                            <TouchableOpacity onPress={() => triggerStateDialog(false)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Typography style={{ width: '100%', fontSize: normalize(18), marginBottom: normalize(10), textAlign: 'center' }}>{"Select State"}</Typography>
                            </TouchableOpacity>
                            <FlatList
                                style={{ height: normalize(420) }}
                                data={states}
                                renderItem={({ item, index }) =>
                                    <TouchableOpacity onPress={function () {
                                        setState(item);
                                        setTowns(undefined);
                                        setTown(undefined);

                                        setOpenStateDialog(false);
                                    }}>
                                        <Typography style={styles.item}>{item.name}</Typography>
                                    </TouchableOpacity>
                                }
                            />
                            <View style={{ height: normalize(24) }}></View>
                        </View>

                }

            </ButtonSheet>
            <ButtonSheet onClose={() => triggerTownDialog(false)} dispatch={openTownDialog} height={normalize(500)}>
                {
                    isTownLoading
                        ?
                        <OverlayLoader loading={true} title={""} height={normalize(500)} />
                        :
                        <View style={{ padding: normalize(24) }}>
                            <TouchableOpacity onPress={() => triggerTownDialog(false)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Typography style={{ width: '100%', fontSize: normalize(18), marginBottom: normalize(10), textAlign: 'center' }}>{"Select Town."}</Typography>
                            </TouchableOpacity>
                            <FlatList
                                style={{ height: normalize(420) }}
                                data={towns}
                                renderItem={({ item, index }) =>
                                    <TouchableOpacity onPress={function () {
                                        setTown(item);
                                        setOpenTownDialog(false);
                                    }}>
                                        <Typography style={styles.item}>{item.name}</Typography>
                                    </TouchableOpacity>
                                }
                            />
                            <View style={{ height: normalize(24) }}></View>
                        </View>

                }

            </ButtonSheet>
        </WrapperNoScroll>
    );
};

export default NewAddress;
