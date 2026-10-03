import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RoutesTab from "@/shared/routes/wholesalestab";
import ImpersonateTab from "@/shared/routes/impersonater_wholesalestab";
import Typography from "@/shared/component/typography";
import { palette, semantic } from "@/shared/constants/colors.ts";
import Icon from "@/shared/component/icon";
import { normalize } from "@/shared/helpers";
import { Platform, StyleSheet, View, Animated } from "react-native";
import { FONT } from "@/shared/constants/fonts";
import React, { useEffect, useState, useRef } from "react";
import Environment from "@/shared/utils/Environment.tsx";
import { useGlobal } from "@/shared/helpers/GlobalContext.tsx";
import CartService from "@/service/cart/CartService.tsx";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import CustomerTypeModal from "@/shared/component/customerTypeModal";
import * as NavigationService from "@/shared/utils/NavigationService";
import ProvisionsIntroModal, { PROVISIONS_INTRO_STORAGE_KEY } from "@/shared/component/provisionsIntroModal";


const Tab = createBottomTabNavigator();

function ShakeIcon({ focused, icon }: { focused: boolean; icon: any }) {
    const shakeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (focused) {
            shakeAnim.setValue(0);
            return;
        }

        const shakeSequence = Animated.loop(
            Animated.sequence([
                Animated.timing(shakeAnim, { toValue: -6, duration: 80, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 6, duration: 80, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -5, duration: 80, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 5, duration: 80, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -3, duration: 70, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 3, duration: 70, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 0, duration: 70, useNativeDriver: true }),
                Animated.delay(2200),
            ])
        );

        shakeSequence.start();
        return () => shakeSequence.stop();
    }, [focused]);

    const rotateInterpolation = shakeAnim.interpolate({
        inputRange: [-10, 10],
        outputRange: ['-12deg', '12deg'],
    });

    return (
        <Animated.View
            style={[
                styles.promoIconContainer,
                focused && styles.promoIconContainerActive,
                {
                    transform: [
                        { rotate: rotateInterpolation },
                        { translateX: shakeAnim },
                    ],
                },
            ]}
        >
            <Icon
                customStyles={{
                    width: normalize(20),
                    height: normalize(20),
                    tintColor: focused ? '#FFFFFF' : '#D50000',
                }}
                icon={icon}
            />
        </Animated.View>
    );
}

let hasShownProvisionsIntroThisSession = false;

