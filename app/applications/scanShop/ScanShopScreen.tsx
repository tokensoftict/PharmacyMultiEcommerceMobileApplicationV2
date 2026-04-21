import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useScanner } from './hooks/useScanner';
import { ScannerView } from './components/ScannerView';
import { CartList } from './components/CartList';
import ProductService from '@/service/product/show/ProductService';
import CartService from '@/service/cart/CartService';
import Toasts from '@/shared/utils/Toast';
import HeaderWithIcon from '@/shared/component/headerBack';
import WrapperNoScroll from '@/shared/component/wrapperNoScroll';
import SoundPlayer from 'react-native-sound-player';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { store } from '@/redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import * as action from '@/redux/actions';
import { NavigationProps } from '@/shared/routes/stack';
import { CartInterface, Items } from '@/service/cart/interface/CartInterface';
import UpdateCartDialog from '@/shared/component/updateCartDialog';
import useDarkMode from '@/shared/hooks/useDarkMode';
import { normalize } from '@/shared/helpers';
import Typography from '@/shared/component/typography';
import Environment from '@/shared/utils/Environment';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const ScanShopScreen = () => {
    const { isDarkMode } = useDarkMode();
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
        const env = Environment.getEnvironment();
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

    // Refresh cart when the cart update token changes
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
                // Show confirmation dialog via Redux
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

  // No longer blocking based on radius
  /*
  if (isWithinRadius === false) {
    return (
      <View style={[styles.centered, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
        <Typography style={styles.errorText}>
          You must be inside the store to use Scan & Shop.
        </Typography>
        <Typography style={styles.subErrorText}>
          Current Radius: 100 meters
        </Typography>
        <ActivityIndicator size="large" color="#D32F2F" style={{ marginTop: 20 }} />
        <Typography onPress={recheckLocation} style={styles.retryText}>
          Retry Location
        </Typography>
      </View>
    );
  }
  */

  return (
    <WrapperNoScroll loading={isLoading} barStyle="light-content">
      <View style={styles.container}>
        <HeaderWithIcon title="SCAN & SHOP" />

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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(40),
  },
  cartSection: {
    flex: 1,
  },
  errorText: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#D32F2F',
  },
  subErrorText: {
    fontSize: normalize(14),
    textAlign: 'center',
    color: '#888',
    marginTop: normalize(10),
  },
  retryText: {
    marginTop: normalize(20),
    color: '#2196F3',
    fontSize: normalize(16),
    textDecorationLine: 'underline',
  },
});

export default ScanShopScreen;
