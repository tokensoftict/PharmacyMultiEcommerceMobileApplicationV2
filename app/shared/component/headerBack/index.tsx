import React from 'react';
import { TouchableOpacity, View, Platform } from "react-native";
import Icon from "../icon";
import { arrowBack } from "@/assets/icons";
import Typography from "@/shared/component/typography";
import { styles } from './styles'
import { useNavigation } from "@react-navigation/native";
import { design } from "@/shared/constants/colors";
import { NavigationProps } from "@/shared/routes/stack.tsx";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import { normalize } from "@/shared/helpers";

interface HeaderBackProps {
  title?: string;
  icon?: React.ReactNode | undefined;
  rightComponent?: React.ReactNode | undefined;
  onPress?: any | undefined;
  transparent?: boolean;
}
export default function HeaderWithIcon({ title, icon, onPress, rightComponent, transparent }: HeaderBackProps) {
  const navigation = useNavigation<NavigationProps>();
  const stylesIcon = {
    tintColor: transparent ? '#1E293B' : design.text1.color
  }

  function goBack() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // @ts-ignore
      navigation.replace(new AuthSessionService().getEnvironment());
    }
  }

  return (
    <View style={[
      styles.container,
      transparent && { backgroundColor: 'transparent', borderBottomWidth: 0, marginBottom: 0 }
    ]}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={() => goBack()} style={{ padding: normalize(5) }}>
          <Icon customStyles={stylesIcon} icon={icon ? icon : arrowBack} />
        </TouchableOpacity>
        {title && (
          <Typography numberOfLines={1} style={[
            styles.title,
            transparent && { color: '#1E293B', fontWeight: Platform.OS === 'ios' ? '800' : undefined }
          ]}>
            {title}
          </Typography>
        )}
      </View>
      <View style={styles.headerRight}>
        {rightComponent}
      </View>
    </View>
  )
}
