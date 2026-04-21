import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";
import { MedReminderSchedules } from "@/service/medReminder/interface/MedReminderInterface.tsx";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import LinearGradient from "react-native-linear-gradient";
import { styles } from "./styles"
import { TouchableOpacity, View, Alert, FlatList, StatusBar, StyleSheet, ScrollView } from "react-native";
import Icon from "@/shared/component/icon";
import { arrowBack, drug, history } from "@/assets/icons";
import Typography from "@/shared/component/typography";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import HeaderWithIcon from "@/shared/component/headerBack";
import MedReminderService from "@/service/medReminder/MedReminderService.tsx";
import Toastss from "@/shared/utils/Toast.tsx";
import { useLoading } from "@/shared/utils/LoadingProvider.tsx";
import ButtonSheet from "@/shared/component/buttonSheet";
import { normalize } from "@/shared/helpers";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import { palette } from "@/shared/constants/colors.ts";
import MotiAnimated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function ViewReminder() {
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute();
    const [medication, setMedication] = useState<MedReminderSchedules>();
    const [taken, setTaken] = useState(false);
    const { showLoading, hideLoading } = useLoading();
    const [openIntervalDialog, setOpenIntervalDialog] = useState(false);

    const pendingPalette = {
        primary: '#FF7E5F',
        secondary: '#FEB47B',
        accent: '#FF416C',
        bg: ['#FF7E5F', '#FEB47B']
    };

    const completedPalette = {
        primary: '#00B09B',
        secondary: '#96C93D',
        accent: '#1D976C',
        bg: ['#00B09B', '#96C93D']
    };

    const currentPalette = taken ? pendingPalette : completedPalette;

    function goBack() {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            setTimeout(() => {
                navigation.replace(new AuthSessionService().getEnvironment())
            }, 1200);
        }
    }

    useEffectOnce(function () {
        const authService = new AuthSessionService();
        // @ts-ignore
        let med = route.params?.schedule;
        if (!med) {
            const startUpPage = JSON.parse(authService.getLaunchPage());
            med = startUpPage['extraData'];
            med.allowTaken = true;
        }
        setTaken(med.status === "Pending" || med.status === "Scheduled");
        setMedication(med);
    }, []);

    const intervalList = [
        { name: "10 Minutes", id: "10 minutes" },
        { name: "20 Minutes", id: "20 minutes" },
        { name: "30 Minutes", id: "30 minutes" },
        { name: "1 Hour", id: "1 hour" },
        { name: "2 Hours", id: "2 hour" },
    ];

    const snoozeNotification = function (item: any) {
        Alert.alert('PS GDC', 'Snooze this reminder for ' + item.name + '?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Yes', onPress: () => {
                    const updateData = { snoozed_at: item.id };
                    showLoading("Updating reminder...");
                    // @ts-ignore
                    (new MedReminderService()).updateHistoryStatus(medication?.id, updateData).then((response) => {
                        hideLoading();
                        if (response.data.status === true) {
                            Toastss("Reminder snoozed.");
                            goBack();
                        }
                    }).catch(() => hideLoading());
                }
            }
        ]);
        setOpenIntervalDialog(false);
    }

    const makeScheduleHasTaken = function (schedule_id: number | string) {
        Alert.alert('PS GDC', 'Mark this medication as taken?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Yes', onPress: () => {
                    const updateData = { status: 'Completed' };
                    showLoading("Updating...");
                    (new MedReminderService()).updateHistoryStatus(schedule_id, updateData).then((response) => {
                        hideLoading();
                        if (response.data.status === true) {
                            Toastss("Updated successfully.");
                            goBack();
                        }
                    }).catch(() => hideLoading());
                }
            }
        ]);
    }

    return (
        <WrapperNoScroll barStyle="light-content" transparent={false}>
            <LinearGradient
                colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
                style={StyleSheet.absoluteFill}
            />
            {/* Decorative mesh elements */}
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />

            <HeaderWithIcon title="MEDICATION DETAILS" />

            <View style={{ flex: 1 }}>
                <ScrollView
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: normalize(40) }}
                >
                    <MotiAnimated.View entering={FadeInUp.duration(800)} style={styles.mainContent}>
                        <View style={styles.medCard}>
                            <View style={[styles.statusBadge, { backgroundColor: `${currentPalette.accent}20` }]}>
                                <Typography style={[styles.statusText, { color: currentPalette.accent }]}>
                                    {taken ? '⏰ PENDING' : '✅ COMPLETED'}
                                </Typography>
                            </View>

                            <View style={[styles.iconWrapper, { backgroundColor: `${currentPalette.primary}10` }]}>
                                <Icon icon={drug} width={normalize(60)} height={normalize(60)} tintColor={currentPalette.primary} />
                            </View>

                            <Typography style={styles.drugName}>{medication?.drugName}</Typography>
                            <Typography style={styles.titleMed}>{medication?.title || 'Daily Dose'}</Typography>
                        </View>

                        <MotiAnimated.View entering={FadeInDown.delay(200).duration(800)} style={styles.detailsGrid}>
                            <View style={styles.detailItem}>
                                <Typography style={styles.detailLabel}>Dosage</Typography>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon icon={drug} width={14} height={14} tintColor={palette.main.p500} customStyles={{ marginRight: 6 }} />
                                    <Typography style={styles.detailValue}>{medication?.dosage} {medication?.dosage_form}</Typography>
                                </View>
                            </View>
                            <View style={styles.detailItem}>
                                <Typography style={styles.detailLabel}>Time</Typography>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon icon={history} width={14} height={14} tintColor={palette.main.p500} customStyles={{ marginRight: 6 }} />
                                    <Typography style={styles.detailValue}>{medication?.scheduled_at}</Typography>
                                </View>
                            </View>
                        </MotiAnimated.View>

                        {medication?.med_reminder.notes && (
                            <MotiAnimated.View entering={FadeInDown.delay(400).duration(800)} style={styles.notesCard}>
                                <Typography style={styles.notesTitle}>Instructions & Notes</Typography>
                                <Typography style={styles.notesText}>{medication.med_reminder.notes}</Typography>
                            </MotiAnimated.View>
                        )}
                    </MotiAnimated.View>
                </ScrollView>

                {taken && medication?.allowTaken && (
                    <MotiAnimated.View entering={FadeInUp.delay(600)} style={styles.actionContainer}>
                        <TouchableOpacity style={styles.snoozeButton} onPress={() => setOpenIntervalDialog(true)}>
                            <View style={styles.snoozeGradient}>
                                <Typography style={[styles.buttonText, { color: '#64748B' }]}>SNOOZE</Typography>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.takeButton} onPress={() => medication?.id && makeScheduleHasTaken(medication.id)}>
                            <LinearGradient colors={['#10B981', '#059669']} style={styles.takeGradient}>
                                <Typography style={[styles.buttonText, { color: 'white' }]}>TAKE NOW</Typography>
                            </LinearGradient>
                        </TouchableOpacity>
                    </MotiAnimated.View>
                )}
            </View>

            <ButtonSheet
                onClose={() => setOpenIntervalDialog(false)}
                dispatch={openIntervalDialog}
                height={normalize(400)}
            >
                <View style={styles.sheetContainer}>
                    <Typography style={styles.sheetTitle}>Snooze Duration</Typography>
                    <FlatList
                        data={intervalList}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.intervalItem} onPress={() => snoozeNotification(item)}>
                                <Typography style={styles.intervalText}>{item.name}</Typography>
                                <Icon icon={history} width={20} height={20} tintColor="#94A3B8" />
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </ButtonSheet>
        </WrapperNoScroll>
    );
}
