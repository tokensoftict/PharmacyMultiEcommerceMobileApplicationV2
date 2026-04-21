import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StatusBar, View} from 'react-native';
import OverlayLoader from "@/shared/component/overlayLoader";
import {StatusBarStyle} from 'react-native/Libraries/Components/StatusBar/StatusBar';
import {normalize} from '@/shared/helpers';
import useDarkMode from '@/shared/hooks/useDarkMode';
import {design, semantic} from '@/shared/constants/colors';
import AddToCartDialog from "@/shared/component/addToCartDialog";
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import {store} from "@/redux/store/store.tsx";
import {SafeAreaView} from "react-native-safe-area-context";
import Environment from "@/shared/utils/Environment.tsx";
import * as action from "@/redux/actions";

interface WrapperProps {
    children: React.ReactNode;
    backgroundColorStatusBar?: string;
    barStyle?: StatusBarStyle;
    loading?: boolean;
    titleLoader?: string;
    overlayLoaderHeight?: number;
    onRefresh?: () => void;
}
export default function Wrapper({
                                    children,
                                    backgroundColorStatusBar,
                                    barStyle,
                                    loading,
                                    titleLoader,
                                    overlayLoaderHeight,
                                    onRefresh
                                }: WrapperProps) {
    const {isDarkMode} = useDarkMode();
    const [addToCartProduct, setAddToCartProduct] = useState()

    useEffectOnce(() => {
        store.subscribe(() =>{
            const selectedProduct = store.getState().systemReducer.product
            setAddToCartProduct(selectedProduct)
        });
    }, []);

    const handleClose = () => {
        store.dispatch(action.setProductDialogData(undefined));
    };

    return (
        Environment.checkForImpersonateCustomerData() ?
            <View style={{flex : 1,  backgroundColor: semantic.background.white.w101}}>
                <StatusBar backgroundColor={design.text1.background} barStyle="light-content" />
                <OverlayLoader loading={loading} title={""} height={overlayLoaderHeight} />
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={loading ?? false} onRefresh={onRefresh} />
                    }
                >
                    {children}
                </ScrollView>
            </View>
            : <SafeAreaView edges={['top']} style={{
                    flex: 1,
                    backgroundColor : semantic.background.white.w101,
                }}>
                    <StatusBar backgroundColor={design.text1.background} barStyle="light-content" />
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        keyboardVerticalOffset={Platform.OS === "ios" ? normalize(50) : 0} // adjust if needed
                    >
                        <View style={{backgroundColor : semantic.background.white.w101, flex : 1, width : '100%', height : '100%'}}>
                            <AddToCartDialog product={addToCartProduct} onClose={handleClose} />
                            <OverlayLoader loading={loading} title={""} height={overlayLoaderHeight}/>
                            <ScrollView
                                refreshControl={
                                    <RefreshControl refreshing={loading ?? false} onRefresh={onRefresh} />
                                }
                                style={{  opacity: loading ? 0 : 1, backgroundColor: 'rgba(255, 255, 255, 0)'}}
                                showsVerticalScrollIndicator={false}>
                                {children}
                                {
                                    Platform.OS === 'ios' ?
                                        <View style={{height: normalize(60)}}/>
                                        :
                                        <View style={{height: normalize(60)}}/>
                                }

                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>

    );
}
