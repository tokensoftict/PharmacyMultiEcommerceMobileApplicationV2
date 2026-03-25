import React, { useEffect, useState, useCallback } from 'react';
import { View, Alert, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import notifee, { AndroidNotificationSetting } from '@notifee/react-native';
import Typography from '@/shared/component/typography';
import { styles } from "./styles";
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { normalize } from '@/shared/helpers';

// @ts-ignore
export default function SplashScreen({ navigation }) {
    const [isSplashDone, setIsSplashDone] = useState(false);
    const [hasPrompted, setHasPrompted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsSplashDone(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const checkPermissionAndNavigate = useCallback(async () => {
        try {
            if (Platform.OS === 'android') {
                const settings = await notifee.getNotificationSettings();
                
                // On Android, we care about both general notifications and exact alarms
                // 1 = Authorized, 2 = Provisional (Android 13+)
                const isNotificationEnabled = settings.authorizationStatus >= 1; 
                
                const alarmSetting = settings.android.alarm;
                const isAlarmOk = alarmSetting === AndroidNotificationSetting.ENABLED || 
                                 alarmSetting === AndroidNotificationSetting.NOT_SUPPORTED;

                if (isNotificationEnabled && isAlarmOk) {
                    navigation.replace('mainMenu');
                } else if (!hasPrompted) {
                    promptPermission();
                    setHasPrompted(true);
                }
            } else {
                navigation.replace('mainMenu');
            }
        } catch (error) {
            console.error("Permission check error:", error);
            navigation.replace('mainMenu');
        }
    }, [navigation, hasPrompted]);

    useFocusEffect(
        useCallback(() => {
            if (isSplashDone) {
                checkPermissionAndNavigate();
            }
        }, [isSplashDone, checkPermissionAndNavigate])
    );

    const promptPermission = () => {
        Alert.alert(
            'Enable Alarm & Reminders',
            'We need permission to send timely reminders with sound and vibration, even in the background. Please enable alarm and reminder settings to never miss a dose.',
            [
                { 
                    text: 'Not Now', 
                    style: 'cancel',
                    onPress: () => navigation.replace('mainMenu')
                },
                {
                    text: 'Enable',
                    onPress: async () => {
                        if (Platform.OS === 'android') {
                            await notifee.openAlarmPermissionSettings();
                        }
                    }
                }
            ]
        );
    };

    const handleManualEntry = () => {
        navigation.replace('mainMenu');
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
                style={StyleSheet.absoluteFill}
            />

            {/* Decorative Background Elements */}
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />

            <Animated.View entering={FadeInUp.duration(1000)} style={styles.lottieWrapper}>
                <LottieView
                    source={require('@/assets/medicine.json')}
                    autoPlay
                    loop
                    style={styles.lottie}
                />
            </Animated.View>
            
            <View style={styles.content}>
                <Animated.View entering={FadeInDown.delay(200).duration(800)}>
                    <Typography style={styles.title}>Welcome to Medication Reminder</Typography>
                </Animated.View>
                
                <Animated.View entering={FadeInDown.delay(400).duration(800)}>
                    <Typography style={styles.subtitle}>Stay on track with your medications</Typography>
                </Animated.View>

                {isSplashDone && (
                    <Animated.View entering={FadeInDown.duration(600)} style={{ marginTop: normalize(40) }}>
                        <TouchableOpacity 
                            style={styles.proceedButton} 
                            onPress={handleManualEntry}
                        >
                            <Typography style={styles.proceedButtonText}>Proceed to Dashboard</Typography>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>
        </View>
    );
}
