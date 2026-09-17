import { styles } from "@/applications/auth/createAccount/styles.ts";
import { FlatList, Image, Platform, ScrollView, TouchableOpacity, View } from "react-native";
import TitleAuth from "@/shared/component/titleAuth";
import { normalize } from "@/shared/helpers";
import { logo } from "@/assets/images";
import React, { useState } from "react";
import Wrapper from "@/shared/component/wrapper";
import Input from "@/shared/component/input";
import Icon from "@/shared/component/icon";
import { location, mail, phone, store, user } from "@/assets/icons";
import ErrorText from "@/shared/component/ErrorText";
import { nameOrId } from "@/service/General.tsx";
import AddressService from "@/service/account/address/AddressService.tsx";
import { Button } from "@/shared/component/buttons";
import ButtonSheet from "@/shared/component/buttonSheet";
import OverlayLoader from "@/shared/component/overlayLoader";
import Typography from "@/shared/component/typography";
import Toasts from "@/shared/utils/Toast.tsx";
import FilePicker from "@/shared/utils/FilePicker.tsx";
import createStoreRequest from "@/applications/wholesales/createStoreService";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import { CommonActions } from "@react-navigation/native";
import Header from "@/shared/component/header";
import HeaderWithIcon from "@/shared/component/headerBack";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import { palette, semantic } from "@/shared/constants/colors.ts";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FancySelectorTile = ({
    label,
    placeholder,
    value,
    icon,
    onPress,
    error,
}: {
    label: string;
    placeholder: string;
    value?: string;
    icon: any;
    onPress: () => void;
    error?: string;
}) => {
    return (
        <View style={styles.formControl}>
            <Typography style={{ fontSize: normalize(12), color: '#64748B', marginBottom: normalize(6), fontWeight: '600' }}>
                {label}
            </Typography>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPress}
                style={{
                    borderWidth: 1.5,
                    borderColor: value ? palette.main.p500 : semantic.text.borderColor,
                    borderRadius: normalize(12),
                    backgroundColor: value ? '#FFF5F5' : semantic.fill.f04,
                    paddingVertical: normalize(14),
                    paddingHorizontal: normalize(14),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <View style={{
                    width: normalize(38),
                    height: normalize(38),
                    borderRadius: normalize(10),
                    backgroundColor: value ? palette.main.p500 : '#E8E8E8',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: normalize(12),
                }}>
                    <Icon icon={icon} height={20} width={20} tintColor={value ? '#FFF' : semantic.text.grey} />
                </View>

                <View style={{ flex: 1, marginRight: normalize(8) }}>
                    <Typography
                        numberOfLines={1}
                        style={{
                            fontSize: normalize(13),
                            fontWeight: value ? '700' : '400',
                            color: value ? semantic.text.black : semantic.text.grey,
                        }}
                    >
                        {value ? value : placeholder}
                    </Typography>
                </View>

                <View style={{
                    paddingHorizontal: normalize(12),
                    paddingVertical: normalize(6),
                    borderRadius: normalize(8),
                    backgroundColor: value ? palette.main.p500 : '#E8E8E8',
                }}>
                    <Typography style={{ fontSize: normalize(11), fontWeight: '600', color: value ? '#FFF' : semantic.text.grey }}>
                        {value ? 'Change' : 'Select'}
                    </Typography>
                </View>
            </TouchableOpacity>
            {error !== '' && error !== undefined ? <ErrorText>{error}</ErrorText> : null}
        </View>
    );
};

// @ts-ignore
export default function CreateWholesales({ navigation }) {
    const insets = useSafeAreaInsets();
    const [isLoading, setIsLoading] = useState(false);

    const [business_name, setBusiness_name] = useState("");
    const [business_nameError, setBusiness_nameError] = useState("");

    const [business_phone, setBusiness_phone] = useState("");
    const [business_phoneError, setBusiness_phoneError] = useState("");

    const [business_email, setBusiness_email] = useState("");
    const [business_emailError, setBusiness_emailError] = useState("");

    const [business_address_1, setBusiness_address_1] = useState("");
    const [business_address_1Error, setBusiness_address_1Error] = useState("");

    const [business_address_2, setBusiness_address_2] = useState("");
    const [business_address_2Error, setBusiness_address_2Error] = useState("");

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

    const [customerTypes, setCustomerTypes] = useState<nameOrId[]>();
    const [isCustomerTypeLoading, setIsCustomerTypeLoading] = useState(false);
    const [customerType, setCustomerType] = useState<nameOrId>();
    const [openCustomerTypeDialog, setOpenCustomerTypeDialog] = useState(false);
    const [selectedCustomerTypeError, setSelectedCustomerTypeError] = useState<string>();

    const [businessCertificate, setBusinessCertificate] = useState(undefined);
    const [premisesLicense, setPremisesLicense] = useState(undefined);

    function triggerCustomerTypeDialog(status: boolean) {
        if (status) {
            fetchCustomerTypes();
        }
        setOpenCustomerTypeDialog(status);
    }

    function triggerStateDialog(status: boolean) {
        if (status) {
            fetchStates();
        }
        setOpenStateDialog(status);
    }

    function triggerTownDialog(status: boolean) {
        if (status && state?.id === undefined) {
            Toasts("Please select your State first");
            return;
        }
        if (status) {
            fetchTown();
        }
        setOpenTownDialog(status);
    }

    function fetchCustomerTypes() {
        if (customerTypes?.length === 0 || customerTypes?.length === undefined) {
            setIsCustomerTypeLoading(true);
            (new AddressService()).listCustomerTypes().then((response) => {
                if (response.data.status === true) {
                    setCustomerTypes(response.data.data);
                    setIsCustomerTypeLoading(false);
                }
            })
        }
    }

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


    const handleBusinessCertificate = (file: any) => {
        setBusinessCertificate(file);
    };

    const handleBusinessPremises = (file: any) => {
        setPremisesLicense(file);

    };

    function createStore() {
        setBusiness_nameError("");
        setBusiness_phoneError("");
        setBusiness_emailError("");
        setBusiness_address_1Error("");
        setSelectedStateError("");
        setSelectedTownError("");
        setSelectedCustomerTypeError("");

        if (business_name === "") {
            setBusiness_nameError("Business name field is required");
        } else if (business_name === "") {
            setBusiness_phoneError("Business phone field is required");
        } else if (business_email === "") {
            setBusiness_emailError("Business email field is required");
        } else if (business_address_1 === "") {
            setBusiness_address_1Error("Business address field is required");
        } else if (customerType?.id === undefined) {
            setSelectedCustomerTypeError('Store type field is required');
        } else if (state?.id === undefined) {
            setSelectedStateError('State field is required');
        }
        else if (town?.id === undefined) {
            setSelectedTownError('Town field is required');
        } else {
            const data = new FormData();
            data.append("business_name", business_name);
            data.append("phone", phone);
            data.append("business_email_address", business_email);
            data.append("address_1", business_address_1);
            data.append("address_2", business_address_2);
            data.append("customer_type_id", customerType?.id);
            data.append("country_id", "160");
            data.append("state_id", state?.id);
            data.append("town_id", town?.id);

            if (businessCertificate !== undefined) {
                data.append("cac_document", {
                    // @ts-ignore
                    uri: businessCertificate.uri,
                    // @ts-ignore
                    name: businessCertificate.name,
                    // @ts-ignore
                    type: businessCertificate.type,
                });
            }

            if (premisesLicense !== undefined) {
                data.append("premises_licence", {
                    // @ts-ignore
                    uri: premisesLicense.uri,
                    // @ts-ignore
                    name: premisesLicense.name,
                    // @ts-ignore
                    type: premisesLicense.type,
                });
            }

            setIsLoading(true);
            createStoreRequest.post("account/create-store", data).then((response) => {
                if (response.data.status === true) {
                    new AuthSessionService().autoLogin().then(function (response) {
                        if (response) {
                            Toasts("Hurray, Your Business has been created successfully.");
                            setIsLoading(false);
                            CommonActions.reset({
                                index: 0, // Set the index of the active screen
                                routes: [{ name: 'storeSelector' }], // Replace with your target screen
                            })
                            navigation.replace("storeSelector");
                        }
                    })
                } else {
                    console.log(response.data);
                    setIsLoading(false);
                    Toasts("There was an error creating your account, please try again.");
                }
            });

        }
    }

    return (
        <WrapperNoScroll titleLoader={"Creating store Please wait..."}>
            <HeaderWithIcon title="Create Your Store" />
            <ScrollView style={{ width: '100%', backgroundColor: semantic.fill.f03, borderTopEndRadius: normalize(20), borderTopStartRadius: normalize(20), }} showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, normalize(40)) }}>
                <View style={styles.container}>
                    <View style={styles.titleImageContainer}>
                        <TitleAuth title="Create Your Store" />
                        <Image
                            style={{
                                width: normalize(100),
                                height: normalize(60),
                                marginTop: normalize(10)
                            }}
                            source={logo}
                        />
                    </View>
                    <View style={styles.form}>

                        <View style={styles.formControl}>
                            <Input
                                leftIcon={<Icon icon={store} />}
                                label="Business name"
                                value={business_name}
                                onChangeText={(name) => setBusiness_name(name)}
                                placeholder="Enter Your Business name"
                                keyboardType="default"
                            />
                            {business_nameError !== '' ? <ErrorText>{business_nameError}</ErrorText> : ''}
                        </View>
                        <View style={styles.formControl}>
                            <FilePicker label={"Business Certificate (optional)"} onFileSelected={handleBusinessCertificate} />
                        </View>

                        <View style={styles.formControl}>
                            <FilePicker label={"Premises Licence (optional)"} onFileSelected={handleBusinessPremises} />
                        </View>

                        <View style={styles.formControl}>
                            <Input
                                leftIcon={<Icon icon={phone} />}
                                label="Business Phone Number"
                                value={business_phone}
                                onChangeText={(phone) => setBusiness_phone(phone)}
                                placeholder="Business Phone Number"
                                keyboardType={"phone-pad"}
                            />
                            {business_phoneError !== '' ? <ErrorText>{business_phoneError}</ErrorText> : ''}
                        </View>

                        <View style={styles.formControl}>
                            <Input
                                leftIcon={<Icon icon={mail} />}
                                label="Business Email Address"
                                value={business_email}
                                onChangeText={(email) => setBusiness_email(email)}
                                placeholder="Business Email Address"
                                keyboardType={"email-address"}
                            />
                            {business_emailError !== '' ? <ErrorText>{business_emailError}</ErrorText> : ''}
                        </View>

                        <View style={styles.formControl}>
                            <Input
                                leftIcon={<Icon icon={location} />}
                                label="Business Address Line 1"
                                value={business_address_1}
                                onChangeText={(address_1) => setBusiness_address_1(address_1)}
                                placeholder="Business Address Line 1"
                                keyboardType={"default"}
                            />
                            {business_address_1Error !== '' ? <ErrorText>{business_address_1Error}</ErrorText> : ''}
                        </View>

                        <View style={styles.formControl}>
                            <Input
                                leftIcon={<Icon icon={location} />}
                                label="Business Address Line 2"
                                value={business_address_2}
                                onChangeText={(address_2) => setBusiness_address_2(address_2)}
                                placeholder="Business Address Line 2"
                                keyboardType={"default"}
                            />
                            {business_address_2Error !== '' ? <ErrorText>{business_address_2Error}</ErrorText> : ''}
                        </View>

                        <FancySelectorTile
                            label="Store Type"
                            placeholder="Tap to select Store Type"
                            value={customerType?.name}
                            icon={store}
                            onPress={() => triggerCustomerTypeDialog(true)}
                            error={selectedCustomerTypeError}
                        />

                        <FancySelectorTile
                            label="State"
                            placeholder="Tap to select State"
                            value={state?.name}
                            icon={location}
                            onPress={() => triggerStateDialog(true)}
                            error={selectedStateError}
                        />

                        <FancySelectorTile
                            label="Town"
                            placeholder="Tap to select Town"
                            value={town?.name}
                            icon={location}
                            onPress={() => triggerTownDialog(true)}
                            error={selectedTownError}
                        />
                        <Button title="Create Store" loadingText="Creating store Please wait..." loading={isLoading} disabled={isLoading} onPress={createStore} />
                        {
                            Platform.OS === 'ios' ?
                                <View style={{ height: normalize(60) }} />
                                : <View style={{ height: normalize(40) }} />
                        }
                    </View>
                </View>
            </ScrollView>
            <ButtonSheet onClose={() => triggerCustomerTypeDialog(false)} dispatch={openCustomerTypeDialog} height={normalize(500)}>
                {
                    isCustomerTypeLoading
                        ?
                        <OverlayLoader loading={true} title={""} height={normalize(500)} />
                        :
                        <View style={{ padding: normalize(24) }}>
                            <TouchableOpacity onPress={() => triggerCustomerTypeDialog(false)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Typography style={{ width: '100%', fontSize: normalize(18), marginBottom: normalize(10), textAlign: 'center' }}>{"Select Store Type"}</Typography>
                            </TouchableOpacity>
                            <FlatList
                                style={{ height: normalize(420) }}
                                data={customerTypes}
                                renderItem={({ item, index }) =>
                                    <TouchableOpacity onPress={function () {
                                        setCustomerType(item);
                                        setOpenCustomerTypeDialog(false);
                                    }}>
                                        <Typography style={styles.item}>{item.name}</Typography>
                                    </TouchableOpacity>
                                }
                            />
                            <View style={{ height: normalize(24) }}></View>
                        </View>

                }

            </ButtonSheet>
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
    )
}
