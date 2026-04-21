import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, StatusBar, View} from 'react-native';
import OverlayLoader from "@/shared/component/overlayLoader";
import {StatusBarStyle} from 'react-native/Libraries/Components/StatusBar/StatusBar';
import {normalize} from '@/shared/helpers';
import {design, semantic} from '@/shared/constants/colors';
import useEffectOnce from "@/shared/hooks/useEffectOnce.tsx";
import {store} from "@/redux/store/store.tsx";
import AddToCartDialog from "@/shared/component/addToCartDialog";
import * as action from "@/redux/actions";
import {SafeAreaProvider,SafeAreaView, Edge} from "react-native-safe-area-context";

import { StyleProp, ViewStyle } from "react-native";

interface WrapperProps {
    children: React.ReactNode;
    backgroundColorStatusBar?: string;
    barStyle?: StatusBarStyle;
    loading?: boolean;
    titleLoader?: string;
    overlayLoaderHeight?: number;
    style?: StyleProp<ViewStyle>;
    transparent?: boolean;
    edges?: Edge[];
}
export default function WrapperNoScroll({
                                            children,
                                            backgroundColorStatusBar,
                                            barStyle,
                                            loading,
                                            titleLoader,
                                            overlayLoaderHeight,
                                            style,
                                            transparent,
                                            edges,
                                        }: WrapperProps) {

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

        <SafeAreaProvider>
            <StatusBar 
                backgroundColor={transparent ? 'transparent' : (backgroundColorStatusBar || design.text1.background)} 
                barStyle={barStyle || (transparent ? "dark-content" : "light-content")} 
                translucent={transparent}
            />
            <SafeAreaView
                edges={edges || ['top']}
                style={[{
                flex: 1,
                backgroundColor : transparent ? 'transparent' : (backgroundColorStatusBar || design.text1.background)
            }, style]}>

                    <View style={{ backgroundColor : transparent ? 'transparent' : semantic.background.white.w101, flex : 1, width : '100%', height : '100%'}}>

                        <AddToCartDialog product={addToCartProduct} onClose={handleClose} />
                        <OverlayLoader loading={loading} title={""} height={overlayLoaderHeight} />
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior={Platform.OS === "ios" ? "padding" : undefined}
                            keyboardVerticalOffset={Platform.OS === "ios" ? normalize(50) : 0} // adjust if needed
                        >
                        <View style={{opacity: loading ? 0 : 1, flex: 1, width : '100%', height : '100%', backgroundColor: transparent ? 'transparent' : "#FFF"}}>
                            {children}
                        </View>
                        </KeyboardAvoidingView>
                    </View>

            </SafeAreaView>
        </SafeAreaProvider>
    );
}
