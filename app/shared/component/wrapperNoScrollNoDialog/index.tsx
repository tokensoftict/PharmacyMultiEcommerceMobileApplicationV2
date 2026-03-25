import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StatusBar, View} from 'react-native';
import OverlayLoader from "../overlayLoader";
import {StatusBarStyle} from 'react-native/Libraries/Components/StatusBar/StatusBar';
import {normalize} from '../../helpers';
import useDarkMode from '../../hooks/useDarkMode.tsx';
import {design, semantic} from '../../constants/colors';
import {SafeAreaProvider} from "react-native-safe-area-context";

interface WrapperProps {
    children: React.ReactNode;
    backgroundColorStatusBar?: string;
    barStyle?: StatusBarStyle;
    loading?: boolean;
    titleLoader?: string;
    overlayLoaderHeight?: number;
}
export default function WrapperNoScrollNoDialog({
                                                    children,
                                                    backgroundColorStatusBar,
                                                    barStyle,
                                                    loading,
                                                    titleLoader,
                                                    overlayLoaderHeight,
                                                }: WrapperProps) {
    const {isDarkMode} = useDarkMode();
    return (
        <SafeAreaProvider>
            <StatusBar backgroundColor={design.text1.background} barStyle="light-content" />
            <SafeAreaView style={{
                flex: 1,
                backgroundColor : semantic.background.white.w101,
                marginTop : normalize(32)
            }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    keyboardVerticalOffset={Platform.OS === "ios" ? normalize(50) : 0} // adjust if needed
                >
                <View style={{height: normalize(10)}}/>
                <View>
                    <OverlayLoader loading={loading} title={""} height={overlayLoaderHeight} />
                    <View style={{opacity: loading ? 0 : 1, flex: 1, width : '100%', height : '100%'}}>
                    {children}
                    </View>
                </View>
                {Platform.OS === 'ios' && <View style={{height: normalize(20)}} />}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
