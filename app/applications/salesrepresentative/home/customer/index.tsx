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
import Typography from "@/shared/component/typography";
import { Button, ButtonSecondary } from "@/shared/component/buttons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from "@/shared/theme";

const screenHeight = Dimensions.get('window').height;

// @ts-ignore
export default function CustomerProfileModal({ visible, onClose, customerData, onImpersonate }) {
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    const insets = useSafeAreaInsets();

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
                <Animated.View style={[
                    styles.modalContainer, 
                    { 
                        transform: [{ translateY: slideAnim }],
                        paddingBottom: Math.max(insets.bottom, theme.spacing.md),
                    }
                ]}>
                    <View style={[styles.header, { paddingTop: Math.max(insets.top, theme.spacing.lg) }]}>
                        <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { top: Math.max(insets.top, theme.spacing.md) }]}>
                            <Typography style={{ fontSize: theme.typography.xl, color: '#fff' }}>✕</Typography>
                        </TouchableOpacity>

                        <Image source={{ uri: customerData?.user?.image }} style={styles.avatar} />
                        <Typography style={styles.customerName}>
                            {customerData?.business_name}
                        </Typography>
                        <Typography style={styles.customerTag}>{customerData?.customer_type?.name}</Typography>
                    </View>

                    <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
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
                            
                            <View style={{ marginTop: theme.spacing.xs }}>
                                <Button 
                                    title="Download CAC Document" 
                                    onPress={() => handleDownload(customerData?.cac_document)} 
                                />
                            </View>
                            
                            <View style={{ marginTop: theme.spacing.xs }}>
                                <Button 
                                    title="Download Premises License" 
                                    onPress={() => handleDownload(customerData?.premises_licence)} 
                                />
                            </View>
                        </View>

                        <View style={{ marginTop: theme.spacing.sm }}>
                            <ButtonSecondary
                                title="Impersonate & Create Order"
                                onPress={() => onImpersonate(customerData)}
                            />
                        </View>
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
}
