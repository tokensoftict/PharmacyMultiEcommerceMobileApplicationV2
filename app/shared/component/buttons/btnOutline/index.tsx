import React from 'react';
import { ActivityIndicator, TouchableOpacity } from "react-native";
import {_styles} from './styles';
import Typography from "../../typography";
import {GestureResponderEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import { palette, semantic } from "../../../constants/colors";
import useDarkMode from "../../../hooks/useDarkMode.tsx";

interface ButtonProps {
  disabled?: boolean | undefined;
  leftIcon?: React.ReactNode | undefined;
  title?: string | undefined;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  loading?: boolean | undefined;
}
export default function ButtonOutline({
  disabled,
  leftIcon,
  title = 'Done',
  onPress,
  loading,
}: ButtonProps) {
  const {isDarkMode} = useDarkMode()
  const styles = _styles(disabled, isDarkMode);
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={styles.container}>
      {loading ? (
        <ActivityIndicator color={palette.main.p300} />
      ) : (
        <>
          {leftIcon && leftIcon}
          <Typography style={styles.text}>{title}</Typography>
        </>
      )}
    </TouchableOpacity>
  );
}
