import React, { useState } from "react";
import { styles } from "./styles";
import HeaderWithIcon from "@/shared/component/headerBack";
import { Image, TouchableOpacity, View, ScrollView } from "react-native";
import TitleAuth from "@/shared/component/titleAuth";
import { logo } from "@/assets/images";
import Input from "@/shared/component/input";
import Icon from "@/shared/component/icon";
import { eyeFilled, eyeOff, lock } from "@/assets/icons";
import ErrorText from "@/shared/component/ErrorText";
import { Button } from "@/shared/component/buttons";
import Toasts from "@/shared/utils/Toast.tsx";
import Security from "@/service/auth/Security.tsx";
import Typography from "@/shared/component/typography";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from "@/shared/theme";
import { isTablet, wp } from '@/shared/helpers';

export default function ChangePassword() {
    const navigation = useNavigation<NavigationProps>();
    const insets = useSafeAreaInsets();
    const tablet = isTablet();

    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [isOldPasswordShown, setIsOldPasswordShown] = useState(true);
    const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(true);
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [messageError, setMessageError] = useState('');
    const [errorOldPassword, setErrorOldPassword] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorPasswordConfirmation, setErrorPasswordConfirmation] = useState("");

    const security = new Security();

    function doPasswordReset() {
        let validationError = false;
        setErrorPassword("");
        setMessageError("");
        setErrorOldPassword("");
        setErrorPasswordConfirmation("");

        if (oldPassword === "") {
            setErrorOldPassword("Please enter your old password");
            validationError = true;
        }
        if (password === "") {
            setErrorPassword("Please enter your new Password");
            validationError = true;
        }
        if (passwordConfirmation === "") {
            setErrorPasswordConfirmation("Please confirm your new password");
            validationError = true;
        }

        if (!validationError) {
            setIsLoading(true);
            security.changePassword(oldPassword, password, passwordConfirmation).then(function (response) {
                setIsLoading(false);
                if (response.data.status === true) {
                    Toasts('Your password has been reset successfully 👋');
                    setOldPassword("");
                    setPassword("");
                    setPasswordConfirmation("");
                } else {
                    const error = response.data.error;
                    if (error.hasOwnProperty("old_password")) {
                        setErrorOldPassword(error.old_password.join("\n"));
                    }
                    if (error.hasOwnProperty("password")) {
                        setErrorPassword(error.password.join("\n"));
                    }
                    if (error.hasOwnProperty("password_confirmation")) {
                        setErrorPasswordConfirmation(error.password_confirmation.join("\n"));
                    }
                    if (!error.hasOwnProperty("old_password") && !error.hasOwnProperty("password") && !error.hasOwnProperty("password_confirmation")) {
                        setMessageError(response.data.error || "Incorrect old password");
                    }
                }
            }, function (error) { setIsLoading(false); });
        }
    }

    return (
        <WrapperNoScroll edges={['top', 'bottom']}>
            <HeaderWithIcon title="SECURITY" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    paddingBottom: Math.max(insets.bottom + theme.spacing.md, theme.spacing.xl),
                }}
            >
                <View style={[styles.container, tablet && { maxWidth: 480, alignSelf: 'center', width: '100%' }]}>
                    <View style={styles.titleImageContainer}>
                        <TitleAuth title="Change Password" />
                        <Image
                            style={{
                                width: wp(26),
                                height: wp(16),
                                marginTop: theme.spacing.xs,
                            }}
                            source={logo}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.form}>
                        <View style={styles.formControl}>
                            <Input
                                leftIcon={<Icon icon={lock} />}
                                rightIcon={
                                    isOldPasswordShown ? <Icon onPress={() => setIsOldPasswordShown(false)} icon={eyeOff} /> : <Icon onPress={() => setIsOldPasswordShown(true)} icon={eyeFilled} />
                                }
                                secureTextEntry={isOldPasswordShown}
                                value={oldPassword}
                                onChangeText={(val) => setOldPassword(val)}
                                label="Old Password"
                                placeholder="Enter Your Old Password"
                            />
                            {errorOldPassword !== '' && <ErrorText>{errorOldPassword}</ErrorText>}
                        </View>

                        <View style={styles.formControl}>
                            <Input
                                leftIcon={<Icon icon={lock} />}
                                rightIcon={
                                    isPasswordShown ? <Icon onPress={() => setIsPasswordShown(false)} icon={eyeOff} /> : <Icon onPress={() => setIsPasswordShown(true)} icon={eyeFilled} />
                                }
                                secureTextEntry={isPasswordShown}
                                onChangeText={(val) => setPassword(val)}
                                value={password}
                                label="New Password"
                                placeholder="Enter Your New Password"
                            />
                            {errorPassword !== '' && <ErrorText>{errorPassword}</ErrorText>}
                        </View>

                        <View style={styles.formControl}>
                            <Input
                                leftIcon={<Icon icon={lock} />}
                                rightIcon={
                                    isConfirmPasswordShown ? <Icon onPress={() => setIsConfirmPasswordShown(false)} icon={eyeOff} /> : <Icon onPress={() => setIsConfirmPasswordShown(true)} icon={eyeFilled} />
                                }
                                secureTextEntry={isConfirmPasswordShown}
                                onChangeText={(val) => setPasswordConfirmation(val)}
                                value={passwordConfirmation}
                                label="Confirm Password"
                                placeholder="Confirm Your New Password"
                            />
                            {errorPasswordConfirmation !== '' && <ErrorText>{errorPasswordConfirmation}</ErrorText>}
                        </View>

                        <View style={styles.formControl}>
                            {messageError !== '' && <ErrorText textAlign="center" style={{ marginBottom: theme.spacing.sm }}>{messageError}</ErrorText>}
                            <Button title="Change Password" loading={isLoading} disabled={isLoading} onPress={doPasswordReset} loadingText="Changing Your Password..." />
                        </View>

                        <View style={styles.formControl}>
                            <TouchableOpacity style={styles.addToCartButton} onPress={() => { navigation.navigate('deleteAccount') }}>
                                <Typography style={styles.buttonText}>Delete My Account</Typography>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </WrapperNoScroll>
    );
}
