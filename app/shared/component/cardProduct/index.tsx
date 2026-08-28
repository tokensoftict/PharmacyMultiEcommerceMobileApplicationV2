import React, { useState } from 'react';
import { ActivityIndicator, Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import Typography from '../typography';
import { currencyType } from '@/shared/constants/global.ts';
import { _styles } from './styles';
import useDarkMode from '@/shared/hooks/useDarkMode.tsx';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/shared/routes/stack';
import { ProductListInterface } from '@/service/product/ProductListInterface';
import Icon from '@/shared/component/icon';
import { icon_wishlist, icon_wishlist_filled, white_shopping_cart } from '@/assets/icons';
import { store } from '@/redux/store/store';
import * as action from '@/redux/actions';
import { semantic } from '@/shared/constants/colors.ts';
import Environment from '@/shared/utils/Environment.tsx';
import WishlistService from '@/service/wishlist/WishlistService';
import Toasts from '@/shared/utils/Toast';
import { theme } from '@/shared/theme';
import { getCardWidth, getNumColumns } from '@/shared/helpers';

/**
 * CardProduct
 *
 * BEFORE:
 *   - Used react-native-paper's `<Card>` with inline width: normalize(170) AND
 *     a stylesheet width: normalize(176) — two conflicting fixed widths
 *   - Image container: fixed height normalize(115)
 *   - No tablet awareness
 *
 * AFTER:
 *   - Width is calculated responsively: (screenWidth - gaps) / numColumns
 *   - On phone: 2 columns; on tablet: 3 columns
 *   - Removed react-native-paper Card dependency — now a plain TouchableOpacity
 *     with the same shadow/border-radius via our styles (saves re-render overhead)
 *   - Image uses aspectRatio via stylesheet — no hardcoded height
 *   - All spacing from theme tokens
 */

interface ProductList {
  product: ProductListInterface;
  /** Optional: pass explicit card width from parent for grid layouts */
  cardWidth?: number;
}

function CardProduct({ product, cardWidth }: ProductList) {
  const { isDarkMode } = useDarkMode();
  const styles = _styles(isDarkMode);
  const navigation = useNavigation<NavigationProps>();
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(product.is_wishlisted);

  // Responsive card width — parent can pass it in (from FlatList numColumns layout)
  // or we calculate it ourselves for standalone use.
  const numCols = getNumColumns(2, 3);
  const computedWidth = cardWidth ?? getCardWidth(numCols, theme.spacing.sm);

  function navigateTo() {
    // @ts-ignore
    navigation.navigate('detailProduct', { productId: product.id });
  }

  function toggleWishlist() {
    setWishlistLoading(true);
    const service = new WishlistService();
    const promise = isWishlisted
      ? service.remove(product.id as number)
      : service.add(product.id);

    promise
      .then((response) => {
        setWishlistLoading(false);
        if (response.data.status === true) {
          setIsWishlisted(!isWishlisted);
          Toasts(isWishlisted ? 'Product removed from wishlist!' : 'Product added to wishlist!');
        } else {
          Toasts(response.data.message || 'Action failed');
        }
      })
      .catch(() => {
        setWishlistLoading(false);
        Toasts('An error occurred');
      });
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={navigateTo}
      style={[styles.card, { width: computedWidth }]}
    >
      {/* ---- Image container ---- */}
      <View style={styles.containerImage}>
        {/* Out-of-stock overlay */}
        {product.quantity !== undefined && product.quantity <= 0 && (
          <View style={styles.outOfStockContainer}>
            <View style={styles.outOfStockBadge}>
              <Typography style={styles.outOfStockText}>Out of Stock</Typography>
            </View>
          </View>
        )}

        {/* Wishlist button */}
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={toggleWishlist}
          disabled={wishlistLoading}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {wishlistLoading ? (
            <ActivityIndicator size="small" color="#D50000" />
          ) : (
            <Icon
              customStyles={[
                styles.wishlistIcon,
                { tintColor: isWishlisted ? '#D50000' : '#9E9E9E' },
              ]}
              icon={isWishlisted ? icon_wishlist_filled : icon_wishlist}
            />
          )}
        </TouchableOpacity>

        <Image
          style={[
            styles.image,
            product.quantity !== undefined && product.quantity <= 0 && { opacity: 0.4 },
          ]}
          resizeMode="contain"
          source={{ uri: product.image }}
        />
      </View>

      {/* ---- Product info ---- */}
      <View style={styles.contentPadding}>
        <Typography ellipsizeMode="tail" numberOfLines={2} style={styles.name}>
          {product.name}
        </Typography>

        <View style={styles.rowBetween}>
          <Typography style={styles.expiryStyle}>Exp. {product?.expiry_date ?? 'N/A'}</Typography>
          <Typography style={styles.quantityStyle}>{product?.quantity} Available</Typography>
        </View>

        <View style={[styles.rowBetween, { marginTop: theme.spacing.xs }]}>
          {product.special !== false ? (
            <View>
              <Typography style={styles.special}>
                {currencyType} {product.price}
              </Typography>
              <Typography style={styles.price}>
                {currencyType} {product.special}
              </Typography>
            </View>
          ) : (
            <Typography style={styles.price}>
              {currencyType} {product.price}
            </Typography>
          )}

          {Environment.isLogin() && (product.quantity ?? 0) > 0 && (
            <TouchableOpacity
              style={styles.addToCart}
              onPress={() => store.dispatch(action.setProductDialogData(product))}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            >
              <Icon
                width={14}
                height={14}
                tintColor={semantic.background.white.w500}
                icon={white_shopping_cart}
              />
            </TouchableOpacity>
          )}
        </View>

        {Environment.isWholeSalesEnvironment() && product?.doorstep && (
          <Typography style={styles.doorStep}>
            + Door Delivery : {currencyType} {product?.doorstep}
          </Typography>
        )}

        {(Environment.isSuperMarketEnvironment() || Environment.isWholeSalesEnvironment()) &&
          (product?.custom_price?.length ?? 0) > 0 && (
            <Typography style={styles.doorStep}>
              Buy {product?.custom_price[0].min_qty}{' '}
              {Environment.isWholeSalesEnvironment() ? 'cartons' : ''} for{' '}
              {currencyType} {product?.custom_price[0].price_formatted} each
            </Typography>
          )}
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(CardProduct);
