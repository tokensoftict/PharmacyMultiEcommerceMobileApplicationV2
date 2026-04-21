import React, { useEffect, useRef, useCallback, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import {
    View,
    ScrollView,
    TouchableOpacity,
    Animated,
    RefreshControl,
    Dimensions,
    Alert,
    StatusBar,
    Platform,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import Icon from "@/shared/component/icon";
import {
    add_circle,
    list,
    arrowBack,
    checkIcon,
    close,
    drug,
    notification,
    history,
    medica
} from "@/assets/icons";
import { palette, semantic } from "@/shared/constants/colors.ts";
import Typography from "@/shared/component/typography";
import styles from "./main_styles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";
import { MedReminderSchedules } from "@/service/medReminder/interface/MedReminderInterface.tsx";
import MedReminderService from "@/service/medReminder/MedReminderService.tsx";
import WrapperNoScrollNoDialogNoSafeArea from "@/shared/component/wrapperNoScrollNoDialogNoSafeArea";
import Toastss from "@/shared/utils/Toast";
import { useLoading } from "@/shared/utils/LoadingProvider.tsx";
import { normalize } from "@/shared/helpers";
import Environment from "@/shared/utils/Environment.tsx";

const { width } = Dimensions.get("window");

// Create animated circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const QUICK_ACTIONS = [
    {
        icon: add_circle,
        label: "Add\nReminder",
        route: "medReminderForm",
        gradient: ["#F44336", "#D32F2F"] as [string, string],
    },
    {
        icon: list,
        label: "List \nReminder",
        route: "listMedReminder",
        gradient: ["#2196F3", "#1976D2"] as [string, string],
    },
    {
        icon: history,
        label: "History\nLog",
        route: "historyLogs",
        gradient: ["#9C27B0", "#7B1FA2"] as [string, string],
    },
    {
        icon: medica,
        label: "Refill\nTracker",
        route: "refillTracker",
        gradient: ["#FF9800", "#F57C00"] as [string, string],
    },
];

interface CircularProgressProps {
    progress: number;
}

function CircularProgress({ progress }: CircularProgressProps) {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const size = normalize(85);
    const strokeWidth = normalize(10);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: progress,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [progress]);

    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
    });

    return (
        <View style={styles.progressRingContainer}>
            <Typography style={styles.progressPercentage}>
                {Math.round(progress * 100)}%
            </Typography>
            <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#F1F5F9"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#F44336"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </Svg>
        </View>
    );
}

