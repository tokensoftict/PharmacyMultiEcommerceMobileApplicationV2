import React, { useState, useCallback, useRef, useEffect, createContext, useContext } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Platform,
  RefreshControl,
  Dimensions,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import Typography from '@/shared/component/typography';
import SectionHeader from '@/shared/component/sectionHeader';
import Icon from '@/shared/component/icon';
import { search, dots, arrowBack, add, icon_wishlist, icon_wishlist_filled } from '@/assets/icons';
import { palette, semantic } from '@/shared/constants/colors';
import { theme } from '@/shared/theme';
import { FONT } from '@/shared/constants/fonts';
import { normalize } from '@/shared/helpers';
import useDarkMode from '@/shared/hooks/useDarkMode';
import { NavigationProps } from '@/shared/routes/stack';
import WholesalesProvisionsService from '@/service/wholesales/WholesalesProvisionsService';
import CartService from '@/service/cart/CartService';
import WishlistService from '@/service/wishlist/WishlistService';
import ProductService from '@/service/product/show/ProductService';
import { shareProduct } from '@/shared/utils/ProductShareHelper';
import Environment from '@/shared/utils/Environment';
import Toasts from '@/shared/utils/Toast';
import { share_product, white_shopping_cart, close as closeIcon } from '@/assets/icons';
import { useGlobal } from '@/shared/helpers/GlobalContext';
import { store } from '@/redux/store/store';
import * as action from '@/redux/actions';
import Skeleton from '@/shared/component/skeleton';
import ButtonSheet from '@/shared/component/buttonSheet';
import CartItemHorizontalList from '@/shared/component/cartItemHorizontalList';
import UpdateCartDialog from '@/shared/component/updateCartDialog';
import { CartInterface } from '@/service/cart/interface/CartInterface';
import CustomerTypeModal from '@/shared/component/customerTypeModal';
import AuthSessionService from '@/service/auth/AuthSessionService';

const LOGO = require('@/assets/images/logo.png');

// ─── API → UI mapping ───────────────────────────────────────────────────────
const CATEGORY_EMOJIS = ['🥤', '🍪', '🍿', '🍜', '🥣', '🍳', '🧹', '🧴'];

const mapCategory = (c: any, i: number) => ({
  id: String(c.id),
  name: c.name,
  emoji: CATEGORY_EMOJIS[i % CATEGORY_EMOJIS.length],
  isFeatured: i < 2,
});

const mapProduct = (p: any) => {
  const base = Number(p.price_not_formatted) || 0;
  const special = Number(p.special_not_formatted) || 0;
  const hasSpecial = special > 0 && special < base;
  const unit = hasSpecial ? special : base;
  return {
    id: String(p.id),
    name: p.name,
    image: p.image,
    seo: p.seo,
    unitPrice: unit,
    price: formatNaira(unit),
    oldPrice: hasSpecial ? formatNaira(base) : undefined,
    savings: hasSpecial ? `${Math.max(1, Math.round((1 - special / base) * 100))}% OFF` : undefined,
    package: String(p.carton ?? ''),
    stock: Number(p.quantity) || 0,
    expiryText: p.expiry_date || '',
    is_wishlisted: !!(p.is_wishlisted ?? false),
    raw: p,
  };
};

// ─── Mock stock details (deterministic per product id) ──────────────────────
const TINTS = ['#FFF1F0', '#EEF6FF', '#F1FBF3', '#FFF8E6', '#F5F0FF', '#EFFAFA'];
const EMOJIS = ['🥤', '🍜', '🍪', '🧴', '🥣', '🍳', '🧹', '🍿'];

