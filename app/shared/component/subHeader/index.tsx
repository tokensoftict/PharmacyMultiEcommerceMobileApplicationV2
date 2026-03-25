import React from 'react';
import { TouchableOpacity, View } from "react-native";
import Icon from "../icon";
import { arrowBack} from "@/assets/icons";
import Typography from "@/shared/component/typography";
import {styles} from './styles'
import { useNavigation } from "@react-navigation/native";
import {design} from "@/shared/constants/colors";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import {normalize} from "@/shared/helpers";

interface HeaderBackProps {
  title?: string;
  icon?: React.ReactNode | undefined;
  rightComponent?: React.ReactNode | undefined;
  onPress?:any | undefined
}
export default function SubHeader({title, icon, onPress, rightComponent}: HeaderBackProps) {
  const navigation = useNavigation<NavigationProps>();
  const stylesIcon = {
    tintColor: '#000'
  }

  function goBack() {
    if(navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // @ts-ignore
      navigation.replace(new AuthSessionService().getEnvironment());
    }
  }

  return (
    <View style={styles.container}>
      <View style={{flex : 1, alignItems : 'center', flexDirection : "row"}}>
      <TouchableOpacity onPress={() => goBack()}>
        <Icon customStyles={stylesIcon} icon={icon ? icon : arrowBack} />
      </TouchableOpacity>
      {title && (
        <Typography numberOfLines={1} style={styles.title}>{title}</Typography>
      )}
      </View>
      {
        rightComponent ? rightComponent : <View style={{height : normalize(60)}}></View>

      }
    </View>
  )
}
