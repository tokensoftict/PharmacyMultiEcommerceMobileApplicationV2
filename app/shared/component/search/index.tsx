import React, {useState} from "react";
import {styles} from "./style"
import Icon from "@/shared/component/icon";
import {filter, search} from "@/assets/icons";
import Input from "@/shared/component/input";
import {TouchableOpacity, View} from "react-native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import {useNavigation} from "@react-navigation/native";

interface SearchProps {
    onChange: (value: boolean) => void
    value: string |undefined,
    placeholder : string|undefined
}

export default function Search({onChange, value, placeholder}:SearchProps) {
    const navigation = useNavigation<NavigationProps>();
    const openSearchDialog = () => {
        // @ts-ignore
        navigation.navigate('search')
    }

    return (
        <View style={styles.container}>
                <TouchableOpacity onPress={openSearchDialog}>
                    <Input
                        leftIcon={<Icon icon={search} onPress={openSearchDialog} />}
                        rightIcon={<Icon icon={filter} onPress={openSearchDialog} />}
                        editable={false}
                        onPressIn={openSearchDialog}
                        placeholder={placeholder}
                    />
                </TouchableOpacity>
        </View>
    );
}
