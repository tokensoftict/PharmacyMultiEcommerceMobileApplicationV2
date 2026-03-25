import {Alert, Platform, ToastAndroid,} from "react-native";
import Toast from 'react-native-simple-toast';

export default function Toastss(msg: string) {
    if (Platform.OS === 'android') {
        ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
        Toast.show(msg, Toast.SHORT);
    }
}
