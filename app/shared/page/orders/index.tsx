import React, { useEffect, useState } from 'react';
import HeaderWithIcon from "@/shared/component/headerBack";
import { ActivityIndicator, FlatList, Platform, View, StyleSheet, Dimensions } from "react-native";
import Order from "@/shared/page/orders/components/order";
import TopNavigation, { TopNavigationProps } from "@/shared/page/orders/components/topNavigation";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import { normalize } from "@/shared/helpers";
import { palette, semantic } from "@/shared/constants/colors.ts";
import OrderService from "@/service/order/OrderService.tsx";
import { OrderListInterface } from "@/service/order/interface/OrderListInterface.tsx";
import Typography from "@/shared/component/typography";
import LottieView from "lottie-react-native";
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function Orders() {
    const [isLoading, setIsLoading] = useState(false);
    const [tabSelected, setTabSelected] = useState<string>("In Progress");
    const [lastPage, setLastPage] = useState(3);
    const [pageNumber, setPageNumber] = useState(1);
    const [orderItemList, setOrderItemList] = useState<OrderListInterface[]>([]);
    const orderService = new OrderService();

    useEffect(() => {
        loadOrders();
    }, [tabSelected])

    const loadOrders = function () {
        if (pageNumber >= lastPage) return;
        setIsLoading(true);
        orderService.list(tabSelected, pageNumber).then((response) => {
            setIsLoading(false);
            if (response.data.status === true) {
                const fetchedData = response.data.data;
                setLastPage(response.data.meta.last_page);
                const page = pageNumber;
                setPageNumber((prev) => (page === 1 ? 2 : prev + 1));
                setOrderItemList((prev) =>
                    page === 1 ? fetchedData : [...prev, ...fetchedData]
                );
            }
        }).catch(() => {
            setIsLoading(false);
            setPageNumber(1);
            setLastPage(1);
        });
    };

    function onTabSelected(tab: TopNavigationProps) {
        setPageNumber(1);
        setLastPage(3);
        setOrderItemList([]);
        setTabSelected(tab.name);
    }

    return (
        <View style={styles.mainContainer}>
            <LinearGradient
                colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
                style={StyleSheet.absoluteFill}
            />

            {/* Decorative Background Elements */}
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />

            <WrapperNoScroll barStyle="light-content" style={{ flex: 1 }}>
                <HeaderWithIcon title={"MY ORDERS"} />

                <Animated.View 
                    entering={FadeInDown.duration(600).delay(200)}
                    style={styles.navContainer}
                >
                    <TopNavigation onChange={onTabSelected} />
                </Animated.View>

                <View style={{ flex: 1 }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        onEndReached={() => {
                            if (!isLoading) {
                                loadOrders()
                            }
                        }}
                        onEndReachedThreshold={0.5}
                        data={orderItemList}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item, index }) => (
                            <Animated.View entering={FadeInDown.duration(500).delay(index * 100)}>
                                <Order key={item.id} product={item} />
                            </Animated.View>
                        )}
                        ListHeaderComponent={
                            (isLoading && orderItemList.length === 0) ? (
                                <View style={styles.loaderContainer}>
                                    <ActivityIndicator size="large" color={palette.main.p500} />
                                </View>
                            ) : null
                        }
                        ListFooterComponent={
                            (isLoading && orderItemList.length > 0) ? (
                                <View style={styles.footerLoader}>
                                    <ActivityIndicator size="small" color={palette.main.p500} />
                                </View>
                            ) : null
                        }
                        ListEmptyComponent={
                            !isLoading ? (
                                <View style={styles.emptyContainer}>
                                    <LottieView
                                        source={require("@/assets/order_empty.json")}
                                        autoPlay
                                        resizeMode="contain"
                                        loop={false}
                                        style={styles.emptyLottie}
                                    />
                                    <Typography style={styles.emptyText}>
                                        No orders found just yet 🛍️{"\n"}Start shopping to place your first one!
                                    </Typography>
                                </View>
                            ) : null
                        }
                    />
                </View>
            </WrapperNoScroll>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    circle: {
        position: 'absolute',
        borderRadius: 1000,
        backgroundColor: '#E2E8F0',
        opacity: 0.5,
    },
    circle1: {
        width: width * 0.8,
        height: width * 0.8,
        top: -width * 0.2,
        right: -width * 0.2,
        backgroundColor: '#BFDBFE',
    },
    circle2: {
        width: width * 0.6,
        height: width * 0.6,
        bottom: -width * 0.1,
        left: -width * 0.3,
        backgroundColor: '#DDD6FE',
    },
    navContainer: {
        paddingHorizontal: normalize(16),
        marginBottom: normalize(8),
    },
    listContent: {
        paddingBottom: normalize(40),
        paddingTop: normalize(8),
    },
    loaderContainer: {
        paddingVertical: normalize(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerLoader: {
        paddingVertical: normalize(20),
        alignItems: 'center',
    },
    emptyContainer: {
        paddingHorizontal: normalize(40),
        paddingTop: normalize(60),
        alignItems: 'center',
    },
    emptyLottie: {
        width: normalize(300),
        height: normalize(250),
    },
    emptyText: {
        textAlign: 'center',
        fontSize: normalize(15),
        lineHeight: normalize(22),
        color: '#64748B',
        marginTop: normalize(-20),
    }
});