function MainMenu() {
    const navigation = useNavigation<NavigationProps>();
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshLoading, setRefreshLoading] = useState<boolean>(false);
    const [medicationHistory, setMedicationHistory] = useState<MedReminderSchedules[]>([]);
    const [progress, setProgress] = useState(0);
    const [totalDoses, setTotalDoses] = useState(0);
    const [completedDoses, setCompletedDoses] = useState(0);
    const { showLoading, hideLoading } = useLoading();

    const loadTodayHistory = useCallback(() => {
        setLoading(true);
        (new MedReminderService()).loadTodayHistory("today-history").then((response) => {
            setLoading(false);
            setRefreshLoading(false);
            if (response.data.status === true) {
                setMedicationHistory(response.data.data);
                if (response.data.data.length > 0) {
                    const _totalDoses = response.data.data.length;
                    const _completedDoses = response.data.data.filter((data: MedReminderSchedules) =>
                        data.status !== "Pending" && data.status !== "Cancelled"
                    ).length;
                    const _progress = _completedDoses / _totalDoses;
                    setCompletedDoses(_completedDoses);
                    setTotalDoses(_totalDoses);
                    setProgress(_progress);
                } else {
                    setProgress(0);
                    setCompletedDoses(0);
                    setTotalDoses(0);
                }
            } else {
                Toastss("There was an error loading schedules.");
            }
        });
    }, []);

    useFocusEffect(useCallback(() => { loadTodayHistory(); }, []));

    const makeScheduleHasTaken = (schedule_id: number | string) => {
        Alert.alert('MedReminder', 'Mark this medication as taken?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Confirm', onPress: () => {
                    showLoading("Updating...");
                    (new MedReminderService()).updateHistoryStatus(schedule_id, { status: 'Completed' }).then((response) => {
                        hideLoading();
                        if (response.data.status === true) {
                            Toastss("Updated successfully.");
                            loadTodayHistory();
                        }
                    });
                }
            }
        ]);
    };

    const navigate = (path: string, params = {}) => {
        // @ts-ignore
        navigation.navigate(path, params);
    };

    const todayDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    });

    return (
        <WrapperNoScrollNoDialogNoSafeArea loading={loading}>
            <StatusBar backgroundColor="#F44336" barStyle="light-content" translucent={false} />

            <View style={styles.headerContainer}>
                <View style={styles.headerTop}>
                    <View>
                        <Typography style={styles.headerSubtitle}>{todayDate}</Typography>
                        <Typography style={styles.headerGreeting}>Medication Tracker</Typography>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            if (navigation.canGoBack()) {
                                navigation.goBack();
                            } else {
                                // @ts-ignore
                                navigation.navigate(Environment.getEnvironment());
                            }
                        }}
                        style={styles.notificationButton}
                    >
                        <Icon icon={arrowBack} width={24} height={24} tintColor="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.featuredCardContainer}>
                <View style={styles.featuredCard}>
                    <View style={styles.featuredInfo}>
                        <Typography style={styles.featuredTitle}>Daily Progress</Typography>
                        <Typography style={styles.featuredSubtitle}>
                            {completedDoses} of {totalDoses} doses completed
                        </Typography>
                    </View>
                    <CircularProgress progress={progress} />
                </View>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshLoading} onRefresh={() => { setRefreshLoading(true); loadTodayHistory(); }} />}
            >
                <View style={styles.section}>
                    <Typography style={styles.sectionTitle}>Quick Actions</Typography>
                    <View style={styles.quickActionsGrid}>
                        {QUICK_ACTIONS.map((action) => (
                            <TouchableOpacity
                                key={action.route}
                                onPress={() => navigate(action.route)}
                                style={styles.actionButton}
                                activeOpacity={0.7}
                            >
                                <LinearGradient
                                    colors={action.gradient}
                                    style={styles.actionIconWrapper}
                                >
                                    <Icon icon={action.icon} width={24} height={24} tintColor="white" />
                                </LinearGradient>
                                <Typography style={styles.actionLabel}>{action.label}</Typography>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Typography style={styles.sectionTitle}>Today's Schedule</Typography>
                        <TouchableOpacity onPress={() => navigate('historyLogs')}>
                            <Typography style={styles.seeAllButton}>View All</Typography>
                        </TouchableOpacity>
                    </View>

                    {medicationHistory.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Icon icon={drug} width={48} height={48} tintColor="#CBD5E1" />
                            <Typography style={styles.emptyStateText}>No medications scheduled for today</Typography>
                            <TouchableOpacity onPress={() => navigate('medReminderForm')} style={styles.addMedicationButton}>
                                <Typography style={styles.addMedicationButtonText}>Create Reminder</Typography>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        medicationHistory.map((medication) => {
                            const taken = medication.status !== "Pending" && medication.status !== "Cancelled";
                            return (
                                <TouchableOpacity
                                    key={medication.id}
                                    onPress={() => navigate('viewReminder', { schedule: medication })}
                                    activeOpacity={0.7}
                                    style={styles.doseCard}
                                >
                                    <View style={styles.doseIconContainer}>
                                        <Icon icon={medica} width={24} height={24} tintColor="#F44336" />
                                    </View>
                                    <View style={styles.doseInfo}>
                                        <Typography style={styles.medicineName} numberOfLines={1}>
                                            {medication.drugName}
                                        </Typography>
                                        <Typography style={styles.dosageInfo}>{medication.dosage} {medication.dosage_form}</Typography>
                                        <View style={styles.doseTimeContainer}>
                                            <Icon icon={history} width={14} height={14} tintColor="#94A3B8" />
                                            <Typography style={styles.timeText}>{medication.scheduled_at}</Typography>
                                        </View>
                                    </View>
                                    {taken ? (
                                        <View style={styles.takenBadge}>
                                            <Icon icon={checkIcon} width={12} height={12} tintColor="#16A34A" />
                                            <Typography style={styles.takenText}>Taken</Typography>
                                        </View>
                                    ) : (
                                        medication.allowTaken && (
                                            <TouchableOpacity
                                                style={styles.takeDoseButton}
                                                onPress={() => makeScheduleHasTaken(medication.id)}
                                            >
                                                <Typography style={styles.takeDoseText}>Take</Typography>
                                            </TouchableOpacity>
                                        )
                                    )}
                                </TouchableOpacity>
                            );
                        })
                    )}
                </View>
            </ScrollView>
        </WrapperNoScrollNoDialogNoSafeArea>
    );
}

export default React.memo(MainMenu);
