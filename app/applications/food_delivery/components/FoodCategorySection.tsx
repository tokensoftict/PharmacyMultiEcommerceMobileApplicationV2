import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import Typography from '@/shared/component/typography';
import Icon from '@/shared/component/icon';
import { normalize } from '@/shared/helpers';
import { semantic } from '@/shared/constants/colors';
import { mockCategories } from '../data/mockData';

const FoodCategorySection = () => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {mockCategories.map((category) => (
          <TouchableOpacity key={category.id} style={styles.categoryItem}>
            <View style={styles.iconContainer}>
              <Icon icon={category.icon} width={20} height={20} />
            </View>
            <Typography style={styles.categoryName}>{category.name}</Typography>
          </TouchableOpacity>
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
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semantic.text.white,
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(12),
    borderRadius: normalize(20),
    marginRight: normalize(15),
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  iconContainer: {
    marginRight: normalize(8),
  },
  categoryName: {
    fontSize: normalize(14),
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    color: semantic.text.black,
  },
});

export default FoodCategorySection;
