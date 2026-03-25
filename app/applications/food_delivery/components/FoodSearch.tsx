import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import Icon from '@/shared/component/icon';
import { normalize } from '@/shared/helpers';
import { semantic } from '@/shared/constants/colors';

import { search } from '@/assets/icons';

const FoodSearch = () => {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          placeholder="What are you craving today?..."
          style={styles.input}
          placeholderTextColor={semantic.text.grey}
        />
        <Icon icon={search} width={20} height={20} tintColor={semantic.text.black} />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    marginTop: normalize(-25),
    paddingHorizontal: normalize(20),
    zIndex: 10,
  },
  searchBar: {
    backgroundColor: semantic.text.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(15),
    height: normalize(50),
    borderRadius: normalize(25),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: normalize(14),
    color: semantic.text.black,
  },
});

export default FoodSearch;
