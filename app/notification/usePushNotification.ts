import { PermissionsAndroid, Platform, Linking } from "react-native";
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from "@notifee/react-native";
import AuthSessionService from "@/service/auth/AuthSessionService";
import SpInAppUpdates, {
    IAUUpdateKind,
    StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import OtpService from "@/service/auth/OtpService";
import Environment from "@/shared/utils/Environment";
import { NativeModules } from 'react-native';
import * as NavigationService from "@/shared/utils/NavigationService";

const locale = NativeModules.SettingsManager?.settings?.AppleLocale ||
    NativeModules.SettingsManager?.settings?.AppleLanguages?.[0];
const country = locale?.split('_')[1]?.toLowerCase() || 'us';

const requestUserPermission = async () => {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            return;
        }
    }
    if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
            return;
        }

        await messaging().registerDeviceForRemoteMessages();
    }
}

const checkForUpdate = async () => {
    const inAppUpdates = new SpInAppUpdates(false);
    inAppUpdates.checkNeedsUpdate().then((result) => {
        if (result.shouldUpdate) {
            let updateOptions: StartUpdateOptions = {};
            if (Platform.OS === 'android') {
                updateOptions = {
                    updateType: IAUUpdateKind.IMMEDIATE,
                };
            } else {
                updateOptions = {
                    forceUpgrade: true,
                    title: 'Update Required',
                    message: 'A new version of the app is available. Please update to continue.',
                    buttonUpgradeText: 'Update Now',
                    country: country,
                }
            }
            inAppUpdates.startUpdate(updateOptions);
        }
    }, function () {

    });
}

const getToken = async () => {
    if (await new AuthSessionService().getDeviceToken() === null) {
        try {
            if (Platform.OS === 'ios' && !messaging().isDeviceRegisteredForRemoteMessages) {
                await messaging().registerDeviceForRemoteMessages();
            }
            const token = await messaging().getToken();
            await new AuthSessionService().setDeviceToken(token);
            await messaging().subscribeToTopic("psgdc_notification");
            return token;
        } catch (e) {
            console.log(e);
            return false
        }
    }
}

export async function requestAllNotificationPermissions() {
    await requestUserPermission();
}

export const handleNotification = (notification: any) => {
    if (!Environment.isLogin()) return;

    const data = notification.data || {};
    const notificationExtra = JSON.parse(data.extra || "{}");
    const environment = data.environment;
    const notificationType = data.notificationType;

    notificationExtra['body'] = notification.body || notification.notification?.body;
    notificationExtra['title'] = notification.title || notification.notification?.title;

    if (environment) {
        new AuthSessionService().setEnvironment(environment + "");
    }

    if (data.hasOwnProperty('json')) {
        const json = JSON.parse(data.json || "{}");
        const action = json.action;
        if (action === "stocks") {
            NavigationService.navigate("productList", {
                endpoint: "stock/new-arrivals",
                title: notificationExtra.title,
                id: "new-arrivals"
            });
            return;
        }
    }

    switch (notificationType) {
        case "VIEW_MED_REMINDER":
            NavigationService.navigate("mainMenu", notificationExtra);
            break;
        case "APPROVE_MED_REMINDER_SCHEDULES":
            NavigationService.navigate("viewLogs", notificationExtra);
            break;
        case "VIEW_ORDER":
            NavigationService.navigate("showOrder", notificationExtra);
            break;
        case "NEW_ARRIVAL":
            NavigationService.navigate("productList", {
                endpoint: "stock/new-arrivals",
                title: notificationExtra.title,
                id: "new-arrivals"
            });
            break;
        case "OPEN_URL":
            if (notificationExtra.url || data.url) {
                Linking.openURL(notificationExtra.url || data.url);
            }
            break;
    }
};

export const setupNotificationListeners = () => {
    // 1. Foreground messaging (Firebase)
    messaging().onMessage(async remoteMessage => {
        const channelId = await notifee.createChannel({
            id: 'psgdc_high_priority_v1',
            name: 'PSGDC Notifications',
            importance: AndroidImportance.HIGH,
            sound: 'medication_reminder',
            vibration: true,
            vibrationPattern: [500, 500, 500, 500, 500, 500],
        });

        await notifee.displayNotification({
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            data: remoteMessage.data,
            android: {
                channelId,
                importance: AndroidImportance.HIGH,
                sound: 'medication_reminder',
                vibrationPattern: [500, 500, 500, 500, 500, 500],
                smallIcon: 'ic_launcher',
                pressAction: {
                    id: 'default',
                },
            },
            ios: {
                sound: 'medication_reminder.wav',
            }
        });
    });

    // 2. Tap on notification (App in background)
    messaging().onNotificationOpenedApp(remoteMessage => {
        handleNotification(remoteMessage);
    });

    // 3. Notifee Foreground Events (e.g. tapping our custom foreground notification)
    notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.PRESS) {
            handleNotification(detail.notification);
        }
    });
};

export const bootUpApplication = async () => {
    // Fire and forget non-critical tasks
    if (Platform.OS === 'ios') {
        // iOS requires permission and registration before token request
        await requestAllNotificationPermissions().catch(console.log);
        getToken().catch(console.log);
    } else {
        requestAllNotificationPermissions().catch(console.log);
        getToken().catch(console.log);
    }
    checkForUpdate().catch(console.log);

    const authService = new AuthSessionService();

    // Parallelize critical path checks
    const [introStatus, initialNotifee, initialFirebase] = await Promise.all([
        authService.getIntroPageStatus(),
        notifee.getInitialNotification(),
        messaging().getInitialNotification()
    ]);

    let initialPage = "supermarket";

    if (introStatus === "NO") {
        if (Environment.isLogin()) {
            await authService.destroySession();
        }
        await new OtpService().getApps();
        initialPage = "introSlider";
    } else {
        // Quick login from cache
        const hasSession = await authService.quickAutoLogin();
        if (hasSession) {
            const userProfile = authService.getAuthSession();
            const userAppCount = userProfile?.data?.apps?.length ?? 0;
            initialPage = userAppCount > 0 ? "storeSelector" : "supermarket";

            // Perform full refresh in background
            authService.autoLogin().catch(console.log);
        } else {
            // No session, still need app list for login choices
            const otpService = new OtpService();
            const hasCachedApps = await otpService.loadCachedApps();

            if (hasCachedApps) {
                // Return immediately with cached data, refresh in background
                otpService.getApps().catch(console.log);
            } else {
                // No cache, must wait for first fetch
                await otpService.getApps();
            }
            initialPage = "storeSelector";
        }
    }

    // Handle initial notifications if present
    if (initialNotifee) {
        handleNotification(initialNotifee.notification);
    }
    if (initialFirebase) {
        handleNotification(initialFirebase);
    }

    return initialPage;
};
