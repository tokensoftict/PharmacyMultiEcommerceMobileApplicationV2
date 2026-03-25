import React, {useState} from 'react';
import {styles} from "./styles"
import WrapperNoScrollNoDialogNoSafeArea from "@/shared/component/wrapperNoScrollNoDialogNoSafeArea";
import {useNavigation, useRoute} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import LinearGradient from "react-native-linear-gradient";
import {Text, TouchableOpacity, View} from "react-native";
import {arrowBack, drug, history, medica, status} from "@/assets/icons";
import Icon from "@/shared/component/icon";
import Typography from "@/shared/component/typography";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import {MedReminderSchedules} from "@/service/medReminder/interface/MedReminderInterface.tsx";
import {normalize} from "@/shared/helpers";

export default function ViewReminder() {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute();
    const [medication, setMedication] = useState<MedReminderSchedules>();
    function goBack() {
        navigation.goBack();
    }


    useEffectOnce(function(){
        // @ts-ignore
        const medication = route.params?.schedule;
        setMedication(medication);
    },[]);


    return (
        <WrapperNoScrollNoDialogNoSafeArea loading={loading}>
            <LinearGradient colors={["#4CAF50", "#2E7D32"]} style={styles.container}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={goBack}>
                        <Icon  icon={arrowBack} tintColor={'white'} />
                    </TouchableOpacity>
                    <Typography style={styles.titleHeader}></Typography>
                </View>

                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <Icon  icon={drug} height={80} width={80} tintColor={'white'} />
                    </View>


                    <View style={styles.card}>
                        <Typography style={styles.welcomeText}>{medication?.med_reminder.drug_name}</Typography>
                        <Typography style={styles.instructionText}>
                            {medication?.med_reminder.notes}
                        </Typography>
                        <View style={styles.doseTime}>
                            <Icon icon={history} width={24} height={24} tintColor="#666" />
                            <Typography style={styles.timeText}>{medication?.scheduled_at_full}</Typography>
                        </View>
                        <View style={styles.doseTime}>
                            <Icon icon={status} width={24} height={24} tintColor="#666" />
                            <Typography style={styles.timeText}>{medication?.status}</Typography>
                        </View>
                        <View style={{height : normalize(20)}}></View>



                    </View>
                </View>
            </LinearGradient>
        </WrapperNoScrollNoDialogNoSafeArea>
    );

}
