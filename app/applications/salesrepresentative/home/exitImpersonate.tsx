import React, { useCallback } from "react";
import { CommonActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import { Alert, View } from "react-native";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";

// @ts-ignore
export default function ExitImpersonate({ navigation }) {

    useFocusEffect(
        useCallback(() => {
            Alert.alert(
                "Exit Impersonation",
                "Are you sure you want to exit impersonation?",
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                        onPress: () => {
                            // @ts-ignore
                            navigation.navigate('homeTab')
                        },
                    },
                    {
                        text: "Yes",
                        onPress: () => {
                            const session = new AuthSessionService();
                            session.removeImpersonateCustomerData();
                            session.setEnvironment("rep");
                            CommonActions.reset({
                                index: 0, // Set the index of the active screen
                                routes: [{ name: 'sales_representative' }], // Replace with your target screen
                            })
                            // @ts-ignore
                            console.log(session.getImpersonateCustomerData())
                            navigation.navigate('sales_representative')
                        },
                    },
                ]
            );
        }, [])
    );
    return <View></View>
}
