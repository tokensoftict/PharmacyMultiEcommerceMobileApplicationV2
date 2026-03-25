import notifee, {AndroidImportance, TimestampTrigger, TriggerType} from '@notifee/react-native';

export async function scheduleNotification(notificationId : number, drugName : string, dosage : string , measurement : string, dateTime : string|number, extra : any, environment : string, notificationType : string) {

    const channelId =  await notifee.createChannel({
        id: 'med_reminder_notification',
        name: 'Medication Reminder',
        importance: AndroidImportance.HIGH,
    });

    // Convert dateTime to timestamp
    const timestamp = new Date(dateTime);

    // Create trigger for future notification
    const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: timestamp.getTime(),
        alarmManager: {
            allowWhileIdle: true,
        },
    };


    // Schedule the notification
    return await notifee.createTriggerNotification(
        {
            id: notificationId+"",
            title: `Time to take ${drugName}`,
            body: `Dosage: ${dosage} ${measurement}`,
            data : {extra : JSON.stringify(extra), environment : environment, notificationType : notificationType},
            android: {
                channelId: channelId,
                importance: AndroidImportance.HIGH,
                // @ts-ignore
                fullScreenIntent: true,
                sound: 'default',
                vibrationPattern: [500, 1000, 500, 1000],
                smallIcon: 'ic_launcher',
                largeIcon: require('@/assets/images/logo.png'),
                pressAction: {
                    id: 'default',
                },
            },
        },
        trigger
    );
}


export async function deleteNotification(notificationId : string) {
    await notifee.cancelNotification(notificationId);
}

export async function cancelAllScheduledNotifications() {
    await notifee.cancelAllNotifications();
}
