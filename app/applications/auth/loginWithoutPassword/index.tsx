import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native";
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import TitleAuth from "@/shared/component/titleAuth";
import Input from "@/shared/component/input";
import Icon from "@/shared/component/icon";
import { mail } from "@/assets/icons";
import { Button } from "@/shared/component/buttons";
import Typography from "@/shared/component/typography";
import { normalize } from "@/shared/helpers";
import { logo } from "@/assets/images";
import ErrorText from "@/shared/component/ErrorText";
import Toasts from "@/shared/utils/Toast.tsx";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import LoginService from "@/service/auth/LoginService.tsx";
import { palette } from "@/shared/constants/colors.ts";

const { width } = Dimensions.get('window');

export default function PasswordLessLogin({ navigation }: any) {
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
                        <Typography style={styles.title}>One-Time Sign In</Typography>
                        <Typography style={styles.subText}>Sign in securely with a temporary code</Typography>
                    </Animated.View>

                    <Animated.View 
                        entering={FadeInDown.delay(200).duration(800)}
                        style={styles.card}
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
                        <Typography style={styles.footerLabel}>Back to</Typography>
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
    inputGroup: {
        marginBottom: normalize(24),
    },
    errorBanner: {
        backgroundColor: '#FEF2F2',
        padding: normalize(12),
        borderRadius: normalize(12),
        marginBottom: normalize(20),
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
