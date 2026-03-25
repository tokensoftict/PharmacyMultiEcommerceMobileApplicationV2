import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Platform } from "react-native";
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { OtpInput } from "react-native-otp-entry";
import { Button } from "@/shared/component/buttons";
import Typography from "@/shared/component/typography";
import { normalize } from "@/shared/helpers";
import { logo } from "@/assets/images";
import AuthSessionService from "@/service/auth/AuthSessionService";
import ErrorText from "@/shared/component/ErrorText";
import Toasts from "@/shared/utils/Toast";
import useEffectOnce from "@/shared/hooks/useEffectOnce";
import { palette } from "@/shared/constants/colors.ts";
import LoginService from "@/service/auth/LoginService.tsx";
import { CommonActions } from "@react-navigation/native";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";

const { width } = Dimensions.get('window');

// @ts-ignore
export default function ValidateAuthCode({ navigation, route }) {
    const [otpError, setOtpError] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [countdown, setCountdown] = useState(120);

    const loginService = new LoginService();

    useEffectOnce(() => {
        setEmail(route.params?.email);
    }, []);

    // Countdown Timer Effect
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const formatCountdown = (secs: number) => {
        const minutes = Math.floor(secs / 60).toString().padStart(2, '0');
        const seconds = (secs % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    function doValidateOTP() {
        if (otpCode.length !== 4) {
            setOtpError("Please enter the complete otp code that was sent to " + email);
        } else {
            setOtpError("");
            setIsLoading(true);
            setLoadingMessage("Validating OTP Code...");

            loginService.completeLoginWithoutPassword(email, otpCode).then(async function (response: any) {
                setIsLoading(false);
                if (response.status === false) {
                    if (response.hasOwnProperty('email') && response.email !== false) {
                        setOtpError(response.email);
                    }
                    if (response.hasOwnProperty('otp') && response.otp !== false) {
                        setOtpError(response.otp);
                    }
                    if (response.hasOwnProperty('message') && response.message !== false) {
                        setOtpError(response.message);
                    }
                } else {
                    if (response.hasOwnProperty('trashed') && response.trashed) {
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'restoreMyAccount' }],
                        });
                        navigation.navigate('restoreMyAccount');
                    } else {
                        const userProfile = new AuthSessionService().getAuthSession();
                        const userData = userProfile?.data;
                        const systemSettings = (userData as any)?.systemSettings;
                        const authKey = systemSettings?.verifyField ?? 'phone_verified_status';

                        if (userData && userData[authKey] === false) {
                            if (systemSettings?.mustVerify === "email") {
                                Toasts("Please verify your email address to continue!");
                                navigation.navigate('enterEmailOTP', { otp: true });
                            } else {
                                Toasts("Please verify your phone number to continue!");
                                navigation.navigate('enterOTP', { otp: true });
                            }
                        } else {
                            Toasts('Login successful, please wait..');
                            setTimeout(() => {
                                if (userData?.apps && userData.apps.length === 1) {
                                    navigation.replace("supermarket");
                                } else {
                                    navigation.replace("storeSelector");
                                }
                            }, 1000);
                        }
                    }
                }
            }, function (error) {
                setIsLoading(false);
                if (error.hasOwnProperty('message') && error.message !== false) {
                    setOtpError(error.message);
                }
            });

        }
    }

    function requestForOtp() {
        setIsLoading(true);
        loginService.loginWithOutPassword(email).then((response) => {
            setIsLoading(false);
            if (response.data.status === true) {
                Toasts("OTP has been sent to " + email);
                setCountdown(120); // restart countdown
            } else {
                setOtpError(response.data.error);
            }
        }).catch(() => {
            setIsLoading(false);
        });
    }

    return (
        <WrapperNoScroll transparent={true} edges={[]}>
            <View style={styles.container}>
                <LinearGradient
                    colors={['#f8fafc', '#f1f5f9', '#e2e8f0']}
                    style={StyleSheet.absoluteFill}
                />
                
                {/* Decorative Background Elements */}
                <Animated.View 
                    entering={FadeInDown.delay(100).duration(1000)}
                    style={[styles.circle, { top: -normalize(50), right: -normalize(30), backgroundColor: '#F0F9FF' }]} 
                />
                <Animated.View 
                    entering={FadeInDown.delay(300).duration(1000)}
                    style={[styles.circle, { bottom: normalize(100), left: -normalize(60), backgroundColor: '#E0E7FF', width: normalize(200), height: normalize(200) }]} 
                />

                <View style={styles.content}>
                    <Animated.View 
                        entering={FadeInUp.duration(800)}
                        style={styles.header}
                    >
                        <View style={styles.logoContainer}>
                            <Image source={logo} style={styles.logo} resizeMode="contain" />
                        </View>
                        <Typography style={styles.title}>Enter Code</Typography>
                        <Typography style={styles.subText}>A 4-digit code was sent to {email}</Typography>
                    </Animated.View>

                    <Animated.View 
                        entering={FadeInDown.delay(200).duration(800)}
                        style={styles.card}
                    >
                        <View style={styles.form}>
                            <OtpInput
                                numberOfDigits={4}
                                focusColor={palette.main.p500}
                                autoFocus={true}
                                hideStick={true}
                                placeholder="****"
                                blurOnFilled={true}
                                disabled={false}
                                type="numeric"
                                secureTextEntry={false}
                                focusStickBlinkingDuration={500}
                                onFilled={(text) => setOtpCode(text)}
                                textInputProps={{
                                    accessibilityLabel: "Enter OTP Code",
                                }}
                                theme={{
                                    pinCodeContainerStyle: styles.otpContainer,
                                    pinCodeTextStyle: styles.otpText,
                                    focusStickStyle: { backgroundColor: palette.main.p500 }
                                }}
                            />

                            <View style={{ height: normalize(24) }} />
                            {otpError !== '' && <ErrorText textAlign="center">{otpError}</ErrorText>}

                            <Button
                                loading={isLoading}
                                disabled={isLoading}
                                onPress={doValidateOTP}
                                title="Verify & Continue"
                            />

                            {/* Countdown or Resend */}
                            <View style={styles.resendContainer}>
                                {countdown > 0 ? (
                                    <Typography style={styles.resendLabel}>
                                        Resend code in {formatCountdown(countdown)}
                                    </Typography>
                                ) : (
                                    <TouchableOpacity onPress={requestForOtp}>
                                        <Typography style={styles.resendLink}>
                                            Didn’t receive code? Resend
                                        </Typography>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </Animated.View>

                    <Animated.View 
                        entering={FadeInDown.delay(400).duration(800)}
                        style={styles.footer}
                    >
                        <Typography style={styles.footerLabel}>Entered wrong details?</Typography>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Typography style={styles.linkText}>Go Back</Typography>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </WrapperNoScroll>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    circle: {
        position: 'absolute',
        width: normalize(250),
        height: normalize(250),
        borderRadius: normalize(125),
        opacity: 0.6,
    },
    content: {
        flex: 1,
        paddingHorizontal: normalize(24),
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: normalize(40),
    },
    logoContainer: {
        width: normalize(100),
        height: normalize(60),
        marginBottom: normalize(16),
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: normalize(28),
        fontWeight: Platform.OS === 'ios' ? '800' : undefined,
        color: '#0F172A',
        textAlign: 'center',
    },
    subText: {
        fontSize: normalize(15),
        color: '#64748B',
        marginTop: normalize(8),
        textAlign: 'center',
        lineHeight: normalize(22),
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(24),
        padding: normalize(24),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    form: {
        width: '100%',
    },
    otpContainer: {
        width: normalize(56),
        height: normalize(56),
        borderRadius: normalize(12),
        backgroundColor: '#F8FAFC',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    otpText: {
        fontSize: normalize(20),
        fontWeight: Platform.OS === 'ios' ? '700' : undefined,
        color: '#0F172A',
    },
    resendContainer: {
        alignItems: 'center',
        marginTop: normalize(24),
    },
    resendLabel: {
        fontSize: normalize(14),
        color: '#94A3B8',
    },
    resendLink: {
        fontSize: normalize(14),
        color: palette.main.p500,
        fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: normalize(40),
    },
    footerLabel: {
        fontSize: normalize(15),
        color: '#64748B',
    },
    linkText: {
        fontSize: normalize(15),
        color: palette.main.p500,
        fontWeight: Platform.OS === 'ios' ? '700' : undefined,
        marginLeft: normalize(6),
    }
});
