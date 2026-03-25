import React, {useEffect, useState} from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import RoutesStack, {RootStackParamList} from "@/shared/routes/stack";
import {store} from '@/redux/store/store';
import {Provider} from 'react-redux';
import {ActivityIndicator,View} from "react-native";
import {LoadingProvider} from "@/shared/utils/LoadingProvider";
import AuthSessionService from "@/service/auth/AuthSessionService";
import { bootUpApplication, setupNotificationListeners } from "@/notification/usePushNotification";
import * as NavigationService from "@/shared/utils/NavigationService";
import { navigationRef } from "@/shared/utils/NavigationService";
import RNBootSplash from "react-native-bootsplash";
import {InternetProvider} from "@/shared/helpers/InternetContext";
import {PopupProvider} from "@/popup/PopupProvider";
import {SafeAreaProvider} from "react-native-safe-area-context";
const Stack = createStackNavigator<RootStackParamList>();


function App(): React.JSX.Element {
    const [page, setPage] = useState("");
    const [loading, setLoading] = useState(true);
    const authService = new AuthSessionService();
    useEffect(() => {
        const initNotification = async () => {
            setLoading(true);
            const initialPage = await bootUpApplication();
            setPage(initialPage);
            setLoading(false);
            setupNotificationListeners();
            RNBootSplash.hide({ fade: true });
            return true
        }
        initNotification();
    },[]);

    if (loading) {
        return <View style={{flex : 1, justifyContent : "center"}}><ActivityIndicator size="large" color="red" /></View>;
    }

    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <NavigationContainer 
                    ref={navigationRef}
                    onReady={() => {
                        NavigationService.flushPendingNavigation();
                    }}
                >
                    <InternetProvider>
                        <LoadingProvider>
                            <PopupProvider>
                                <Stack.Navigator
                                    // @ts-ignore
                                    initialRouteName={page}
                                    screenOptions={{ headerShown: false }}>
                                    {RoutesStack.map(route => (
                                        <Stack.Screen
                                            key={route.path}
                                            name={route.path}
                                            component={route.component}
                                        />
                                    ))}
                                </Stack.Navigator>
                            </PopupProvider>
                        </LoadingProvider>
                    </InternetProvider>
                </NavigationContainer>
            </SafeAreaProvider>
        </Provider>
    );
}

export default App;


