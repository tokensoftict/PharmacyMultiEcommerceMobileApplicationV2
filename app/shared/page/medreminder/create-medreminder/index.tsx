import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native';
import styles, { width } from './styles';
import HeaderWithIcon from "@/shared/component/headerBack";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import Typography from "@/shared/component/typography";
import Input from "@/shared/component/input";
import { normalize } from "@/shared/helpers";
import Icon from "@/shared/component/icon";
import { browse } from "@/assets/icons";
import { palette } from "@/shared/constants/colors.ts";
import SearchDialog from "@/shared/component/product_search";
import _ from "lodash";
import CustomDatePicker from "@/shared/component/CustomDatePicker";
import ordinalSuffix from "@/shared/utils/OrdinalSuffix.tsx";
import ButtonSheet from "@/shared/component/buttonSheet";
import MedReminderService from "@/service/medReminder/MedReminderService.tsx";
import { scheduleNotification } from "@/shared/utils/ScheduleNotification.tsx";
import dayjs from "dayjs";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import Toastss from "@/shared/utils/Toast.tsx";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from 'react-native-linear-gradient';
import Reanimated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

interface StepField {
    key: string;
    label?: string,
    type: 'notes' | 'dosage_form' | 'drug_name' | 'dosage' | 'frequency' | 'schedule' | 'total_dosage_in_package' | 'type' | 'start_date_time' | 'interval';
    placeholder?: string;
    options?: string[];
}

interface Step {
    title: string;
    description: string;
    fields: StepField[];
}


