import React from 'react';
import {KeyboardAvoidingView, Platform, StatusBar, View} from 'react-native';
import OverlayLoader from "../overlayLoader";
import {StatusBarStyle} from 'react-native/Libraries/Components/StatusBar/StatusBar';
import {normalize} from "@/shared/helpers";
import {design} from "@/shared/constants/colors.ts";

interface WrapperProps {
    children: React.ReactNode;
    backgroundColorStatusBar?: string;
    barStyle?: StatusBarStyle;
    loading?: boolean;
    titleLoader?: string;
    overlayLoaderHeight?: number;
    noBottomSpace?: boolean
}
export default function WrapperNoScrollNoDialogNoSafeArea({loading, overlayLoaderHeight, children, noBottomSpace = false}: WrapperProps) {
    return (
        <KeyboardAvoidingView
            style={{ flex: 1}}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? normalize(50) : 0} // adjust if needed
        >
        <View style={{flex : 1,  backgroundColor: "#f8f9fa",}}>
            <OverlayLoader loading={loading} title={""} height={overlayLoaderHeight} />
            <View style={{opacity: loading ? 0 : 1, flex: 1, width : '100%', height : '100%'}}>
            {children}
            </View>
            {!noBottomSpace &&  <View style={{height: normalize(90) }}/>}
        </View>
        </KeyboardAvoidingView>
    );
}
