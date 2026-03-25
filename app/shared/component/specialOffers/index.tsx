import React from 'react';
import {ScrollView, View, TouchableOpacity, Image} from 'react-native';
import {styles} from './styles';
import Typography from "../../../shared/component/typography";

export default function SpecialOffers(banners) {
  return (
    <View style={styles.container}>
      <Typography style={styles.titleSection}>Top Categories</Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {banners.map((banner, index) => (
          <View key={index} style={styles.divider}>
            <TouchableOpacity style={styles.containerBanner}>
              <Image
                style={styles.image}
                source={{uri: banner.link}}
              />
              <View style={styles.overlay} />
              <View style={styles.containerInfo}>
                <Typography style={styles.title}>{banner.label}</Typography>
                <Typography style={styles.description}>{banner.label}</Typography>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
