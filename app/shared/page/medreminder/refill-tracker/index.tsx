import React, {useEffect, useRef, useState} from 'react';
import {styles} from "./styles"
import {useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import LinearGradient from "react-native-linear-gradient";
import {palette, design} from "@/shared/constants/colors.ts";
import {RefreshControl,Animated, ScrollView, TouchableOpacity, View, StyleSheet} from "react-native";
import Icon from "@/shared/component/icon";
import {drug, history} from "@/assets/icons";
import Typography from "@/shared/component/typography";
import MedReminderService from "@/service/medReminder/MedReminderService.tsx";
import {MedReminderInterface} from "@/service/medReminder/interface/MedReminderInterface.tsx";
import {normalize} from "@/shared/helpers";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import HeaderWithIcon from "@/shared/component/headerBack";
import MotiAnimated, { FadeInDown } from 'react-native-reanimated';


export default function RefillTracker() {
    const navigation = useNavigation<NavigationProps>();
    const [loading, setLoading] = useState(false);
    const [refreshLoading, setRefreshLoading] = useState(false);
    // @ts-ignore
    const [medReminder, setMedReminder] = useState<MedReminderInterface[]>([]);

    function goBack() {
        navigation.goBack();
    }

    const refreshLoadingTrigger = function(){
        setRefreshLoading(true);
        loadMedication();
    }

    useEffect(function(){
        loadMedication();
    },[]);


    function loadMedication() {
        setLoading(true);
        (new MedReminderService()).list().then((response) => {
            setLoading(false);
            setRefreshLoading(false);
            if(response.data.status === true) {
                setMedReminder(response.data.data);
            }
        }).catch(() => {
            setLoading(false);
            setRefreshLoading(false);
        });
    }

    const RefillButton = ({ onPress } : any) => {
        const scaleAnim = useRef(new Animated.Value(1)).current;

        useEffect(() => {
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.05,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            );
            pulse.start();
            return () => pulse.stop();
        }, [scaleAnim]);

        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.refillButtonWrapper}>
                <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleAnim }] }]}>
                    <LinearGradient
                        colors={['#FF4B2B', '#FF416C']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradient}
                    >
                        <Typography style={styles.refillButtonText}>💊 REFILL NOW & SAVE</Typography>
                    </LinearGradient>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <WrapperNoScroll loading={loading} barStyle="light-content" backgroundColorStatusBar={design.text1.background} transparent={false}>
            <View style={[StyleSheet.absoluteFillObject, { overflow: 'hidden' }]}>
                <LinearGradient
                    colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
                    style={StyleSheet.absoluteFill}
                />
                {/* Decorative circles */}
                <View style={[styles.circle, styles.circle1]} />
                <View style={[styles.circle, styles.circle2]} />
            </View>

            <HeaderWithIcon title="REFILL TRACKER" />
            <View style={styles.container}>
                {medReminder.length === 0 ? (
                    <MotiAnimated.View entering={FadeInDown.duration(600)} style={styles.emptyContainer}>
                        <View style={styles.emptyIconWrapper}>
                            <Icon icon={drug} width={normalize(60)} height={normalize(60)} tintColor={palette.main.p300} />
                        </View>
                        <Typography style={styles.emptyText}>Track Your Refills</Typography>
                        <Typography style={styles.emptySubtext}>We'll help you monitor your medication supply and notify you when it's time to refill.</Typography>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('medReminderForm')} 
                            style={styles.addMedicationButton}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={[palette.main.p500, palette.main.p400]}
                                style={styles.gradientButton}
                            >
                                <Typography style={styles.addMedicationButtonText}>CREATE REMINDER</Typography>
                            </LinearGradient>
                        </TouchableOpacity>
                    </MotiAnimated.View>
                ) : (
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
                        {medReminder.map((med, index) => (
                            <MotiAnimated.View 
                                key={med.id} 
                                entering={FadeInDown.delay(index * 100).duration(600)}
                            >
                                <View style={styles.cardHolder}>
                                    <View style={styles.medCard}>
                                        <View style={styles.medBadge}>
                                            <Icon icon={drug} width={normalize(24)} height={normalize(24)} tintColor={palette.main.p500} />
                                        </View>
                                        <View style={styles.medInfo}>
                                            <Typography style={styles.medName}>{med.drug_name}</Typography>
                                            <View style={styles.medTime}>
                                                <Icon icon={history} width={normalize(14)} height={normalize(14)} tintColor="#94A3B8" />
                                                <Typography style={styles.dateCreated}>Started on {med.date_create}</Typography>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.supplyContainer}>
                                        <View style={styles.supplyInfo}>
                                            <Typography style={styles.supplyLabel}>Current Inventory</Typography>
                                            <View style={styles.inventoryRow}>
                                                <Typography style={styles.supplyValue}>{med.total_dosage_taken}</Typography>
                                                <Typography style={styles.supplyValueTotal}> / {med.total_dosage_in_package} {med.dosage_form}</Typography>
                                            </View>
                                        </View>
                                        
                                        <View style={styles.progressBarWrapper}>
                                            <View style={styles.progressBarBackground}>
                                                <LinearGradient
                                                    colors={[palette.main.p500, palette.main.p300]}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    style={[styles.progressBar, { width: `${med.percentageTaken}%` }]}
                                                />
                                            </View>
                                            <Typography style={styles.progressText}>{med.percentageTaken}% consumed</Typography>
                                        </View>
                                    </View>

                                    {med.allowRefill && (
                                        <RefillButton onPress={() => {
                                            // @ts-ignore
                                            navigation.navigate('detailProduct', {productId : med.stock.id, bottomNav : true});
                                        }} />
                                    )}
                                </View>
                            </MotiAnimated.View>
                        ))}
                    </ScrollView>
                )}
            </View>
        </WrapperNoScroll>
    );
}
