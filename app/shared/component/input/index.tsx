import React, {  useState } from "react";
import {View, TextInput} from 'react-native';
import {_styles} from './styles';
import Typography from '../typography';
import {semantic} from '../../constants/colors';
import {KeyboardTypeOptions} from 'react-native/Libraries/Components/TextInput/TextInput';
import { NativeSyntheticEvent, NativeTouchEvent } from "react-native/Libraries/Types/CoreEventTypes";
import useDarkMode from "../../hooks/useDarkMode.tsx";

interface InputProps {
  value?: string | undefined;
  onChangeText?: ((text: string) => void) | undefined;
  multiline?: boolean | undefined;
  maxLength?: number | undefined;
  keyboardType?: KeyboardTypeOptions | undefined;
  editable?: boolean | undefined;
  placeholder?: string | undefined;
  secureTextEntry?: boolean | undefined;
  leftIcon?: React.ReactNode | undefined;
  rightIcon?: React.ReactNode | undefined;
  label?: string | undefined;
  onPressIn?: ((e: NativeSyntheticEvent<NativeTouchEvent>) => void) | undefined;
  inputRef?: any
  autoFocus?: boolean | undefined;
  focusable?: boolean | undefined;
  onSubmitEditing?: any;
  style?: any;
}

export default function Input({
  value,
  onChangeText,
  multiline,
  maxLength,
  keyboardType,
  editable,
  placeholder = '',
  secureTextEntry,
  leftIcon,
  rightIcon,
  label,
  onPressIn,
  inputRef,
  autoFocus,
  onSubmitEditing,
  focusable,
  style
}: InputProps) {
  const [isFocus, setFocus] = useState(false);
  const {isDarkMode} = useDarkMode()
  // @ts-ignore
  const styles = _styles(isFocus, isDarkMode, multiline);
  return (
    <View style={[{width : '100%'}, style]}>
      {label && <Typography style={styles.label}>{label}</Typography>}
      <View style={styles.container}>
        {leftIcon && leftIcon}
        <TextInput
          ref={inputRef}
          onPressIn={onPressIn}
          multiline={multiline}
          onChangeText={onChangeText}
          value={value}
          autoFocus={autoFocus}
          maxLength={maxLength}
          keyboardType={keyboardType}
          editable={editable}
          autoCorrect={false}
          // @ts-ignore
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          onFocus={() => setFocus(true)}
          placeholderTextColor={semantic.text.grey}
          style={styles.input}
          onSubmitEditing={onSubmitEditing}
          focusable={focusable}
          autoCapitalize={'none'}
        />
        {rightIcon && rightIcon}
      </View>
    </View>
  );
}
