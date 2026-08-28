import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import WrapperNoScrollNoDialogNoSafeArea from "@/shared/component/wrapperNoScrollNoDialogNoSafeArea";
import { FONT } from "@/shared/constants/fonts.ts";
import Typography from "@/shared/component/typography";
import { labels } from "@/shared/constants/colors.ts";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import Security from "@/service/auth/Security.tsx";
import { useLoading } from "@/shared/utils/LoadingProvider.tsx";
import { CommonActions } from "@react-navigation/native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from "@/shared/theme";
import { isTablet } from '@/shared/helpers';

// @ts-ignore
export default function RestoreAccountScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const tablet = isTablet();
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
                                    index: 0,
                                    routes: [{ name: 'login' }],
                                });
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
            <ScrollView 
                showsVerticalScrollIndicator={false}
                style={{ backgroundColor: '#ffffff' }}
                contentContainerStyle={{
                    paddingTop: Math.max(insets.top + theme.spacing.lg, 80),
                    paddingBottom: Math.max(insets.bottom + theme.spacing.md, theme.spacing.xl),
                }}
            >
                <View style={[styles.container, tablet && { maxWidth: 480, alignSelf: 'center', width: '100%' }]}>
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
        paddingHorizontal: theme.spacing.lg,
    },
    logo: {
        width: 150,
        height: 150,
        alignSelf: 'center',
    },
    iconContainer: {
        marginBottom: theme.spacing.md,
        backgroundColor: '#e0f7e9',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.full,
    },
    icon: {
        width: 60,
        height: 60,
        tintColor: '#2ecc71',
    },
    title: {
        fontSize: theme.typography.md,
        color: '#333',
        textAlign: 'center',
        fontFamily: FONT.NORMAL,
        marginBottom: theme.spacing.xs,
    },
    userTitle: {
        fontSize: theme.typography.xl,
        color: labels.type4.textColor,
        textAlign: 'center',
        fontFamily: FONT.BOLD,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        fontSize: theme.typography.sm,
        color: '#555',
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
        fontFamily: FONT.NORMAL,
        lineHeight: 22,
    },
    restoreButton: {
        backgroundColor: '#2ecc71',
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.borderRadius.full,
        ...theme.shadows.sm,
        shadowColor: '#2ecc71',
    },
    goBack: {
        backgroundColor: labels.type4.textColor,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.borderRadius.full,
        marginTop: theme.spacing.md,
        ...theme.shadows.sm,
        shadowColor: labels.type4.textColor,
    },
    restoreText: {
        color: '#fff',
        fontSize: theme.typography.body,
        fontFamily: FONT.BOLD,
    },
});
