import React, { useEffect, useState } from 'react';
import { styles } from "./styles"
import { Alert, RefreshControl, ScrollView, TouchableOpacity, View, StyleSheet } from "react-native";
import { palette, design } from "@/shared/constants/colors.ts";
import Icon from "@/shared/component/icon";
import { add_circle, drug, eyeFilled, history, trash } from "@/assets/icons";
import Typography from "@/shared/component/typography";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack";
import MedReminderService from "@/service/medReminder/MedReminderService";
import { MedReminderInterface } from "@/service/medReminder/interface/MedReminderInterface";
import { normalize } from "@/shared/helpers";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import HeaderWithIcon from "@/shared/component/headerBack";
import ButtonSheet from "@/shared/component/buttonSheet";
import { Button, ButtonOutline } from "@/shared/component/buttons";
import Toastss from "@/shared/utils/Toast.tsx";
import { useLoading } from "@/shared/utils/LoadingProvider.tsx";
import notifee from "@notifee/react-native";
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';


export default function ListMedReminder() {
    const navigation = useNavigation<NavigationProps>();
    const [loading, setLoading] = useState(false);
    const [refreshLoading, setRefreshLoading] = useState(false);
    const [openRemoveMedReminderDialog, setRemoveMedReminderDialog] = useState(false);
    const [removeLoading, setRemoveLoading] = useState(false);
    const { showLoading, hideLoading } = useLoading();
    // @ts-ignore
    const [medReminder, setMedReminder] = useState<MedReminderInterface[]>([]);
    const [medication, setMedication] = useState<MedReminderInterface>();

    const refreshLoadingTrigger = function () {
        setRefreshLoading(true);
        loadMedication();
    }

    function goBack() {
        navigation.goBack();
    }

    useEffect(function () {
        loadMedication();
    }, []);

    function triggerRemoveMedReminder(status: boolean) {
        setRemoveMedReminderDialog(status);
    }

    function removeMedReminder() {
        Alert.alert('Cancel Reminder', 'Are you sure you want to cancel this medication reminder? This will also remove scheduled notifications.', [
            { text: 'No', style: 'cancel' },
            {
                text: 'Yes, Cancel',
                onPress: () => {
                    setRemoveLoading(true);
                    try {
                        // @ts-ignore
                        (new MedReminderService()).remove(medication?.id).then(async (response) => {
                            if (response.data.status === true) {
                                setRemoveLoading(false);
                                Toastss("Reminder removed successfully.");
                                const schedulesIDS = response.data.data ?? [];
                                if (schedulesIDS.length > 0) {
                                    showLoading("Updating notifications...");
                                    await Promise.all(
                                        schedulesIDS.map(async (schedule: any) => {
                                            await notifee.cancelNotification(schedule + "");
                                        })
                                    )
                                    hideLoading();
                                }
                                refreshLoadingTrigger();
                                triggerRemoveMedReminder(false);
                            } else {
                                setRemoveLoading(false);
                            }
                        })
                    } catch (error) {
                        setRemoveLoading(false);
                        console.error("Failed to remove med schedule:", error);
                        Toastss("An error occurred. Please try again.");
                    }
                }
            }
        ])
    }

    function loadMedication() {
        setLoading(true);
        (new MedReminderService()).list().then((response) => {
            setLoading(false);
            setRefreshLoading(false);
            if (response.data.status === true) {
                setMedReminder(response.data.data);
            }
        }).catch(() => {
            setLoading(false);
            setRefreshLoading(false);
        });
    }

    return (
        <WrapperNoScroll loading={loading} barStyle="light-content" backgroundColorStatusBar={design.text1.background} transparent={false}>
            <View style={[StyleSheet.absoluteFillObject, { overflow: 'hidden' }]}>
                <LinearGradient
                    colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
                    style={StyleSheet.absoluteFill}
                />
                {/* Decorative Background Elements */}
                <View style={[styles.circle, styles.circle1]} />
                <View style={[styles.circle, styles.circle2]} />
            </View>

            <HeaderWithIcon 
                title="MEDICATIONS" 
                rightComponent={
                    <TouchableOpacity onPress={() => navigation.navigate('medReminderForm')}>
                        <Icon icon={add_circle} width={normalize(24)} height={normalize(24)} tintColor="#FFFFFF" />
                    </TouchableOpacity>
                }
            />

            <View style={styles.container}>
                {medReminder.length === 0 ? (
                    <Animated.View entering={FadeInDown.duration(600)} style={styles.emptyContainer}>
                        <View style={styles.emptyIconWrapper}>
                            <Icon icon={drug} width={normalize(60)} height={normalize(60)} tintColor={palette.main.p300} />
                        </View>
                        <Typography style={styles.emptyText}>No Active Reminders</Typography>
                        <Typography style={styles.emptySubtext}>Keep your health on track by setting up your first medication reminder.</Typography>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('medReminderForm')} 
                            style={styles.addMedicationButton}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={[palette.main.p500, palette.main.p400]}
                                style={styles.gradientButton}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Typography style={styles.addMedicationButtonText}>CREATE NEW REMINDER</Typography>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                ) : (
                    <ScrollView
                        style={{ height: '100%' }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: normalize(100) }}
                        refreshControl={
                            <RefreshControl 
                                refreshing={refreshLoading} 
                                onRefresh={refreshLoadingTrigger} 
                                tintColor={palette.main.p500}
                                colors={[palette.main.p500]}
                            />
                        }
                    >
                        {medReminder.map((med, index) => (
                            <Animated.View 
                                key={med.id} 
                                entering={FadeInDown.delay(index * 100).duration(600)}
                            >
                                <TouchableOpacity 
                                    activeOpacity={0.7} 
                                    style={styles.medCard} 
                                    onPress={() => {
                                        setMedication(med);
                                        triggerRemoveMedReminder(true);
                                    }}
                                >
                                    <View style={styles.medCardHeader}>
                                        <View style={styles.medBadge}>
                                            <Icon icon={drug} width={normalize(24)} height={normalize(24)} tintColor={palette.main.p500} />
                                        </View>
                                        <View style={styles.medNameContainer}>
                                            <Typography style={styles.medName}>{med.drug_name}</Typography>
                                            <View style={styles.medTime}>
                                                <Icon icon={history} width={normalize(14)} height={normalize(14)} tintColor="#94A3B8" />
                                                <Typography style={styles.dateCreated}>{med.date_create}</Typography>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.statsRow}>
                                        <View style={styles.statItem}>
                                            <Typography style={styles.statLabel}>STOCK</Typography>
                                            <View style={styles.statValueWrapper}>
                                                <Typography style={styles.statValue}>{med.total_dosage_in_package}</Typography>
                                                <Typography style={styles.statUnit}>{med.dosage_form}</Typography>
                                            </View>
                                        </View>
                                        <View style={[styles.statItem, styles.statDivider]}>
                                            <Typography style={styles.statLabel}>TAKEN</Typography>
                                            <View style={styles.statValueWrapper}>
                                                <Typography style={[styles.statValue, { color: '#10B981' }]}>{med.total_dosage_taken}</Typography>
                                                <Typography style={styles.statUnit}>{med.dosage_form}</Typography>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </ScrollView>
                )}
            </View>

            <ButtonSheet onClose={() => triggerRemoveMedReminder(false)} dispatch={openRemoveMedReminderDialog} height={normalize(260)}>
                <View style={styles.sheetContent}>
                    <Typography style={styles.sheetDrugName}>{medication?.drug_name}</Typography>
                    <Typography style={styles.sheetDescription}>Manage your medication reminder schedule.</Typography>

                    <View style={styles.buttonsHolder}>
                        <TouchableOpacity 
                            style={styles.sheetActionBtn}
                            onPress={() => {
                                // @ts-ignore
                                navigation.navigate("viewLogs", { medReminder: medication });
                                triggerRemoveMedReminder(false);
                            }}
                        >
                            <View style={[styles.actionIconWrapper, { backgroundColor: '#F1F5F9' }]}>
                                <Icon icon={eyeFilled} tintColor="#475569" width={normalize(20)} height={normalize(20)} />
                            </View>
                            <Typography style={styles.actionBtnText}>View Logs</Typography>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.sheetActionBtn}
                            disabled={removeLoading}
                            onPress={removeMedReminder}
                        >
                            <View style={[styles.actionIconWrapper, { backgroundColor: '#FEF2F2' }]}>
                                <Icon icon={trash} tintColor="#EF4444" width={normalize(20)} height={normalize(20)} />
                            </View>
                            <Typography style={[styles.actionBtnText, { color: '#EF4444' }]}>
                                {removeLoading ? 'Wait...' : 'Cancel'}
                            </Typography>
                        </TouchableOpacity>
                    </View>
                </View>
            </ButtonSheet>
        </WrapperNoScroll>
    );
}
