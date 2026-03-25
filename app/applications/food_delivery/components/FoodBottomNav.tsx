import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Typography from '@/shared/component/typography';
import Icon from '@/shared/component/icon';
import { normalize } from '@/shared/helpers';
import { semantic } from '@/shared/constants/colors';

import { home, wallet, order, like, user } from '@/assets/icons';

const FoodBottomNav = () => {
  const tabs = [
    { name: 'Home', icon: home, active: true },
    { name: 'Wallet', icon: wallet },
    { name: 'Orders', icon: order },
    { name: 'Likes', icon: like },
    { name: 'Profile', icon: user },
  ];


  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => (
        <TouchableOpacity key={index} style={styles.tab}>
          <Icon 
            icon={tab.icon} 
            width={normalize(24)} 
            height={normalize(24)} 
            tintColor={tab.active ? '#008435' : semantic.text.grey} 
          />
          <Typography style={[styles.tabLabel, tab.active && styles.activeLabel]}>
            {tab.name}
          </Typography>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: semantic.text.white,
    paddingTop: normalize(10),
    paddingBottom: normalize(25),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: normalize(10),
    color: semantic.text.grey,
    marginTop: normalize(4),
  },
  activeLabel: {
    color: '#008435',
    fontWeight: Platform.OS === 'ios' ? 'bold' : undefined,
  },
});

export default FoodBottomNav;
