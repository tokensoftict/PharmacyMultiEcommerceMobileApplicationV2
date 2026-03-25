import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RoutesTab from "@/shared/routes/wholesalestab";
import ImpersonateTab from "@/shared/routes/impersonater_wholesalestab";
import Typography from "@/shared/component/typography";
import { palette, semantic } from "@/shared/constants/colors.ts";
import Icon from "@/shared/component/icon";
import { normalize } from "@/shared/helpers";
import { Platform, StyleSheet } from "react-native";
import { FONT } from "@/shared/constants/fonts";
import React from "react";
import Environment from "@/shared/utils/Environment.tsx";


const Tab = createBottomTabNavigator();

export default function WholesalesNavigation() {

    let tab = RoutesTab;
    if (Environment.checkForImpersonateCustomerData()) {
        // @ts-ignore
        tab = ImpersonateTab;
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: styles.tabBar,
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
    );
}
const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        elevation: 10,
        height: Platform.OS === 'ios' ? normalize(88) : normalize(60),
        paddingBottom: Platform.OS === 'ios' ? normalize(30) : 0,
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
    }
});
