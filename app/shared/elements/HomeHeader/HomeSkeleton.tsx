import React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import Skeleton from '@/shared/component/skeleton';
import { normalize } from '@/shared/helpers';
import useDarkMode from '@/shared/hooks/useDarkMode.tsx';

const HomeSkeleton = () => {
  const { isDarkMode } = useDarkMode();
  const bgColor = isDarkMode ? '#1A1D1E' : '#FFFFFF';
  const skeletonColor = isDarkMode ? '#2C2F33' : '#E1E9EE';

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#F8FAFC' }]}>
      {/* Header Skeleton */}
      <View style={[styles.header, { backgroundColor: bgColor }]}>
        <View style={styles.row}>
          <Skeleton 
             width={normalize(40)} 
             height={normalize(40)} 
             borderRadius={normalize(12)} 
             style={{ backgroundColor: skeletonColor }}
          />
          <View style={styles.headerText}>
            <Skeleton 
                width={normalize(100)} 
                height={normalize(18)} 
                borderRadius={4} 
                style={{ backgroundColor: skeletonColor }}
            />
            <Skeleton 
                width={normalize(160)} 
                height={normalize(14)} 
                borderRadius={4} 
                style={{ marginTop: 8, backgroundColor: skeletonColor }} 
            />
          </View>
          <View style={{ marginLeft: 'auto', flexDirection: 'row' }}>
            <Skeleton 
                width={normalize(32)} 
                height={normalize(32)} 
                borderRadius={20} 
                style={{ backgroundColor: skeletonColor, marginRight: 8 }} 
            />
            <Skeleton 
                width={normalize(32)} 
                height={normalize(32)} 
                borderRadius={20} 
                style={{ backgroundColor: skeletonColor }} 
            />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Slider Skeleton */}
        <Skeleton 
            width="100%" 
            height={normalize(160)} 
            borderRadius={16} 
            style={{ backgroundColor: skeletonColor }}
        />

        {/* Categories Section Skeleton */}
        <View style={styles.section}>
          <Skeleton 
              width={normalize(120)} 
              height={20} 
              borderRadius={4} 
              style={{ backgroundColor: skeletonColor }}
          />
          <View style={[styles.row, { marginTop: 16 }]}>
            {[1, 2, 3, 4].map(i => (
              <Skeleton 
                  key={i} 
                  width={normalize(75)} 
                  height={normalize(75)} 
                  borderRadius={normalize(18)} 
                  style={{ marginRight: 12, backgroundColor: skeletonColor }} 
              />
            ))}
          </View>
        </View>

        {/* Product List Skeleton */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Skeleton 
                width={normalize(150)} 
                height={22} 
                borderRadius={4} 
                style={{ backgroundColor: skeletonColor }}
            />
            <Skeleton 
                width={normalize(60)} 
                height={16} 
                borderRadius={4} 
                style={{ marginLeft: 'auto', backgroundColor: skeletonColor }} 
            />
          </View>
          <View style={[styles.row, { marginTop: 16 }]}>
            {[1, 2].map(i => (
              <View key={i} style={{ marginRight: normalize(16) }}>
                <Skeleton 
                    width={normalize(165)} 
                    height={normalize(165)} 
                    borderRadius={16} 
                    style={{ backgroundColor: skeletonColor }}
                />
                <Skeleton 
                    width={normalize(120)} 
                    height={16} 
                    borderRadius={4} 
                    style={{ marginTop: 12, backgroundColor: skeletonColor }} 
                />
                <Skeleton 
                    width={normalize(80)} 
                    height={14} 
                    borderRadius={4} 
                    style={{ marginTop: 6, backgroundColor: skeletonColor }} 
                />
              </View>
            ))}
          </View>
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
    paddingBottom: normalize(16),
    paddingHorizontal: normalize(20),
    borderBottomLeftRadius: normalize(24),
    borderBottomRightRadius: normalize(24),
    // Premium Shadow Effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  content: {
    padding: normalize(20),
    paddingBottom: normalize(100),
  },
  section: {
    marginTop: 28,
  },
});

export default HomeSkeleton;
