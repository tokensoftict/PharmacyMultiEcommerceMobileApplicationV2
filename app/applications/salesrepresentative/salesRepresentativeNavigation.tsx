import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RoutesTab from "@/shared/routes/salesreptab";
import Typography from "@/shared/component/typography";
import { palette, semantic } from "@/shared/constants/colors.ts";
import Icon from "@/shared/component/icon";
import { normalize } from "@/shared/helpers";
import { Platform, StyleSheet } from "react-native";
import { FONT } from "@/shared/constants/fonts.ts";
import React from "react";


const Tab = createBottomTabNavigator();

export default function SalesRepresentativeNavigation() {
    const insets = useSafeAreaInsets();

    return (
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
            {RoutesTab.map(route => (
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
    }
});
