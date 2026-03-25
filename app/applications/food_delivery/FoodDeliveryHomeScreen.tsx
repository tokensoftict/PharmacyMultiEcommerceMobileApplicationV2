import React from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import Typography from '@/shared/component/typography';
import { normalize } from '@/shared/helpers';
import { semantic } from '@/shared/constants/colors';
import FoodHeader from './components/FoodHeader';
import FoodSearch from './components/FoodSearch';
import FoodCategorySection from './components/FoodCategorySection';
import FoodHeroBanner from './components/FoodHeroBanner';
import FoodProductCard from './components/FoodProductCard';
import FoodBottomNav from './components/FoodBottomNav';
import { mockProducts } from './data/mockData';

const FoodDeliveryHomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <FoodHeader />
          <FoodSearch />
          <FoodCategorySection />
          <FoodHeroBanner />

          {/* Combo Deals Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Typography style={styles.sectionTitle}>Combo Deals For You</Typography>
              <TouchableOpacity>
                <Typography style={styles.seeAll}>See All {'>'}</Typography>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsScroll}>
              {mockProducts.map((product) => (
                <FoodProductCard key={product.id} product={product} />
              ))}
            </ScrollView>
          </View>

          {/* Classic Pizza Section */}
          <View style={[styles.section, { marginBottom: normalize(100) }]}>
            <View style={styles.sectionHeader}>
              <Typography style={styles.sectionTitle}>Classic Pizza</Typography>
              <TouchableOpacity>
                <Typography style={styles.seeAll}>See All {'>'}</Typography>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsScroll}>
              {mockProducts.map((product) => (
                <FoodProductCard key={`pizza-${product.id}`} product={product} />
              ))}
            </ScrollView>
          </View>
        </ScrollView>
        <FoodBottomNav />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#008435', // Match header for seamless safe area
  },
  container: {
    flex: 1,
    backgroundColor: semantic.text.reallightgrey,
  },
  scrollContent: {
    paddingBottom: normalize(20),
  },
  section: {
    marginTop: normalize(25),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    marginBottom: normalize(15),
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: Platform.OS === 'ios' ? 'bold' : undefined,
    color: semantic.text.black,
  },
  seeAll: {
    fontSize: normalize(12),
    color: semantic.alert.success.s500,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },
  productsScroll: {
    paddingHorizontal: normalize(20),
  },
});

export default FoodDeliveryHomeScreen;
