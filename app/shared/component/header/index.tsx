import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import Typography from "../../../shared/component/typography";
import {styles} from './styles'
import Icon from "../../../shared/component/icon";
import { location, homeNotifications, homeLike, homeNotificationsDark, homeLikeDark } from "../../../assets/icons";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "../../routes/stack";
import useDarkMode from "../../hooks/useDarkMode.tsx";
import AuthSessionService from "../../../service/auth/AuthSessionService";
import Environment from "@/shared/utils/Environment.tsx";

export default function Header() {
  const {isDarkMode} = useDarkMode()
  const {navigate} = useNavigation<NavigationProps>()

  const userProfile = (new AuthSessionService()).getAuthSession();

  return (
    <View style={styles.container}>
      {
        Environment.isLogin() ?
            <View style={styles.row}>
              <Image style={styles.avatar} source={{uri: userProfile?.data?.image}} />
              <View>
                <Typography style={styles.nameUser}>{ userProfile?.data?.firstname} { userProfile?.data?.lastname}</Typography>
                <View style={styles.row}>
                  <Icon customStyles={styles.iconLocation} icon={location} />
                  <Typography style={styles.location}> No Location</Typography>
                </View>
              </View>
            </View>
            :
            <View style={styles.row}>
              <Image style={styles.avatarlogo} source={require("@/assets/images/logo.png")} />
              <View>
                <Typography style={styles.nameUser}>PS GDC</Typography>
              </View>
            </View>
      }

      {
        Environment.isLogin() ?
            <View style={styles.row}>
              <TouchableOpacity onPress={() => navigate('notifications')}>
                {isDarkMode ? (
                    <Icon customStyles={styles.iconSize} icon={homeNotificationsDark} />
                ) : (
                    <Icon customStyles={styles.iconSize} icon={homeNotifications} />
                )}
              </TouchableOpacity>
              <View style={styles.widthSpace}/>
              <TouchableOpacity onPress={() => navigate('wishlist')}>
                {isDarkMode ? (
                    <Icon customStyles={styles.iconSize} icon={homeLikeDark} />
                ) : (
                    <Icon customStyles={styles.iconSize} icon={homeLike} />
                )}
              </TouchableOpacity>
            </View>
            :
            <View style={styles.row}></View>
      }
    </View>
  )
}
