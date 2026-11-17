import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import wholesalesTabs, { getWholesalesTabs } from "@/shared/routes/wholesalestab";
import ImpersonateTab from "@/shared/routes/impersonater_wholesalestab";
import Typography from "@/shared/component/typography";
import { palette, semantic } from "@/shared/constants/colors.ts";
import Icon from "@/shared/component/icon";
import { normalize } from "@/shared/helpers";
import { Platform, StyleSheet } from "react-native";
import { FONT } from "@/shared/constants/fonts";
import React, { useEffect, useState, useRef } from "react";
import Environment from "@/shared/utils/Environment.tsx";
import { useGlobal } from "@/shared/helpers/GlobalContext.tsx";
import CartService from "@/service/cart/CartService.tsx";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import CustomerTypeModal from "@/shared/component/customerTypeModal";


const Tab = createBottomTabNavigator();

export default function WholesalesNavigation({ navigation }: any) {
    const insets = useSafeAreaInsets();
    const { cartCount, setCartCount, setCartTotal } = useGlobal();

    const [showCustomerTypeModal, setShowCustomerTypeModal] = useState(false);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        (new CartService()).get().then((response) => {
            if (response.data.status === true) {
                setCartCount(response.data.data?.meta?.noItems || 0);
                setCartTotal(response.data.data?.meta?.totalItemsInCarts_formatted || "0.00");
            }
        });

        checkCustomerType();

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

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

    let tab = getWholesalesTabs();
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
                {tab.map(route => (
                    <Tab.Screen
                        key={route.name}
                        name={route.name}
                        component={route.component}
                        options={{
                            tabBarBadge: route.name === 'myCart' && cartCount > 0 ? cartCount : undefined,
                            tabBarBadgeStyle: {
                                backgroundColor: semantic.alert.danger.d500,
                                color: 'white',
                                fontSize: normalize(10),
                                marginTop: Platform.OS === 'ios' ? normalize(-2) : 0,
                            },
                            tabBarLabel: ({ focused }) => (
                                <Typography
                                    style={[
                                        styles.tabBarText,
                                        { color: focused ? palette.main.p500 : semantic.text.black }
                                    ]}
                                >
                                    {route.displayName}
                                </Typography>
                            ),
                            tabBarIcon: ({ focused }) => (
                                <Icon
                                    customStyles={{
                                        width: normalize(22),
                                        height: normalize(22),
                                        tintColor: focused ? palette.main.p500 : semantic.text.black,
                                    }}
                                    icon={route.icon}
                                />
                            ),
                        }}
                    />
                ))}
            </Tab.Navigator>

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
});
