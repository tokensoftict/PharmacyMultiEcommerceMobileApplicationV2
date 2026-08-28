import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import OverlayLoader from '@/shared/component/overlayLoader';
import { StatusBarStyle } from 'react-native/Libraries/Components/StatusBar/StatusBar';
import useDarkMode from '@/shared/hooks/useDarkMode';
import { design, semantic } from '@/shared/constants/colors';
import AddToCartDialog from '@/shared/component/addToCartDialog';
import useEffectOnce from '@/shared/hooks/useEffectOnce.tsx';
import { store } from '@/redux/store/store.tsx';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Environment from '@/shared/utils/Environment.tsx';
import * as action from '@/redux/actions';
import { theme } from '@/shared/theme';

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
  onRefresh,
}: WrapperProps) {
  const { isDarkMode } = useDarkMode();
  const insets = useSafeAreaInsets();
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

  /**
   * Bottom spacer: uses the safe area bottom inset so content is never
   * hidden behind the home indicator on modern iPhones / gesture-nav Androids.
   * We add a minimum of theme.spacing.lg for visual breathing room.
   */
  const bottomSpacerHeight = Math.max(insets.bottom, theme.spacing.lg);

  if (Environment.checkForImpersonateCustomerData()) {
    return (
      <View style={{ flex: 1, backgroundColor: semantic.background.white.w101 }}>
        <StatusBar
          backgroundColor={design.text1.background}
          barStyle="light-content"
          translucent
        />
        <OverlayLoader loading={loading} title="" height={overlayLoaderHeight} />
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={loading ?? false} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {children}
          <View style={{ height: bottomSpacerHeight }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={{ flex: 1, backgroundColor: semantic.background.white.w101 }}
    >
      <StatusBar
        backgroundColor={design.text1.background}
        barStyle="light-content"
        translucent
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        <View
          style={{
            backgroundColor: semantic.background.white.w101,
            flex: 1,
            width: '100%',
          }}
        >
          <AddToCartDialog product={addToCartProduct} onClose={handleClose} />
          <OverlayLoader loading={loading} title="" height={overlayLoaderHeight} />
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={loading ?? false} onRefresh={onRefresh} />
            }
            style={{ opacity: loading ? 0 : 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {children}
            {/* Bottom spacer: adapts to home indicator height on iOS and
                gesture navigation bar on Android. No more hardcoded 60dp. */}
            <View style={{ height: bottomSpacerHeight }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
