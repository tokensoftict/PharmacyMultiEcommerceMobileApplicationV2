import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Typography from "../typography";
import { _styles } from "./styles";
import useDarkMode from "../../hooks/useDarkMode.tsx";
import Icon from "../icon";
import Radio from "../radio";
import { activeOpacity, currencyType } from "../../constants/global";

export interface OptionCardOptions {
  id: string;
  icon: any;
  title: string;
  description: string;
  active: boolean,
  price?: string
}
interface ListOptionCardProps {
  value: OptionCardOptions | undefined;
  options: OptionCardOptions[];
  onChange?: (value: OptionCardOptions) => void
}
 function ListCard({options, onChange, value}: ListOptionCardProps) {
  const [currentOptions, setCurrentOptions] = useState(options);
  function handleChange(optionSelected: OptionCardOptions) {
    if (onChange) {
      onChange(optionSelected)
    }
    setCurrentOptions(currentOptions.map(option => ({
      ...option,
    })));
  }
  useEffect(() => {
    if (value?.id) {
      setCurrentOptions(currentOptions.map(option => ({
        ...option,
      })))
    }
  }, [value?.id])

  return (
    <View>
      {currentOptions.map(option => {
        return (
          <Option callback={handleChange} key={option.id} option={option} />
        )
      })}
    </View>
  )
}

interface OptionProps {
  option: OptionCardOptions;
  callback?: (option: OptionCardOptions) => void
}
 function Option({option, callback}: OptionProps) {
  const {isDarkMode} = useDarkMode()
  const styles = _styles(isDarkMode, option.active)
  return (
    <TouchableOpacity activeOpacity={activeOpacity} onPress={() => callback ? callback(option) : null} style={styles.container}>
      <View style={styles.containerInfo}>
        <View style={styles.containerIcon}>
          <Icon customStyles={styles.icon} icon={option.icon} />
        </View>
        <View style={{flex: 0.9}}>
          <Typography style={styles.title}>{option.title}</Typography>
          <Typography style={styles.address}>{option.description}</Typography>
        </View>
      </View>
    </TouchableOpacity>
  )
}


export default React.memo(ListCard);
