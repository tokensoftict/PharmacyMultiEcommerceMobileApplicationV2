import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import MainMenu from "@/shared/page/medreminder/dashboard/main";
import SplashScreen from "@/shared/page/medreminder/splashscreen";
import MedReminderForm from "@/shared/page/medreminder/new-medreminder";
import ListMedReminder from "@/shared/page/medreminder/list-medreminder";
import HistoryLogs from "@/shared/page/medreminder/history-logs";
import RefillTracker from "@/shared/page/medreminder/refill-tracker";
import ViewReminder from "@/shared/page/medreminder/view-reminder";
import ViewLogs from "@/shared/page/medreminder/view-logs";
import DetailProduct from "@/shared//page/product";
import MedReminderWizard from "@/shared/page/medreminder/create-medreminder";

const InternalStack = createStackNavigator();

export default function MedReminderNavigationStack() {
    return (
        <NavigationIndependentTree>
            <NavigationContainer>
                <InternalStack.Navigator screenOptions={{ headerShown: false }}>
                    <InternalStack.Screen name="splashScreen" component={SplashScreen} />
                    <InternalStack.Screen name="mainMenu" component={MainMenu} />
                    <InternalStack.Screen name="medReminderForm" component={MedReminderWizard} />
                    <InternalStack.Screen name="listMedReminder" component={ListMedReminder} />
                    <InternalStack.Screen name="historyLogs" component={HistoryLogs} />
                    <InternalStack.Screen name="refillTracker" component={RefillTracker} />
                    <InternalStack.Screen name="viewLogs" component={ViewLogs} />
                    <InternalStack.Screen name="viewReminder" component={ViewReminder} />
                    <InternalStack.Screen name="detailProduct" component={DetailProduct} />
                </InternalStack.Navigator>
            </NavigationContainer>
        </NavigationIndependentTree>
    )
}