function getStockInfo(item: any) {
  const seed = String(item.id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const perCarton = parseInt(String(item.package).replace(/\D/g, ''), 10) || 1;
  const qty = Number(item.stock) || 0;
  return {
    expiry: item.expiryText || '—',
    qty,
    perCarton,
    stockPct: Math.min(1, qty / 5000),
    tint: TINTS[seed % TINTS.length],
    emoji: EMOJIS[seed % EMOJIS.length],
  };
}

function WishlistButton({ product, styles }: { product: any; styles: any }) {
  const [loading, setLoading] = useState(false);
  const [fav, setFav] = useState(!!(product?.is_wishlisted || product?.raw?.is_wishlisted));

  useEffect(() => {
    setFav(!!(product?.is_wishlisted || product?.raw?.is_wishlisted));
  }, [product?.is_wishlisted, product?.raw?.is_wishlisted]);

  const toggleWishlist = (e?: any) => {
    e?.stopPropagation?.();
    const productId = product?.id;
    if (!productId || loading) return;

    setLoading(true);
    const service = new WishlistService();
    const promise = fav
      ? service.remove(Number(productId))
      : service.add(Number(productId));

    promise
      .then((res: any) => {
        setLoading(false);
        if (res?.data?.status === true || res?.status === 200) {
          const nextFav = !fav;
          setFav(nextFav);
          if (product) {
            product.is_wishlisted = nextFav;
            if (product.raw) product.raw.is_wishlisted = nextFav;
          }
          Toasts(nextFav ? 'Product added to wishlist!' : 'Product removed from wishlist!');
        } else {
          Toasts(res?.data?.message || 'Failed to update wishlist');
        }
      })
      .catch(() => {
        setLoading(false);
        Toasts('Failed to update wishlist');
      });
  };

  return (
    <TouchableOpacity
      style={styles.wishlistButton}
      onPress={toggleWishlist}
      activeOpacity={0.7}
      disabled={loading}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#D50000" />
      ) : (
        <Icon
          customStyles={[styles.wishlistIcon, { tintColor: fav ? '#D50000' : '#9E9E9E' }]}
          icon={fav ? icon_wishlist_filled : icon_wishlist}
        />
      )}
    </TouchableOpacity>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY CARD — matches TopBrands pattern
// ═══════════════════════════════════════════════════════════════════════════

function CategoryCard({ item, onPress }: { item: ReturnType<typeof mapCategory>; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const { isDarkMode } = useDarkMode();

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[_styles(isDarkMode).catCard, { transform: [{ scale }] }]}>
        {item.isFeatured && (
          <View style={_styles(isDarkMode).catTag}>
            <Typography style={_styles(isDarkMode).catTagText}>TOP</Typography>
          </View>
        )}
        <View style={_styles(isDarkMode).catImageWrapper}>
          <Typography style={{ fontSize: normalize(28) }}>{item.emoji}</Typography>
        </View>
        <Typography numberOfLines={1} style={_styles(isDarkMode).catText}>
          {item.name.toUpperCase()}
        </Typography>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FANCY PRODUCT CARD — shared by horizontal lists and the grid
// ═══════════════════════════════════════════════════════════════════════════

// ─── Cart (UI-only) ────────────────────────────────────────────────────────────────────
const CartCtx = createContext<{ qty: Record<string, number>; open: (item: any) => void }>({
  qty: {},
  open: () => { },
});

const parsePrice = (p: string) => parseInt(String(p).replace(/\D/g, ''), 10) || 0;
const formatNaira = (n: number) => '₦' + n.toLocaleString('en-NG');

function AddToCartSheet({
  item,
  initialQty,
  isDarkMode,
  onClose,
  onConfirm,
}: {
  item: any | null;
  initialQty: number;
  isDarkMode: boolean;
  onClose: () => void;
  onConfirm: (qty: number) => void;
}) {
  const styles = _styles(isDarkMode);
  const [text, setText] = useState('1');
  const [adding, setAdding] = useState(false);
  const [sharing, setSharing] = useState(false);
  const qty = parseInt(text, 10) || 0;

  React.useEffect(() => {
    if (item) setText(String(initialQty || 1));
  }, [item, initialQty]);

  if (!item) return null;
  const info = getStockInfo(item);
  const unit = item.unitPrice ?? parsePrice(item.price);
  const maxCartons = Math.max(1, Math.floor(info.qty));
  const quickPicks = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  const setQty = (n: number) => setText(String(Math.min(maxCartons, Math.max(1, n))));
  const onType = (t: string) => {
    const digits = t.replace(/\D/g, '').replace(/^0+/, '');
    if (!digits) return setText('');
    setText(String(Math.min(maxCartons, parseInt(digits, 10))));
  };

  const handleAddToCart = () => {
    if (!item || qty < 1 || adding) return;
    setAdding(true);
    new CartService().add(item.id, qty, true).then((res) => {
      setAdding(false);
      if (res?.data?.status === true) {
        Toasts('Item added to cart!');
        store.dispatch(action.notifyCartUpdated());
        onConfirm(qty);
      } else {
        Toasts(res?.data?.message || 'Failed to add item to cart');
      }
    }).catch(() => {
      setAdding(false);
      Toasts('Error adding item to cart');
    });
  };

  const handleShare = async () => {
    if (!item || sharing) return;
    const department = Environment.isWholeSalesEnvironment() ? 'wholesales' : 'retail';
    let seo: string | undefined = item.seo || item.raw?.seo;
    try {
      setSharing(true);
      if (!seo && item.id) {
        const res = await new ProductService().getProduct(Number(item.id), department as any);
        seo = res?.data?.data?.seo;
      }
    } catch (e) {
      // fallback
    } finally {
      setSharing(false);
    }
    shareProduct({
      name: String(item.name ?? ''),
      seo,
      slug: String(item.id ?? ''),
      department,
      price: item.price,
    });
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.sheetBackdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />

          {/* Product summary */}
          <View style={styles.sheetHeader}>
            <View style={[styles.sheetThumb, { backgroundColor: info.tint }]}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={{ width: '80%', height: '80%' }} resizeMode="contain" />
              ) : (
                <Typography style={{ fontSize: normalize(34) }}>{info.emoji}</Typography>
              )}
              <TouchableOpacity
                style={styles.sheetShareBtn}
                onPress={handleShare}
                disabled={sharing}
                activeOpacity={0.8}
              >
                {sharing ? (
                  <ActivityIndicator size="small" color="#D50000" />
                ) : (
                  <Icon icon={share_product} customStyles={{ width: 14, height: 14, tintColor: '#D50000' }} />
                )}
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginLeft: normalize(12) }}>
              <Typography numberOfLines={2} style={styles.sheetName}>{item.name}</Typography>
              <Typography style={styles.sheetMeta}>
                Exp. {info.expiry} · {info.qty} available
              </Typography>
              <Typography style={styles.sheetUnit}>{item.price} <Typography style={styles.sheetMeta}>each</Typography></Typography>
            </View>
          </View>

          {/* Stepper */}
          <View style={styles.sheetRow}>
            <Typography style={styles.sheetLabel}>Quantity</Typography>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={[styles.stepBtn, qty <= 1 && { opacity: 0.35 }]}
                onPress={() => setQty(qty - 1)}
                activeOpacity={0.7}
              >
                <Typography style={styles.stepBtnText}>−</Typography>
              </TouchableOpacity>
              <TextInput
                style={styles.stepQtyInput}
                value={text}
                onChangeText={onType}
                onBlur={() => !text && setText('1')}
                keyboardType="number-pad"
                maxLength={6}
                selectTextOnFocus
                placeholder="0"
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity
                style={[styles.stepBtn, styles.stepBtnPlus, qty >= maxCartons && { opacity: 0.35 }]}
                onPress={() => setQty(qty + 1)}
                activeOpacity={0.7}
              >
                <Typography style={[styles.stepBtnText, { color: '#FFF' }]}>+</Typography>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick picks */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -normalize(18) }}
            contentContainerStyle={[styles.quickRow, { paddingHorizontal: normalize(18) }]}
          >
            {quickPicks.map((n) => {
              const disabled = n > maxCartons;
              return (
                <TouchableOpacity
                  key={n}
                  disabled={disabled}
                  style={[styles.quickChip, qty === n && styles.quickChipActive, disabled && { opacity: 0.35 }]}
                  onPress={() => setQty(n)}
                  activeOpacity={0.8}
                >
                  <Typography style={[styles.quickChipText, qty === n && { color: '#FFF' }]}>{n}</Typography>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Summary */}
          <View style={styles.sheetSummary}>
            <View style={styles.sheetSummaryRow}>
              <Typography style={styles.sheetMeta}>Unit price</Typography>
              <Typography style={styles.sheetSummaryVal}>{item.price}</Typography>
            </View>
            <View style={styles.sheetSummaryRow}>
              <Typography style={styles.sheetMeta}>Subtotal</Typography>
              <Typography style={styles.sheetTotal}>{formatNaira(unit * qty)}</Typography>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.sheetCta, (qty < 1 || adding) && { opacity: 0.5 }]}
            disabled={qty < 1 || adding}
            activeOpacity={0.85}
            onPress={handleAddToCart}
          >
            {adding ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Typography style={styles.sheetCtaText}>
                {initialQty ? 'Update Cart' : 'Add to Cart'} · {formatNaira(unit * qty)}
              </Typography>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function FancyCard({ item, isDarkMode, grid }: { item: any; isDarkMode: boolean; grid?: boolean }) {
  const navigation = useNavigation<NavigationProps>();
  const styles = _styles(isDarkMode);
  const info = getStockInfo(item);
  const scale = useRef(new Animated.Value(1)).current;
  const isOutOfStock = info.qty <= 0;
  const lowStock = info.qty < 60;
  const cart = useContext(CartCtx);
  const inCart = cart.qty[item.id] || 0;
  const barColor = isOutOfStock ? '#EF4444' : lowStock ? '#F59E0B' : '#16A34A';

  const handleCardPress = () => {
    navigation.navigate('detailProduct', { productId: item.id });
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={0.95}
        onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
        onPress={handleCardPress}
        style={[styles.fancyCard, grid && styles.fancyCardGrid, { height: normalize(276) }]}
      >
        {/* Hero image area */}
        <View style={[styles.fancyImage, { backgroundColor: isDarkMode ? semantic.fill.f02 : info.tint }]}>
          <View style={styles.fancyBlob} />
          {item.image ? (
            <Image source={{ uri: item.image }} style={{ width: '70%', height: '70%' }} resizeMode="contain" />
          ) : (
            <Typography style={{ fontSize: normalize(46) }}>{info.emoji}</Typography>
          )}

          {isOutOfStock && (
            <View style={styles.outOfStockOverlay}>
              <View style={styles.outOfStockBadge}>
                <Typography style={styles.outOfStockText}>OUT OF STOCK</Typography>
              </View>
            </View>
          )}

          {item.savings ? (
            <View style={styles.fancyRibbon}>
              <Typography style={styles.fancyRibbonText}>{item.savings}</Typography>
            </View>
          ) : (
            <View style={[styles.fancyRibbon, { backgroundColor: '#0F172A' }]}>
              <Typography style={styles.fancyRibbonText}>WHOLESALE</Typography>
            </View>
          )}

          <WishlistButton product={item} styles={styles} />

          <View style={styles.fancyExpiry}>
            <Typography style={styles.fancyExpiryText}>⏳ Exp. {info.expiry}</Typography>
          </View>
        </View>

        {/* Body */}
        <View style={styles.fancyBody}>
          <Typography numberOfLines={2} style={styles.fancyName}>{item.name}</Typography>

          <View style={styles.fancyChipRow}>
            <View style={styles.fancyChip}>
              <View style={styles.fancyChipNumWrap}>
                <Typography style={styles.fancyChipNum}>{info.perCarton}</Typography>
              </View>
              <View style={styles.fancyChipLabelWrap}>
                <Typography style={styles.fancyChipText}>📦 IN CARTON</Typography>
              </View>
            </View>
          </View>

          {/* Stock meter */}
          <View style={styles.fancyStockWrap}>
            <View style={styles.fancyStockTrack}>
              <View style={[styles.fancyStockFill, { width: `${isOutOfStock ? 0 : Math.round(info.stockPct * 100)}%`, backgroundColor: barColor }]} />
            </View>
            <Typography style={[styles.fancyStockText, { color: barColor }]}>
              {isOutOfStock ? 'Out of Stock' : lowStock ? `Only ${info.qty} left` : `${info.qty} available`}
            </Typography>
          </View>

          {/* Footer: price + add */}
          <View style={styles.fancyFooter}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap' }}>
              <Typography style={styles.fancyPrice}>{item.price}</Typography>
              {item.oldPrice ? (
                <Typography style={[styles.fancyOldPrice, { marginLeft: normalize(5) }]}>
                  {item.oldPrice}
                </Typography>
              ) : null}
            </View>
            <TouchableOpacity
              style={[
                styles.fancyAddBtn,
                inCart > 0 && styles.fancyAddBtnActive,
                isOutOfStock && styles.fancyAddBtnDisabled,
              ]}
              activeOpacity={isOutOfStock ? 1 : 0.8}
              disabled={isOutOfStock}
              onPress={() => !isOutOfStock && cart.open(item)}
            >
              {inCart > 0 ? (
                <Typography style={styles.fancyAddCount}>{inCart}</Typography>
              ) : (
                <Icon width={16} height={16} tintColor={isOutOfStock ? '#94A3B8' : semantic.text.white} icon={add} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function ProvisionCard({ item, isDarkMode }: { item: any; isDarkMode: boolean }) {
  return <FancyCard item={item} isDarkMode={isDarkMode} />;
}

function GridCard({ item, isDarkMode }: { item: any; isDarkMode: boolean }) {
  return <FancyCard item={item} isDarkMode={isDarkMode} grid />;
}


// ─── Skeleton Loaders ───────────────────────────────────────────────────────
function ProvisionCardSkeleton({ isDarkMode, grid }: { isDarkMode: boolean; grid?: boolean }) {
  const skeletonColor = isDarkMode ? '#2C2F33' : '#E1E9EE';
  const cardStyle = grid ? _styles(isDarkMode).fancyCardGrid : _styles(isDarkMode).fancyCard;
  return (
    <View style={[cardStyle, { overflow: 'hidden', height: normalize(280) }]}>
      <Skeleton
        width="100%"
        height={normalize(110)}
        borderRadius={0}
        style={{ backgroundColor: skeletonColor }}
      />
      <View style={{ padding: normalize(10) }}>
        <Skeleton
          width="85%"
          height={normalize(14)}
          borderRadius={4}
          style={{ backgroundColor: skeletonColor, marginBottom: normalize(8) }}
        />
        <Skeleton
          width="50%"
          height={normalize(12)}
          borderRadius={4}
          style={{ backgroundColor: skeletonColor, marginBottom: normalize(12) }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton
            width="45%"
            height={normalize(16)}
            borderRadius={4}
            style={{ backgroundColor: skeletonColor }}
          />
          <Skeleton
            width={normalize(28)}
            height={normalize(28)}
            borderRadius={normalize(14)}
            style={{ backgroundColor: skeletonColor }}
          />
        </View>
      </View>
    </View>
  );
}

function ProvisionsScreenSkeleton({ isDarkMode }: { isDarkMode: boolean }) {
  const skeletonColor = isDarkMode ? '#2C2F33' : '#E1E9EE';
  return (
    <View style={{ marginTop: normalize(8) }}>
      {/* Category Chips Skeleton */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: normalize(16), marginBottom: normalize(16) }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton
            key={i}
            width={normalize(85)}
            height={normalize(34)}
            borderRadius={normalize(17)}
            style={{ backgroundColor: skeletonColor, marginRight: normalize(8) }}
          />
        ))}
      </ScrollView>

      {/* Horizontal List Skeleton 1 */}
      <View style={{ marginBottom: normalize(20) }}>
        <View style={{ paddingHorizontal: normalize(16), marginBottom: normalize(10) }}>
          <Skeleton width={normalize(170)} height={normalize(18)} borderRadius={4} style={{ backgroundColor: skeletonColor }} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: normalize(8) }}>
          {[1, 2, 3].map((i) => (
            <ProvisionCardSkeleton key={i} isDarkMode={isDarkMode} />
          ))}
        </ScrollView>
      </View>

      {/* Horizontal List Skeleton 2 */}
      <View style={{ marginBottom: normalize(20) }}>
        <View style={{ paddingHorizontal: normalize(16), marginBottom: normalize(10) }}>
          <Skeleton width={normalize(140)} height={normalize(18)} borderRadius={4} style={{ backgroundColor: skeletonColor }} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: normalize(8) }}>
          {[1, 2, 3].map((i) => (
            <ProvisionCardSkeleton key={i} isDarkMode={isDarkMode} />
          ))}
        </ScrollView>
      </View>

      {/* Grid List Skeleton */}
      <View style={{ marginBottom: normalize(20) }}>
        <View style={{ paddingHorizontal: normalize(16), marginBottom: normalize(10) }}>
          <Skeleton width={normalize(130)} height={normalize(18)} borderRadius={4} style={{ backgroundColor: skeletonColor }} />
        </View>
        <View style={_styles(isDarkMode).gridContainer}>
          {[1, 2, 3, 4].map((i) => (
            <ProvisionCardSkeleton key={i} isDarkMode={isDarkMode} grid />
          ))}
        </View>
      </View>
    </View>
  );
}

// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════

export default function WholesaleProvisionsScreen() {
  const { isDarkMode } = useDarkMode();
  const { cartCount, setCartCount, setCartTotal } = useGlobal();
  const styles = _styles(isDarkMode);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProps>();
  const isFocused = useIsFocused();
  const [activeCategory, setActiveCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [popular, setPopular] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [shopCategories, setShopCategories] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const service = useRef(new WholesalesProvisionsService()).current;
  const cartService = useRef(new CartService()).current;

  // Shopping Cart Review Modal State (Checkout Cart Modal)
  const [cartReviewDialog, setCartReviewDialog] = useState(false);
  const [cartItemList, setCartItemList] = useState<CartInterface>();
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [openUpdateCartModal, setOpenUpdateCartModal] = useState(false);
  const [cartItemSelected, setCartItemSelected] = useState<any>();
  const [showCustomerTypeModal, setShowCustomerTypeModal] = useState(false);
  const customerTypeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (Environment.isLogin()) {
      const session = new AuthSessionService().getAuthSession();
      const apps = session?.data?.apps || [];
      const wholesalesApp = apps.find((a: any) => String(a.name || '').toLowerCase() === 'wholesales');
      const customerTypeId = wholesalesApp?.info?.customer_type_id;

      if (customerTypeId === null || customerTypeId === undefined) {
        // Random delay between 3 seconds and 10 seconds
        const randomDelayMs = Math.floor(Math.random() * (10 - 3 + 1) + 3) * 1000;
        customerTypeTimerRef.current = setTimeout(() => {
          setShowCustomerTypeModal(true);
        }, randomDelayMs);
      }
    }

    return () => {
      if (customerTypeTimerRef.current) clearTimeout(customerTypeTimerRef.current);
    };
  }, []);

  const CATEGORIES = [{ id: 'all', name: 'All', emoji: '🛒' }, ...shopCategories];
  const [cartQty, setCartQty] = useState<Record<string, number>>({});
  const [sheetItem, setSheetItem] = useState<any | null>(null);
  const itemsById = useRef<Record<string, any>>({}).current;
  const openSheet = useCallback((it: any) => {
    itemsById[it.id] = it;
    setSheetItem(it);
  }, [itemsById]);
  const cartLines = Object.keys(cartQty).filter((k) => cartQty[k] > 0);
  const cartCartons = cartLines.reduce((a, k) => a + cartQty[k], 0);
  const cartTotal = cartLines.reduce((a, k) => a + cartQty[k] * (itemsById[k]?.unitPrice ?? 0), 0);

  const loadCartItems = useCallback(() => {
    setIsCartLoading(true);
    cartService.get().then(
      (response: any) => {
        setIsCartLoading(false);
        if (response?.data?.status === true) {
          setCartItemList(response.data);
          setCartCount(response.data.data?.meta?.noItems || 0);
          setCartTotal(response.data.data?.meta?.totalFormatted || '0.00');
        }
      },
      () => {
        setIsCartLoading(false);
      }
    );
  }, [cartService, setCartCount, setCartTotal]);

  const openCategoryProducts = useCallback((cat: any) => {
    if (!cat || !cat.id || cat.id === 'all') {
      setActiveCategory('all');
      return;
    }
    navigation.navigate('productList', {
      endpoint: `stock/${cat.id}/by_classification`,
      title: cat.name,
      id: Number(cat.id),
    });
  }, [navigation]);

  const goToCart = useCallback(() => {
    setCartReviewDialog(true);
    loadCartItems();
  }, [loadCartItems]);

  const onEditItem = useCallback((item: any) => {
    setCartItemSelected(item);
    setCartReviewDialog(false);
    setTimeout(() => {
      setOpenUpdateCartModal(true);
    }, 400);
  }, []);

  const onCartUpdated = useCallback(() => {
    loadCartItems();
    store.dispatch(action.notifyCartUpdated());
  }, [loadCartItems]);
  const goBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);

  const applyAll = (res: any, append: boolean) => {
    const list = (res?.all_products?.data || []).map(mapProduct);
    setAllProducts((prev) => (append ? [...prev, ...list] : list));
    setPage(res?.all_products?.current_page || 1);
    setHasMore(!!res?.all_products?.has_more);
  };

  const [components, setComponents] = useState<any[]>([]);

  const loadAll = useCallback(() => {
    setActiveCategory('all');
    return service.load().then((r: any) => {
      const d = r.data.data;
      if (d.components && Array.isArray(d.components)) {
        setComponents(d.components);
      }
      setPopular((d.popular_picks || []).map(mapProduct));
      setDeals((d.deals || []).map(mapProduct));
      setShopCategories((d.categories || []).map(mapCategory));
      applyAll(d, false);
    }).catch(() => { }).finally(() => { setLoading(false); setRefreshing(false); });
  }, [service]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const selectCategory = (id: string) => {
    setActiveCategory(id);
    setLoading(true);
    service.load(id === 'all' ? undefined : id, 1)
      .then((r: any) => applyAll(r.data.data, false))
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    service.load(activeCategory === 'all' ? undefined : activeCategory, page + 1)
      .then((r: any) => applyAll(r.data.data, true))
      .catch(() => { })
      .finally(() => setLoadingMore(false));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAll();
  }, [loadAll]);

  // Build section data dynamically: show skeleton on initial loading
  const sections = loading ? [
    { id: 'hero', component: 'hero' },
    { id: 'skeleton', component: 'skeleton' },
  ] : components.length > 0 ? [
    { id: 'hero', component: 'hero' },
    ...components.map((c: any, idx: number) => ({
      id: `${c.component}-${c.type}-${idx}`,
      component: c.component,
      type: c.type,
      label: c.label || '',
      data: c.data,
    }))
  ] : [
    { id: 'hero', component: 'hero' },
    { id: 'CategoryChips', component: 'CategoryChips' },
    ...(popular.length ? [{ id: 'Horizontal_List', component: 'Horizontal_List', type: 'popular_picks', label: 'Popular Wholesale Picks', data: popular }] : []),
    ...(deals.length ? [{ id: 'FlashDeals', component: 'FlashDeals', type: 'deals', label: 'Wholesale Deals', data: deals }] : []),
    ...(shopCategories.length ? [{ id: 'CategoryGrid', component: 'CategoryGrid', type: 'shop_by_category', label: 'Shop by Category', data: shopCategories }] : []),
    { id: 'Grid_List', component: 'Grid_List', type: 'all_products', label: 'All Provisions', data: allProducts },
  ];

  const renderSection = ({ item }: { item: any }) => {
    switch (item.component) {
      case 'hero':
        return (
          <View style={[styles.heroBanner, { paddingTop: insets.top + normalize(72) }]}>
            <View style={styles.heroContent}>
              <Typography style={styles.heroTitle}>Wholesale Provisions</Typography>
              <Typography style={styles.heroSubtitle}>
                Stock up on everyday essentials at great wholesale prices.
              </Typography>
            </View>
          </View>
        );

      case 'CategoryChips':
      case 'categories':
        return (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  activeCategory === cat.id && styles.categoryChipActive,
                ]}
                onPress={() => openCategoryProducts(cat)}
                activeOpacity={0.7}
              >
                <Typography style={styles.categoryEmoji}>{cat.emoji}</Typography>
                <Typography
                  style={[
                    styles.categoryChipText,
                    activeCategory === cat.id && styles.categoryChipTextActive,
                  ]}
                >
                  {cat.name.toUpperCase()}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );

      case 'Horizontal_List':
      case 'featured': {
        const listData = (item.data || popular).map((p: any) => p.unitPrice !== undefined ? p : mapProduct(p));
        return (
          <View style={{ marginTop: normalize(10) }}>
            <SectionHeader title={item.label || "Popular Wholesale Picks"} showSeeAll={false} />
            <FlatList
              horizontal
              data={listData}
              keyExtractor={(p) => String(p.id)}
              renderItem={({ item: product }) => (
                <ProvisionCard item={product} isDarkMode={isDarkMode} />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: normalize(8) }}
            />
          </View>
        );
      }

      case 'FlashDeals':
      case 'deals': {
        const listData = (item.data || deals).map((p: any) => p.unitPrice !== undefined ? p : mapProduct(p));
        return (
          <View style={{ marginTop: normalize(10) }}>
            <SectionHeader title={item.label || "Wholesale Deals"} showSeeAll={false} />
            <FlatList
              horizontal
              data={listData}
              keyExtractor={(p) => String(p.id)}
              renderItem={({ item: product }) => (
                <ProvisionCard item={product} isDarkMode={isDarkMode} />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: normalize(8) }}
            />
          </View>
        );
      }

      case 'CategoryGrid':
      case 'shopByCategory': {
        const catData = (item.data || shopCategories).map((c: any, i: number) => c.emoji ? c : mapCategory(c, i));
        return (
          <View style={{ marginTop: normalize(10) }}>
            <SectionHeader title={item.label || "Shop by Category"} showSeeAll={false} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.catScrollContainer}
              decelerationRate="fast"
              snapToInterval={normalize(116)}
            >
              {catData.map((cat: any) => (
                <CategoryCard key={cat.id} item={cat} onPress={() => openCategoryProducts(cat)} />
              ))}
            </ScrollView>
          </View>
        );
      }

      case 'skeleton':
        return <ProvisionsScreenSkeleton isDarkMode={isDarkMode} />;

      case 'Grid_List':
      case 'allProducts':
        return (
          <View style={{ marginTop: normalize(10) }}>
            <SectionHeader title={item.label || "All Provisions"} showSeeAll={false} />
            <View style={styles.gridContainer}>
              {allProducts.map((product) => (
                <GridCard key={product.id} item={product} isDarkMode={isDarkMode} />
              ))}
            </View>
            {loadingMore && (
              <View style={[styles.gridContainer, { marginTop: normalize(10) }]}>
                <ProvisionCardSkeleton isDarkMode={isDarkMode} grid />
                <ProvisionCardSkeleton isDarkMode={isDarkMode} grid />
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <CartCtx.Provider value={{ qty: cartQty, open: openSheet }}>
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        {isFocused && (
          <StatusBar
            backgroundColor="transparent"
            barStyle="light-content"
            translucent
          />
        )}

        {/* ── Sticky Header ──────────────────────────────────────── */}
        <View style={[styles.stickyHeader, { paddingTop: insets.top + normalize(6) }]}>
          <TouchableOpacity onPress={goBack} style={styles.heroBack} activeOpacity={0.7}>
            <Icon icon={arrowBack} height={theme.spacing.lg} tintColor="#FFFFFF" />
          </TouchableOpacity>
          {/* {<TouchableOpacity
            onPress={goToCart}
            style={styles.heroCartBtn}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon icon={white_shopping_cart} width={20} height={20} tintColor="#FFFFFF" />
            {cartCount > 0 && (
              <View style={styles.heroCartBadge}>
                <Typography style={styles.heroCartBadgeText}>
                  {cartCount > 99 ? '99+' : cartCount}
                </Typography>
              </View>
            )}
          </TouchableOpacity>} */}
        </View>

        {/* ── Content ────────────────────────────────────────────── */}
        <FlatList
          data={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderSection}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D32F2F" />
          }
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        />


        <AddToCartSheet
          item={sheetItem}
          initialQty={sheetItem ? cartQty[sheetItem.id] || 0 : 0}
          isDarkMode={isDarkMode}
          onClose={() => setSheetItem(null)}
          onConfirm={(q) => {
            setCartQty((c) => ({ ...c, [sheetItem.id]: q }));
            setSheetItem(null);
          }}
        />

        {/* ── Shopping Cart Review Modal (Checkout Cart Modal) ── */}
        <ButtonSheet dispatch={cartReviewDialog} height={normalize(500)}>
          <View style={styles.cartSheetContent}>
            <View style={[styles.dialogHeader, { paddingHorizontal: normalize(24) }]}>
              <Typography style={styles.dialogTitle}>Items in your Cart</Typography>
              <TouchableOpacity onPress={() => setCartReviewDialog(false)}>
                <Icon icon={closeIcon} height={normalize(24)} tintColor={isDarkMode ? '#FFF' : '#000'} />
              </TouchableOpacity>
            </View>

            {isCartLoading ? (
              <ActivityIndicator size="large" color={semantic.alert.danger.d500} style={{ marginTop: normalize(40) }} />
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.cartListScroll}
              >
                {(cartItemList?.data?.items ?? []).length === 0 ? (
                  <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: normalize(40) }}>
                    <Typography style={{ color: isDarkMode ? '#94A3B8' : '#64748B', fontSize: normalize(14) }}>
                      Your cart is empty
                    </Typography>
                  </View>
                ) : (
                  (cartItemList?.data?.items ?? []).map((item, index) => (
                    <CartItemHorizontalList
                      key={item.id ? `${item.id}-${index}` : index}
                      product={item}
                      onPress={onEditItem}
                    />
                  ))
                )}
              </ScrollView>
            )}
          </View>
        </ButtonSheet>

        <UpdateCartDialog
          onCartUpdated={onCartUpdated}
          product={cartItemSelected}
          visible={openUpdateCartModal}
          onClose={(status: boolean) => setOpenUpdateCartModal(status)}
        />

        <CustomerTypeModal
          visible={showCustomerTypeModal}
          dismissable={false}
          onSuccess={() => setShowCustomerTypeModal(false)}
        />
      </SafeAreaView>
    </CartCtx.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLES — Follows existing HomeHeader + ProductCard + TopBrands patterns
