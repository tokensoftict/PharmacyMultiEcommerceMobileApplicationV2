import React, { useEffect, useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RoutesStack, { RootStackParamList } from "@/shared/routes/stack";
import { store } from '@/redux/store/store';
import { Provider } from 'react-redux';
import { ActivityIndicator, View } from "react-native";
import { LoadingProvider } from "@/shared/utils/LoadingProvider";
import AuthSessionService from "@/service/auth/AuthSessionService";
import { bootUpApplication, setupNotificationListeners } from "@/notification/usePushNotification";
import * as NavigationService from "@/shared/utils/NavigationService";
import { navigationRef } from "@/shared/utils/NavigationService";
import RNBootSplash from "react-native-bootsplash";
import { InternetProvider } from "@/shared/helpers/InternetContext";
import { GlobalProvider } from "@/shared/helpers/GlobalContext";
import FloatingCartBar from "@/shared/component/floatingCartBar";
import { PopupProvider } from "@/popup/PopupProvider";
import { CampaignProvider } from "@/campaign/CampaignProvider";
import { AppUpdateProvider } from "@/shared/component/appUpdateDialog/AppUpdateProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import linking from "@/shared/routes/linking";
import DetourService from "@/service/referral/DetourService";
import { useGlobalBackHandler } from "@/shared/hooks/useGlobalBackHandler";

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

            // ── Referral: resolve any deferred Detour referral link ──────────
            // Run non-blocking in background so app startup is never delayed
            DetourService.initialize().catch((err) => {
                console.warn('[Referral] Init failed:', err);
            });

            setLoading(false);
            setupNotificationListeners();
            RNBootSplash.hide({ fade: true });
            return true;
        }
        initNotification();
    }, []);

    // ── Global Android back-press: redirect to storeSelector instead of exiting ──
    useGlobalBackHandler();


    if (loading) {
        return <View style={{ flex: 1, justifyContent: "center" }}><ActivityIndicator size="large" color="red" /></View>;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Provider store={store}>
                <SafeAreaProvider>
                    <NavigationContainer
                        ref={navigationRef}
                        linking={linking}
                        onReady={() => {
                            NavigationService.flushPendingNavigation();
                        }}
                    >
                        <InternetProvider>
                            <GlobalProvider>
                                <LoadingProvider>
                                    <PopupProvider>
                                        <CampaignProvider>
                                            <AppUpdateProvider>
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
                                                <FloatingCartBar />
                                            </AppUpdateProvider>
                                        </CampaignProvider>
                                    </PopupProvider>
                                </LoadingProvider>
                            </GlobalProvider>
                        </InternetProvider>
                    </NavigationContainer>
                </SafeAreaProvider>
            </Provider>
        </GestureHandlerRootView>
    );
}

export default App;


