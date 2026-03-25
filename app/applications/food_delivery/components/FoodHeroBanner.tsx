import React from 'react';
import { View, StyleSheet, Image, ScrollView, Platform } from 'react-native';
import Typography from '@/shared/component/typography';
import { normalize } from '@/shared/helpers';
import { semantic } from '@/shared/constants/colors';
import { mockBanners } from '../data/mockData';

const FoodHeroBanner = () => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled contentContainerStyle={styles.scrollContent}>
        {mockBanners.map((banner) => (
          <View key={banner.id} style={[styles.banner, { backgroundColor: banner.backgroundColor }]}>
            <View style={styles.textSection}>
               <View style={styles.badge}>
                  <Typography style={styles.badgeText}>🔥 FREE DELIVERY</Typography>
               </View>
              <Typography style={styles.title}>{banner.title}</Typography>
              <Typography style={styles.description}>{banner.description}</Typography>
            </View>
            <Image source={banner.image} style={styles.bannerImage} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: normalize(20),
  },
  scrollContent: {
    paddingHorizontal: normalize(20),
  },
  banner: {
    width: normalize(335),
    height: normalize(160),
    borderRadius: normalize(20),
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
    marginRight: normalize(15),
  },
  textSection: {
    flex: 1,
    padding: normalize(20),
    justifyContent: 'center',
  },
  badge: {
     backgroundColor: 'rgba(255,255,255,0.2)',
     alignSelf: 'flex-start',
     paddingHorizontal: normalize(8),
     paddingVertical: normalize(4),
     borderRadius: normalize(10),
     marginBottom: normalize(8),
  },
  badgeText: {
     color: semantic.text.white,
     fontSize: normalize(10),
     fontWeight: Platform.OS === 'ios' ? 'bold' : undefined,
  },
  title: {
    color: semantic.text.white,
    fontSize: normalize(24),
    fontWeight: Platform.OS === 'ios' ? '900' : undefined,
    marginBottom: normalize(8),
  },
  description: {
    color: semantic.text.white,
    fontSize: normalize(12),
    opacity: 0.9,
  },
  bannerImage: {
    width: normalize(150),
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    right: 0,
  },
});

export default FoodHeroBanner;
