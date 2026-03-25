import React, {useState} from "react";
import Wrapper from "@/shared/component/wrapper";
import { ScrollView, View } from "react-native";
import HeaderWithIcon from "@/shared/component/headerBack";
import Typography from "@/shared/component/typography";
import {styles} from './styles'
import Notification from "@/shared/component/notification";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import {normalize} from "@/shared/helpers";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import AddressService from "@/service/account/address/AddressService.tsx";
import {Button} from "@/shared/component/buttons";
import {useNavigation} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";

interface notificationHolder{
    id: number
    date: string
    notifications: Notification[]
}

interface Notification {
    description: string
    title: string
    state: string
}



export default function Notifications() {
    const [sections, setSections] = useState<notificationHolder[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation<NavigationProps>();
    useEffectOnce(() =>{
        loadNotifications();
    }, []);

    function loadNotifications() {
        setIsLoading(true);
        new AddressService().notifications().then((response) => {
            setIsLoading(false);
            if(response.data.status === true) {
                setSections(response.data.data);
            }
        })
    }

    return (
        <WrapperNoScroll loading={isLoading}>
            <HeaderWithIcon title={"NOTIFICATIONS"} />
            {
                sections.length > 0 ?
                    <ScrollView style={styles.container}>
                        <View style={styles.body}>
                            {sections.map((section) => (
                                <View key={section.id}>
                                    <Typography style={styles.title} >{section.date}</Typography>
                                    <View>
                                        {section.notifications.map((notification, index) => (
                                            <Notification
                                                key={index}
                                                notification={notification}
                                            />
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                    :
                    <View  style={styles.zeroContainer}>
                        <Typography style={{textAlign : 'center',alignSelf : 'center', fontSize : normalize(16)}}>No notifications for now 😎 You're all caught up!</Typography>
                       <View style={{paddingHorizontal : normalize(120), marginTop : normalize(10)}}>
                           <Button title="Go Back" onPress={() => navigation.goBack() }/>
                       </View>
                    </View>
            }
        </WrapperNoScroll>
    )
}
