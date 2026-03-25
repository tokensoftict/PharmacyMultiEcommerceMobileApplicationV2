import React, {useCallback, useState} from 'react';
import {styles} from "./styles"
import dayjs from 'dayjs';
import {palette, design} from "@/shared/constants/colors.ts";
import {ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import Icon from "@/shared/component/icon";
import {checkIcon, drug, history, medica} from "@/assets/icons";
import Typography from "@/shared/component/typography";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import WeeklyCalendarStrip from "@/shared/component/WeeklyCalendarStrip";
// import {CalendarProvider, WeekCalendar} from "react-native-calendars";
import {MedReminderSchedules} from "@/service/medReminder/interface/MedReminderInterface.tsx";
import MedReminderService from "@/service/medReminder/MedReminderService.tsx";
import Toastss from "@/shared/utils/Toast.tsx";
import {normalize} from "@/shared/helpers";
import formatDate from "@/shared/utils/DateFormatter.ts";
import {useLoading} from "@/shared/utils/LoadingProvider.tsx";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import HeaderWithIcon from "@/shared/component/headerBack";
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';


export default function HistoryLogs() {
    const navigation = useNavigation<NavigationProps>();
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshLoading, setRefreshLoading] = useState<boolean>(false);
    const [medicationHistory, setMedicationHistory] = useState<MedReminderSchedules[]>([]);
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
    const {showLoading, hideLoading} = useLoading();
    
    function navigate(path : string, params = {}) {
        // @ts-ignore
        navigation.navigate(path, params);
    }

    const loadTodayHistory = useCallback(() => {
        setLoading(true);
        (new MedReminderService()).loadTodayHistory("today-history").then((response) => {
            setLoading(false);
            setRefreshLoading(false);
            if (response.data.status === true) {
                setMedicationHistory(response.data.data);
            } else {
                setMedicationHistory([]);
                Toastss("Failed to load medication schedules.");
            }
        }).catch(() => {
            setLoading(false);
            setRefreshLoading(false);
        });
    }, []);

    const loadCustomHistory = function(dateString:string) {
        setLoading(true);
        setSelectedDate(dateString);
        (new MedReminderService()).loadHistoryWithFilter(dateString).then((response) => {
            setLoading(false);
            setRefreshLoading(false);
            if (response.data.status === true) {
                setMedicationHistory(response.data.data);
            } else {
                setMedicationHistory([]);
                Toastss("Failed to load history.");
            }
        }).catch(() => {
            setLoading(false);
            setRefreshLoading(false);
        });
    }

    useFocusEffect(
        useCallback(() => {
            loadTodayHistory();
        }, [loadTodayHistory])
    );

    function refreshLoadingTrigger() {
        setRefreshLoading(true);
        loadTodayHistory();
    }

    const makeScheduleHasTaken = function (schedule_id : number | string) {
        Alert.alert('Confirm Action', 'Mark this medication as taken?', [
            { text: 'Cancel', style: 'cancel' },
            { 
                text: 'Yes, Taken', 
                onPress: () => {
                    const updateData = { status : 'Completed' };
                    showLoading("Updating...");
                    (new MedReminderService()).updateHistoryStatus(schedule_id, updateData).then((response) => {
                        hideLoading();
                        if(response.data.status === true){
                            Toastss("Updated successfully.");
                            loadTodayHistory();
                        }
                    })
                }
            }
        ])
    }

    return (
        <WrapperNoScroll loading={false} barStyle="light-content" backgroundColorStatusBar={design.text1.background} transparent={false}>
            <View style={[StyleSheet.absoluteFillObject, { overflow: 'hidden' }]}>
                <LinearGradient
                    colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
                    style={StyleSheet.absoluteFill}
                />
                {/* Decorative circles */}
                <View style={[styles.circle, styles.circle1]} />
                <View style={[styles.circle, styles.circle2]} />
            </View>

            <HeaderWithIcon title="HISTORY LOGS" />
            
            <View style={styles.container}>
                <Animated.View entering={FadeInUp.duration(600)}>
                     <WeeklyCalendarStrip 
                        selectedDate={selectedDate}
                        onDateChange={(d) => {
                            loadCustomHistory(d);
                        }}
                    />
                </Animated.View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Typography style={styles.sectionTitle}>{formatDate(dayjs(selectedDate).toDate())}</Typography>
                        <Typography style={styles.sectionSubtitle}>Daily Schedule</Typography>
                    </View>

                    <ScrollView
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
                        {loading && !refreshLoading ? (
                            <View style={{ paddingVertical: normalize(40), alignItems: 'center' }}>
                                <ActivityIndicator size="large" color={palette.main.p500} />
                                <Typography style={{ marginTop: normalize(12), color: '#64748B', fontWeight: '600' }}>
                                    Loading schedules...
                                </Typography>
                            </View>
                        ) : medicationHistory.length === 0 ? (
                            <Animated.View entering={FadeInDown.duration(600)} style={styles.emptyState}>
                                <View style={styles.emptyIconWrapper}>
                                    <Icon icon={drug} width={normalize(40)} height={normalize(40)} tintColor="#94A3B8" />
                                </View>
                                <Typography style={styles.emptyStateText}>No schedule found for this date</Typography>
                                <TouchableOpacity 
                                    onPress={() => navigate('medReminderForm')} 
                                    style={styles.addMedicationButton}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={[palette.main.p500, palette.main.p400]}
                                        style={styles.gradientButton}
                                    >
                                        <Typography style={styles.addMedicationButtonText}>ADD NEW REMINDER</Typography>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Animated.View>
                        ) : (
                            medicationHistory.map((medication, index) => {
                                const taken = (medication.status !== "Pending" && medication.status !== "Cancelled");
                                return (
                                    <Animated.View 
                                        key={medication.id} 
                                        entering={FadeInDown.delay(index * 100).duration(600)}
                                    >
                                        <TouchableOpacity 
                                            activeOpacity={0.7}
                                            style={styles.doseCard}
                                            onPress={() => navigate('viewReminder', { schedule: medication })}
                                        >
                                            <View style={styles.doseBadge}>
                                                <Icon icon={medica} width={normalize(22)} height={normalize(22)} tintColor={palette.main.p500} />
                                            </View>
                                            <View style={styles.doseInfo}>
                                                <Typography style={styles.medicineName}>{medication.drugName}</Typography>
                                                <View style={styles.doseMeta}>
                                                    <View style={styles.doseTime}>
                                                        <Icon icon={history} width={normalize(14)} height={normalize(14)} tintColor="#94A3B8" />
                                                        <Typography style={styles.timeText}>{medication.scheduled_at}</Typography>
                                                    </View>
                                                    <View style={styles.dot} />
                                                    <Typography style={styles.dosageInfo}>{medication.dosage}mg</Typography>
                                                </View>
                                            </View>
                                            {taken ? (
                                                <View style={styles.takenBadge}>
                                                    <Icon icon={checkIcon} width={normalize(12)} height={normalize(12)} tintColor="#10B981" />
                                                    <Typography style={styles.takenText}>Taken</Typography>
                                                </View>
                                            ) : (
                                                medication.allowTaken && (
                                                    <TouchableOpacity
                                                        activeOpacity={0.8}
                                                        style={styles.takeDoseButton}
                                                        onPress={() => makeScheduleHasTaken(medication.id)}
                                                    >
                                                        <Typography style={styles.takeDoseText}>Take</Typography>
                                                    </TouchableOpacity>
                                                )
                                            )}
                                        </TouchableOpacity>
                                    </Animated.View>
                                )
                            })
                        )}
                    </ScrollView>
                </View>
            </View>
        </WrapperNoScroll>
    );
}
