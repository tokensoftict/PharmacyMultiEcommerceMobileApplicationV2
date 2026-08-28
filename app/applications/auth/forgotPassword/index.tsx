import React, { useState } from "react";
import HeaderWithIcon from "@/shared/component/headerBack";
import { Image, ScrollView, View } from "react-native";
import TitleAuth from "@/shared/component/titleAuth";
import Typography from "@/shared/component/typography";
import Input from "@/shared/component/input";
import { Button } from "@/shared/component/buttons";
import { styles } from './styles';
import { logo } from "@/assets/images";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";
import ErrorText from "@/shared/component/ErrorText";
import ResetPasswordService from "@/service/auth/ResetPasswordService.tsx";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import Toasts from "@/shared/utils/Toast.tsx";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from "@/shared/theme";
import { isTablet, wp } from '@/shared/helpers';

export default function ForgotPassword() {
    const navigation = useNavigation<NavigationProps>();
    const insets = useSafeAreaInsets();
    const tablet = isTablet();

    const [isLoading, setIsLoading] = useState(false);
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [emailOrPhoneError, setEmailOrPhoneError] = useState("");

    const forgotPasswordService = new ResetPasswordService();

    const backToLoginPage = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "login" }]
            })
        );
    };

    function doPasswordRequest() {
        if (emailOrPhone === "") {
            setEmailOrPhoneError("Please enter your phone number or email address!");
        } else {
            setEmailOrPhoneError("");
            setIsLoading(true);
            forgotPasswordService.resetPasswordRequest(emailOrPhone).then(function (response) {
                setIsLoading(false);
                if (response.data.status === true) {
                    new AuthSessionService().setPageSessionData("phone", emailOrPhone);
                    navigation.navigate('resetPassword');
                    Toasts(response.data.data.message);
                } else {
                    const error = response.data.error;
                    if (error.hasOwnProperty("email_or_phone")) {
                        setEmailOrPhoneError(error.email_or_phone.join("\n"));
                    } else {
                        setEmailOrPhoneError(error);
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
                        <TitleAuth title="Forgot Password" />
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

                    <Typography style={styles.description}>
                        {"Don't worry! It happens. Please enter the email or phone number associated with your account"}
                    </Typography>

                    <View style={styles.form}>
                        <Input
                            label="Email/Phone Number"
                            placeholder="Enter Your Email or Phone Number"
                            value={emailOrPhone}
                            onChangeText={(val) => setEmailOrPhone(val)}
                        />
                        {emailOrPhoneError !== '' && <ErrorText>{emailOrPhoneError}</ErrorText>}
                    </View>
                    <Button title="Request Password Reset" disabled={isLoading} loading={isLoading} onPress={doPasswordRequest} />
                </View>
            </ScrollView>
        </WrapperNoScroll>
    );
}
