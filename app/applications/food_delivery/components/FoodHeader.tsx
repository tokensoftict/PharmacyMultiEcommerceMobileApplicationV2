import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import Typography from '@/shared/component/typography';
import Icon from '@/shared/component/icon';
import { normalize } from '@/shared/helpers';
import { palette, semantic } from '@/shared/constants/colors';
import { userProfile } from '../data/mockData';

import { notification, white_shopping_cart, chevronLeft } from '@/assets/icons';

const FoodHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.profileSection}>
          <Image source={userProfile.avatar} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Typography style={styles.greeting}>Hi {userProfile.name}</Typography>
            <TouchableOpacity style={styles.locationContainer}>
              <Typography style={styles.locationText}>{userProfile.location}</Typography>
              <Icon 
                icon={chevronLeft} 
                customStyles={styles.chevronIcon}
                tintColor={semantic.text.white}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon icon={notification} tintColor={semantic.text.white} width={24} height={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon icon={white_shopping_cart} width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#008435', // Food delivery green
    paddingTop: normalize(50),
    paddingBottom: normalize(40),
    paddingHorizontal: normalize(20),
    borderBottomLeftRadius: normalize(30),
    borderBottomRightRadius: normalize(30),
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    marginRight: normalize(10),
  },
  userInfo: {
    justifyContent: 'center',
  },
  greeting: {
    color: semantic.text.white,
    fontSize: normalize(12),
    opacity: 0.9,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: semantic.text.white,
    fontSize: normalize(16),
    fontWeight: Platform.OS === 'ios' ? 'bold' : undefined,
  },
  chevronIcon: {
    transform: [{ rotate: '-90deg' }],
    marginLeft: normalize(4),
    width: normalize(14),
    height: normalize(14),
  },
  actions: {
    flexDirection: 'row',
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: normalize(8),
    borderRadius: normalize(20),
    marginLeft: normalize(10),
  },
});

export default FoodHeader;
