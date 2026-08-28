import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Platform, ScrollView } from "react-native";
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { OtpInput } from "react-native-otp-entry";
import { Button } from "@/shared/component/buttons";
import Typography from "@/shared/component/typography";
import { logo } from "@/assets/images";
import AuthSessionService from "@/service/auth/AuthSessionService";
import ErrorText from "@/shared/component/ErrorText";
import Toasts from "@/shared/utils/Toast";
import useEffectOnce from "@/shared/hooks/useEffectOnce";
import { palette } from "@/shared/constants/colors.ts";
import LoginService from "@/service/auth/LoginService.tsx";
import { CommonActions } from "@react-navigation/native";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from "@/shared/theme";
import { FONT } from "@/shared/constants/fonts.ts";
import { isTablet, wp } from '@/shared/helpers';

// @ts-ignore
export default function ValidateAuthCode({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const tablet = isTablet();
    
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
            setOtpError("Please enter the complete OTP code that was sent to " + email);
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
                setCountdown(120);
            } else {
                setOtpError(response.data.error);
            }
        }).catch(() => {
            setIsLoading(false);
        });
    }

    return (
        <WrapperNoScroll transparent={true} edges={['top', 'bottom']}>
            <View style={styles.container}>
                <LinearGradient
                    colors={['#f8fafc', '#f1f5f9', '#e2e8f0']}
                    style={StyleSheet.absoluteFill}
                />
                
                {/* Decorative Background Elements */}
                <Animated.View 
                    entering={FadeInDown.delay(100).duration(1000)}
                    style={[styles.circle, { top: -wp(13), right: -wp(8), backgroundColor: '#F0F9FF' }]} 
                />
                <Animated.View 
                    entering={FadeInDown.delay(300).duration(1000)}
                    style={[styles.circle, { bottom: wp(25), left: -wp(16), backgroundColor: '#E0E7FF', width: wp(53), height: wp(53) }]} 
                />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        paddingTop: Math.max(insets.top + theme.spacing.lg, theme.spacing.xl),
                        paddingBottom: Math.max(insets.bottom + theme.spacing.md, theme.spacing.xl),
                    }}
                >
                    <View style={[styles.content, tablet && { maxWidth: 480, alignSelf: 'center', width: '100%' }]}>
                        <Animated.View 
                            entering={FadeInUp.duration(800)}
                            style={styles.header}
                        >
                            <View style={[styles.logoContainer, tablet && styles.logoContainerTablet]}>
                                <Image source={logo} style={styles.logo} resizeMode="contain" />
                            </View>
                            <Typography style={styles.title}>Enter Code</Typography>
                            <Typography style={styles.subText}>A 4-digit code was sent to {email}</Typography>
                        </Animated.View>

                        <Animated.View 
                            entering={FadeInDown.delay(200).duration(800)}
                            style={styles.card}
                        >
                            <View>
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

                                <View style={{ height: theme.spacing.sm }} />
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
                </ScrollView>
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
        width: wp(66),
        height: wp(66),
        borderRadius: wp(33),
        opacity: 0.6,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    logoContainer: {
        width: wp(26),
        height: wp(16),
        marginBottom: theme.spacing.md,
    },
    logoContainerTablet: {
        width: wp(15),
        height: wp(9),
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: theme.typography.display,
        fontWeight: Platform.OS === 'ios' ? '800' : undefined,
        fontFamily: FONT.EXTRA_BOLD,
        color: '#0F172A',
        textAlign: 'center',
    },
    subText: {
        fontSize: theme.typography.md,
        color: '#64748B',
        marginTop: theme.spacing.xs,
        textAlign: 'center',
        lineHeight: 22,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        ...theme.shadows.md,
    },
    otpContainer: {
        width: 56,
        height: 56,
        borderRadius: theme.borderRadius.sm,
        backgroundColor: '#F8FAFC',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    otpText: {
        fontSize: theme.typography.lg,
        fontFamily: FONT.BOLD,
        color: '#0F172A',
    },
    resendContainer: {
        alignItems: 'center',
        marginTop: theme.spacing.md,
    },
    resendLabel: {
        fontSize: theme.typography.sm,
        color: '#94A3B8',
    },
    resendLink: {
        fontSize: theme.typography.sm,
        color: palette.main.p500,
        fontFamily: FONT.BOLD,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing.xl,
    },
    footerLabel: {
        fontSize: theme.typography.md,
        color: '#64748B',
    },
    linkText: {
        fontSize: theme.typography.md,
        color: palette.main.p500,
        fontFamily: FONT.BOLD,
        marginLeft: theme.spacing.xs,
    }
});
