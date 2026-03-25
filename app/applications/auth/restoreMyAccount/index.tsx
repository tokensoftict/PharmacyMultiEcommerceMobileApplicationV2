import React from 'react';

import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import WrapperNoScrollNoDialogNoSafeArea from "@/shared/component/wrapperNoScrollNoDialogNoSafeArea";
import { normalize } from "@/shared/helpers";
import { FONT } from "@/shared/constants/fonts.ts";
import Typography from "@/shared/component/typography";
import { labels } from "@/shared/constants/colors.ts";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import Security from "@/service/auth/Security.tsx";
import { useLoading } from "@/shared/utils/LoadingProvider.tsx";
import { CommonActions } from "@react-navigation/native";

// @ts-ignore
export default function RestoreAccountScreen({ navigation }) {
    const trashedUser = new AuthSessionService().getTrashedUserData();
    const service = new Security();
    const { showLoading, hideLoading } = useLoading();
    const handleRestore = () => {
        Alert.alert(
            'Are you want to restore your account?',
            'Bring back your profile, settings, and everything else — just like before.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes',
                    style: 'default',
                    onPress: () => {
                        showLoading("Restoring account.. please wait...");
                        service.restoreMyAccount(trashedUser.id).then((response) => {
                            hideLoading();
                            if (response.data.status === true) {
                                Alert.alert('Account Restored', 'Great! Your account has been restored successfully, Please login to continue where you left off.');
                                CommonActions.reset({
                                    index: 0, // Set the index of the active screen
                                    routes: [{ name: 'login' }], // Replace with your target screen
                                })
                                navigation.navigate('login');
                            } else {
                                Alert.alert('Account Restore', 'There was an error restoring, your account');
                            }
                        });
                    },
                },
            ]
        );
    };

    return (
        <WrapperNoScrollNoDialogNoSafeArea noBottomSpace={true}>
            <ScrollView style={{ paddingTop: normalize(90), backgroundColor: '#ffffff', }}>
                <View style={styles.container}>
                    <Animatable.View animation="fadeInDown" duration={200} style={styles.iconContainer}>
                        <Image
                            source={require("@/assets/images/account-restore.png")}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </Animatable.View>

                    <Animatable.Text animation="fadeInUp" delay={500} style={styles.userTitle}>
                        Hi {trashedUser.name}
                    </Animatable.Text>

                    <Animatable.Text animation="fadeInUp" delay={600} style={styles.subtitle}>
                        It looks like your account was recently deleted. If you didn’t mean to do this, or if you’ve changed your mind, don’t worry — you still have time to bring everything back. Restoring your account will recover your data, preferences, and activity just as you left them. Tap the button below to restore your account and continue where you left off.
                    </Animatable.Text>

                    <Animatable.View animation="zoomIn" delay={900}>
                        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
                            <Typography style={styles.restoreText}>Restore My Account</Typography>
                        </TouchableOpacity>
                    </Animatable.View>

                    <Animatable.View animation="zoomIn" delay={1200}>
                        <TouchableOpacity style={styles.goBack} onPress={navigation.goBack}>
                            <Typography style={styles.restoreText}>Cancel And Go Back</Typography>
                        </TouchableOpacity>
                    </Animatable.View>

                </View>
            </ScrollView>
        </WrapperNoScrollNoDialogNoSafeArea>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: normalize(20),
    },
    logo: {
        width: normalize(150),
        height: normalize(150),
        alignSelf: 'center',
    },
    iconContainer: {
        marginBottom: normalize(30),
        backgroundColor: '#e0f7e9',
        padding: normalize(30),
        borderRadius: normalize(100),
    },
    icon: {
        width: normalize(60),
        height: normalize(60),
        tintColor: '#2ecc71',
    },
    title: {
        fontSize: normalize(20),

        color: '#333',
        textAlign: 'center',
        fontFamily: FONT.NORMAL,
        marginBottom: normalize(10),
    },
    userTitle: {
        fontSize: normalize(26),

        color: labels.type4.textColor,
        textAlign: 'center',
        fontFamily: FONT.NORMAL,
        marginBottom: normalize(10),
    },
    subtitle: {
        fontSize: normalize(16),
        color: '#555',
        textAlign: 'center',
        marginBottom: normalize(40),
        fontFamily: FONT.NORMAL,
    },
    restoreButton: {
        backgroundColor: '#2ecc71',
        paddingVertical: normalize(15),
        paddingHorizontal: normalize(40),
        borderRadius: normalize(30),
        shadowColor: '#2ecc71',
        shadowOffset: { width: normalize(0), height: normalize(10) },
        shadowOpacity: 0.3,
        shadowRadius: normalize(20),
        elevation: normalize(6),
        fontFamily: FONT.NORMAL,
    },
    goBack: {
        backgroundColor: labels.type4.textColor,
        paddingVertical: normalize(15),
        paddingHorizontal: normalize(40),
        borderRadius: normalize(30),
        marginTop: normalize(30),
        shadowColor: labels.type4.textColor,
        shadowOffset: { width: normalize(0), height: normalize(10) },
        shadowOpacity: 0.3,
        shadowRadius: normalize(20),
        elevation: normalize(6),
        fontFamily: FONT.NORMAL,
    },
    restoreText: {
        color: '#fff',
        fontSize: normalize(18),

        fontFamily: FONT.NORMAL,
    },
})
