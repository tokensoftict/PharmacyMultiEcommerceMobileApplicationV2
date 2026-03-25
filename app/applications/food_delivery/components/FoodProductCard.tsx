import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import Typography from '@/shared/component/typography';
import Icon from '@/shared/component/icon';
import { normalize } from '@/shared/helpers';
import { palette, semantic } from '@/shared/constants/colors';

import { like, star, add } from '@/assets/icons';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    rating: number;
    reviews: number;
    price: number;
    image: any;
    ordersRecently: number;
  };
}


const FoodProductCard = ({ product }: ProductCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={product.image} style={styles.image} />
        <View style={styles.badge}>
          <Typography style={styles.badgeText}>{product.ordersRecently} ordered recently</Typography>
        </View>
        <TouchableOpacity style={styles.likeButton}>
           <Icon icon={like} width={16} height={16} tintColor={semantic.text.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Typography numberOfLines={1} style={styles.name}>{product.name}</Typography>
        <View style={styles.ratingRow}>
          <Icon icon={star} width={12} height={12} tintColor={semantic.alert.success.s500} />
          <Typography style={styles.ratingText}>{product.rating.toFixed(1)} ({product.reviews} Reviews)</Typography>
        </View>
        <Typography style={styles.price}>₦{product.price.toLocaleString()}</Typography>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Icon icon={add} width={14} height={14} tintColor={semantic.text.white} />
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    width: normalize(160),
    backgroundColor: semantic.text.white,
    borderRadius: normalize(15),
    marginRight: normalize(15),
    padding: normalize(8),
    borderWidth: 1,
    borderColor: '#f0f0f0',
    position: 'relative',
  },
  imageContainer: {
    height: normalize(120),
    borderRadius: normalize(12),
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: normalize(8),
    left: normalize(8),
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: normalize(6),
    paddingVertical: normalize(2),
    borderRadius: normalize(8),
  },
  badgeText: {
    color: semantic.text.white,
    fontSize: normalize(8),
  },
  likeButton: {
    position: 'absolute',
    top: normalize(8),
    right: normalize(8),
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: normalize(24),
    height: normalize(24),
    borderRadius: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    marginTop: normalize(8),
  },
  name: {
    fontSize: normalize(13),
    fontWeight: Platform.OS === 'ios' ? 'bold' : undefined,
    color: semantic.text.black,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(4),
  },
  ratingText: {
    fontSize: normalize(10),
    color: semantic.text.grey,
    marginLeft: normalize(4),
  },
  price: {
    fontSize: normalize(14),
    fontWeight: Platform.OS === 'ios' ? 'bold' : undefined,
    color: semantic.text.black,
    marginTop: normalize(4),
  },
  addButton: {
    position: 'absolute',
    bottom: normalize(8),
    right: normalize(8),
    backgroundColor: '#008435',
    width: normalize(28),
    height: normalize(28),
    borderRadius: normalize(14),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: semantic.text.white,
  },
});

export default FoodProductCard;
