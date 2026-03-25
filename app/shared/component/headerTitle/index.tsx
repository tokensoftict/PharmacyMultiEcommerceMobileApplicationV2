import React from 'react';
import {View} from 'react-native';
import Typography from '../typography';
import {styles} from './styles';

interface HeaderTitleProps {
  title: string;
}
export default function HeaderTitle({title}: HeaderTitleProps) {
  return (
    <View style={styles.header}>
      <Typography style={styles.title}>{title}</Typography>
    </View>
  );
}
