import React from 'react';
import {ActivityIndicator, TouchableOpacity, View} from "react-native";
import {_styles} from './styles';
import Typography from "../../typography";
import {GestureResponderEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import { semantic } from "../../../constants/colors.ts";

interface ButtonProps {
  disabled?: boolean | undefined;
  leftIcon?: React.ReactNode | undefined;
  title?: string | undefined;
  loadingText?: string | undefined;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  loading?: boolean | undefined;
  sm?: boolean
}
export default function Button({
  disabled,
  leftIcon,
  title = 'Done',
  loadingText='Please wait',
  onPress,
  loading,
  sm,
}: ButtonProps) {
  const styles = _styles(disabled, sm);
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={styles.container}>
      {loading ? (
          <ActivityIndicator color={semantic.background.white.w500} />
      ) : (
        <>
          {leftIcon && leftIcon}
          <Typography style={styles.text}>{title}</Typography>
        </>
      )}
    </TouchableOpacity>
  );
}
