import { normalize } from "@/shared/helpers";
import React, {useEffect, useRef, useState} from "react";
import WrapperNoScrollNoDialog from "@/shared/component/wrapperNoScrollNoDialog";
import { styles } from "./styles";
import {
    View,
    Text,
    Image,
    Animated,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Typography from "@/shared/component/typography";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import WrapperNoScrollNoDialogNoSafeArea from "@/shared/component/wrapperNoScrollNoDialogNoSafeArea";
import Icon from "@/shared/component/icon";
import {arrowBack} from "@/assets/icons"; // Ensure this is installed

const screenHeight = Dimensions.get('window').height;

export const StoreProfile = ({ navigation } : any) => {
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    const userprofile = new AuthSessionService().getAuthSession().data;
    const [visible, setVisible] = useState(true);

    const businessProfile = userprofile?.apps.filter((app : any) => {
        return app.name === "wholesales";
    })[0].info;



    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: screenHeight,
                duration: 100,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleDownload = (url: string) => {
        if (url) {
            Linking.openURL(url);
        }
    };

    // @ts-ignore
    const FancyButton = ({ label, onPress, gradient = ['#ff416c', '#ff4b2b'], icon = '⬇️' }) => (
        <TouchableOpacity onPress={onPress} style={{ marginTop: normalize(10) }}>
            <View style={styles.fancyButtonShadowWrapper}>
                <LinearGradient colors={gradient} style={styles.fancyButton}>
                    <Text style={styles.fancyButtonText}>{icon} {label}</Text>
                </LinearGradient>
            </View>
        </TouchableOpacity>
    );

    return (
        <WrapperNoScrollNoDialogNoSafeArea>
            <View style={styles.overlay}>
                <Animated.View style={[styles.modalContainer, { transform: [{ translateX: slideAnim }] }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                        <Icon icon={arrowBack}  tintColor="#fff" onPress={navigation.goBack} />
                    </TouchableOpacity>
                    <View style={styles.header}>
                        <Image source={{ uri: userprofile?.image }} style={styles.avatar} />
                        <Typography style={styles.customerName}>
                            {userprofile?.firstname} {userprofile?.lastname}
                        </Typography>
                        <Typography style={styles.customerTag}>{businessProfile?.customer_type?.name}</Typography>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{flex : 1, flexDirection : "column"}}>
                            <View style={styles.card}>
                                <Typography style={styles.cardTitle}>Contact Info</Typography>
                                <Typography style={styles.label}>Email:</Typography>
                                <Typography style={styles.value}>{userprofile?.email}</Typography>

                                <Typography style={styles.label}>Phone:</Typography>
                                <Typography style={styles.value}>{userprofile?.phone}</Typography>
                            </View>
                            <View style={styles.card}>
                                <Typography style={styles.cardTitle}>Business Info</Typography>
                                <Typography style={styles.label}>Business Name:</Typography>
                                <Typography style={styles.value}>{businessProfile?.business_name}</Typography>

                                <Typography style={styles.label}>Customer Group:</Typography>
                                <Typography style={styles.value}>{businessProfile?.customer_group?.name}</Typography>
                                <Typography style={styles.label}>Customer Type:</Typography>
                                <Typography style={styles.value}>{businessProfile?.customer_type?.name}</Typography>
                                <Typography style={styles.label}>Business Phone:</Typography>
                                <Typography style={styles.value}>{businessProfile?.phone}</Typography>
                            </View>
                            {
                                (businessProfile?.cac_document || businessProfile?.premises_licence)
                                    ?
                                    <View style={styles.card}>
                                        <Text style={styles.cardTitle}>Documents</Text>

                                        {
                                            businessProfile?.cac_document ?
                                                <FancyButton
                                                    label="Download CAC Document"
                                                    onPress={() => handleDownload(businessProfile?.cac_document)}
                                                />
                                                :
                                                <></>
                                        }

                                        {
                                            businessProfile?.premises_licence ?
                                                <FancyButton
                                                    label="Download Premises License"
                                                    onPress={() => handleDownload(businessProfile?.premises_licence)}
                                                />
                                                :
                                                <></>
                                        }
                                    </View>
                                    :
                                    <></>
                            }

                        </View>
                    </ScrollView>
                </Animated.View>
            </View>
        </WrapperNoScrollNoDialogNoSafeArea>
    );


}


