import React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import Skeleton from '@/shared/component/skeleton';
import { normalize } from '@/shared/helpers';
import useDarkMode from '@/shared/hooks/useDarkMode.tsx';

const HomeSkeleton = () => {
  const { isDarkMode } = useDarkMode();
  const bgColor = isDarkMode ? '#1E293B' : '#FFFFFF';
  const headerBgColor = isDarkMode ? '#0F172A' : '#F8FAFC';
  const skeletonColor = isDarkMode ? '#334155' : '#E2E8F0';
  const cardBorderColor = isDarkMode ? '#334155' : '#F1F5F9';

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' }]}>
      {/* Header Skeleton matching HomeHeader topContainer */}
      <View style={[styles.header, { backgroundColor: headerBgColor, borderBottomColor: isDarkMode ? '#1E293B' : 'rgba(0,0,0,0.05)' }]}>
        <View style={styles.headerRow}>
          {/* Logo & Store Title */}
          <View style={styles.logoSection}>
            <Skeleton 
              width={normalize(40)} 
              height={normalize(40)} 
              borderRadius={normalize(10)} 
              style={{ backgroundColor: skeletonColor }}
            />
            <View style={styles.headerText}>
              <Skeleton 
                width={normalize(80)} 
                height={normalize(16)} 
                borderRadius={4} 
                style={{ backgroundColor: skeletonColor }}
              />
              <Skeleton 
                width={normalize(130)} 
                height={normalize(14)} 
                borderRadius={4} 
                style={{ marginTop: 4, backgroundColor: skeletonColor }} 
              />
            </View>
          </View>

          {/* Action Buttons (Search & Menu) */}
          <View style={styles.actionButtons}>
            <Skeleton 
              width={normalize(38)} 
              height={normalize(38)} 
              borderRadius={normalize(10)} 
              style={{ backgroundColor: skeletonColor, marginRight: 8 }} 
            />
            <Skeleton 
              width={normalize(38)} 
              height={normalize(38)} 
              borderRadius={normalize(10)} 
              style={{ backgroundColor: skeletonColor }} 
            />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner Carousel Skeleton */}
        <View style={styles.bannerSection}>
          <Skeleton 
            width="100%" 
            height={normalize(150)} 
            borderRadius={18} 
            style={{ backgroundColor: skeletonColor }}
          />
          <View style={styles.dotsRow}>
            <Skeleton width={8} height={8} borderRadius={4} style={{ backgroundColor: skeletonColor, marginHorizontal: 3 }} />
            <Skeleton width={18} height={8} borderRadius={4} style={{ backgroundColor: skeletonColor, marginHorizontal: 3 }} />
            <Skeleton width={8} height={8} borderRadius={4} style={{ backgroundColor: skeletonColor, marginHorizontal: 3 }} />
          </View>
        </View>

        {/* Top Brands Section Skeleton */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Skeleton 
              width={normalize(110)} 
              height={18} 
              borderRadius={4} 
              style={{ backgroundColor: skeletonColor }}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {[1, 2, 3, 4, 5].map(i => (
              <View key={i} style={styles.brandItem}>
                <Skeleton 
                  width={normalize(60)} 
                  height={normalize(60)} 
                  borderRadius={normalize(30)} 
                  style={{ backgroundColor: skeletonColor }} 
                />
                <Skeleton 
                  width={normalize(50)} 
                  height={10} 
                  borderRadius={3} 
                  style={{ marginTop: 8, backgroundColor: skeletonColor }} 
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Flash Deals / Promo Section Skeleton */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Skeleton 
                width={normalize(110)} 
                height={20} 
                borderRadius={4} 
                style={{ backgroundColor: skeletonColor, marginRight: 8 }}
              />
              <Skeleton 
                width={normalize(65)} 
                height={20} 
                borderRadius={10} 
                style={{ backgroundColor: skeletonColor }}
              />
            </View>
            <Skeleton 
              width={normalize(50)} 
              height={14} 
              borderRadius={4} 
              style={{ backgroundColor: skeletonColor }} 
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {[1, 2, 3].map(i => (
              <View key={i} style={[styles.productCard, { backgroundColor: bgColor, borderColor: cardBorderColor }]}>
                <Skeleton 
                  width="100%" 
                  height={normalize(105)} 
                  borderRadius={12} 
                  style={{ backgroundColor: skeletonColor }}
                />
                <Skeleton 
                  width="55%" 
                  height={10} 
                  borderRadius={3} 
                  style={{ marginTop: 10, backgroundColor: skeletonColor }} 
                />
                <Skeleton 
                  width="85%" 
                  height={12} 
                  borderRadius={4} 
                  style={{ marginTop: 6, backgroundColor: skeletonColor }} 
                />
                <View style={styles.cardFooter}>
                  <Skeleton 
                    width="60%" 
                    height={16} 
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
            ))}
          </ScrollView>
        </View>

        {/* Product Category List Skeleton */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Skeleton 
              width={normalize(140)} 
              height={20} 
              borderRadius={4} 
              style={{ backgroundColor: skeletonColor }}
            />
            <Skeleton 
              width={normalize(50)} 
              height={14} 
              borderRadius={4} 
              style={{ backgroundColor: skeletonColor }} 
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {[1, 2, 3].map(i => (
              <View key={i} style={[styles.productCard, { backgroundColor: bgColor, borderColor: cardBorderColor }]}>
                <Skeleton 
                  width="100%" 
                  height={normalize(105)} 
                  borderRadius={12} 
                  style={{ backgroundColor: skeletonColor }}
                />
                <Skeleton 
                  width="90%" 
                  height={12} 
                  borderRadius={4} 
                  style={{ marginTop: 10, backgroundColor: skeletonColor }} 
                />
                <Skeleton 
                  width="60%" 
                  height={12} 
                  borderRadius={4} 
                  style={{ marginTop: 4, backgroundColor: skeletonColor }} 
                />
                <View style={styles.cardFooter}>
                  <Skeleton 
                    width="50%" 
                    height={16} 
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
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? normalize(44) : normalize(16),
    paddingBottom: normalize(12),
    paddingHorizontal: normalize(16),
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    paddingVertical: normalize(16),
    paddingBottom: normalize(80),
  },
  bannerSection: {
    paddingHorizontal: normalize(16),
    marginBottom: normalize(20),
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(10),
  },
  section: {
    marginBottom: normalize(24),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: normalize(16),
    marginBottom: normalize(12),
  },
  horizontalList: {
    paddingHorizontal: normalize(16),
  },
  brandItem: {
    alignItems: 'center',
    marginRight: normalize(16),
  },
  productCard: {
    width: normalize(150),
    borderRadius: normalize(16),
    padding: normalize(10),
    marginRight: normalize(12),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: normalize(12),
  },
});

export default HomeSkeleton;