export default function WholesalesNavigation({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const fallbackNavigation = useNavigation();
    const activeNav = navigation || fallbackNavigation;
    const { cartCount, setCartCount, setCartTotal } = useGlobal();

    const [showProvisionsIntroModal, setShowProvisionsIntroModal] = useState(false);
    const [showCustomerTypeModal, setShowCustomerTypeModal] = useState(false);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const introTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        (new CartService()).get().then((response) => {
            if (response.data.status === true) {
                setCartCount(response.data.data?.meta?.noItems || 0);
                setCartTotal(response.data.data?.meta?.totalItemsInCarts_formatted || "0.00");
            }
        });

        // Check if user has opted out of Provisions Intro Modal or already shown this session
        if (!hasShownProvisionsIntroThisSession) {
            AsyncStorage.getItem(PROVISIONS_INTRO_STORAGE_KEY).then((hideIntro) => {
                if (hideIntro !== 'true' && !hasShownProvisionsIntroThisSession) {
                    hasShownProvisionsIntroThisSession = true;
                    // Show Provisions Intro Modal 2 seconds after homepage loads
                    introTimerRef.current = setTimeout(() => {
                        setShowProvisionsIntroModal(true);
                    }, 2000);
                } else {
                    checkCustomerType();
                }
            }).catch(() => {
                checkCustomerType();
            });
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (introTimerRef.current) clearTimeout(introTimerRef.current);
        };
    }, []);

    const handleProvisionsIntroClose = () => {
        setShowProvisionsIntroModal(false);
        // Customer Type modal pops up after intro modal closes
        checkCustomerType();
    };

    const handleProvisionsIntroExplore = () => {
        setShowProvisionsIntroModal(false);
        // Navigate directly to provisions tab
        try {
            if (activeNav?.navigate) {
                activeNav.navigate('wholesales', { screen: 'provisions' });
            }
        } catch (e) { }
        // Customer Type modal pops up after intro modal closes
        checkCustomerType();
    };

    const checkCustomerType = () => {
        if (!Environment.isLogin()) return;
        const session = new AuthSessionService().getAuthSession();
        const apps = session?.data?.apps || [];
        const wholesalesApp = apps.find((a: any) => String(a.name || '').toLowerCase() === 'wholesales');
        const customerTypeId = wholesalesApp?.info?.customer_type_id;

        if (customerTypeId === null || customerTypeId === undefined) {
            // Delay between 2 seconds and 5 seconds after intro modal
            const randomDelayMs = Math.floor(Math.random() * (5 - 2 + 1) + 2) * 1000;
            timerRef.current = setTimeout(() => {
                setShowCustomerTypeModal(true);
            }, randomDelayMs);
        }
    };

    let tab = RoutesTab;
    if (Environment.checkForImpersonateCustomerData()) {
        // @ts-ignore
        tab = ImpersonateTab;
    }

    return (
        <React.Fragment>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarStyle: [
                        styles.tabBar,
                        {
                            height: Platform.OS === 'ios'
                                ? normalize(80) + (insets.bottom > 0 ? normalize(5) : 0)
                                : normalize(55) + insets.bottom,
                            paddingBottom: Platform.OS === 'ios' ? normalize(30) : insets.bottom,
                        }
                    ],
                    tabBarItemStyle: styles.tabBarItem,
                    tabBarShowLabel: true,
                })}
            >
                {tab.map(route => {
                    const isPromo = route.name === 'provisions' || (route as any).isPromo;

                    return (
                        <Tab.Screen
                            key={route.name}
                            name={route.name}
                            component={route.component}
                            options={{
                                tabBarBadge: route.name === 'myCart' && cartCount > 0
                                    ? cartCount
                                    : isPromo
                                        ? 'HOT🔥'
                                        : undefined,
                                tabBarBadgeStyle: isPromo
                                    ? {
                                        backgroundColor: '#E11D48',
                                        color: '#FFFFFF',
                                        fontSize: normalize(7.5),
                                        fontFamily: FONT.EXTRA_BOLD,
                                        marginTop: Platform.OS === 'ios' ? normalize(-4) : normalize(-2),
                                        paddingHorizontal: normalize(4),
                                        height: normalize(15),
                                        minWidth: normalize(32),
                                        borderRadius: normalize(8),
                                    }
                                    : {
                                        backgroundColor: semantic.alert.danger.d500,
                                        color: 'white',
                                        fontSize: normalize(10),
                                        marginTop: Platform.OS === 'ios' ? normalize(-2) : 0,
                                    },
                                tabBarLabel: ({ focused }) => (
                                    <Typography
                                        style={[
                                            styles.tabBarText,
                                            {
                                                color: isPromo
                                                    ? (focused ? '#D50000' : '#E11D48')
                                                    : (focused ? palette.main.p500 : semantic.text.black),
                                            },
                                            isPromo && { fontFamily: FONT.EXTRA_BOLD, fontSize: normalize(10.5) }
                                        ]}
                                    >
                                        {route.displayName}
                                    </Typography>
                                ),
                                tabBarIcon: ({ focused }) => {
                                    if (isPromo) {
                                        return <ShakeIcon focused={focused} icon={route.icon} />;
                                    }
                                    return (
                                        <Icon
                                            customStyles={{
                                                width: normalize(22),
                                                height: normalize(22),
                                                tintColor: focused ? palette.main.p500 : semantic.text.black,
                                            }}
                                            icon={route.icon}
                                        />
                                    );
                                },
                            }}
                        />
                    );
                })}
            </Tab.Navigator>

            <ProvisionsIntroModal
                visible={showProvisionsIntroModal}
                onClose={handleProvisionsIntroClose}
                onExplore={handleProvisionsIntroExplore}
            />

            <CustomerTypeModal
                visible={showCustomerTypeModal}
                dismissable={false}
                onSuccess={() => setShowCustomerTypeModal(false)}
            />
        </React.Fragment>
    );
}
const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#FFFFFF',

        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        elevation: 10,
        // height and paddingBottom are now handled dynamically in screenOptions
        paddingTop: 0,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
            },
            android: {
                // Standard elevation
            }
        })
    },
    tabBarItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBarText: {
        fontSize: normalize(10),
        fontFamily: FONT.BOLD,
        marginTop: normalize(2),
        textAlign: 'center',
    },
    promoIconContainer: {
        width: normalize(30),
        height: normalize(30),
        borderRadius: normalize(15),
        backgroundColor: '#FFF1F2',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FECDD3',
    },
    promoIconContainerActive: {
        backgroundColor: '#D50000',
        borderColor: '#990000',
        shadowColor: '#D50000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 4,
    },
});
