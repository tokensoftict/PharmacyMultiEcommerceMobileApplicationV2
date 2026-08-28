import { CommonActions, useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";
import React, { useState } from "react";
import { styles } from "./styles";
import HeaderWithIcon from "@/shared/component/headerBack";
import { Image, View, ScrollView } from "react-native";
import TitleAuth from "@/shared/component/titleAuth";
import { logo } from "@/assets/images";
import Typography from "@/shared/component/typography";
import Input from "@/shared/component/input";
import Icon from "@/shared/component/icon";
import { eyeFilled, eyeOff, lock } from "@/assets/icons";
import ErrorText from "@/shared/component/ErrorText";
import { Button } from "@/shared/component/buttons";
import ResetPasswordService from "@/service/auth/ResetPasswordService";
import AuthSessionService from "@/service/auth/AuthSessionService";
import Toasts from "@/shared/utils/Toast.tsx";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from "@/shared/theme";
import { isTablet, wp } from '@/shared/helpers';
import useDarkMode from "@/shared/hooks/useDarkMode.tsx";

export default function ResetPassword() {
    const navigation = useNavigation<NavigationProps>();
    const insets = useSafeAreaInsets();
    const tablet = isTablet();
    const { isDarkMode } = useDarkMode();

    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(true);
    const [pin, setPin] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [messageError, setMessageError] = useState('');

    const [errorPin, setErrorPin] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorPasswordConfirmation, setErrorPasswordConfirmation] = useState("");

    const passwordRequest = new ResetPasswordService();
    const phone = new AuthSessionService().getPageSessionData("phone");

    const backToLoginPage = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "login" }]
            })
        );
    };

    function doPasswordReset() {
        let validationError = false;
        setErrorPin("");
        setErrorPassword("");
        setErrorPasswordConfirmation("");

        if (pin === "") {
            setErrorPin("Please enter the four digit pin sent to your phone");
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
            passwordRequest.resetPassword(phone, pin, password, passwordConfirmation).then(function (response) {
                setIsLoading(false);
                if (response.data.status === true) {
                    new AuthSessionService().setPageSessionData("phone", "");
                    Toasts('Your password has been reset successfully 👋 , please login with your new password');
                    backToLoginPage();
                } else {
                    const error = response.data.error;
                    if (error.hasOwnProperty("pin")) {
                        setErrorPin(error.pin.join("\n"));
                    }
                    if (error.hasOwnProperty("password")) {
                        setErrorPassword(error.password.join("\n"));
                    }
                    if (error.hasOwnProperty("password_confirmation")) {
                        setErrorPasswordConfirmation(error.password_confirmation.join("\n"));
                    }
                    if (!error.hasOwnProperty("pin") && !error.hasOwnProperty("password") && !error.hasOwnProperty("password_confirmation")) {
                        setMessageError(response.data.error || "Reset link expired or invalid pin");
                    }
                }
            }, function (error) { setIsLoading(false); });
        }
    }

    return (
        <WrapperNoScroll transparent={true} edges={['top', 'bottom']}>
            <HeaderWithIcon />
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
                        <TitleAuth title="Reset Password" />
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

                    <View style={styles.containerEmail}>
                        <Typography style={{ color: isDarkMode ? '#FFF' : '#64748B' }}>A Four digits code has been sent to</Typography>
                        <Typography style={styles.textEmail}>{phone}</Typography>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.formControl}>
                            <Input
                                leftIcon={<Icon icon={lock} />}
                                value={pin}
                                onChangeText={(val) => setPin(val)}
                                maxLength={4}
                                keyboardType="phone-pad"
                                label="Four Digit Code"
                                placeholder="Enter the four digit code"
                            />
                            {errorPin !== '' && <ErrorText>{errorPin}</ErrorText>}
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
                            <Button title="Reset Password" loading={isLoading} disabled={isLoading} onPress={doPasswordReset} loadingText="Resetting Your Password..." />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </WrapperNoScroll>
    );
}
