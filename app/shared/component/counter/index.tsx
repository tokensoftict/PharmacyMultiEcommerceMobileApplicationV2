import React, {useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import Typography from '../typography';
import Icon from "../icon";
import {Minus, Plus} from '../../../assets/icons';

export enum TypeChange {
  minus = 0,
  plus = 1,
}

interface CounterProps {
  onChange: (value: number, typeOperation: number | string) => void
  cant?: number
  disabled?: boolean
}

export default function Counter({onChange, cant = 1, disabled = false}: CounterProps) {
  const [count, setCounter] = useState(parseInt(cant+""));
  function handleChange(type: number) {
    if (disabled) return;
    if (type === TypeChange.minus) {
      if (count > 1) {
        onChange(count - 1, TypeChange.minus)
        setCounter(prevState => prevState - 1);
      }
      return;
    }
    onChange(count + 1, TypeChange.plus)
    setCounter(prevState => prevState + 1);
  }

  function onChangeText(number : string) {
      if (disabled) return;

      if(number == ""){
          setCounter(0)
          return;
      }

      onChange(parseInt(number), TypeChange.plus);
      setCounter(parseInt(number));
  }

  return (
    <View style={[styles.container, disabled && { opacity: 0.5 }]}>
      <TouchableOpacity
        disabled={disabled}
        onPress={() => handleChange(TypeChange.minus)}
        style={styles.btnReduce}>
        <Icon customStyles={styles.minus} icon={Minus} />
      </TouchableOpacity>
      <TextInput
          editable={!disabled}
          keyboardType="numeric"
          onChangeText={(value) => onChangeText(value)}
          value={count+""}
          style={styles.input}
      />
      <TouchableOpacity
        disabled={disabled}
        onPress={() => handleChange(TypeChange.plus)}
        style={styles.btnAument}>
        <Icon customStyles={styles.plus} icon={Plus} />
      </TouchableOpacity>
    </View>
  );
}
