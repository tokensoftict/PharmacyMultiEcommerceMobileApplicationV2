import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Typography from "../typography";
import { _styles } from "./styles";
import useDarkMode from "../../hooks/useDarkMode.tsx";
import Radio from "../radio";
import { activeOpacity, currencyType } from "../../constants/global";
import FormatCurrency from "@/shared/utils/FormatCurrency.tsx";

export interface ListOptions {
  id: string;
  title: string;
  active: boolean,
  price?: string,
  option?: any
}
interface ListItemOptionProps {
  value: ListOptions | undefined;
  options: ListOptions[];
  onChange?: (value: ListOptions) => void
}
 function ListItemOption({options, onChange, value}: ListItemOptionProps) {
  const [currentOptions, setCurrentOptions] = useState(options);
  function handleChange(optionSelected: ListOptions) {
    if (onChange) {
      onChange(optionSelected)
    }
    setCurrentOptions(currentOptions.map(option => ({
      ...option,
      active: option.id === optionSelected.id
    })));
  }
  useEffect(() => {
    if (value?.id) {
      setCurrentOptions(currentOptions.map(option => ({
        ...option,
        active: option.id === value.id
      })))
    }
  }, [value?.id])

  return (
    <View>
      {currentOptions.map(option => {
        return (
          <Option  callback={handleChange} key={option.title} option={option} />
        )
      })}
    </View>
  )
}

interface OptionProps {
  option: ListOptions;
  callback?: (option: ListOptions) => void
}
export function Option({option, callback}: OptionProps) {
  const {isDarkMode} = useDarkMode()
  const styles = _styles(isDarkMode, option.active)
  return (
    <TouchableOpacity  activeOpacity={activeOpacity} onPress={() => callback ? callback(option) : null} style={styles.container}>
      <View style={styles.containerInfo}>
        <View style={{flex: 0.9}}>
          <Typography style={styles.title}>{option.title}</Typography>
        </View>
      </View>
      <View style={styles.row}>
        {option?.price && (
          <Typography style={styles.price}>{currencyType}{FormatCurrency(option?.price) || ''}</Typography>
        )}
        <Radio active={option.active} />
      </View>
    </TouchableOpacity>
  )
}


export default React.memo(ListItemOption);