export default function MedReminderWizard() {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [formData, setFormData] = useState<Record<string, string | Array<any>>>({});
    const translateX = useRef(new Animated.Value(0)).current;
    const [medReminder, setMedReminder] = useState({});
    const [stock_id, setStockId] = useState("");
    const [drugName, setDrugName] = useState("");
    const [loading, setLoading] = useState(false);
    const [frequency, setFrequency] = useState(0);
    const [schedules, setSchedules] = useState<Date[]>([]);
    const [type, setType] = useState("");
    const [realType, setRealType] = useState("");
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [openIntervalDialog, setOpenIntervalDialog] = useState(false);
    const [interval, setInterval] = useState("");

    const userSession = new AuthSessionService().getAuthSession();
    const dosageForms = userSession.data.dosageForms ?? [];
    const repeatDuration = userSession.data.medReminderDuration ?? [];

    const steps: Step[] = [
        {
            title: 'Drug Information',
            description: 'Select the medication and form.',
            fields: [
                { key: 'Select Drug', type: 'drug_name', placeholder: 'Select drug name', label: 'Drug Name' },
                {
                    key: 'Dosage Form',
                    type: 'dosage_form',
                    placeholder: 'Dosage Form',
                    options: Object.keys(dosageForms),
                },
            ],
        },
        {
            title: 'Dosages & Frequency',
            description: 'Define how you take this medicine.',
            fields: [
                { key: 'Dosage', type: 'dosage', label: 'Dosage per intake', placeholder: '' },
                { key: 'Frequency', type: 'frequency', label: 'Frequency', placeholder: 'Times per day...' },
                { key: 'Interval', type: 'interval', label: 'Interval', placeholder: 'e.g Days, Weeks, or Months' },
            ],
        },
        {
            title: 'Schedules',
            description: 'What time(s) would you like to be reminded?',
            fields: [{ key: 'Select Time', type: 'schedule', placeholder: 'e.g., 8:00 AM' }],
        },
        {
            title: 'Supply & Duration',
            description: 'Stock details and when to begin.',
            fields: [
                { key: 'Quantity Bought', label: 'Quantity Bought', type: 'total_dosage_in_package', placeholder: '' },
                { key: 'Type of Medication', label: 'Medication Type', type: 'type', placeholder: 'e.g., One-Time or Continuous' },
                { key: 'Starting Date', label: 'Start Date', type: 'start_date_time', placeholder: 'Date to start medication' },
            ],
        },
        {
            title: 'Additional Notes',
            description: 'Any important instructions?',
            fields: [
                { key: 'Notes', type: 'notes', placeholder: 'e.g., Take after meals', label: 'Instructions' },
            ],
        },
    ];

    const medicationTypes = [
        { name: "One-Time Use Medication", id: "ONE-TIME" },
        { name: "Long-Term Medication", id: "CONTINUES" }
    ];

    const navigation = useNavigation();

    function goBack() {
        navigation.goBack();
    }

    useEffect(() => {
        const newSchedules = _.range(frequency).map(() =>
            new Date(new Date().setHours(8, 0, 0, 0))
        );
        setSchedules(newSchedules);
        handleChange('schedule', newSchedules);
        handleChange('start_date_time', new Date())
    }, [frequency]);

    const handleChange = (key: string, value: any) => {
        if (typeof value === 'string') {
            // @ts-ignore
            if (steps[0].fields[1].options.includes(key)) {
                setFormData((prev) => ({ ...prev, ['dosage_form']: value }));
            } else {
                setFormData((prev) => ({ ...prev, [key]: value }));
            }
            if (key === "frequency") {
                setFrequency(parseInt(value));
            }
        } else {
            setFormData((prev) => ({ ...prev, [key]: value }));
        }

    };
    const [openMedicationTypeDialog, setOpenMedicationTypeDialog] = useState(false);
    function triggerOpenMedicationTypeDialog(status: any) {
        setOpenMedicationTypeDialog(status);
    }

    const goToStep = (index: number) => {
        Animated.spring(translateX, {
            toValue: -width * index,
            useNativeDriver: true,
            tension: 40,
            friction: 7,
        }).start();
        setCurrentStep(index);
    };

    const handleNext = () => {
        if (validateCurrentStep()) {
            if (currentStep < steps.length - 1) {
                goToStep(currentStep + 1);
            } else {
                const formDataKeys = Object.keys(formData);
                let formToSubmit = new FormData();
                formDataKeys.map((item) => {
                    if (item === 'schedule') {
                        let formattedSchedule: any = [];
                        // @ts-ignore
                        formData[`schedule`].map((item, index) => {
                            if (typeof item !== 'string') {
                                const number: number = index + 1;
                                const key = ordinalSuffix(number) + " Does Time";
                                let object: any = {};
                                object[key] = item.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                formattedSchedule.push(object)
                            }
                        });
                        formToSubmit.append("normal_schedules", JSON.stringify(formattedSchedule));
                    } else if (item === 'start_date_time') {
                        // @ts-ignore
                        formToSubmit.append(item, formData[item].toISOString().slice(0, 10))
                    }
                    else {
                        formToSubmit.append(item, formData[item])
                    }
                });
                formToSubmit.append("use_interval", 1);
                handleSubmit(formToSubmit);
            }
        }
    };

    const handleSubmit = (formData: FormData) => {
        setLoading(true);
        (new MedReminderService()).create(formData).then(async (response) => {
            setLoading(false);
            if (response.data.status === true) {
                setMedReminder(response.data.data.medReminder);
                // Extract schedules
                const schedules = response.data.data.schedules;
                // Schedule notifications and store their IDs
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
                    setLoading(false);
                    Toastss("Med Reminder created successfully.");
                    // Navigate back
                    goBack();
                }).finally(() => {
                    setLoading(false);
                });
            } else {
                setLoading(false);
                Toastss("Error creating reminder. Please try again.");
            }
        }).catch(() => {
            setLoading(false);
        });
    }

    function triggerIntervalDialog(status: any) {
        setOpenIntervalDialog(status);
    }

    const handlePrev = () => {
        if (currentStep > 0) {
            goToStep(currentStep - 1);
        }
    };

    const [isVisible, setIsVisible] = useState(false);

    const openSearchDialog = () => setIsVisible(!isVisible);

    const onItemDrugSelected = (item: any) => {
        setStockId(item.id);
        setDrugName(item.name);
        openSearchDialog();
        handleChange('stock_id', item.id);
        handleChange('drug_name', item.name);
    }

    const setTime = (index: number, selectedTime: any) => {
        let cacheSchedules = [...schedules];
        cacheSchedules[index] = selectedTime;
        setSchedules(cacheSchedules);
        handleChange('schedule', cacheSchedules);
    };

    const validateCurrentStep = (): boolean => {
        const currentFields = steps[currentStep].fields;
        const newErrors: Record<string, string> = {};
        currentFields.forEach(({ type, key }) => {
            const value: any = formData[type];

            if (type === 'notes') return true;

            if (
                (typeof value === 'string' && value.trim() === '') ||
                (Array.isArray(value) && value.length === 0) || value === undefined
            ) {
                newErrors[type] = `${key} is required`;
            }

            if (type === "schedule") {
                const selectedSchedules: any[] = value;
                let validatedSchedules: string[] = [];
                selectedSchedules.map((item: any) => {
                    if (validatedSchedules.includes("" + item)) {
                        newErrors[type] = `Duplicate dose time detected.`;
                    } else {
                        validatedSchedules.push(item + "");
                    }
                });
            }

        });


        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const renderField = (field: StepField) => {
        const { key, type, placeholder, options, label } = field;
        let content;
        if (type === 'dosage_form') {
            content =
                <View style={{ flex: 1, flexDirection: "column" }}>
                    <Typography style={styles.label}>{key}</Typography>
                    <View style={styles.tagGroup}>
                        {options?.map((option) => {
                            const selected = formData[type] === option;
                            return (
                                <TouchableOpacity
                                    key={option}
                                    style={[styles.tag, selected && styles.tagSelected]}
                                    onPress={() => handleChange(type, option)}
                                >
                                    <Typography
                                        style={[
                                            styles.tagText,
                                            selected && styles.tagTextSelected,
                                        ]}
                                    >
                                        {option}
                                    </Typography>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    {formErrors[type] && (
                        <Typography style={styles.errorText}>{formErrors[type]}</Typography>
                    )}
                </View>
        }
        else if (type === 'drug_name') {
            content =
                <View style={{ flex: 1, flexDirection: "column" }}>
                    <Input
                        editable={false}
                        label={label}
                        placeholder={placeholder}
                        // @ts-ignore
                        value={formData[type] || ''}
                        rightIcon={<Icon icon={browse} onPress={openSearchDialog} tintColor={palette.main.p500} width={normalize(24)} height={normalize(24)} />}
                    />

                    <TouchableOpacity
                        style={styles.browseButton}
                        onPress={openSearchDialog}
                    >
                        <Typography style={styles.browseText}>Browse Drugs</Typography>
                    </TouchableOpacity>

                    {formErrors[type] && (
                        <Typography style={styles.errorText}>{formErrors[type]}</Typography>
                    )}
                </View>

        }
        else if (['dosage', 'frequency', 'total_dosage_in_package'].includes(type)) {
            content =
                <View style={{ flex: 1, flexDirection: "column" }}>
                    <Input
                        label={label}
                        // @ts-ignore
                        placeholder={placeholder === '' ? `e.g 30 ${dosageForms[formData['dosage_form']] || ''}` : placeholder}
                        // @ts-ignore
                        value={formData[type] || ''}
                        keyboardType="numeric"
                        onChangeText={(text) => handleChange(type, text)}
                    />
                    {formErrors[type] && (
                        <Typography style={styles.errorText}>{formErrors[type]}</Typography>
                    )}
                </View>
        }
        else if (type === 'schedule') {
            content = (
                <View style={{ flex: 1, flexDirection: "column" }}>
                    {schedules.map((schedule, index) => (
                        <View key={index} style={styles.scheduleRow}>
                            <Typography style={styles.label}>{ordinalSuffix(index + 1)} Dose</Typography>
                            <CustomDatePicker
                                key={index}
                                style={styles.datePicker}
                                value={schedules[index]}
                                mode="time"
                                time={schedule}
                                display="spinner"
                                label=""
                                onChange={(selectedTime: any) => setTime(index, selectedTime)} // Replace with real logic to update schedule[index]
                            />
                        </View>
                    ))}
                    {formErrors[type] && (
                        <Typography style={styles.errorText}>{formErrors[type]}</Typography>
                    )}
                </View>
            );
        } else if (type === "type") {
            content = <View style={{ flex: 1, flexDirection: "column" }}>
                <Input
                    editable={false}
                    label={label}
                    placeholder={placeholder}
                    // @ts-ignore
                    value={realType}
                    rightIcon={<Icon icon={browse} onPress={() => { triggerOpenMedicationTypeDialog(true) }} tintColor={palette.main.p500} width={normalize(24)} height={normalize(24)} />}
                />

                <TouchableOpacity
                    style={styles.browseButton}
                    onPress={() => { triggerOpenMedicationTypeDialog(true) }}
                >
                    <Typography style={styles.browseText}>Select Medication Type</Typography>
                </TouchableOpacity>

                {formErrors[type] && (
                    <Typography style={styles.errorText}>{formErrors[type]}</Typography>
                )}
            </View>
        } else if (type === "notes") {
            content = (
                <View style={{ marginBottom: normalize(24) }}>
                    <Input
                        label={label}
                        multiline={true}
                        // @ts-ignore
                        value={formData[type] || ''}
                        placeholder={placeholder}
                        onChangeText={(notes) => handleChange(type, notes)}
                    />
                    {formErrors[type] && <Typography style={styles.errorText}>{formErrors[type]}</Typography>}
                </View>
            );
        } else if (type === "start_date_time") {
            content = (
                <View style={{ marginBottom: normalize(24) }}>
                    <Typography style={styles.label}>{label}</Typography>
                    <CustomDatePicker
                        label={label}
                        style={{ width: '100%' }}
                        value={formData[type] || new Date()}
                        mode="date"
                        time={new Date()}
                        display="compact"
                        onChange={(selectedTime: any) => handleChange(type, selectedTime)}
                    />
                    {formErrors[type] && <Typography style={styles.errorText}>{formErrors[type]}</Typography>}
                </View>
            );
        } else if (type === "interval") {
            content = (
                <View style={{ flex: 1, marginBottom: normalize(24) }}>
                    <Input
                        label={"Interval"}
                        placeholder="e.g Daily, Weekly"
                        value={interval ?? ''}
                        onChangeText={(val) => handleChange('interval', val)}
                        editable={false}
                        rightIcon={<Icon icon={browse} onPress={() => triggerIntervalDialog(true)} tintColor={palette.main.p500} width={normalize(24)} height={normalize(24)} />}
                    />
                    {formErrors['interval'] && <Typography style={styles.errorText}>{formErrors['interval']}</Typography>}
                </View>
            );
        }

        return (
            <View key={key} style={styles.fieldWrapper}>
                {content}
            </View>
        );
    };

    return (
        <WrapperNoScroll loading={loading} barStyle="light-content" transparent={false}>
            <View style={{ ...StyleSheet.absoluteFillObject, overflow: 'hidden' }}>
                <LinearGradient
                    colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
                    style={StyleSheet.absoluteFill}
                />
                {/* Decorative Background Elements */}
                <View style={[styles.circle, styles.circle1]} />
                <View style={[styles.circle, styles.circle2]} />
            </View>

            <HeaderWithIcon title={"ADD REMINDER"} />

            <View style={styles.mainContainer}>
                <View style={styles.progressBarWrapper}>
                    <View style={styles.progressBarContainer}>
                        <View
                            style={[
                                styles.progressBarActive,
                                { width: `${((currentStep + 1) / steps.length) * 100}%` }
                            ]}
                        />
                    </View>
                    <Typography style={styles.progressText}>Step {currentStep + 1} of {steps.length}</Typography>
                </View>

                <View style={{ width, overflow: 'hidden', flex: 1 }}>
                    <Animated.View
                        style={[styles.slider, { width: width * steps.length, transform: [{ translateX }], flex: 1 }]}
                    >
                        {steps.map((step, index) => (
                            <View key={index} style={styles.slide}>
                                <Reanimated.View
                                    entering={FadeInUp.duration(600).delay(200)}
                                    style={styles.card}
                                >
                                    <View style={styles.stepHeader}>
                                        <Typography style={styles.stepTitle}>{step.title}</Typography>
                                        <Typography style={styles.stepDescription}>{step.description}</Typography>
                                    </View>

                                    <ScrollView
                                        style={styles.scrollArea}
                                        showsVerticalScrollIndicator={false}
                                    >
                                        {step.fields.map(renderField)}
                                    </ScrollView>
                                </Reanimated.View>
                            </View>
                        ))}
                    </Animated.View>
                </View>
            </View>

            <View style={styles.nav}>
                <TouchableOpacity
                    onPress={handlePrev}
                    disabled={currentStep === 0}
                    style={[styles.navButton, styles.prevButton, currentStep === 0 && styles.buttonDisabled]}
                >
                    <Typography style={[styles.buttonText, { color: currentStep === 0 ? '#CBD5E1' : '#64748B' }]}>
                        PREVIOUS
                    </Typography>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleNext}
                    style={styles.mainNavButton}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={[palette.main.p500, palette.main.p400]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientNavButton}
                    >
                        <Typography style={styles.mainButtonText}>
                            {currentStep === steps.length - 1 ? 'FINISH' : 'CONTINUE'}
                        </Typography>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <SearchDialog visible={isVisible} onClose={openSearchDialog} onItemSelected={onItemDrugSelected} />

            {/* Medication Type Sheet */}
            <ButtonSheet onClose={() => triggerOpenMedicationTypeDialog(false)} dispatch={openMedicationTypeDialog} height={normalize(280)}>
                <View style={styles.sheetContent}>
                    <Typography style={styles.sheetTitle}>Select Medication Type</Typography>
                    <FlatList
                        data={medicationTypes}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.sheetItem}
                                onPress={() => {
                                    setRealType(item.name);
                                    handleChange('type', item.id);
                                    triggerOpenMedicationTypeDialog(false);
                                }}
                            >
                                <Typography style={styles.sheetItemText}>{item.name}</Typography>
                                <Icon icon={browse} tintColor={palette.main.p200} width={normalize(18)} height={normalize(18)} />
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </ButtonSheet>

            {/* Interval Sheet */}
            <ButtonSheet onClose={() => triggerIntervalDialog(false)} dispatch={openIntervalDialog} height={normalize(320)}>
                <View style={styles.sheetContent}>
                    <Typography style={styles.sheetTitle}>Select Reminder Interval</Typography>
                    <FlatList
                        data={repeatDuration}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.sheetItem}
                                onPress={() => {
                                    setInterval(item.name);
                                    handleChange('interval', item.id);
                                    triggerIntervalDialog(false);
                                }}
                            >
                                <Typography style={styles.sheetItemText}>{item.name}</Typography>
                                <Icon icon={browse} tintColor={palette.main.p200} width={normalize(18)} height={normalize(18)} />
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </ButtonSheet>
        </WrapperNoScroll>
    );
}
