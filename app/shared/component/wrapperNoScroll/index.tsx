import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StatusBar, View } from 'react-native';
import OverlayLoader from '@/shared/component/overlayLoader';
import { StatusBarStyle } from 'react-native/Libraries/Components/StatusBar/StatusBar';
import { design, semantic } from '@/shared/constants/colors';
import useEffectOnce from '@/shared/hooks/useEffectOnce.tsx';
import { store } from '@/redux/store/store.tsx';
import AddToCartDialog from '@/shared/component/addToCartDialog';
import * as action from '@/redux/actions';
// NOTE: We use SafeAreaView here but NOT SafeAreaProvider.
// The SafeAreaProvider is already at the App root (App.tsx).
// Nesting providers is redundant and was causing context duplication.
import { SafeAreaView, useSafeAreaInsets, Edge } from 'react-native-safe-area-context';
import { StyleProp, ViewStyle } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

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
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const [addToCartProduct, setAddToCartProduct] = useState<any>(undefined);

  useEffectOnce(() => {
    const unsubscribe = store.subscribe(() => {
      const selectedProduct = store.getState().systemReducer.product;
      setAddToCartProduct(selectedProduct);
    });
    return unsubscribe;
  }, []);

  const handleClose = () => {
    store.dispatch(action.setProductDialogData(undefined));
  };

  const statusBgColor = transparent
    ? 'transparent'
    : backgroundColorStatusBar || design.text1.background;

  const safeAreaBgColor = transparent
    ? 'transparent'
    : backgroundColorStatusBar || design.text1.background;

  const contentBgColor = transparent ? 'transparent' : semantic.background.white.w101;

  return (
    <SafeAreaView
      edges={edges ?? ['top']}
      style={[
        {
          flex: 1,
          backgroundColor: safeAreaBgColor,
        },
        style,
      ]}
    >
      {isFocused && (
        <StatusBar
          backgroundColor={statusBgColor}
          barStyle={barStyle ?? (transparent ? 'dark-content' : 'light-content')}
          translucent
        />
      )}

      <View
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: contentBgColor,
        }}
      >
        <AddToCartDialog product={addToCartProduct} onClose={handleClose} />
        <OverlayLoader loading={loading} title="" height={overlayLoaderHeight} />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          /**
           * keyboardVerticalOffset: On iOS we use the safe area top inset
           * instead of a hardcoded value. This correctly handles notch,
           * Dynamic Island, and status bar heights across all iPhone models.
           */
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
        >
          <View
            style={{
              flex: 1,
              width: '100%',
              opacity: loading ? 0 : 1,
              backgroundColor: transparent ? 'transparent' : '#FFF',
            }}
          >
            {children}
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
