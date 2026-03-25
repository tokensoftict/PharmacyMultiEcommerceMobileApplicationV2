import React from 'react';
import { TouchableOpacity, View } from "react-native";
import Icon from "../icon";
import { arrowBack } from "@/assets/icons";
import Typography from "@/shared/component/typography";
import { styles } from '../headerBack/styles'
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack.tsx";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";

interface HeaderBackProps {
    title?: string;
    icon?: React.ReactNode | undefined;
    onPress?: any | undefined
}

export default function HeaderBackWhite({ title, icon, onPress }: HeaderBackProps) {
    const navigation = useNavigation<NavigationProps>();
    const stylesIcon = {
        tintColor: '#FFFFFF'
    }

    function goBack() {
        if (onPress) {
            onPress();
            return;
        }
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            // @ts-ignore
            navigation.replace(new AuthSessionService().getEnvironment());
        }
    }

    return (
        <View style={[styles.container, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1, alignItems: 'center', flexDirection: "row" }}>
                <TouchableOpacity onPress={() => goBack()}>
                    <Icon customStyles={stylesIcon} icon={icon ? icon : arrowBack} />
                </TouchableOpacity>
                {title && (
                    <Typography numberOfLines={1} style={[styles.title, { color: '#FFFFFF' }]}>{title}</Typography>
                )}
            </View>
        </View>
    )
}