// ═══════════════════════════════════════════════════════════════════════════

const _styles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? semantic.fill.f01 : '#F8FAFC',
    },
    cartSheetContent: {
      flex: 1,
      paddingTop: normalize(16),
    },
    cartListScroll: {
      paddingHorizontal: normalize(20),
      paddingBottom: normalize(40),
    },
    dialogHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: normalize(24),
    },
    dialogTitle: {
      fontSize: normalize(18),
      fontFamily: FONT.BOLD,
      color: isDarkMode ? '#FFF' : '#1A1D1E',
    },

    // ── Header (matches HomeHeader/styles.tsx) ────────────────────────────
    topContainer: {
      backgroundColor: isDarkMode ? semantic.fill.f01 : '#F8FAFC',
      paddingTop: Platform.OS === 'ios' ? theme.spacing.md : theme.spacing.md,
      paddingBottom: theme.spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? semantic.fill.f04 : 'rgba(0,0,0,0.05)',
      zIndex: 100,
    },
    actionBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    logoSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    logo: {
      width: theme.spacing.xxl,
      height: theme.spacing.xxl,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.xs,
    },
    appName: {
      fontSize: theme.typography.lg,
      fontFamily: FONT.BOLD,
      color: isDarkMode ? '#FFFFFF' : '#1A1D1E',
    },
    storeNameTag: {
      backgroundColor: isDarkMode
        ? 'rgba(211, 47, 47, 0.2)'
        : 'rgba(211, 47, 47, 0.08)',
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.xs,
      marginTop: theme.spacing.xs / 2,
      alignSelf: 'flex-start',
    },
    storeNameText: {
      fontSize: theme.typography.xs,
      fontFamily: FONT.BOLD,
      color: semantic.alert.danger.d500,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    actionButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconBtn: {
      width: theme.MIN_TOUCH_TARGET,
      height: theme.MIN_TOUCH_TARGET,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: theme.spacing.xs,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xxl * 2,
    },

    // ── Hero Banner ───────────────────────────────────────────────────────
        stickyHeader: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      backgroundColor: '#0F172A',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: normalize(16),
      paddingBottom: normalize(10),
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.06)',
    },
    heroBanner: {
      paddingHorizontal: normalize(16),
      paddingBottom: theme.spacing.lg,
      backgroundColor: '#0F172A',
    },
        heroTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    heroCartBtn: {
      width: normalize(36),
      height: normalize(36),
      borderRadius: normalize(12),
      backgroundColor: 'rgba(255,255,255,0.18)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    heroCartBadge: {
      position: 'absolute',
      top: -normalize(4),
      right: -normalize(4),
      backgroundColor: '#D50000',
      minWidth: normalize(18),
      height: normalize(18),
      borderRadius: normalize(9),
      paddingHorizontal: normalize(4),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: '#0F172A',
    },
    heroCartBadgeText: {
      color: '#FFFFFF',
      fontSize: normalize(9),
      fontFamily: FONT.BOLD,
    },
    heroBack: {
      width: theme.MIN_TOUCH_TARGET,
      height: theme.MIN_TOUCH_TARGET,
      justifyContent: 'center',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.xs,
    },
    heroContent: {
      flex: 1,
    },
    heroTitle: {
      fontSize: theme.typography.xxl,
      fontFamily: FONT.EXTRA_BOLD,
      color: '#FFFFFF',
      marginBottom: theme.spacing.xs,
    },
    heroSubtitle: {
      fontSize: theme.typography.sm,
      fontFamily: FONT.NORMAL,
      color: 'rgba(255,255,255,0.6)',
      lineHeight: 18,
    },

    // ── Category Selector ─────────────────────────────────────────────────
    categoryScroll: {
      paddingHorizontal: normalize(16),
      paddingVertical: normalize(12),
      gap: normalize(8),
    },
    categoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? semantic.fill.f02 : semantic.text.white,
      paddingHorizontal: theme.spacing.sm + 2,
      paddingVertical: theme.spacing.xs + 2,
      borderRadius: theme.borderRadius.full,
      borderWidth: 1,
      borderColor: isDarkMode ? semantic.fill.f04 : '#f0f0f0',
      gap: 4,
    },
    categoryChipActive: {
      backgroundColor: '#D50000',
      borderColor: '#D50000',
    },
    categoryEmoji: {
      fontSize: 13,
    },
    categoryChipText: {
      fontSize: theme.typography.xs,
      fontFamily: FONT.BOLD,
      color: isDarkMode ? semantic.text.white : semantic.text.black,
      letterSpacing: 0.3,
    },
    categoryChipTextActive: {
      color: '#FFFFFF',
    },

    // ── Product Card — mirrors existing ProductCard component ─────────────
    productCard: {
      width: theme.MAX_CONTENT_WIDTH ? (theme.MAX_CONTENT_WIDTH - theme.spacing.lg) / 3 : 165,
      backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f03,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      margin: theme.spacing.xs,
      borderWidth: 1,
      borderColor: isDarkMode ? semantic.fill.f02 : '#f0f0f0',
      position: 'relative',
      ...theme.shadows.sm,
    },
    productImageContainer: {
      width: '100%',
      aspectRatio: 1.2,
      borderRadius: theme.borderRadius.sm,
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: isDarkMode ? semantic.fill.f02 : '#f9f9f9',
      justifyContent: 'center',
      alignItems: 'center',
    },
    productImagePlaceholder: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeContainer: {
      position: 'absolute',
      top: theme.spacing.xs,
      left: theme.spacing.xs,
      flexDirection: 'column',
      gap: theme.spacing.xs / 2,
      zIndex: 10,
    },
    badge: {
      paddingHorizontal: theme.spacing.xs * 1.5,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.borderRadius.xs,
    },
    badgeText: {
      color: semantic.text.white,
      fontSize: theme.typography.xs - 4,
      fontFamily: FONT.BOLD,
    },
    productInfo: {
      marginTop: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs / 2,
    },
    productName: {
      fontFamily: FONT.MEDIUM,
      color: isDarkMode ? semantic.text.white : semantic.text.black,
      fontSize: theme.typography.sm,
      height: theme.typography.sm * 2.8,
      marginBottom: theme.spacing.xs,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
      flexWrap: 'wrap',
    },
    productPrice: {
      fontSize: theme.typography.body,
      fontFamily: FONT.SEMI_BOLD,
      color: isDarkMode ? semantic.text.white : semantic.text.black,
    },
    oldPrice: {
      fontSize: theme.typography.xs,
      color: semantic.alert.danger.d500,
      textDecorationLine: 'line-through',
      marginLeft: theme.spacing.sm,
    },
    savingsText: {
      fontSize: theme.typography.xs - 0.5,
      color: isDarkMode ? semantic.alert.success.s300 : '#16A34A',
      marginTop: theme.spacing.xs,
      fontFamily: FONT.BOLD,
    },
    wishlistButton: {
      position: 'absolute',
      top: theme.spacing.xs,
      right: theme.spacing.xs,
      zIndex: 250,
      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)',
      borderRadius: theme.borderRadius.full,
      width: theme.spacing.xl,
      height: theme.spacing.xl,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    wishlistIcon: {
      width: theme.spacing.md,
      height: theme.spacing.md,
      tintColor: '#D50000',
    },
    packageText: {
      fontSize: theme.typography.xs - 0.5,
      color: isDarkMode ? semantic.alert.success.s300 : palette.main.p500,
      marginTop: theme.spacing.xs,
      fontFamily: FONT.MEDIUM,
    },
    addToCartBtn: {
      position: 'absolute',
      bottom: theme.spacing.sm,
      right: theme.spacing.sm,
      backgroundColor: '#D50000',
      width: theme.MIN_TOUCH_TARGET - 12,
      height: theme.MIN_TOUCH_TARGET - 12,
      borderRadius: theme.borderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: semantic.text.white,
      ...theme.shadows.sm,
    },

    // ── Category Cards — matches TopBrands exactly ────────────────────────
    // ── Fancy Card ────────────────────────────────────────────────────────
    fancyCard: {
      width: normalize(168),
      backgroundColor: isDarkMode ? semantic.fill.f01 : '#FFFFFF',
      borderRadius: normalize(20),
      margin: theme.spacing.xs,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: isDarkMode ? semantic.fill.f02 : 'rgba(15,23,42,0.06)',
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDarkMode ? 0.4 : 0.1,
      shadowRadius: 16,
      elevation: 6,
    },
    fancyCardGrid: {
      width: (Dimensions_width() - normalize(16) - theme.spacing.xs * 4) / 2,
    },
    fancyImage: {
      height: normalize(118),
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    outOfStockOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.65)' : 'rgba(255, 255, 255, 0.65)',
      zIndex: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    outOfStockBadge: {
      backgroundColor: '#DC2626',
      paddingHorizontal: normalize(10),
      paddingVertical: normalize(5),
      borderRadius: normalize(6),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
    outOfStockText: {
      color: '#FFFFFF',
      fontSize: normalize(10),
      fontFamily: FONT.BOLD,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    fancyBlob: {
      position: 'absolute',
      width: normalize(120),
      height: normalize(120),
      borderRadius: normalize(60),
      backgroundColor: 'rgba(255,255,255,0.65)',
      bottom: -normalize(40),
      right: -normalize(30),
    },
    fancyRibbon: {
      position: 'absolute',
      top: normalize(10),
      left: 0,
      backgroundColor: '#D50000',
      paddingHorizontal: normalize(8),
      paddingVertical: normalize(3),
      borderTopRightRadius: normalize(10),
      borderBottomRightRadius: normalize(10),
    },
    fancyRibbonText: {
      color: '#FFFFFF',
      fontSize: normalize(9),
      fontFamily: FONT.BOLD,
      letterSpacing: 0.6,
    },
    fancyExpiry: {
      position: 'absolute',
      bottom: normalize(8),
      left: normalize(8),
      backgroundColor: 'rgba(15,23,42,0.78)',
      paddingHorizontal: normalize(8),
      paddingVertical: normalize(3),
      borderRadius: normalize(10),
    },
    fancyExpiryText: {
      color: '#FDE68A',
      fontSize: normalize(9),
      fontFamily: FONT.BOLD,
    },
    fancyBody: {
      padding: normalize(10),
      flex: 1,
      justifyContent: 'space-between',
    },
    fancyName: {
      fontFamily: FONT.SEMI_BOLD,
      fontSize: theme.typography.sm,
      color: isDarkMode ? semantic.text.white : '#0F172A',
      height: theme.typography.sm * 2.7,
    },
    fancyChipRow: {
      flexDirection: 'row',
      marginTop: normalize(4),
    },
    fancyChip: {
      flexDirection: 'row',
      alignItems: 'stretch',
      borderRadius: normalize(8),
      overflow: 'hidden',
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: isDarkMode ? semantic.fill.f04 : '#CBD5E1',
    },
    fancyChipNumWrap: {
      backgroundColor: '#0F172A',
      paddingHorizontal: normalize(8),
      justifyContent: 'center',
      alignItems: 'center',
    },
    fancyChipNum: {
      color: '#FDE68A',
      fontSize: normalize(11),
      fontFamily: FONT.EXTRA_BOLD,
    },
    fancyChipLabelWrap: {
      backgroundColor: isDarkMode ? semantic.fill.f02 : '#FFF7ED',
      paddingHorizontal: normalize(7),
      paddingVertical: normalize(3),
      justifyContent: 'center',
    },
    fancyChipText: {
      fontSize: normalize(9),
      fontFamily: FONT.BOLD,
      letterSpacing: 0.6,
      color: isDarkMode ? semantic.text.white : '#C2410C',
    },
    fancyStockWrap: {
      marginTop: normalize(8),
    },
    fancyStockTrack: {
      height: normalize(4),
      borderRadius: normalize(2),
      backgroundColor: isDarkMode ? semantic.fill.f02 : '#E2E8F0',
      overflow: 'hidden',
    },
    fancyStockFill: {
      height: '100%',
      borderRadius: normalize(2),
    },
    fancyStockText: {
      marginTop: normalize(3),
      fontSize: normalize(10),
      fontFamily: FONT.BOLD,
    },
    fancyFooter: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginTop: normalize(8),
      paddingTop: normalize(8),
      borderTopWidth: 1,
      borderStyle: 'dashed',
      borderTopColor: isDarkMode ? semantic.fill.f04 : '#E2E8F0',
    },
    fancyOldPrice: {
      fontSize: normalize(10),
      color: semantic.alert.danger.d500,
      textDecorationLine: 'line-through',
    },
    fancyPrice: {
      fontSize: theme.typography.body,
      fontFamily: FONT.EXTRA_BOLD,
      color: isDarkMode ? semantic.text.white : '#0F172A',
    },
    fancyPackage: {
      fontSize: normalize(10),
      fontFamily: FONT.MEDIUM,
      color: '#64748B',
    },
    fancyAddBtn: {
      width: normalize(34),
      height: normalize(34),
      borderRadius: normalize(12),
      backgroundColor: '#D50000',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#D50000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 6,
      elevation: 4,
    },
    fancyAddBtnActive: {
      backgroundColor: '#16A34A',
      shadowColor: '#16A34A',
    },
    fancyAddBtnDisabled: {
      backgroundColor: isDarkMode ? '#334155' : '#E2E8F0',
      shadowOpacity: 0,
      elevation: 0,
    },
    fancyAddCount: {
      color: '#FFFFFF',
      fontSize: normalize(13),
      fontFamily: FONT.EXTRA_BOLD,
    },

    // ── Add-to-cart sheet ──
    sheetBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(15,23,42,0.55)',
    },
    sheet: {
      backgroundColor: isDarkMode ? semantic.fill.f01 : '#FFFFFF',
      borderTopLeftRadius: normalize(28),
      borderTopRightRadius: normalize(28),
      padding: normalize(18),
      paddingBottom: normalize(32),
    },
    sheetHandle: {
      alignSelf: 'center',
      width: normalize(44),
      height: normalize(4),
      borderRadius: 2,
      backgroundColor: isDarkMode ? semantic.fill.f04 : '#CBD5E1',
      marginBottom: normalize(14),
    },
    sheetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sheetShareBtn: {
      position: 'absolute',
      top: normalize(4),
      right: normalize(4),
      width: normalize(24),
      height: normalize(24),
      borderRadius: normalize(12),
      backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    sheetThumb: {
      width: normalize(80),
      height: normalize(80),
      borderRadius: normalize(18),
      justifyContent: 'center',
      alignItems: 'center',
    },
    sheetName: {
      fontSize: theme.typography.body,
      fontFamily: FONT.BOLD,
      color: isDarkMode ? semantic.text.white : '#0F172A',
    },
    sheetMeta: {
      fontSize: normalize(11),
      fontFamily: FONT.MEDIUM,
      color: '#64748B',
      marginTop: 2,
    },
    sheetUnit: {
      fontSize: theme.typography.lg,
      fontFamily: FONT.EXTRA_BOLD,
      color: '#D50000',
      marginTop: 4,
    },
    sheetRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: normalize(20),
    },
    sheetLabel: {
      fontSize: theme.typography.body,
      fontFamily: FONT.BOLD,
      color: isDarkMode ? semantic.text.white : '#0F172A',
    },
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? semantic.fill.f02 : '#F1F5F9',
      borderRadius: normalize(16),
      padding: normalize(4),
    },
    stepBtn: {
      width: normalize(40),
      height: normalize(40),
      borderRadius: normalize(12),
      backgroundColor: isDarkMode ? semantic.fill.f04 : '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    stepBtnPlus: {
      backgroundColor: '#D50000',
    },
    stepBtnText: {
      fontSize: normalize(20),
      fontFamily: FONT.BOLD,
      color: isDarkMode ? semantic.text.white : '#0F172A',
    },
    stepQtyInput: {
      minWidth: normalize(110),
      height: normalize(40),
      textAlign: 'center',
      fontSize: normalize(18),
      fontFamily: FONT.EXTRA_BOLD,
      color: isDarkMode ? semantic.text.white : '#0F172A',
      padding: 0,
    },
    stepQty: {
      minWidth: normalize(48),
      textAlign: 'center',
      fontSize: normalize(18),
      fontFamily: FONT.EXTRA_BOLD,
      color: isDarkMode ? semantic.text.white : '#0F172A',
    },
    quickRow: {
      flexDirection: 'row',
      marginTop: normalize(14),
      gap: normalize(8),
    },
    quickChip: {
      paddingHorizontal: normalize(14),
      paddingVertical: normalize(7),
      borderRadius: normalize(20),
      borderWidth: 1,
      borderColor: isDarkMode ? semantic.fill.f04 : '#E2E8F0',
    },
    quickChipActive: {
      backgroundColor: '#0F172A',
      borderColor: '#0F172A',
    },
    quickChipText: {
      fontSize: normalize(11),
      fontFamily: FONT.BOLD,
      color: isDarkMode ? semantic.text.white : '#334155',
    },
    sheetSummary: {
      marginTop: normalize(18),
      padding: normalize(14),
      borderRadius: normalize(16),
      backgroundColor: isDarkMode ? semantic.fill.f02 : '#F8FAFC',
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: isDarkMode ? semantic.fill.f04 : '#CBD5E1',
    },
    sheetSummaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 3,
    },
    sheetSummaryVal: {
      fontSize: theme.typography.body,
      fontFamily: FONT.BOLD,
      color: isDarkMode ? semantic.text.white : '#0F172A',
    },
    sheetTotal: {
      fontSize: theme.typography.lg,
      fontFamily: FONT.EXTRA_BOLD,
      color: isDarkMode ? semantic.text.white : '#0F172A',
    },
    sheetCta: {
      marginTop: normalize(16),
      backgroundColor: '#D50000',
      borderRadius: normalize(16),
      paddingVertical: normalize(15),
      alignItems: 'center',
      shadowColor: '#D50000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
      elevation: 6,
    },
    sheetCtaText: {
      color: '#FFFFFF',
      fontSize: theme.typography.body,
      fontFamily: FONT.EXTRA_BOLD,
    },

    // ── Floating cart bar ──
    cartBar: {
      position: 'absolute',
      left: normalize(16),
      right: normalize(16),
      bottom: normalize(16),
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#0F172A',
      borderRadius: normalize(20),
      paddingVertical: normalize(12),
      paddingHorizontal: normalize(14),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 14,
      elevation: 10,
    },
    cartBarBadge: {
      minWidth: normalize(34),
      height: normalize(34),
      borderRadius: normalize(17),
      backgroundColor: '#D50000',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
    },
    cartBarBadgeText: {
      color: '#FFF',
      fontFamily: FONT.EXTRA_BOLD,
      fontSize: normalize(13),
    },
    cartBarTitle: {
      color: '#FFFFFF',
      fontFamily: FONT.BOLD,
      fontSize: theme.typography.body,
    },
    cartBarSub: {
      color: 'rgba(255,255,255,0.6)',
      fontFamily: FONT.MEDIUM,
      fontSize: normalize(11),
    },
    cartBarTotal: {
      color: '#FDE68A',
      fontFamily: FONT.EXTRA_BOLD,
      fontSize: theme.typography.lg,
    },
    catScrollContainer: {
      paddingHorizontal: normalize(16),
      paddingBottom: normalize(10),
      paddingTop: normalize(10),
    },
    catCard: {
      backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.text.white,
      borderRadius: normalize(12),
      padding: normalize(8),
      marginRight: normalize(16),
      alignItems: 'center',
      width: normalize(85),
      borderWidth: 1,
      borderColor: isDarkMode ? semantic.fill.f02 : '#f2f2f2',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    catImageWrapper: {
      width: normalize(50),
      height: normalize(50),
      borderRadius: normalize(10),
      backgroundColor: isDarkMode ? semantic.fill.f02 : '#f9f9f9',
      overflow: 'hidden',
      marginBottom: normalize(6),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDarkMode ? semantic.fill.f04 : '#eee',
    },
    catText: {
      fontSize: normalize(10),
      textAlign: 'center',
      color: isDarkMode ? semantic.text.white : semantic.text.black,
      fontFamily: FONT.BOLD,
      letterSpacing: 0.3,
    },
    catTag: {
      position: 'absolute',
      top: -normalize(5),
      right: -normalize(5),
      backgroundColor: '#D50000',
      paddingHorizontal: normalize(6),
      paddingVertical: normalize(2),
      borderRadius: normalize(10),
      zIndex: 1,
    },
    catTagText: {
      color: '#fff',
      fontSize: normalize(8),
      fontFamily: FONT.BOLD,
    },

    // ── 2-Column Grid ─────────────────────────────────────────────────────
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: normalize(8),
    },
    gridCard: {
      width: theme.MAX_CONTENT_WIDTH
        ? (theme.MAX_CONTENT_WIDTH - theme.spacing.lg) / 3
        : (Dimensions_width() - normalize(24)) / 2,
      backgroundColor: isDarkMode ? semantic.fill.f01 : semantic.fill.f03,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      margin: theme.spacing.xs,
      borderWidth: 1,
      borderColor: isDarkMode ? semantic.fill.f02 : '#f0f0f0',
      position: 'relative',
      ...theme.shadows.sm,
    },
    gridImageContainer: {
      width: '100%',
      aspectRatio: 1.2,
      borderRadius: theme.borderRadius.sm,
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: isDarkMode ? semantic.fill.f02 : '#f9f9f9',
      justifyContent: 'center',
      alignItems: 'center',
    },
    gridBadgeWrap: {
      position: 'absolute',
      top: theme.spacing.xs,
      left: theme.spacing.xs,
      zIndex: 10,
    },
    gridImagePlaceholder: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    gridInfo: {
      marginTop: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs / 2,
    },
  });

function Dimensions_width() {
  return Dimensions.get('window').width;
}
