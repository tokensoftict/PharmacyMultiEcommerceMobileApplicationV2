import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

// Request Notification Permission
export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
}

// Handle Background Messages
export async function onMessageReceived(remoteMessage : any) {
    if (remoteMessage.data?.drugName) {
        await notifee.displayNotification({
            title: `Time to take ${remoteMessage.data.drugName}`,
            body: `Dosage: ${remoteMessage.data.dosage} ${remoteMessage.data.measurement}`,
            android: {
                channelId: 'drug_alerts',
                importance: AndroidImportance.HIGH,
                // @ts-ignore
                fullScreenIntent: true,
                sound: 'default',
                vibrationPattern: [500, 1000, 500],
            },
        });
    }
}

// Set Background Message Handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    onMessageReceived(remoteMessage);
});
