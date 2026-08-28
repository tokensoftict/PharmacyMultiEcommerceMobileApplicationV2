import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native";
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Input from "@/shared/component/input";
import Icon from "@/shared/component/icon";
import { mail } from "@/assets/icons";
import { Button } from "@/shared/component/buttons";
import Typography from "@/shared/component/typography";
import { logo } from "@/assets/images";
import ErrorText from "@/shared/component/ErrorText";
import Toasts from "@/shared/utils/Toast.tsx";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import LoginService from "@/service/auth/LoginService.tsx";
import { palette } from "@/shared/constants/colors.ts";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from "@/shared/theme";
import { FONT } from "@/shared/constants/fonts.ts";
import { isTablet, wp } from '@/shared/helpers';

export default function PasswordLessLogin({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const tablet = isTablet();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [messageError, setMessageError] = useState('');
    const loginService = new LoginService();

    async function requestLoginLink() {
        if (email === '') {
            setEmailError('Email Address or Phone Number is required');
            return;
        }

        setIsLoading(true);
        setEmailError('');
        setMessageError('');

        try {
            loginService.loginWithOutPassword(email).then(function (response: any) {
                setIsLoading(false);
                if (response.data.status === true) {
                     Toasts("We have sent code to "+email);
                     navigation.navigate("validateAuthCode", { email : email});
                } else {
                     const error = response.data.error;
                     setMessageError(error['email']);
                }
            })
        } catch (error: any) {
            setIsLoading(false);
            setMessageError(error.message || "Something went wrong, try again.");
        }
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

                <View style={[styles.content, {
                    paddingTop: Math.max(insets.top + theme.spacing.lg, theme.spacing.xl),
                    paddingBottom: Math.max(insets.bottom + theme.spacing.md, theme.spacing.xl),
                }]}>
                    <Animated.View 
                        entering={FadeInUp.duration(800)}
                        style={styles.header}
                    >
                        <View style={[styles.logoContainer, tablet && styles.logoContainerTablet]}>
                            <Image source={logo} style={styles.logo} resizeMode="contain" />
                        </View>
                        <Typography style={styles.title}>One-Time Sign In</Typography>
                        <Typography style={styles.subText}>Sign in securely with a temporary code</Typography>
                    </Animated.View>

                    <Animated.View 
                        entering={FadeInDown.delay(200).duration(800)}
                        style={[styles.card, tablet && styles.cardTablet]}
                    >
                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Input
                                    leftIcon={<Icon icon={mail} />}
                                    label="Email or Phone Number"
                                    keyboardType="default"
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Enter your email or phone"
                                />
                                {emailError !== '' && <ErrorText>{emailError}</ErrorText>}
                            </View>

                            {messageError !== '' && (
                                <View style={styles.errorBanner}>
                                    <ErrorText textAlign="center">{messageError}</ErrorText>
                                </View>
                            )}

                            <Button
                                loading={isLoading}
                                disabled={isLoading}
                                onPress={requestLoginLink}
                                loadingText="Sending Code..."
                                title="Send OTP"
                            />
                        </View>
                    </Animated.View>

                    <Animated.View 
                        entering={FadeInDown.delay(400).duration(800)}
                        style={styles.footer}
                    >
                        <Typography style={styles.footerLabel}>Back to </Typography>
                        <TouchableOpacity onPress={() => navigation.navigate("login")}>
                            <Typography style={styles.linkText}>Password Login</Typography>
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
        fontFamily: FONT.EXTRA_BOLD,
        color: '#0F172A',
        textAlign: 'center',
    },
    subText: {
        fontSize: theme.typography.md,
        color: '#64748B',
        marginTop: theme.spacing.xs,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        ...theme.shadows.md,
    },
    cardTablet: {
        maxWidth: 480,
        alignSelf: 'center',
        width: '100%',
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: theme.spacing.lg,
    },
    errorBanner: {
        backgroundColor: '#FEF2F2',
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.lg,
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
