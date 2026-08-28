import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScanner } from './hooks/useScanner';
import { ScannerView } from './components/ScannerView';
import { CartList } from './components/CartList';
import ProductService from '@/service/product/show/ProductService';
import CartService from '@/service/cart/CartService';
import Toasts from '@/shared/utils/Toast';
import HeaderWithIcon from '@/shared/component/headerBack';
import WrapperNoScroll from '@/shared/component/wrapperNoScroll';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { store } from '@/redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import * as action from '@/redux/actions';
import { NavigationProps } from '@/shared/routes/stack';
import { CartInterface, Items } from '@/service/cart/interface/CartInterface';
import UpdateCartDialog from '@/shared/component/updateCartDialog';
import useDarkMode from '@/shared/hooks/useDarkMode';
import { theme } from '@/shared/theme';

const ScanShopScreen = () => {
  const { isDarkMode } = useDarkMode();
  const insets = useSafeAreaInsets();
  const [cartData, setCartData] = useState<CartInterface>();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Items>();

  const productService = new ProductService();
  const cartService = new CartService();
  const navigation = useNavigation<NavigationProps>();

  const dispatch = useDispatch<any>();
  const cartUpdateToken = useSelector((state: any) => state.systemReducer.cartUpdateToken);

  const loadCartItems = useCallback(() => {
    setIsLoading(true);
    cartService.get().then((response) => {
      setIsLoading(false);
      if (response.data.status === true) {
        setCartData(response.data);
      }
    }).catch((err) => {
      console.log("Cart Load Error:", err);
      setIsLoading(false);
    });
  }, []);

  React.useEffect(() => {
    if (cartUpdateToken > 0) {
      loadCartItems();
    }
  }, [cartUpdateToken, loadCartItems]);

  useFocusEffect(
    useCallback(() => {
      loadCartItems();
    }, [loadCartItems])
  );

  React.useEffect(() => {
    const auth = store.getState().systemReducer.auth;
    if (!auth || !auth.loginStatus) {
      Toasts('Please login to use Scan & Shop');
      navigation.replace('login');
    }
  }, [navigation]);

  const handleScan = useCallback(async (code: string) => {
    setIsLoading(true);
    try {
      const response = await productService.scanProduct(code);
      if (response.data.status === true) {
        const product = response.data.data;
        dispatch(action.setProductDialogData(product));
      } else {
        Toasts(response.data.error || 'Product not found');
      }
    } catch (error) {
      Toasts('Failed to fetch product information');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const { device, hasPermission, codeScanner, isScanning } = useScanner(handleScan);

  const onItemPress = (item: Items | undefined) => {
    if (!item) return;
    setSelectedProduct(item);
    setIsUpdateModalVisible(true);
  };

  return (
    <WrapperNoScroll loading={isLoading} barStyle="light-content">
      <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, theme.spacing.sm) }]}>
        <View style={[styles.headerContainer, { backgroundColor: isDarkMode ? '#1A1D1E' : '#FFFFFF' }]}>
          <HeaderWithIcon title="SCAN & SHOP" style={{ marginBottom: 0 }} />
        </View>

        <ScannerView
          device={device}
          codeScanner={codeScanner}
          isScanning={isScanning}
          hasPermission={hasPermission}
        />

        <View style={styles.cartSection}>
          <CartList
            cartData={cartData}
            onItemPress={onItemPress}
          />
        </View>

        <UpdateCartDialog
          visible={isUpdateModalVisible}
          product={selectedProduct}
          onClose={() => setIsUpdateModalVisible(false)}
          onCartUpdated={loadCartItems}
        />
      </View>
    </WrapperNoScroll>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    zIndex: 10,
  },
  cartSection: {
    flex: 1,
  },
});

export default ScanShopScreen;
