import React from 'react';
import { Image, TouchableOpacity, View, StyleSheet, Platform } from "react-native";
import Typography from "@/shared/component/typography";
import { activeOpacity, currencyType } from "@/shared/constants/global";
import useDarkMode from "@/shared/hooks/useDarkMode";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack";
import { normalize } from "@/shared/helpers";
import { OrderListInterface } from "@/service/order/interface/OrderListInterface.tsx";
import { palette } from "@/shared/constants/colors.ts";
import Icon from "@/shared/component/icon";
import { arrowForward } from "@/assets/icons";

interface OrderProps {
  product: OrderListInterface;
  track?: boolean | undefined
}

export default function Order({ product, track = true }: OrderProps) {
  const { isDarkMode } = useDarkMode();
  const navigation = useNavigation<NavigationProps>();

  function navigateTo() {
    // @ts-ignore
    navigation.navigate('showOrder', { orderId: product.id })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { bg: '#F0FDF4', text: '#166534' }; // Green
      case 'cancelled':
        return { bg: '#FEF2F2', text: '#991B1B' }; // Red
      default:
        return { bg: '#FFFBEB', text: '#92400E' }; // Yellow/Amber for In Progress
    }
  };

  const statusStyle = getStatusColor(product.status);

  return (
    <TouchableOpacity 
      onPress={navigateTo} 
      activeOpacity={activeOpacity} 
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        <Image 
          style={styles.image} 
          resizeMode="contain" 
          source={{ uri: product.image }} 
        />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Typography style={styles.orderId}>#{product.orderId}</Typography>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Typography style={[styles.statusText, { color: statusStyle.text }]}>
              {product.status}
            </Typography>
          </View>
        </View>

        <Typography style={styles.date}>{product.orderDate}</Typography>
        
        <View style={styles.footerRow}>
          <Typography style={styles.price}>
            {currencyType}{product.total}
          </Typography>
          <Typography style={styles.paymentMethod}>{product.payment_method}</Typography>
        </View>
      </View>
      
      <View style={styles.actionContainer}>
        <Icon icon={arrowForward} width={20} height={20} tintColor="#94A3B8" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(20),
    padding: normalize(12),
    marginBottom: normalize(16),
    marginHorizontal: normalize(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    alignItems: 'center',
  },
  imageContainer: {
    width: normalize(70),
    height: normalize(70),
    backgroundColor: '#F8FAFC',
    borderRadius: normalize(14),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '85%',
    height: '85%',
  },
  infoContainer: {
    flex: 1,
    marginLeft: normalize(16),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(4),
  },
  orderId: {
    fontSize: normalize(14),
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    color: '#1E293B',
  },
  statusBadge: {
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    borderRadius: normalize(8),
  },
  statusText: {
    fontSize: normalize(10),
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    textTransform: 'uppercase',
  },
  date: {
    fontSize: normalize(12),
    color: '#64748B',
    marginBottom: normalize(8),
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: normalize(15),
    fontWeight: Platform.OS === 'ios' ? '800' : undefined,
    color: palette.main.p500,
  },
  paymentMethod: {
    fontSize: normalize(11),
    color: '#94A3B8',
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
  },
  actionContainer: {
      marginLeft: normalize(8),
  }
});
