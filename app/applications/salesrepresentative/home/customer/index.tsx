import React, { useEffect, useRef } from 'react';
import { styles } from "./style";
import {
    Modal,
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
import Typography from "@/shared/component/typography"; // Ensure this is installed
import { normalize } from '@/shared/helpers';

const screenHeight = Dimensions.get('window').height;

// @ts-ignore
export default function CustomerProfileModal({ visible, onClose, customerData, onImpersonate }) {
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: screenHeight,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleDownload = (url: string) => {
        if (url) {
            Linking.openURL(url);
        }
    };

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.overlay}>
                <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Typography style={{ fontSize: normalize(22), color: '#fff' }}>✕</Typography>
                        </TouchableOpacity>

                        <Image source={{ uri: customerData?.user?.image }} style={styles.avatar} />
                        <Typography style={styles.customerName}>
                            {customerData?.business_name}
                        </Typography>
                        <Typography style={styles.customerTag}>{customerData?.customer_type?.name}</Typography>
                    </View>

                    <ScrollView contentContainerStyle={styles.contentContainer}>
                        <View style={styles.card}>
                            <Typography style={styles.cardTitle}>Contact Info</Typography>
                            <Typography style={styles.label}>Email:</Typography>
                            <Typography style={styles.value}>{customerData?.user?.email}</Typography>

                            <Typography style={styles.label}>Phone:</Typography>
                            <Typography style={styles.value}>{customerData?.phone}</Typography>
                        </View>

                        <View style={styles.card}>
                            <Typography style={styles.cardTitle}>Business Info</Typography>
                            <Typography style={styles.label}>Business Name:</Typography>
                            <Typography style={styles.value}>{customerData?.business_name}</Typography>

                            <Typography style={styles.label}>Customer Group:</Typography>
                            <Typography style={styles.value}>{customerData?.customer_group?.name}</Typography>

                            <Typography style={styles.label}>Customer Type:</Typography>
                            <Typography style={styles.value}>{customerData?.customer_type?.name}</Typography>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Documents</Text>

                            <FancyButton
                                label="Download CAC Document"
                                onPress={() => handleDownload(customerData?.cac_document)}
                            />
                            <FancyButton
                                label="Download Premises License"
                                onPress={() => handleDownload(customerData?.premises_licence)}
                            />
                        </View>

                        <FancyButton
                            label="Impersonate & Create Order"
                            gradient={['#43cea2', '#185a9d']}
                            icon="🛒"
                            onPress={() => onImpersonate(customerData)}
                        />
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
}

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
