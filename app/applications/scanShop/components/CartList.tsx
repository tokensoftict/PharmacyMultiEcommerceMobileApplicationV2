import { View, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Typography from '@/shared/component/typography';
import Icon from '@/shared/component/icon';
import { trash, emptyCart } from '@/assets/icons';
import { normalize } from '@/shared/helpers';
import useDarkMode from '@/shared/hooks/useDarkMode';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/component/buttons';
import { semantic } from '@/shared/constants/colors';
import { FONT } from '@/shared/constants/fonts';

import { CartInterface, Items } from '@/service/cart/interface/CartInterface';
import CartItemHorizontalList from '@/shared/component/cartItemHorizontalList';
import { ScrollView } from 'react-native';

interface CartListProps {
  cartData: CartInterface | undefined;
  onItemPress: (item: Items | undefined) => void;
}

export const CartList: React.FC<CartListProps> = ({ cartData, onItemPress }) => {
  const { isDarkMode } = useDarkMode();
  const navigation = useNavigation<any>();
  const styles = _styles(isDarkMode);

  const items = cartData?.data.items || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography style={styles.headerTitle}>MY CART ({items.length})</Typography>
      </View>
      
      {items.length > 0 ? (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {items.map((item, index) => (
            <CartItemHorizontalList 
              key={index} 
              product={item} 
              onPress={onItemPress} 
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyImageWrapper}>
            <Image resizeMode={'contain'} style={styles.emptyImage} source={emptyCart} />
          </View>
          <Typography style={styles.emptyTitle}>Your cart is empty</Typography>
          <Typography style={styles.emptySubtitle}>
            Looks like you haven't added anything to your cart yet.
          </Typography>
          <View style={{ marginTop: normalize(32), width: '100%' }}>
            <Button title="START SHOPPING" onPress={() => navigation.goBack()} />
          </View>
        </View>
      )}
    </View>
  );
};

const _styles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(15),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  listContent: {
    padding: normalize(15),
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(12),
    borderRadius: normalize(12),
    marginBottom: normalize(10),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(8),
    backgroundColor: '#f5f5f5',
  },
  details: {
    flex: 1,
    marginLeft: normalize(12),
  },
  name: {
    fontSize: normalize(14),
    fontWeight: '600',
  },
  price: {
    fontSize: normalize(14),
    color: '#D32F2F',
    marginTop: normalize(4),
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(8),
  },
  controlBtn: {
    width: normalize(28),
    height: normalize(28),
    borderRadius: normalize(14),
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    fontSize: normalize(18),
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: normalize(15),
    fontSize: normalize(14),
    fontWeight: 'bold',
  },
  removeBtn: {
    padding: normalize(8),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: normalize(40),
    paddingTop: normalize(40),
  },
  emptyImageWrapper: {
    width: normalize(150),
    height: normalize(150),
    backgroundColor: isDarkMode ? semantic.fill.f02 : '#F1F5F9',
    borderRadius: normalize(75),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: normalize(24),
  },
  emptyImage: {
    width: '60%',
    height: '60%',
  },
  emptyTitle: {
    fontSize: normalize(20),
    fontFamily: FONT.BOLD,
    color: isDarkMode ? '#FFF' : '#1A1D1E',
    textAlign: 'center',
    marginBottom: normalize(8),
  },
  emptySubtitle: {
    fontSize: normalize(14),
    fontFamily: FONT.MEDIUM,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: normalize(20),
  },
});
