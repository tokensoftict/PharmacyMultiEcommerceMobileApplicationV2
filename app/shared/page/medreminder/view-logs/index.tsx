import React, { useCallback, useState } from 'react';
import { styles } from "./styles"
import LinearGradient from "react-native-linear-gradient";
import { palette, design } from "@/shared/constants/colors.ts";
import { Alert, RefreshControl, ScrollView, TouchableOpacity, View, StyleSheet } from "react-native";
import Icon from "@/shared/component/icon";
import {
    checkIcon,
    history,
    medica,
} from "@/assets/icons";
import Typography from "@/shared/component/typography";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";
import { MedReminderInterface, MedReminderSchedules } from "@/service/medReminder/interface/MedReminderInterface.tsx";
import MedReminderService from "@/service/medReminder/MedReminderService.tsx";
import Toastss from "@/shared/utils/Toast.tsx";
import { useLoading } from "@/shared/utils/LoadingProvider.tsx";
import ButtonSheet from "@/shared/component/buttonSheet";
import { normalize } from "@/shared/helpers";
import { scheduleNotification } from "@/shared/utils/ScheduleNotification.tsx";
import dayjs from "dayjs";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import Environment from "@/shared/utils/Environment.tsx";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import HeaderWithIcon from "@/shared/component/headerBack";
import MotiAnimated, { FadeInDown } from 'react-native-reanimated';


