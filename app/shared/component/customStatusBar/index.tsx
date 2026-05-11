import React from "react";
import { StatusBar, View } from "react-native";
import {styles} from './styles'
import { StatusBarStyle } from "react-native/Libraries/Components/StatusBar/StatusBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CustomStatusBarProps {
    backgroundColor?: string;
    barStyle?: StatusBarStyle
}

export default function CustomStatusBar({backgroundColor, barStyle}: CustomStatusBarProps) {
    const insets = useSafeAreaInsets();
    const _backgroundColor = backgroundColor || 'white';
    const _barStyle = barStyle || 'dark-content';

    return (
        <View style={[styles.statusBar, { height: insets.top, backgroundColor: _backgroundColor }]}>
            <StatusBar
                barStyle={_barStyle}
                translucent
                backgroundColor="transparent"
            />
        </View>
    );
}
