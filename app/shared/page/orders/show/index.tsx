import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import React, { useState } from "react";
import OrderService from "@/service/order/OrderService.tsx";
import Toasts from "@/shared/utils/Toast.tsx";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";
import { ScrollView, View, StyleSheet, Dimensions, Platform } from "react-native";
import { normalize } from "@/shared/helpers";
import { palette, semantic } from "@/shared/constants/colors.ts";
import HeaderWithIcon from "@/shared/component/headerBack";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import Typography from "@/shared/component/typography";
import { currencyType } from "@/shared/constants/global.ts";
import { Order } from "@/service/order/interface/OrderListInterface.tsx";
import OrderItemHorizontalList from "@/shared/component/orderItemHorizontalList";
import Environment from "@/shared/utils/Environment.tsx";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import LinearGradient from "react-native-linear-gradient";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";

const { width } = Dimensions.get('window');

export default function ShowOrder() {
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute();
    const [isLoading, setIsLoading] = useState(false);
    const orderService = new OrderService();
    const [order, setOrder] = useState<Order>();

    useEffectOnce(function () {
        const notificationData = Environment.getNotificationData();
        // @ts-ignore
        const orderId = route.params?.orderId ?? notificationData['orderId'];
        if (!orderId) {
            Toasts('Unknown error occurred!');
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                navigation.replace(new AuthSessionService().getEnvironment());
            }
        }

        setIsLoading(true)
        orderService.get(orderId).then((response) => {
            setIsLoading(false);
            if (response.data.status) {
                setOrder(response.data.data);
            }
        }, (error) => {
            setIsLoading(false);
            Toasts('Unknown error occurred!')
            navigation.goBack();
        });

    }, []);

    function renderItem(item: any, key: number) {
        return (
            <View style={styles.productItem} key={key}>
                <OrderItemHorizontalList product={item} />
            </View>
        );
    }

    const DetailRow = ({ label, value, color }: { label: string, value?: string | number, color?: string }) => (
        <View style={styles.detailRow}>
            <Typography style={styles.detailLabel}>{label}</Typography>
            <Typography style={[styles.detailValue, color ? { color } : {}]}>{value}</Typography>
        </View>
    );

    return (
        <View style={styles.mainContainer}>
            <LinearGradient
                colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
                style={StyleSheet.absoluteFill}
            />
            
            <WrapperNoScroll loading={isLoading} barStyle="light-content" style={{ flex: 1 }}>
                <HeaderWithIcon title={"ORDER DETAILS"} />
                
                {!isLoading && order && (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        
                        <Animated.View entering={FadeInUp.duration(600)} style={styles.card}>
                            <Typography style={styles.cardTitle}>Basic Information</Typography>
                            <DetailRow label="Order Number" value={order?.orderId} />
                            <DetailRow label="Invoice Number" value={order?.invoiceNo} />
                            <DetailRow label="Order Date" value={order?.orderDate} />
                            <DetailRow label="Status" value={order?.status} color={palette.main.p500} />
                        </Animated.View>

                        <Animated.View entering={FadeInUp.duration(600).delay(100)} style={styles.card}>
                            <Typography style={styles.cardTitle}>Order Items</Typography>
                            {order?.products?.map((item: any, index: number) => renderItem(item, index))}
                        </Animated.View>

                        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.card}>
                            <Typography style={styles.cardTitle}>Delivery Details</Typography>
                            <View style={styles.shippingInfo}>
                                <Typography style={styles.detailLabel}>Address</Typography>
                                <Typography style={styles.addressText}>{order?.address}</Typography>
                                <View style={styles.divider} />
                                <DetailRow label="Items Count" value={`${order?.itemsCount} Items`} />
                            </View>
                        </Animated.View>

                        <Animated.View entering={FadeInUp.duration(600).delay(300)} style={styles.card}>
                            <Typography style={styles.cardTitle}>Payment Summary</Typography>
                            <DetailRow label="Payment Method" value={order?.paymentMethod} />
                            <View style={[styles.divider, { marginVertical: normalize(10) }]} />
                            
                            {order?.orderTotals?.map((item, index) => (
                                <View key={'orderTotal-' + index} style={styles.summaryRow}>
                                    <Typography style={styles.summaryLabel}>{item.name}</Typography>
                                    <Typography style={styles.summaryValue}>{currencyType}{item.value_formatted}</Typography>
                                </View>
                            ))}
                            
                            <View style={styles.totalRow}>
                                <Typography style={styles.totalLabel}>Total Amount</Typography>
                                <Typography style={styles.totalValue}>{currencyType}{order?.totalAmount}</Typography>
                            </View>
                        </Animated.View>

                        <View style={{ height: normalize(40) }} />
                    </ScrollView>
                )}
            </WrapperNoScroll>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingHorizontal: normalize(16),
        paddingTop: normalize(10),
        paddingBottom: normalize(40),
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(20),
        padding: normalize(16),
        marginBottom: normalize(16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardTitle: {
        fontSize: normalize(15),
        fontWeight: Platform.OS === 'ios' ? '800' : undefined,
        color: '#1E293B',
        marginBottom: normalize(12),
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: normalize(6),
    },
    detailLabel: {
        fontSize: normalize(12),
        color: '#64748B',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: normalize(13),
        fontWeight: Platform.OS === 'ios' ? '700' : undefined,
        color: '#334155',
    },
    productItem: {
        marginBottom: normalize(12),
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        paddingBottom: normalize(12),
    },
    shippingInfo: {
        marginTop: normalize(4),
    },
    addressText: {
        fontSize: normalize(13),
        color: '#475569',
        lineHeight: normalize(18),
        marginTop: normalize(6),
        fontWeight: '400',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: normalize(12),
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: normalize(4),
    },
    summaryLabel: {
        fontSize: normalize(12),
        color: '#64748B',
    },
    summaryValue: {
        fontSize: normalize(13),
        fontWeight: Platform.OS === 'ios' ? '600' : undefined,
        color: '#334155',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: normalize(12),
        backgroundColor: palette.main.p500 + '10', // 10% opacity
        padding: normalize(12),
        borderRadius: normalize(12),
    },
    totalLabel: {
        fontSize: normalize(14),
        fontWeight: Platform.OS === 'ios' ? '800' : undefined,
        color: '#1E293B',
    },
    totalValue: {
        fontSize: normalize(16),
        fontWeight: Platform.OS === 'ios' ? '900' : undefined,
        color: palette.main.p500,
    }
});