export default function ViewLogs() {
    const navigation = useNavigation<NavigationProps>();
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshLoading, setRefreshLoading] = useState<boolean>(false);
    const [medication, setMedication] = useState<MedReminderInterface>();
    const [medicationHistory, setMedicationHistory] = useState<MedReminderSchedules[]>([]);
    const [openApproveMedReminderDialog, setApproveMedReminderDialog] = useState(false);
    const { showLoading, hideLoading } = useLoading();
    const [approveLoading, setApproveLoading] = useState(false);
    const [notificationData, setNotificationData] = useState<any>({});
    const route = useRoute();
    
    const loadTodayHistory = useCallback((med: MedReminderInterface) => {
        setLoading(true);
        // @ts-ignore
        (new MedReminderService()).loadHistoryForReminder(med?.id).then((response) => {
            setLoading(false);
            setRefreshLoading(false);
            if (response.data.status === true) {
                setMedicationHistory(response.data.data);
            } else {
                setMedicationHistory([]);
                Toastss("Error loading schedules.");
            }
        }).catch(() => {
            setLoading(false);
            setRefreshLoading(false);
        });
    }, []);


    useFocusEffect(
        useCallback(() => {
            const nData = Environment.getNotificationData();
            // @ts-ignore
            const medReminder = route.params?.medReminder ?? nData;
            setMedication(medReminder);
            if (medReminder) loadTodayHistory(medReminder);
            if (nData && Object.keys(nData).length > 0) {
                setNotificationData(nData);
                setApproveMedReminderDialog(true);
            }
        }, [route.params, loadTodayHistory])
    );


    function refreshLoadingTrigger() {
        if (medication) {
            setRefreshLoading(true);
            loadTodayHistory(medication);
        }
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
                            if (medication) loadTodayHistory(medication);
                        }
                    }).catch(() => hideLoading());
                }
            }
        ]);
    }

    function approveMedReminder() {
        setApproveLoading(true);
        (new MedReminderService()).show(medication?.id ?? "").then((response) => {
            if (response.data.status === true) {
                const schedules = response.data.data.schedules;
                Promise.all(
                    schedules.map(async (schedule: any, index: number) => {
                        const notificationId = await scheduleNotification(
                            schedule.id,
                            schedule.drugName,
                            schedule.dosage,
                            schedule.dosage_form,
                            // @ts-ignore
                            new Date(dayjs(schedule.js_date)).getTime() + index,
                            schedule,
                            new AuthSessionService().getEnvironment(),
                            "VIEW_MED_REMINDER",
                        );
                        return { [schedule.id]: notificationId };
                    })
                ).then(() => {
                    setApproveLoading(false);
                    Toastss("Reminder scheduled successfully.");
                    setApproveMedReminderDialog(false);
                }).catch(() => {
                    setApproveLoading(false);
                    Toastss("Error creating schedules.");
                });
            } else {
                setApproveLoading(false);
            }
        });
    }

    function navigate(path: string, params = {}) {
        // @ts-ignore
        navigation.navigate(path, params);
    }

    return (
        <WrapperNoScroll loading={loading} transparent={false} barStyle="light-content" backgroundColorStatusBar={design.text1.background}>
            <View style={[StyleSheet.absoluteFillObject, { overflow: 'hidden' }]}>
                <LinearGradient
                    colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
                    style={StyleSheet.absoluteFill}
                />
                {/* Decorative circles */}
                <View style={[styles.circle, styles.circle1]} />
                <View style={[styles.circle, styles.circle2]} />
            </View>

            <HeaderWithIcon title={medication?.drug_name || 'MEDICATION LOGS'} />
            
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: normalize(100) }}
                    refreshControl={
                        <RefreshControl 
                            refreshing={refreshLoading} 
                            onRefresh={refreshLoadingTrigger}
                            tintColor={palette.main.p500}
                        />
                    }
                >
                    {medicationHistory.map((med, index) => {
                        const isTaken = (med.status !== "Pending" && med.status !== "Cancelled");
                        return (
                            <MotiAnimated.View 
                                key={med.id} 
                                entering={FadeInDown.delay(index * 100).duration(600)}
                            >
                                <TouchableOpacity 
                                    activeOpacity={0.8}
                                    onPress={() => navigate('viewReminder', { schedule: med })}
                                >
                                    <View style={styles.doseCard}>
                                        <View style={[styles.doseBadge, { backgroundColor: isTaken ? `${palette.main.p500}10` : '#F1F5F9' }]}>
                                            <Icon 
                                                icon={medica} 
                                                width={normalize(24)} 
                                                height={normalize(24)} 
                                                tintColor={isTaken ? palette.main.p500 : '#94A3B8'} 
                                            />
                                        </View>
                                        
                                        <View style={styles.doseInfo}>
                                            <Typography style={styles.medicineName}>{med.drugName}</Typography>
                                            <View style={styles.doseTime}>
                                                <Icon icon={history} width={normalize(14)} height={normalize(14)} tintColor="#94A3B8" />
                                                <Typography style={styles.timeText}>{med.scheduled_at}</Typography>
                                            </View>
                                        </View>

                                        {isTaken ? (
                                            <View style={styles.takenBadge}>
                                                <Icon icon={checkIcon} width={normalize(12)} height={normalize(12)} tintColor="#10B981" />
                                                <Typography style={styles.takenText}>Taken</Typography>
                                            </View>
                                        ) : (
                                            med.allowTaken && (
                                                <TouchableOpacity
                                                    style={styles.takeDoseButton}
                                                    onPress={() => makeScheduleHasTaken(med.id)}
                                                    activeOpacity={0.7}
                                                >
                                                    <LinearGradient
                                                        colors={[palette.main.p500, palette.main.p300]}
                                                        style={styles.takeDoseGradient}
                                                    >
                                                        <Typography style={styles.takeDoseText}>Take</Typography>
                                                    </LinearGradient>
                                                </TouchableOpacity>
                                            )
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </MotiAnimated.View>
                        );
                    })}
                </ScrollView>
            </View>

            <ButtonSheet 
                onClose={() => setApproveMedReminderDialog(false)} 
                dispatch={openApproveMedReminderDialog} 
                height={normalize(260)}
            >
                <View style={styles.sheetContent}>
                    <Typography style={styles.sheetTitle}>{notificationData?.title || "Approve Medication"}</Typography>
                    <Typography style={styles.sheetBody}>{notificationData?.body || "Would you like to approve this medication reminder?"}</Typography>

                    <View style={styles.buttonsHolder}>
                        <TouchableOpacity style={styles.rejectButton} onPress={() => setApproveMedReminderDialog(false)}>
                            <Typography style={styles.rejectButtonText}>REJECT</Typography>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.approveButton} onPress={approveMedReminder} disabled={approveLoading}>
                            <LinearGradient colors={[palette.main.p500, palette.main.p300]} style={styles.approveGradient}>
                                <Typography style={styles.approveButtonText}>APPROVE</Typography>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </ButtonSheet>
        </WrapperNoScroll>
    );
}
