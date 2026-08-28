import React from 'react';
import {ActivityIndicator, StyleProp, TouchableOpacity, View, ViewStyle} from "react-native";
import {_styles} from './styles';
import Typography from "../../typography";
import {GestureResponderEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import { semantic } from "../../../constants/colors.ts";

interface ButtonProps {
  disabled?: boolean | undefined;
  leftIcon?: React.ReactNode | undefined;
  rightIcon?: React.ReactNode | undefined;
  title?: string | undefined;
  loadingText?: string | undefined;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  loading?: boolean | undefined;
  sm?: boolean;
  style?: StyleProp<ViewStyle>;
}
export default function Button({
  disabled,
  leftIcon,
  rightIcon,
  title = 'Done',
  loadingText='Please wait',
  onPress,
  loading,
  sm,
  style,
}: ButtonProps) {
  const styles = _styles(disabled, sm);
  return (
    <TouchableOpacity disabled={disabled || loading} onPress={onPress} style={[styles.container, style]} activeOpacity={0.75}>
      {loading ? (
          <ActivityIndicator color={semantic.background.white.w500} size="small" />
      ) : (
        <>
          {leftIcon && leftIcon}
          <Typography style={styles.text}>{title}</Typography>
          {rightIcon && rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
}
