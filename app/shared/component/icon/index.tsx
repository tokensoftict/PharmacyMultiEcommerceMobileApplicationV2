import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {ImageSourcePropType} from 'react-native/Libraries/Image/Image';
import {_styles} from './styles';
import { StyleProp } from "react-native/Libraries/StyleSheet/StyleSheet";
import { ImageStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import useDarkMode from "../../hooks/useDarkMode.tsx";

interface IconProps {
  icon: ImageSourcePropType;
  width?: number | undefined;
  height?: number | undefined;
  customStyles?: StyleProp<ImageStyle> | undefined;
  onPress?:  any | undefined;
  tintColor?: string
}
export default function Icon({icon, width, height, customStyles, tintColor, onPress}: IconProps) {
  const {isDarkMode} = useDarkMode()
  const styles = _styles({width, height, isDarkMode});
  return (
      onPress === undefined ?  <Image tintColor={tintColor} style={[styles.icon, customStyles]} source={icon} />
          :
      <TouchableOpacity onPress={onPress}>
        <Image tintColor={tintColor} style={[styles.icon, customStyles]} source={icon} />
      </TouchableOpacity>
  );
}
